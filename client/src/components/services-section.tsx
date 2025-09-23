import { Button } from "@/components/ui/button";
import { Compass, RotateCcw, Users, TrendingUp } from "lucide-react";

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
  const handleLearnMore = (serviceType: string) => {
    // Navigate to contact section with service pre-selected
    const contactSection = document.querySelector('#contact');
    const serviceSelect = document.querySelector('select[name="serviceInterest"]') as HTMLSelectElement;
    
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      
      // Set the service type after a small delay to ensure the component is rendered
      setTimeout(() => {
        if (serviceSelect) {
          const serviceTitle = services.find(s => s.serviceType === serviceType)?.title;
          if (serviceTitle) {
            serviceSelect.value = serviceTitle;
          }
        }
      }, 500);
    }
  };

  return (
    <section id="services" className="py-20 bg-background" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">
            Comprehensive Career Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From individual guidance to enterprise workshops, discover services designed to unlock your potential and accelerate your career growth.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.serviceType}
                className="service-card bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-2xl scroll-animate"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`service-card-${service.serviceType}`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-6">
                  <Icon className="text-2xl text-primary-foreground" size={24} />
                </div>
                <h3 className="text-xl font-display font-semibold text-card-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>
                <div className="text-primary font-semibold mb-4">
                  {service.price}
                </div>
                <Button 
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300"
                  onClick={() => handleLearnMore(service.serviceType)}
                  data-testid={`button-learn-more-${service.serviceType}`}
                >
                  Learn More
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
