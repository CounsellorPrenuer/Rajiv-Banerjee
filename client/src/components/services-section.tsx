import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Compass, RotateCcw, Users, TrendingUp } from "lucide-react";
import BookingModal from "./booking-modal.tsx";

const services = [
  {
    icon: Compass,
    title: "Career Guidance",
    description: "Personalized career coaching to help you navigate professional transitions and achieve your goals.",
    price: "From ₹2,999",
    serviceType: "career-guidance"
  },
  {
    icon: RotateCcw,
    title: "Agile Coaching",
    description: "Expert Agile transformation coaching based on 20+ years of corporate experience at IBM.",
    price: "From ₹4,999",
    serviceType: "agile-coaching"
  },
  {
    icon: Users,
    title: "Corporate Workshops",
    description: "Tailored workshops for teams focusing on professional development and career advancement.",
    price: "From ₹19,999",
    serviceType: "corporate-workshops"
  },
  {
    icon: TrendingUp,
    title: "Enterprise Mentoring",
    description: "Strategic mentoring programs for organizations looking to develop their leadership pipeline.",
    price: "Custom Pricing",
    serviceType: "enterprise-mentoring"
  }
];

export default function ServicesSection() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");

  const handleBookNow = (serviceType: string) => {
    setSelectedService(serviceType);
    setIsBookingModalOpen(true);
  };

  return (
    <section id="services" className="py-20 mesh-gradient-bg" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 animate-bounce-in">
            Comprehensive Career Solutions
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            From individual guidance to enterprise workshops, discover services designed to unlock your potential and accelerate your career growth.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.serviceType}
                className="interactive-card bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-0 rounded-2xl p-8 shadow-lg hover:shadow-2xl scroll-animate relative overflow-hidden group"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`service-card-${service.serviceType}`}
              >
                {/* Animated background elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full -translate-y-10 translate-x-10 animate-sparkle group-hover:animate-glow-pulse"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full translate-y-8 -translate-x-8 animate-sparkle" style={{animationDelay: `${index * 0.3}s`}}></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center mb-6 animate-bounce-in group-hover:animate-glow-pulse" style={{animationDelay: `${index * 0.2}s`}}>
                    <Icon className="text-2xl text-white animate-wave" size={24} style={{animationDelay: `${index * 0.1}s`}} />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-card-foreground mb-4 group-hover:gradient-text transition-all duration-300">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="text-2xl font-bold gradient-text mb-6 animate-bounce-in" style={{animationDelay: `${index * 0.3}s`}}>
                    {service.price}
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-primary via-accent to-primary text-white py-3 rounded-lg font-medium hover:from-accent hover:via-primary hover:to-accent transition-all duration-500 transform hover:scale-105 animate-glow-pulse group-hover:animate-gradient-shift shadow-lg hover:shadow-xl"
                    onClick={() => handleBookNow(service.serviceType)}
                    data-testid={`button-book-now-${service.serviceType}`}
                    style={{animationDelay: `${index * 0.4}s`}}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedService={selectedService}
      />
    </section>
  );
}
