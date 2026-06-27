import { Star } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useCms } from "@/hooks/useCms";
import { imageUrl } from "@/lib/sanity";

export default function TestimonialsSection() {
  const { data } = useCms();
  const testimonials = data?.testimonials ?? [];

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
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={testimonial._id}
              className="bg-card border border-border rounded-2xl p-8 shadow-lg scroll-animate"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`testimonial-card-${index}`}
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image ? imageUrl(testimonial.image, 100) : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                  alt={`${testimonial.name} testimonial`}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                  data-testid={`img-testimonial-${index}`}
                />
                <div>
                  <div className="font-semibold text-card-foreground" data-testid={`text-name-${index}`}>
                    {testimonial.name}
                  </div>
                  <div className="text-muted-foreground text-sm" data-testid={`text-title-${index}`}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mb-6" data-testid={`text-content-${index}`}>
                "{testimonial.quote}"
              </p>
              <div className="flex text-yellow-500" data-testid={`rating-${index}`}>
                {Array.from({ length: testimonial.rating || 5 }, (_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/testimonials">
            <Button variant="outline">View All Testimonials</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
