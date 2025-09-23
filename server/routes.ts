import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertPaymentSchema } from "@shared/schema";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";

// Razorpay configuration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// Service pricing
const SERVICE_PRICING = {
  "career-guidance": { amount: 299900, name: "Career Guidance" },
  "agile-coaching": { amount: 499900, name: "Agile Coaching" },
  "corporate-workshops": { amount: 1999900, name: "Corporate Workshops" },
  "enterprise-mentoring": { amount: 4999900, name: "Enterprise Mentoring" },
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Get blog posts
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  // Get featured testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getFeaturedTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      
      // Here you would typically send an email notification
      console.log("New contact submission:", contact);
      
      res.json({ success: true, message: "Contact form submitted successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Error submitting contact form:", error);
        res.status(500).json({ error: "Failed to submit contact form" });
      }
    }
  });

  // Create Razorpay order
  app.post("/api/payments/create-order", async (req, res) => {
    try {
      const { serviceType, contactInfo } = req.body;
      
      if (!SERVICE_PRICING[serviceType as keyof typeof SERVICE_PRICING]) {
        return res.status(400).json({ error: "Invalid service type" });
      }

      const service = SERVICE_PRICING[serviceType as keyof typeof SERVICE_PRICING];
      
      // Create contact record
      const validatedContact = insertContactSchema.parse(contactInfo);
      const contact = await storage.createContact(validatedContact);

      // Create Razorpay order
      const options = {
        amount: service.amount, // amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1
      };

      const order = await razorpay.orders.create(options);
      
      const payment = await storage.createPayment({
        razorpayOrderId: order.id,
        amount: service.amount.toString(),
        currency: "INR",
        status: "created",
        contactId: contact.id,
        serviceType: service.name,
        metadata: { serviceType, contactInfo }
      });

      res.json({
        orderId: order.id,
        amount: service.amount,
        currency: "INR",
        keyId: RAZORPAY_KEY_ID,
        paymentId: payment.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Error creating payment order:", error);
        res.status(500).json({ error: "Failed to create payment order" });
      }
    }
  });

  // Payment verification schema
  const verifyPaymentSchema = z.object({
    paymentId: z.string().min(1, "Payment ID is required"),
    razorpayPaymentId: z.string().min(1, "Razorpay payment ID is required"),
    razorpayOrderId: z.string().min(1, "Razorpay order ID is required"),
    razorpaySignature: z.string().min(1, "Razorpay signature is required"),
  });

  // Verify payment
  app.post("/api/payments/verify", async (req, res) => {
    try {
      // Validate request body
      const validationResult = verifyPaymentSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validationResult.error.errors 
        });
      }
      
      const { paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = validationResult.data;
      
      // First, get the stored payment to verify order ID matches
      const storedPayment = await storage.getPayment(paymentId);
      if (!storedPayment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      // Verify that the razorpay order ID matches the stored payment
      if (storedPayment.razorpayOrderId !== razorpayOrderId) {
        return res.status(400).json({ error: "Order ID mismatch" });
      }

      // Prevent duplicate processing
      if (storedPayment.status === "completed") {
        return res.json({ 
          success: true, 
          message: "Payment already verified",
          payment: storedPayment 
        });
      }
      
      // Verify signature using timing-safe comparison
      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (!crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(razorpaySignature, 'hex'))) {
        return res.status(400).json({ error: "Invalid signature" });
      }

      // Verify payment details with Razorpay API (fail-closed approach)
      try {
        const paymentDetails = await razorpay.payments.fetch(razorpayPaymentId);
        
        // Verify order ID matches (defense in depth)
        if (paymentDetails.order_id !== razorpayOrderId) {
          return res.status(400).json({ error: "Order ID mismatch in payment details" });
        }
        
        // Verify payment amount and currency match
        if (paymentDetails.amount.toString() !== storedPayment.amount || 
            paymentDetails.currency !== storedPayment.currency) {
          return res.status(400).json({ error: "Payment amount or currency mismatch" });
        }

        // Verify payment is captured
        if (paymentDetails.status !== 'captured') {
          return res.status(400).json({ error: "Payment not captured" });
        }
      } catch (razorpayError) {
        console.error("Error fetching payment from Razorpay:", razorpayError);
        return res.status(500).json({ 
          error: "Unable to verify payment with Razorpay", 
          details: "Please try again or contact support" 
        });
      }

      // Update payment status
      const payment = await storage.updatePayment(paymentId, {
        razorpayPaymentId,
        status: "completed"
      });

      res.json({ 
        success: true, 
        message: "Payment verified successfully",
        payment 
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  // Get service pricing
  app.get("/api/services/pricing", async (req, res) => {
    try {
      res.json(SERVICE_PRICING);
    } catch (error) {
      console.error("Error fetching service pricing:", error);
      res.status(500).json({ error: "Failed to fetch service pricing" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
