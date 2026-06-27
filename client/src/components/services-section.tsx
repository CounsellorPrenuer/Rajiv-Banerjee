import { Compass, RotateCcw, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useCms } from "@/hooks/useCms";
import { imageUrl } from "@/lib/sanity";

const serviceIcons = [Compass, RotateCcw, Users, TrendingUp];

export default function ServicesSection() {
  const { data } = useCms();
  const services = data?.services ?? [];

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
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <div
                key={service._id}
                className="interactive-card bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-0 rounded-2xl p-8 shadow-lg hover:shadow-2xl scroll-animate relative overflow-hidden group"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`service-card-${index}`}
              >
                {service.image && (
                  <img
                    src={imageUrl(service.image, 400)}
                    alt={service.image.alt || service.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                    loading="lazy"
                  />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center mb-6">
                    <Icon className="text-2xl text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-card-foreground mb-4">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <Link href="/pricing">
                    <Button className="w-full bg-gradient-to-r from-primary via-accent to-primary text-white">
                      View Packages
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
