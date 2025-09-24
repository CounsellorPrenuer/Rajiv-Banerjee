import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company?: string;
  content: string;
  rating: number;
  imageUrl?: string;
  featured: boolean;
}

export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 bg-background" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">
              What Clients Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Real stories from professionals who transformed their careers with KarmaPath
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-8 shadow-lg animate-pulse">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-muted rounded-full mr-4"></div>
                  <div>
                    <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="w-4 h-4 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">
            What Clients Say
          </h2>
          <p className="text-xl text-muted-foreground">
            Real stories from professionals who transformed their careers with KarmaPath
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials?.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="bg-card border border-border rounded-2xl p-8 shadow-lg scroll-animate" 
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`testimonial-card-${index}`}
            >
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.imageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                  alt={`${testimonial.name} testimonial`} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                  data-testid={`img-testimonial-${index}`}
                />
                <div>
                  <div className="font-semibold text-card-foreground" data-testid={`text-name-${index}`}>
                    {testimonial.name}
                  </div>
                  <div className="text-muted-foreground text-sm" data-testid={`text-title-${index}`}>
                    {testimonial.title}
                    {testimonial.company && ` at ${testimonial.company}`}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mb-6" data-testid={`text-content-${index}`}>
                "{testimonial.content}"
              </p>
              <div className="flex text-yellow-500" data-testid={`rating-${index}`}>
                {Array.from({ length: testimonial.rating }, (_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
