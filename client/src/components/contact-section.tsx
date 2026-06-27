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
import { workerPost } from "@/lib/workerApi";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/config";
import { Phone, Mail, Globe, Send, Linkedin, Instagram } from "lucide-react";
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      return workerPost("/api/forms/submit", {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        message: data.message,
        serviceType: data.serviceInterest,
      });
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
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const openMailDraft = (data: ContactForm) => {
    const subject = encodeURIComponent(`KarmaPath enquiry: ${data.serviceInterest}`);
    const body = encodeURIComponent(
      `Hello Rajiv,\n\nName: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nPhone: ${data.phone}\nService: ${data.serviceInterest}\n\n${data.message}\n`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
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
                  <div className="text-muted-foreground" data-testid="text-phone">{CONTACT_PHONE}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Mail className="text-primary-foreground" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Email</div>
                  <div className="text-muted-foreground" data-testid="text-email">{CONTACT_EMAIL}</div>
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
              <a href="https://www.linkedin.com/in/rajiv-banerjee/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors" data-testid="link-linkedin">
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a href="https://www.instagram.com/rajivban8" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors" data-testid="link-instagram">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="https://x.com/rajibane" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors" data-testid="link-twitter">
                <FaXTwitter className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          <div className="scroll-animate">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" {...register("firstName")} placeholder="John" data-testid="input-first-name" />
                  {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" {...register("lastName")} placeholder="Doe" data-testid="input-last-name" />
                  {errors.lastName && <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register("email")} placeholder="john.doe@example.com" data-testid="input-email" />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" type="tel" {...register("phone")} placeholder="+91 98765 43210" data-testid="input-phone" />
                {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <Label htmlFor="serviceInterest">Service Interest *</Label>
                <Select onValueChange={(value) => setValue("serviceInterest", value)} data-testid="select-service">
                  <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Career Guidance">Career Guidance</SelectItem>
                    <SelectItem value="Agile Coaching">Agile Coaching</SelectItem>
                    <SelectItem value="Corporate Workshops">Corporate Workshops</SelectItem>
                    <SelectItem value="Enterprise Mentoring">Enterprise Mentoring</SelectItem>
                  </SelectContent>
                </Select>
                {errors.serviceInterest && <p className="text-destructive text-sm mt-1">{errors.serviceInterest.message}</p>}
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" rows={4} {...register("message")} placeholder="Tell us about your career goals..." data-testid="textarea-message" />
                {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
              </div>

              <div className="space-y-4">
                <Button type="submit" disabled={contactMutation.isPending} className="w-full" data-testid="button-send-message">
                  <Send size={20} className="mr-2" />
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleSubmit(openMailDraft)}>
                  <Mail size={20} className="mr-2" />
                  Email Instead
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
