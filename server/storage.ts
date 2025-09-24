import { 
  type User, 
  type InsertUser, 
  type Contact, 
  type InsertContact,
  type Payment,
  type InsertPayment,
  type BlogPost,
  type InsertBlogPost,
  type Testimonial,
  type InsertTestimonial,
  type Service,
  type InsertService,
  users,
  contacts,
  payments,
  blogPosts,
  testimonials,
  services
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(id: string): Promise<Payment | undefined>;
  getAllPayments(): Promise<Payment[]>;
  updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | undefined>;
  
  getBlogPosts(): Promise<BlogPost[]>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  
  getTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;
  
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, updates: Partial<Service>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values({
        ...insertPayment,
        metadata: insertPayment.metadata || null,
        status: insertPayment.status || "created",
        razorpayPaymentId: insertPayment.razorpayPaymentId || null,
        currency: insertPayment.currency || "INR"
      })
      .returning();
    return payment;
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async getAllPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | undefined> {
    const [payment] = await db
      .update(payments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return payment || undefined;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values({
        ...insertPost,
        imageUrl: insertPost.imageUrl || null,
        published: insertPost.published || false
      })
      .returning();
    return post;
  }

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const [post] = await db
      .update(blogPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return post || undefined;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.featured, true)).orderBy(desc(testimonials.createdAt));
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values({
        ...insertTestimonial,
        imageUrl: insertTestimonial.imageUrl || null,
        company: insertTestimonial.company || null,
        rating: insertTestimonial.rating || 5,
        featured: insertTestimonial.featured || false
      })
      .returning();
    return testimonial;
  }

  async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .update(testimonials)
      .set(updates)
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial || undefined;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(desc(services.createdAt));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values(insertService)
      .returning();
    return service;
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service | undefined> {
    const [service] = await db
      .update(services)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return service || undefined;
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private payments: Map<string, Payment>;
  private blogPosts: Map<string, BlogPost>;
  private testimonials: Map<string, Testimonial>;
  private services: Map<string, Service>;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.payments = new Map();
    this.blogPosts = new Map();
    this.testimonials = new Map();
    this.services = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample blog posts
    const blogPost1: BlogPost = {
      id: randomUUID(),
      title: "5 Signs It's Time to Change Your Career Path",
      slug: "signs-change-career-path",
      excerpt: "Discover the key indicators that suggest it might be time to pivot your career direction and find renewed purpose in your professional journey.",
      content: "Career transitions can be both exciting and daunting. Here are five clear signs that indicate it might be time to consider a new career path...",
      category: "Career Development",
      imageUrl: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      published: true,
      createdAt: new Date("2024-12-15"),
      updatedAt: new Date("2024-12-15"),
    };

    const blogPost2: BlogPost = {
      id: randomUUID(),
      title: "Implementing Agile: A Leader's Guide",
      slug: "implementing-agile-leaders-guide",
      excerpt: "Learn practical strategies for successful Agile transformation in your organization from someone with 20+ years of experience.",
      content: "Agile transformation is more than just changing processes - it's about changing mindsets and culture...",
      category: "Agile Coaching",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      published: true,
      createdAt: new Date("2024-12-12"),
      updatedAt: new Date("2024-12-12"),
    };

    const blogPost3: BlogPost = {
      id: randomUUID(),
      title: "Building a Strong Professional Network",
      slug: "building-professional-network",
      excerpt: "Essential networking strategies that will accelerate your career growth and open new opportunities.",
      content: "Professional networking is one of the most powerful tools for career advancement...",
      category: "Professional Growth",
      imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      published: true,
      createdAt: new Date("2024-12-10"),
      updatedAt: new Date("2024-12-10"),
    };

    this.blogPosts.set(blogPost1.slug, blogPost1);
    this.blogPosts.set(blogPost2.slug, blogPost2);
    this.blogPosts.set(blogPost3.slug, blogPost3);

    // Sample testimonials
    const testimonial1: Testimonial = {
      id: randomUUID(),
      name: "Sarah Johnson",
      title: "Software Engineer",
      company: "Tech Corp",
      content: "Rajiv's guidance helped me transition from a developer to a team lead. His insights into corporate dynamics and career growth strategies were invaluable.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      featured: true,
      createdAt: new Date(),
    };

    const testimonial2: Testimonial = {
      id: randomUUID(),
      name: "Michael Chen",
      title: "Product Manager",
      company: "Innovation Labs",
      content: "The Agile coaching sessions transformed our team's productivity. Rajiv's 20+ years of experience really shows in his practical approach.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      featured: true,
      createdAt: new Date(),
    };

    const testimonial3: Testimonial = {
      id: randomUUID(),
      name: "Priya Sharma",
      title: "Recent Graduate",
      company: "University",
      content: "As a fresh graduate, I was confused about my career path. Rajiv's career clarity session gave me the direction I needed.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      featured: true,
      createdAt: new Date(),
    };

    this.testimonials.set(testimonial1.id, testimonial1);
    this.testimonials.set(testimonial2.id, testimonial2);
    this.testimonials.set(testimonial3.id, testimonial3);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: false,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = { 
      ...insertPayment, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: insertPayment.metadata || null,
      status: insertPayment.status || "created",
      razorpayPaymentId: insertPayment.razorpayPaymentId || null,
      currency: insertPayment.currency || "INR",
      contactId: insertPayment.contactId || null
    };
    this.payments.set(id, payment);
    return payment;
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getAllPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updatedPayment = { 
      ...payment, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.published)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(slug);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = { 
      ...insertPost, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date(),
      imageUrl: insertPost.imageUrl || null,
      published: insertPost.published || false
    };
    this.blogPosts.set(post.slug, post);
    return post;
  }

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const existingPost = Array.from(this.blogPosts.values()).find(p => p.id === id);
    if (!existingPost) return undefined;
    
    const updatedPost: BlogPost = { 
      ...existingPost, 
      ...updates, 
      id, 
      updatedAt: new Date() 
    };
    this.blogPosts.delete(existingPost.slug);
    this.blogPosts.set(updatedPost.slug, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const existingPost = Array.from(this.blogPosts.values()).find(p => p.id === id);
    if (!existingPost) return false;
    return this.blogPosts.delete(existingPost.slug);
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values())
      .filter(testimonial => testimonial.featured)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = randomUUID();
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id, 
      createdAt: new Date(),
      imageUrl: insertTestimonial.imageUrl || null,
      company: insertTestimonial.company || null,
      rating: insertTestimonial.rating || 5,
      featured: insertTestimonial.featured || false
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | undefined> {
    const existingTestimonial = this.testimonials.get(id);
    if (!existingTestimonial) return undefined;
    
    const updatedTestimonial: Testimonial = { 
      ...existingTestimonial, 
      ...updates, 
      id 
    };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    return this.testimonials.delete(id);
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = { 
      ...insertService, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service | undefined> {
    const existingService = this.services.get(id);
    if (!existingService) return undefined;
    
    const updatedService: Service = { 
      ...existingService, 
      ...updates, 
      id, 
      updatedAt: new Date() 
    };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: string): Promise<boolean> {
    return this.services.delete(id);
  }
}

// Initialize with sample data for development
const initializeSampleData = async () => {
  try {
    // Check if data already exists
    const existingPosts = await db.select().from(blogPosts).limit(1);
    if (existingPosts.length > 0) {
      return; // Data already exists
    }

    // Sample blog posts
    await db.insert(blogPosts).values([
      {
        title: "5 Signs It's Time to Change Your Career Path",
        slug: "signs-change-career-path",
        excerpt: "Discover the key indicators that suggest it might be time to pivot your career direction and find renewed purpose in your professional journey.",
        content: "Career transitions can be both exciting and daunting. Here are five clear signs that indicate it might be time to consider a new career path...",
        category: "Career Development",
        imageUrl: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        published: true,
      },
      {
        title: "Implementing Agile: A Leader's Guide",
        slug: "implementing-agile-leaders-guide",
        excerpt: "Learn practical strategies for successful Agile transformation in your organization from someone with 20+ years of experience.",
        content: "Agile transformation is more than just changing processes - it's about changing mindsets and culture...",
        category: "Agile Coaching",
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        published: true,
      },
      {
        title: "Building a Strong Professional Network",
        slug: "building-professional-network",
        excerpt: "Essential networking strategies that will accelerate your career growth and open new opportunities.",
        content: "Professional networking is one of the most powerful tools for career advancement...",
        category: "Professional Growth",
        imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        published: true,
      }
    ]);

    // Sample testimonials
    await db.insert(testimonials).values([
      {
        name: "Sarah Johnson",
        title: "Software Engineer",
        company: "Tech Corp",
        content: "Rajiv's guidance helped me transition from a developer to a team lead. His insights into corporate dynamics and career growth strategies were invaluable.",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        featured: true,
      },
      {
        name: "Michael Chen",
        title: "Product Manager",
        company: "Innovation Labs",
        content: "The Agile coaching sessions transformed our team's productivity. Rajiv's 20+ years of experience really shows in his practical approach.",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        featured: true,
      },
      {
        name: "Priya Sharma",
        title: "Recent Graduate",
        company: "University",
        content: "As a fresh graduate, I was confused about my career path. Rajiv's career clarity session gave me the direction I needed.",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        featured: true,
      }
    ]);

    console.log('Sample data initialized successfully');
  } catch (error) {
    console.log('Sample data already exists or error initializing:', error);
  }
};

export const storage = new DatabaseStorage();

// Initialize sample data on startup
initializeSampleData();
