import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Settings, Users, CreditCard, MessageSquare, FileText, BarChart3, LogOut, Plus, Edit, Trash2, Briefcase } from "lucide-react";

interface AdminUser {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company?: string;
  content: string;
  rating: number;
  imageUrl?: string;
  featured: boolean;
  createdAt: string;
}

export function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: ''
  });

  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [blogPostForm, setBlogPostForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    imageUrl: '',
    published: false
  });

  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    title: '',
    company: '',
    content: '',
    rating: 5,
    imageUrl: '',
    featured: false
  });

  // Check authentication status
  const { data: authData, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  }) as { data: { user?: AdminUser } | undefined; isLoading: boolean; error: any };

  useEffect(() => {
    if (!isLoading && (error || !authData?.user?.isAdmin)) {
      setLocation("/admin-login");
    }
  }, [isLoading, error, authData, setLocation]);

  // Fetch services
  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
  }) as { data: Service[] };

  // Fetch contacts for admin (all contacts)
  const { data: contacts = [] } = useQuery({
    queryKey: ["/api/admin/contacts"],
  }) as { data: any[] };

  // Fetch blog posts for admin (all posts)
  const { data: blogPosts = [] } = useQuery({
    queryKey: ["/api/admin/blog-posts"],
  }) as { data: BlogPost[] };

  // Fetch testimonials for admin (all testimonials)
  const { data: testimonials = [] } = useQuery({
    queryKey: ["/api/admin/testimonials"],
  }) as { data: Testimonial[] };

  // Fetch payments for admin (all payments)
  const { data: payments = [] } = useQuery({
    queryKey: ["/api/admin/payments"],
  }) as { data: any[] };

  // Calculate payment statistics
  const completedPayments = payments.filter(p => p.status === 'completed');
  const totalRevenue = completedPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthPayments = completedPayments.filter(payment => {
    const paymentDate = new Date(payment.createdAt);
    return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
  });
  const thisMonthRevenue = thisMonthPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin dashboard.",
      });
      setLocation("/admin-login");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  const handleCreateService = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/admin/services", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setServiceDialogOpen(false);
      resetServiceForm();
      toast({
        title: "Service created",
        description: "New service has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create service.",
        variant: "destructive",
      });
    },
  });

  // Blog Post CRUD Operations
  const handleCreateBlogPost = useMutation({
    mutationFn: async (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
      return apiRequest("POST", "/api/admin/blog-posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      setBlogPostForm({ title: '', slug: '', excerpt: '', content: '', category: '', imageUrl: '', published: false });
      setEditingBlogPost(null);
      toast({
        title: "Blog post created",
        description: "New blog post has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create blog post.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateBlogPost = useMutation({
    mutationFn: async (data: BlogPost) => {
      return apiRequest("PUT", `/api/admin/blog-posts/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      setBlogPostForm({ title: '', slug: '', excerpt: '', content: '', category: '', imageUrl: '', published: false });
      setEditingBlogPost(null);
      toast({
        title: "Blog post updated",
        description: "Blog post has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update blog post.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteBlogPost = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/blog-posts/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      toast({
        title: "Blog post deleted",
        description: "Blog post has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete blog post.",
        variant: "destructive",
      });
    },
  });

  // Testimonial CRUD Operations
  const handleCreateTestimonial = useMutation({
    mutationFn: async (data: Omit<Testimonial, 'id' | 'createdAt'>) => {
      return apiRequest("POST", "/api/admin/testimonials", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      setTestimonialForm({ name: '', title: '', company: '', content: '', rating: 5, imageUrl: '', featured: false });
      setEditingTestimonial(null);
      toast({
        title: "Testimonial created",
        description: "New testimonial has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create testimonial.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateTestimonial = useMutation({
    mutationFn: async (data: Testimonial) => {
      return apiRequest("PUT", `/api/admin/testimonials/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      setTestimonialForm({ name: '', title: '', company: '', content: '', rating: 5, imageUrl: '', featured: false });
      setEditingTestimonial(null);
      toast({
        title: "Testimonial updated",
        description: "Testimonial has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update testimonial.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteTestimonial = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/testimonials/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      toast({
        title: "Testimonial deleted",
        description: "Testimonial has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete testimonial.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateService = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PUT", `/api/admin/services/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setServiceDialogOpen(false);
      resetServiceForm();
      toast({
        title: "Service updated",
        description: "Service has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update service.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteService = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/services/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Service deleted",
        description: "Service has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete service.",
        variant: "destructive",
      });
    },
  });

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = {
      name: serviceForm.name,
      description: serviceForm.description,
      price: serviceForm.price,
      duration: serviceForm.duration,
      category: serviceForm.category,
    };

    if (editingService) {
      handleUpdateService.mutate({ ...editingService, ...serviceData });
    } else {
      handleCreateService.mutate(serviceData);
    }
  };

  const startEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration,
      category: service.category,
    });
    setActiveSection('services'); // Switch to services section to show the form
    setServiceDialogOpen(true); // Open the dialog
  };

  const resetServiceForm = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: ''
    });
  };

  // Blog Post Form Handlers
  const handleBlogPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const blogPostData = {
      title: blogPostForm.title,
      slug: blogPostForm.slug || blogPostForm.title.toLowerCase().replace(/\s+/g, '-'),
      excerpt: blogPostForm.excerpt,
      content: blogPostForm.content,
      category: blogPostForm.category,
      imageUrl: blogPostForm.imageUrl || undefined,
      published: blogPostForm.published,
    };

    if (editingBlogPost) {
      handleUpdateBlogPost.mutate({ ...blogPostData, id: editingBlogPost.id, createdAt: editingBlogPost.createdAt, updatedAt: new Date().toISOString() });
    } else {
      handleCreateBlogPost.mutate(blogPostData);
    }
  };

  const startEditBlogPost = (blogPost: BlogPost) => {
    setEditingBlogPost(blogPost);
    setBlogPostForm({
      title: blogPost.title,
      slug: blogPost.slug,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      category: blogPost.category,
      imageUrl: blogPost.imageUrl || '',
      published: blogPost.published,
    });
    setActiveSection('content'); // Switch to content section to show the form
  };

  // Testimonial Form Handlers
  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const testimonialData = {
      name: testimonialForm.name,
      title: testimonialForm.title,
      company: testimonialForm.company || undefined,
      content: testimonialForm.content,
      rating: testimonialForm.rating,
      imageUrl: testimonialForm.imageUrl || undefined,
      featured: testimonialForm.featured,
    };

    if (editingTestimonial) {
      handleUpdateTestimonial.mutate({ ...testimonialData, id: editingTestimonial.id, createdAt: editingTestimonial.createdAt });
    } else {
      handleCreateTestimonial.mutate(testimonialData);
    }
  };

  const startEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      name: testimonial.name,
      title: testimonial.title,
      company: testimonial.company || '',
      content: testimonial.content,
      rating: testimonial.rating,
      imageUrl: testimonial.imageUrl || '',
      featured: testimonial.featured,
    });
    setActiveSection('content'); // Switch to content section to show the form
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  if (!authData?.user?.isAdmin) {
    return null; // Will redirect to login
  }

  const user: AdminUser = authData.user;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                KarmaPath Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {user.username}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts.length}</div>
              <p className="text-xs text-muted-foreground">
                Active inquiries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services.length}</div>
              <p className="text-xs text-muted-foreground">
                Active services available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogPosts.length}</div>
              <p className="text-xs text-muted-foreground">
                Published articles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testimonials.length}</div>
              <p className="text-xs text-muted-foreground">
                Customer reviews
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contact Management
              </CardTitle>
              <CardDescription>
                View and manage customer inquiries and leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => setActiveSection('contacts')}
                data-testid="button-manage-contacts"
              >
                Manage Contacts
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Tracking
              </CardTitle>
              <CardDescription>
                Monitor payments and transaction history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => setActiveSection('payments')}
                data-testid="button-manage-payments"
              >
                View Payments
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Management
              </CardTitle>
              <CardDescription>
                Create and edit blog posts and testimonials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => setActiveSection('content')}
                data-testid="button-manage-content"
              >
                Manage Content
              </Button>
            </CardContent>
          </Card>
          

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Service Management
              </CardTitle>
              <CardDescription>
                Create, edit and manage comprehensive career solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => setActiveSection('services')}
                data-testid="button-manage-services"
              >
                Manage Services
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Content Sections */}
        {activeSection && (
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {activeSection === 'services' && 'Service Management'}
                  {activeSection === 'contacts' && 'Contact Management'}
                  {activeSection === 'payments' && 'Payment Tracking'}
                  {activeSection === 'content' && 'Content Management'}
                  {activeSection === 'testimonials' && 'Testimonial Management'}
                </CardTitle>
                <Button variant="outline" onClick={() => setActiveSection(null)}>
                  Back to Dashboard
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeSection === 'services' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Comprehensive Career Solutions</h3>
                    <Button onClick={() => setServiceDialogOpen(true)}>
                      <Plus className="mr-2 w-4 h-4" />
                      Add New Service
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {services.map((service) => (
                      <Card key={service.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{service.name}</h4>
                              <p className="text-gray-600 mt-1">{service.description}</p>
                              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                <span>₹{service.price}</span>
                                <span>{service.duration}</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{service.category}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditService(service)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteService.mutate(service.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'contacts' && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {contacts.map((contact: any, index: number) => (
                      <Card key={index} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{contact.firstName} {contact.lastName}</h4>
                              <p className="text-sm text-gray-600">{contact.email}</p>
                              <p className="text-sm text-gray-600">{contact.phone}</p>
                              <p className="text-sm mt-2">{contact.message}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Service Interest:</p>
                              <p className="text-sm font-medium">{contact.serviceInterest}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'payments' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-green-800">₹{totalRevenue.toLocaleString()}</p>
                          </div>
                          <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600">This Month</p>
                            <p className="text-2xl font-bold text-blue-800">₹{thisMonthRevenue.toLocaleString()}</p>
                          </div>
                          <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-purple-600">Transactions</p>
                            <p className="text-2xl font-bold text-purple-800">{payments.length}</p>
                          </div>
                          <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Payments</CardTitle>
                      <CardDescription>Latest payment transactions via Razorpay</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {payments.slice(0, 5).map((payment: any, index: number) => (
                          <div key={payment.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                payment.status === 'completed' ? 'bg-green-100' : 
                                payment.status === 'created' ? 'bg-yellow-100' : 'bg-gray-100'
                              }`}>
                                <span className={`font-semibold ${
                                  payment.status === 'completed' ? 'text-green-600' : 
                                  payment.status === 'created' ? 'text-yellow-600' : 'text-gray-600'
                                }`}>₹</span>
                              </div>
                              <div>
                                <p className="font-semibold">{payment.serviceType || 'Service'}</p>
                                <p className="text-sm text-gray-600">
                                  Order ID: {payment.razorpayOrderId?.substring(0, 20)}...
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₹{Number(payment.amount).toLocaleString()}</p>
                              <p className={`text-sm capitalize ${
                                payment.status === 'completed' ? 'text-green-600' : 
                                payment.status === 'created' ? 'text-yellow-600' : 'text-gray-600'
                              }`}>
                                {payment.status}
                              </p>
                            </div>
                          </div>
                        ))}
                        {payments.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            No payments yet. Payments will appear here once customers make bookings.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>UPI Payments</span>
                            <span className="font-semibold">65%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Credit Cards</span>
                            <span className="font-semibold">25%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Net Banking</span>
                            <span className="font-semibold">10%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Razorpay Integration</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Status</span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Active</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Gateway Fee</span>
                            <span>2% + ₹2</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Settlement</span>
                            <span>T+3 Days</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeSection === 'content' && (
                <div className="space-y-8">
                  {/* Blog Posts Management */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Blog Posts</h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 w-4 h-4" />
                            Add New Blog Post
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{editingBlogPost ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
                            <DialogDescription>
                              {editingBlogPost ? 'Update blog post details' : 'Create a new blog post for your website'}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleBlogPostSubmit} className="space-y-4">
                            <div>
                              <Label htmlFor="blog-title">Title</Label>
                              <Input
                                id="blog-title"
                                value={blogPostForm.title}
                                onChange={(e) => setBlogPostForm({ ...blogPostForm, title: e.target.value })}
                                placeholder="Enter blog post title"
                                required
                                data-testid="input-blog-title"
                              />
                            </div>
                            <div>
                              <Label htmlFor="blog-slug">Slug (URL)</Label>
                              <Input
                                id="blog-slug"
                                value={blogPostForm.slug}
                                onChange={(e) => setBlogPostForm({ ...blogPostForm, slug: e.target.value })}
                                placeholder="auto-generated-from-title"
                                data-testid="input-blog-slug"
                              />
                            </div>
                            <div>
                              <Label htmlFor="blog-excerpt">Excerpt</Label>
                              <Textarea
                                id="blog-excerpt"
                                value={blogPostForm.excerpt}
                                onChange={(e) => setBlogPostForm({ ...blogPostForm, excerpt: e.target.value })}
                                placeholder="Brief description of the blog post"
                                required
                                data-testid="textarea-blog-excerpt"
                              />
                            </div>
                            <div>
                              <Label htmlFor="blog-content">Content</Label>
                              <Textarea
                                id="blog-content"
                                value={blogPostForm.content}
                                onChange={(e) => setBlogPostForm({ ...blogPostForm, content: e.target.value })}
                                placeholder="Full blog post content"
                                className="min-h-[200px]"
                                required
                                data-testid="textarea-blog-content"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="blog-category">Category</Label>
                                <Input
                                  id="blog-category"
                                  value={blogPostForm.category}
                                  onChange={(e) => setBlogPostForm({ ...blogPostForm, category: e.target.value })}
                                  placeholder="Career Advice"
                                  required
                                  data-testid="input-blog-category"
                                />
                              </div>
                              <div>
                                <Label htmlFor="blog-image">Image URL</Label>
                                <Input
                                  id="blog-image"
                                  value={blogPostForm.imageUrl}
                                  onChange={(e) => setBlogPostForm({ ...blogPostForm, imageUrl: e.target.value })}
                                  placeholder="https://example.com/image.jpg"
                                  data-testid="input-blog-image"
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="blog-published"
                                checked={blogPostForm.published}
                                onChange={(e) => setBlogPostForm({ ...blogPostForm, published: e.target.checked })}
                                data-testid="checkbox-blog-published"
                              />
                              <Label htmlFor="blog-published">Published</Label>
                            </div>
                            <Button type="submit" className="w-full" data-testid="button-submit-blog">
                              {editingBlogPost ? 'Update Blog Post' : 'Create Blog Post'}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="grid gap-4">
                      {blogPosts.map((post) => (
                        <Card key={post.id} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-lg">{post.title}</h4>
                                  <span className={`px-2 py-1 text-xs rounded ${post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {post.published ? 'Published' : 'Draft'}
                                  </span>
                                </div>
                                <p className="text-gray-600 mt-1">{post.excerpt}</p>
                                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                  <span>/{post.slug}</span>
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{post.category}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => startEditBlogPost(post)}
                                  data-testid={`button-edit-blog-${post.id}`}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteBlogPost.mutate(post.id)}
                                  data-testid={`button-delete-blog-${post.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {blogPosts.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No blog posts yet. Create your first blog post to get started.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Testimonials Management */}
                  <div className="space-y-6 border-t pt-8">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Testimonials</h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 w-4 h-4" />
                            Add New Testimonial
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}</DialogTitle>
                            <DialogDescription>
                              {editingTestimonial ? 'Update testimonial details' : 'Add a new customer testimonial'}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                            <div>
                              <Label htmlFor="testimonial-name">Client Name</Label>
                              <Input
                                id="testimonial-name"
                                value={testimonialForm.name}
                                onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                                placeholder="John Doe"
                                required
                                data-testid="input-testimonial-name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="testimonial-title">Job Title</Label>
                              <Input
                                id="testimonial-title"
                                value={testimonialForm.title}
                                onChange={(e) => setTestimonialForm({ ...testimonialForm, title: e.target.value })}
                                placeholder="Software Engineer"
                                required
                                data-testid="input-testimonial-title"
                              />
                            </div>
                            <div>
                              <Label htmlFor="testimonial-company">Company</Label>
                              <Input
                                id="testimonial-company"
                                value={testimonialForm.company}
                                onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                                placeholder="Google (optional)"
                                data-testid="input-testimonial-company"
                              />
                            </div>
                            <div>
                              <Label htmlFor="testimonial-content">Testimonial</Label>
                              <Textarea
                                id="testimonial-content"
                                value={testimonialForm.content}
                                onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                                placeholder="Share their feedback..."
                                required
                                data-testid="textarea-testimonial-content"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="testimonial-rating">Rating</Label>
                                <Input
                                  id="testimonial-rating"
                                  type="number"
                                  min="1"
                                  max="5"
                                  value={testimonialForm.rating}
                                  onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) })}
                                  required
                                  data-testid="input-testimonial-rating"
                                />
                              </div>
                              <div>
                                <Label htmlFor="testimonial-image">Image URL</Label>
                                <Input
                                  id="testimonial-image"
                                  value={testimonialForm.imageUrl}
                                  onChange={(e) => setTestimonialForm({ ...testimonialForm, imageUrl: e.target.value })}
                                  placeholder="https://example.com/photo.jpg"
                                  data-testid="input-testimonial-image"
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="testimonial-featured"
                                checked={testimonialForm.featured}
                                onChange={(e) => setTestimonialForm({ ...testimonialForm, featured: e.target.checked })}
                                data-testid="checkbox-testimonial-featured"
                              />
                              <Label htmlFor="testimonial-featured">Featured Testimonial</Label>
                            </div>
                            <Button type="submit" className="w-full" data-testid="button-submit-testimonial">
                              {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="grid gap-4">
                      {testimonials.map((testimonial) => (
                        <Card key={testimonial.id} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                                  {testimonial.featured && (
                                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Featured</span>
                                  )}
                                </div>
                                <p className="text-gray-600">{testimonial.title}{testimonial.company && ` at ${testimonial.company}`}</p>
                                <p className="text-gray-700 mt-2">{testimonial.content}</p>
                                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                  <span>{'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => startEditTestimonial(testimonial)}
                                  data-testid={`button-edit-testimonial-${testimonial.id}`}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteTestimonial.mutate(testimonial.id)}
                                  data-testid={`button-delete-testimonial-${testimonial.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {testimonials.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No testimonials yet. Add your first testimonial to build credibility.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}


              {activeSection === 'testimonials' && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {testimonials.map((testimonial: any, index: number) => (
                      <Card key={index} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{testimonial.name}</h4>
                              <p className="text-sm text-gray-600">{testimonial.role}</p>
                              <p className="text-sm mt-2">{testimonial.content}</p>
                              <div className="flex items-center mt-2">
                                <span className="text-sm text-yellow-600">
                                  {'★'.repeat(testimonial.rating || 5)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              {testimonial.featured && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Featured</span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Service Dialog - Outside of sections for proper state control */}
        <Dialog open={serviceDialogOpen} onOpenChange={(open) => {
          setServiceDialogOpen(open);
          if (!open) {
            resetServiceForm();
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Create New Service'}</DialogTitle>
              <DialogDescription>
                {editingService ? 'Update service details' : 'Add a new career counseling service'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="e.g., Career Guidance Session"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Describe the service..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    placeholder="5000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    placeholder="60 minutes"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                  placeholder="Career Guidance"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingService ? 'Update Service' : 'Create Service'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
}