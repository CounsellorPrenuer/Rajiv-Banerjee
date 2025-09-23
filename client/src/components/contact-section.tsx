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
import { Phone, Mail, Globe, Send, CreditCard } from "lucide-react";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  serviceInterest: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
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
      
      // In a real implementation, you would integrate with Razorpay here
      toast({
        title: "Payment Integration",
        description: "Razorpay payment gateway would be initialized here with order ID: " + data.orderId,
      });
      
      // Mock payment success
      setTimeout(() => {
        toast({
          title: "Payment successful!",
          description: "Your session has been booked. Check your email for details.",
        });
        reset();
        setIsPaymentMode(false);
      }, 2000);
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
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Take the first step towards career clarity and professional growth. Book your consultation today.
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
              <a 
                href="https://www.linkedin.com/in/rajiv-banerjee/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                data-testid="link-linkedin"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/rajivban8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors"
                data-testid="link-instagram"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2.253c2.262 0 2.53.009 3.426.05.826.037 1.275.174 1.574.289.396.153.678.337.975.634.297.297.481.579.634.975.115.299.252.748.289 1.574.041.896.05 1.164.05 3.426s-.009 2.53-.05 3.426c-.037.826-.174 1.275-.289 1.574a2.588 2.588 0 01-.634.975 2.588 2.588 0 01-.975.634c-.299.115-.748.252-1.574.289-.896.041-1.164.05-3.426.05s-2.53-.009-3.426-.05c-.826-.037-1.275-.174-1.574-.289a2.588 2.588 0 01-.975-.634 2.588 2.588 0 01-.634-.975c-.115-.299-.252-.748-.289-1.574-.041-.896-.05-1.164-.05-3.426s.009-2.53.05-3.426c.037-.826.174-1.275.289-1.574.153-.396.337-.678.634-.975a2.588 2.588 0 01.975-.634c.299-.115.748-.252 1.574-.289.896-.041 1.164-.05 3.426-.05zm0-1.622C7.735.631 7.459.622 6.549.581 5.64.54 5.002.366 4.428.193A4.209 4.209 0 002.193 2.428C2.02 3.002 1.846 3.64 1.805 4.549 1.764 5.459 1.755 5.735 1.755 10s.009 4.541.05 5.451c.041.909.215 1.547.388 2.121a4.209 4.209 0 002.235 2.235c.574.173 1.212.347 2.121.388.91.041 1.186.05 5.451.05s4.541-.009 5.451-.05c.909-.041 1.547-.215 2.121-.388a4.209 4.209 0 002.235-2.235c.173-.574.347-1.212.388-2.121.041-.91.05-1.186.05-5.451s-.009-4.541-.05-5.451c-.041-.909-.215-1.547-.388-2.121A4.209 4.209 0 0015.572.193c-.574-.173-1.212-.347-2.121-.388C12.541.64 12.265.631 10 .631zm0 4.378a3.991 3.991 0 100 7.982 3.991 3.991 0 000-7.982zM10 13.001A3.01 3.01 0 1110 6.999a3.01 3.01 0 010 6.002zm5.906-7.772a.933.933 0 11-1.866 0 .933.933 0 011.866 0z" clipRule="evenodd"/>
                </svg>
              </a>
              <a 
                href="https://x.com/rajibane" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
                data-testid="link-twitter"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="scroll-animate">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                    First Name
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
                    Last Name
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
                  Email
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
                  Phone
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
                  Service Interest
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
                  Message
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  {...register("message")}
                  placeholder="Tell us about your career goals..."
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
