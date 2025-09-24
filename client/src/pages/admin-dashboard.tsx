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

export function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: ''
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

  // Fetch contacts
  const { data: contacts = [] } = useQuery({
    queryKey: ["/api/contacts"],
  }) as { data: any[] };

  // Fetch blog posts
  const { data: blogPosts = [] } = useQuery({
    queryKey: ["/api/blog-posts"],
  }) as { data: any[] };

  // Fetch testimonials
  const { data: testimonials = [] } = useQuery({
    queryKey: ["/api/testimonials"],
  }) as { data: any[] };

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
    mutationFn: async (data: Omit<Service, 'id'>) => {
      return apiRequest("POST", "/api/services", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setServiceForm({ name: '', description: '', price: '', duration: '', category: '' });
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

  const handleUpdateService = useMutation({
    mutationFn: async (data: Service) => {
      return apiRequest("PUT", `/api/services/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setEditingService(null);
      setServiceForm({ name: '', description: '', price: '', duration: '', category: '' });
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
      return apiRequest("DELETE", `/api/services/${id}`, {});
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
      price: parseFloat(serviceForm.price),
      duration: serviceForm.duration,
      category: serviceForm.category,
    };

    if (editingService) {
      handleUpdateService.mutate({ ...serviceData, id: editingService.id });
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
                +{Math.floor(contacts.length * 0.15)} from last week
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
                <BarChart3 className="h-5 w-5" />
                Analytics
              </CardTitle>
              <CardDescription>
                View website performance and user engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => setActiveSection('analytics')}
                data-testid="button-view-analytics"
              >
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Testimonials
              </CardTitle>
              <CardDescription>
                Manage customer testimonials and reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => setActiveSection('testimonials')}
                data-testid="button-manage-testimonials"
              >
                Manage Testimonials
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
                  {activeSection === 'analytics' && 'Analytics Dashboard'}
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 w-4 h-4" />
                          Add New Service
                        </Button>
                      </DialogTrigger>
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
                            <p className="text-2xl font-bold text-green-800">₹2,45,000</p>
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
                            <p className="text-2xl font-bold text-blue-800">₹45,000</p>
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
                            <p className="text-2xl font-bold text-purple-800">127</p>
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
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-semibold">₹</span>
                            </div>
                            <div>
                              <p className="font-semibold">Career Guidance Session</p>
                              <p className="text-sm text-gray-600">John Doe - john@example.com</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹2,999</p>
                            <p className="text-sm text-green-600">Completed</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">₹</span>
                            </div>
                            <div>
                              <p className="font-semibold">Agile Coaching Workshop</p>
                              <p className="text-sm text-gray-600">Sarah Smith - sarah@company.com</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹4,999</p>
                            <p className="text-sm text-green-600">Completed</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-semibold">₹</span>
                            </div>
                            <div>
                              <p className="font-semibold">Corporate Workshop</p>
                              <p className="text-sm text-gray-600">Tech Corp - hr@techcorp.com</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹19,999</p>
                            <p className="text-sm text-yellow-600">Processing</p>
                          </div>
                        </div>
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
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Blog Posts ({blogPosts.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {blogPosts.slice(0, 3).map((post: any, index: number) => (
                            <div key={index} className="text-sm">
                              <p className="font-medium">{post.title}</p>
                              <p className="text-gray-600">{post.excerpt}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Testimonials ({testimonials.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {testimonials.slice(0, 3).map((testimonial: any, index: number) => (
                            <div key={index} className="text-sm">
                              <p className="font-medium">{testimonial.name}</p>
                              <p className="text-gray-600">{testimonial.content.substring(0, 100)}...</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeSection === 'analytics' && (
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-600">Advanced analytics and reporting features coming soon.</p>
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

        {/* Recent Activity */}
        {!activeSection && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions and updates across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">New contact form submission received</span>
                  <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Service pricing updated</span>
                  <span className="text-xs text-muted-foreground ml-auto">5 hours ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">New testimonial added</span>
                  <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}