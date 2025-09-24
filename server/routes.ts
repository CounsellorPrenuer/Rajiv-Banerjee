import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertPaymentSchema, adminLoginSchema, insertBlogPostSchema, insertTestimonialSchema, insertServiceSchema } from "@shared/schema";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";
import bcrypt from "bcrypt";

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

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (req.session?.user?.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: "Authentication required" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validationResult = adminLoginSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validationResult.error.errors 
        });
      }
      
      const { username, password } = validationResult.data;
      const user = await storage.getUserByUsername(username);
      
      if (!user || !user.isAdmin) {
        return res.status(401).json({ error: "Invalid admin credentials" });
      }
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid admin credentials" });
      }
      
      // Regenerate session to prevent session fixation
      (req as any).session.regenerate((err: any) => {
        if (err) {
          console.error('Session regeneration error:', err);
          return res.status(500).json({ error: "Login failed" });
        }
        
        // Set session after regeneration
        (req as any).session.user = {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin
        };
        
        // Save session to ensure it's persisted
        (req as any).session.save((saveErr: any) => {
          if (saveErr) {
            console.error('Session save error:', saveErr);
            return res.status(500).json({ error: "Login failed" });
          }
          
          res.json({ 
            success: true,
            user: {
              id: user.id,
              username: user.username,
              isAdmin: user.isAdmin
            }
          });
        });
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    (req as any).session.destroy((err: any) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.json({ success: true });
    });
  });
  
  app.get("/api/auth/me", (req, res) => {
    if ((req as any).session?.user) {
      res.json({ user: (req as any).session.user });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // Protected admin API endpoint for testing authentication
  app.get("/api/admin/health", requireAuth, (req, res) => {
    res.json({ 
      status: "healthy", 
      message: "Admin API is accessible", 
      user: (req as any).session.user 
    });
  });

  // Public blog posts endpoint (published only)
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  // Admin blog posts endpoints
  app.get("/api/admin/blog-posts", requireAuth, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching all blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog-posts", requireAuth, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Error creating blog post:", error);
        res.status(500).json({ error: "Failed to create blog post" });
      }
    }
  });

  app.put("/api/admin/blog-posts/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(id, validatedData);
      
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Error updating blog post:", error);
        res.status(500).json({ error: "Failed to update blog post" });
      }
    }
  });

  app.delete("/api/admin/blog-posts/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteBlogPost(id);
      
      if (!success) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json({ success: true, message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // Public testimonials endpoint (featured only)
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getFeaturedTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  // Admin testimonials endpoints
  app.get("/api/admin/testimonials", requireAuth, async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching all testimonials:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/admin/testimonials", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Error creating testimonial:", error);
        res.status(500).json({ error: "Failed to create testimonial" });
      }
    }
  });

  app.put("/api/admin/testimonials/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(id, validatedData);
      
      if (!testimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      
      res.json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Error updating testimonial:", error);
        res.status(500).json({ error: "Failed to update testimonial" });
      }
    }
  });

  app.delete("/api/admin/testimonials/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTestimonial(id);
      
      if (!success) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      
      res.json({ success: true, message: "Testimonial deleted successfully" });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ error: "Failed to delete testimonial" });
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

  // Public services endpoint
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Admin services endpoints
  app.get("/api/admin/services", requireAuth, async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/admin/services", requireAuth, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Error creating service:", error);
        res.status(500).json({ error: "Failed to create service" });
      }
    }
  });

  app.put("/api/admin/services/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(id, validatedData);
      
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Error updating service:", error);
        res.status(500).json({ error: "Failed to update service" });
      }
    }
  });

  app.delete("/api/admin/services/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteService(id);
      
      if (!success) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      res.json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Get service pricing (legacy endpoint for frontend compatibility)
  app.get("/api/services/pricing", async (req, res) => {
    try {
      res.json(SERVICE_PRICING);
    } catch (error) {
      console.error("Error fetching service pricing:", error);
      res.status(500).json({ error: "Failed to fetch service pricing" });
    }
  });

  // Get payment status by ID
  app.get("/api/payments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await storage.getPayment(id);
      
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      res.json(payment);
    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({ error: "Failed to fetch payment" });
    }
  });

  // Admin payment tracking endpoints  
  app.get("/api/admin/contacts", requireAuth, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.get("/api/admin/payments", requireAuth, async (req, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
