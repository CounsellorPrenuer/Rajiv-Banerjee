import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertPaymentSchema } from "@shared/schema";
import { z } from "zod";

// Razorpay configuration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_key";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret";

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

      // In a real implementation, you would use the Razorpay SDK here
      // For demo purposes, we'll create a mock order
      const mockOrderId = `order_${Date.now()}`;
      
      const payment = await storage.createPayment({
        razorpayOrderId: mockOrderId,
        amount: service.amount.toString(),
        currency: "INR",
        status: "created",
        contactId: contact.id,
        serviceType: service.name,
        metadata: { serviceType, contactInfo }
      });

      res.json({
        orderId: mockOrderId,
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

  // Verify payment
  app.post("/api/payments/verify", async (req, res) => {
    try {
      const { paymentId, razorpayPaymentId, razorpaySignature } = req.body;
      
      // In a real implementation, you would verify the signature with Razorpay
      // For demo purposes, we'll just update the payment status
      const payment = await storage.updatePayment(paymentId, {
        razorpayPaymentId,
        status: "completed"
      });

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

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
