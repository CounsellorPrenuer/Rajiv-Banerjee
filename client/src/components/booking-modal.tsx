import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { X, CreditCard, User, Mail, Phone } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const bookingFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  serviceInterest: z.string().min(1, "Service selection is required"),
  message: z.string().min(10, "Please provide more details about your requirements")
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: string;
}

// Service mapping for display
const serviceMapping: Record<string, { name: string; price: string }> = {
  "career-guidance": { name: "Career Guidance", price: "₹2,999" },
  "agile-coaching": { name: "Agile Coaching", price: "₹4,999" },
  "corporate-workshops": { name: "Corporate Workshops", price: "₹19,999" },
  "enterprise-mentoring": { name: "Enterprise Mentoring", price: "Custom Pricing" }
};

export default function BookingModal({ isOpen, onClose, selectedService }: BookingModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceInterest: serviceMapping[selectedService]?.name || ""
    }
  });

  // Reset form when selectedService changes to ensure serviceInterest is prefilled
  useEffect(() => {
    if (selectedService && serviceMapping[selectedService]) {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        serviceInterest: serviceMapping[selectedService].name,
      });
    }
  }, [selectedService, reset]);

  // Create payment order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await apiRequest("POST", "/api/payments/create-order", {
        serviceType: selectedService,
        contactInfo: data
      });
      return await response.json();
    }
  });

  // Payment verification mutation
  const verifyPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await apiRequest("POST", "/api/payments/verify", paymentData);
      return await response.json();
    }
  });

  const onSubmit = async (data: BookingFormData) => {
    if (selectedService === "enterprise-mentoring") {
      // For enterprise mentoring, just submit contact form
      handleContactSubmission(data);
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create payment order
      const orderResponse = await createOrderMutation.mutateAsync(data);
      
      // Initialize Razorpay
      const options = {
        key: orderResponse.keyId,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        order_id: orderResponse.orderId,
        name: "KarmaPath Career Coaching",
        description: `Payment for ${serviceMapping[selectedService]?.name}`,
        image: "/favicon.ico",
        handler: async function (response: any) {
          try {
            // Verify payment
            await verifyPaymentMutation.mutateAsync({
              paymentId: orderResponse.paymentId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            });
            
            toast({
              title: "Payment Successful!",
              description: "Your booking has been confirmed. We'll contact you shortly.",
            });
            
            handleClose();
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support with your payment details.",
              variant: "destructive"
            });
          }
        },
        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone
        },
        theme: {
          color: "#3B82F6"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error("Payment failed:", response.error);
        toast({
          title: "Payment Failed",
          description: "Payment was not completed. Please try again.",
          variant: "destructive"
        });
        setIsProcessing(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Booking Failed",
        description: "Unable to process your booking. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const handleContactSubmission = async (data: BookingFormData) => {
    try {
      await apiRequest("POST", "/api/contact", data);

      toast({
        title: "Request Submitted!",
        description: "We'll contact you with custom pricing details shortly.",
      });
      
      handleClose();
    } catch (error) {
      console.error("Contact submission failed:", error);
      toast({
        title: "Submission Failed",
        description: "Unable to submit your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setIsProcessing(false);
    reset();
    onClose();
  };

  const selectedServiceDetails = serviceMapping[selectedService];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Book {selectedServiceDetails?.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
              data-testid="button-close-modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {selectedServiceDetails && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Price: {selectedServiceDetails.price}
            </div>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                <User className="inline w-4 h-4 mr-1" />
                First Name
              </Label>
              <Input
                {...register("firstName")}
                id="firstName"
                placeholder="John"
                data-testid="input-firstName"
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </Label>
              <Input
                {...register("lastName")}
                id="lastName"
                placeholder="Doe"
                data-testid="input-lastName"
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              <Mail className="inline w-4 h-4 mr-1" />
              Email
            </Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="john@example.com"
              data-testid="input-email"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              <Phone className="inline w-4 h-4 mr-1" />
              Phone Number
            </Label>
            <Input
              {...register("phone")}
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              data-testid="input-phone"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Requirements
            </Label>
            <textarea
              {...register("message")}
              id="message"
              rows={3}
              placeholder="Please describe your specific needs and goals..."
              data-testid="input-message"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.message ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="button-book-now"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  {selectedService === "enterprise-mentoring" ? "Submit Request" : "Book Now & Pay"}
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}