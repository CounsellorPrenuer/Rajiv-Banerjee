import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const expertiseAreas = [
  "Career Coaching",
  "Agile Transformation", 
  "Team Mentoring",
  "Leadership Development"
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-muted" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="scroll-animate">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600" 
              alt="Rajiv Banerjee Profile" 
              className="w-full max-w-md rounded-2xl shadow-2xl mx-auto lg:mx-0"
              data-testid="img-rajiv-profile"
            />
          </div>
          
          <div className="space-y-8 scroll-animate">
            <div>
              <h2 className="text-4xl font-display font-bold text-foreground mb-6">
                Meet Rajiv Banerjee
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                With over 20 years of corporate experience at IBM India Pvt. Ltd., I've led Agile transformations, mentored countless teams, and helped professionals navigate their career journeys with confidence.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Starting as a Java Developer after completing honors in Mathematics from Calcutta University, I've witnessed firsthand the challenges and opportunities in today's evolving professional landscape.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="text-2xl font-bold text-primary mb-2" data-testid="text-years-experience">20+</div>
                <div className="text-muted-foreground">Years Corporate Experience</div>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="text-2xl font-bold text-primary mb-2" data-testid="text-professionals-mentored">500+</div>
                <div className="text-muted-foreground">Professionals Mentored</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Expertise Areas</h3>
              <div className="flex flex-wrap gap-3">
                {expertiseAreas.map((area) => (
                  <span 
                    key={area}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium"
                    data-testid={`expertise-${area.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
            
            <Button 
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
              data-testid="button-download-resume"
            >
              <Download className="mr-2" />
              Download Resume
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
