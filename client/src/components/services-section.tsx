import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Compass, RotateCcw, Users, TrendingUp, Star, Target, Briefcase, Award, Code, Building } from "lucide-react";
import BookingModal from "./booking-modal.tsx";

// Icon mapping based on service category
const iconMapping: Record<string, any> = {
  "career": Compass,
  "agile": RotateCcw, 
  "workshop": Users,
  "mentoring": TrendingUp,
  "consulting": Briefcase,
  "coaching": Target,
  "development": Code,
  "corporate": Building,
  "leadership": Award,
  "default": Star
};

// Helper function to get icon based on category
const getServiceIcon = (category: string) => {
  const normalizedCategory = category.toLowerCase();
  for (const [key, icon] of Object.entries(iconMapping)) {
    if (normalizedCategory.includes(key)) {
      return icon;
    }
  }
  return iconMapping.default;
};

export default function ServicesSection() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");

  // Fetch services from API
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ["/api/services"],
    select: (data: any[]) => data.map(service => ({
      ...service,
      icon: getServiceIcon(service.category),
      serviceType: service.name.toLowerCase().replace(/\s+/g, '-'),
      formattedPrice: service.price ? `₹${parseFloat(service.price).toLocaleString('en-IN')}` : "Contact for pricing"
    }))
  });

  const handleBookNow = (serviceType: string) => {
    setSelectedService(serviceType);
    setIsBookingModalOpen(true);
  };

  if (error) {
    return (
      <section id="services" className="py-20 mesh-gradient-bg" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Services Currently Unavailable
          </h2>
          <p className="text-xl text-blue-100">
            Please try again later or contact us directly.
          </p>
        </div>
      </section>
    );
  }

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
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white/10 rounded-2xl p-8 animate-pulse">
                <div className="w-16 h-16 bg-white/20 rounded-xl mb-6"></div>
                <div className="h-6 bg-white/20 rounded mb-4"></div>
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-4 bg-white/20 rounded mb-6"></div>
                <div className="h-8 bg-white/20 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.id}
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
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="text-2xl font-bold gradient-text mb-6 animate-bounce-in" style={{animationDelay: `${index * 0.3}s`}}>
                    {service.formattedPrice}
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
        )}
      </div>
      
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedService={selectedService}
      />
    </section>
  );
}
