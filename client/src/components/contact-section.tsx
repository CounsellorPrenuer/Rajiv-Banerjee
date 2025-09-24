import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, Mail, Globe, Send, CreditCard, Linkedin, Instagram } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  serviceInterest: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Please provide a message"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const [isPaymentMode, setIsPaymentMode] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const serviceInterest = watch("serviceInterest");

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      const serviceTypeMap: Record<string, string> = {
        "Career Guidance": "career-guidance",
        "Agile Coaching": "agile-coaching", 
        "Corporate Workshops": "corporate-workshops",
        "Enterprise Mentoring": "enterprise-mentoring",
      };
      
      const serviceType = serviceTypeMap[data.serviceInterest];
      if (!serviceType) {
        throw new Error("Invalid service type");
      }

      return apiRequest("POST", "/api/payments/create-order", {
        serviceType,
        contactInfo: data,
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      const formData = watch(); // Get current form values for prefill
      
      // Check if Razorpay script is already loaded
      if (!(window as any).Razorpay) {
        // Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => initializePayment();
        script.onerror = () => {
          toast({
            title: "Payment script failed to load",
            description: "Please check your internet connection and try again.",
            variant: "destructive",
          });
        };
        document.body.appendChild(script);
      } else {
        initializePayment();
      }
      
      function initializePayment() {
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          order_id: data.orderId,
          name: 'KarmaPath',
          description: 'Career Counseling Session',
          image: '/favicon.ico',
          handler: async (response: any) => {
            try {
              const verifyResponse = await apiRequest('POST', '/api/payments/verify', {
                paymentId: data.paymentId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });
              
              const result = await verifyResponse.json();
              if (result.success) {
                toast({
                  title: "Payment successful!",
                  description: "Your session has been booked. Check your email for details.",
                });
                reset();
                setIsPaymentMode(false);
              } else {
                throw new Error(result.error || 'Payment verification failed');
              }
            } catch (error: any) {
              toast({
                title: "Payment verification failed",
                description: error.message || "Please contact support if payment was deducted.",
                variant: "destructive",
              });
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: 'hsl(221, 83%, 53%)',
          },
          modal: {
            ondismiss: () => {
              toast({
                title: "Payment cancelled",
                description: "You can try again anytime.",
              });
            }
          }
        };
        
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      }
    },
    onError: (error) => {
      toast({
        title: "Payment error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    if (isPaymentMode) {
      paymentMutation.mutate(data);
    } else {
      contactMutation.mutate(data);
    }
  };

  return (
    <section id="contact" className="py-20 bg-background" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="scroll-animate">
            <h2 className="text-4xl font-display font-bold text-foreground mb-6">
              Contact / Free Career Clarity Call
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Ready to transform your career? Book your free career clarity call today.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Phone className="text-primary-foreground" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Phone</div>
                  <div className="text-muted-foreground" data-testid="text-phone">+91 9830115113</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Mail className="text-primary-foreground" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Email</div>
                  <div className="text-muted-foreground" data-testid="text-email">rajivban@gmail.com</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Globe className="text-primary-foreground" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Website</div>
                  <div className="text-muted-foreground" data-testid="text-website">www.KarmaPath.coach</div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-8">
              <div className="text-sm text-muted-foreground mb-4">
                <p><strong>Social Links:</strong></p>
              </div>
              
              <a 
                href="https://www.linkedin.com/in/rajivbanerjee" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                data-testid="link-linkedin"
                title="LinkedIn: Rajiv Banerjee"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://www.instagram.com/rajivban8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors"
                data-testid="link-instagram"
                title="Instagram: @rajivban8"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://x.com/rajibane" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
                data-testid="link-twitter"
                title="X (Twitter): @rajibane"
              >
                <FaXTwitter className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
          
          <div className="scroll-animate">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="John"
                    className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
                    data-testid="input-first-name"
                  />
                  {errors.firstName && (
                    <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Doe"
                    className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
                    data-testid="input-last-name"
                  />
                  {errors.lastName && (
                    <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john.doe@example.com"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
                  data-testid="input-email"
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Phone *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
                  data-testid="input-phone"
                />
                {errors.phone && (
                  <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
              
              
              <div>
                <Label htmlFor="serviceInterest" className="block text-sm font-medium text-foreground mb-2">
                  Service Interest *
                </Label>
                <Select onValueChange={(value) => setValue("serviceInterest", value)} data-testid="select-service">
                  <SelectTrigger className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Career Guidance">Career Guidance</SelectItem>
                    <SelectItem value="Agile Coaching">Agile Coaching</SelectItem>
                    <SelectItem value="Corporate Workshops">Corporate Workshops</SelectItem>
                    <SelectItem value="Enterprise Mentoring">Enterprise Mentoring</SelectItem>
                  </SelectContent>
                </Select>
                {errors.serviceInterest && (
                  <p className="text-destructive text-sm mt-1">{errors.serviceInterest.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  {...register("message")}
                  placeholder="Tell us about your career goals or any specific questions..."
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
                  data-testid="textarea-message"
                />
                {errors.message && (
                  <p className="text-destructive text-sm mt-1">{errors.message.message}</p>
                )}
              </div>
              
              <div className="space-y-4">
                <Button 
                  type="submit" 
                  disabled={contactMutation.isPending}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center space-x-2"
                  data-testid="button-send-message"
                  onClick={() => setIsPaymentMode(false)}
                >
                  <Send size={20} />
                  <span>{contactMutation.isPending ? "Sending..." : "Send Message"}</span>
                </Button>
                
                {serviceInterest && serviceInterest !== "Enterprise Mentoring" && (
                  <Button 
                    type="submit"
                    disabled={paymentMutation.isPending}
                    className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2"
                    data-testid="button-pay-book-session"
                    onClick={() => setIsPaymentMode(true)}
                  >
                    <CreditCard size={20} />
                    <span>{paymentMutation.isPending ? "Processing..." : "Pay & Book Session"}</span>
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
