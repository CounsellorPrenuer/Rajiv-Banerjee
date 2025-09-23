import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, TrendingUp, Heart } from "lucide-react";

const resourceTopics = [
  {
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    title: "Career Guidance Tips",
    description: "Essential insights for students and professionals navigating their career journey",
    topics: ["Resume Building", "Interview Mastery", "Career Transitions", "Skill Development"]
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Agile Transformation & Leadership",
    description: "Leadership strategies and agile methodologies for modern workplaces",
    topics: ["Agile Leadership", "Team Management", "Digital Transformation", "Change Management"]
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
    title: "Productivity & AI Trends",
    description: "Stay ahead with AI integration and productivity optimization in modern careers",
    topics: ["AI in Workplace", "Automation Tools", "Future Skills", "Digital Productivity"]
  },
  {
    icon: <Heart className="w-8 h-8 text-primary" />,
    title: "Mindfulness & Work-Life Balance",
    description: "Techniques for maintaining mental wellness and achieving work-life harmony",
    topics: ["Stress Management", "Mindful Leadership", "Work-Life Integration", "Mental Wellness"]
  }
];

export default function ResourcesSection() {
  return (
    <section id="resources" className="py-20 bg-background" data-testid="resources-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">
            Blog / Resources
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive career guidance, leadership insights, and professional development resources 
            to accelerate your growth journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {resourceTopics.map((resource, index) => (
            <Card 
              key={index}
              className="hover:shadow-xl transition-all duration-300 scroll-animate border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`resource-card-${index}`}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  {resource.icon}
                </div>
                <CardTitle className="text-2xl mb-2">{resource.title}</CardTitle>
                <CardDescription className="text-base">
                  {resource.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {resource.topics.map((topic, topicIndex) => (
                    <div 
                      key={topicIndex}
                      className="text-sm text-center py-2 px-3 bg-muted rounded-lg font-medium text-foreground"
                      data-testid={`topic-${index}-${topicIndex}`}
                    >
                      {topic}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
            data-testid="button-explore-all-resources"
          >
            <BookOpen className="mr-2" />
            Explore All Resources
          </Button>
        </div>
      </div>
    </section>
  );
}