import { Star, Quote } from "lucide-react";
import { imageUrl } from "@/lib/sanity";
import { useCms } from "@/hooks/useCms";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Testimonials() {
  const { data } = useCms();
  const testimonials = data?.testimonials ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-display font-bold mb-6">What Our Clients Say</h1>
            <p className="text-xl text-muted-foreground">Real stories from professionals who transformed their careers with KarmaPath.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial._id} className="h-full flex flex-col">
                <CardContent className="p-8 flex flex-col h-full">
                  {testimonial.image && (
                    <img
                      src={imageUrl(testimonial.image, 240)}
                      alt={testimonial.image.alt || testimonial.name}
                      className="w-20 h-20 rounded-full object-cover mb-4"
                      loading="lazy"
                    />
                  )}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating || 5 }).map((_, star) => (
                      <Star key={star} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <div className="relative mb-4 flex-1">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                    <p className="leading-relaxed pl-6">{testimonial.quote}</p>
                  </div>
                  <div className="mt-auto pt-4 border-t">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
