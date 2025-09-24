import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, GraduationCap, PlayCircle, ExternalLink } from "lucide-react";

export default function MentoriaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-blue-50 dark:from-primary/10 dark:to-gray-900" data-testid="mentoria-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-4xl font-display font-bold text-foreground mb-6">
            Powered by Mentoria
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Every KarmaPath program includes lifetime access to <strong>Mentoria</strong>, 
            India's trusted platform for career discovery, mentorship, and lifelong upskilling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8 scroll-animate">
            <div>
              <h3 className="text-3xl font-display font-bold text-foreground mb-6">
                Mentoria at a Glance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-border shadow-sm">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">3,50,000+</div>
                  <div className="text-sm text-muted-foreground">Students & Professionals Mentored</div>
                </div>
                
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-border shadow-sm">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">240+</div>
                  <div className="text-sm text-muted-foreground">Corporate Partners</div>
                </div>
                
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-border shadow-sm">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">350+</div>
                  <div className="text-sm text-muted-foreground">Schools & College Partners</div>
                </div>
                
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-border shadow-sm">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                    <PlayCircle className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">1000+</div>
                  <div className="text-sm text-muted-foreground">Hours of Career Webinars</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="scroll-animate">
            <Card className="bg-white dark:bg-gray-800 border-primary/20 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-primary">
                  Enhanced Career Guidance Services
                </CardTitle>
                <CardDescription className="text-base">
                  In partnership with Mentoria for comprehensive career development
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Career Discovery Platform</h4>
                      <p className="text-sm text-muted-foreground">
                        Access comprehensive career assessments and exploration tools
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Expert Mentorship Network</h4>
                      <p className="text-sm text-muted-foreground">
                        Connect with industry professionals and career experts
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Lifelong Learning Resources</h4>
                      <p className="text-sm text-muted-foreground">
                        Continuous upskilling opportunities and learning pathways
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Career Webinars & Workshops</h4>
                      <p className="text-sm text-muted-foreground">
                        Regular sessions on industry trends and career strategies
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  data-testid="button-explore-mentoria"
                >
                  <ExternalLink className="mr-2 w-4 h-4" />
                  Explore Mentoria Platform
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}