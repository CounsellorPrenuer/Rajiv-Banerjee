import { Button } from "@/components/ui/button";
import { Calendar, Play } from "lucide-react";
import AnimatedCounter from "@/components/animated-counter";
import karmaPathLogo from "@assets/Karma Path - RAJIV BANERJEE_1758627126158.png";

export default function HeroSection() {
  return (
    <section id="home" className="pt-20 pb-16 hero-gradient overflow-hidden" data-testid="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
                Guiding Professionals & Students Towards{" "}
                <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                  Career Clarity
                </span>
              </h1>
              <p className="text-xl text-blue-100 max-w-lg">
                With Rajiv Banerjee's 20+ years of corporate and Agile experience, discover your career path with confidence.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 hover:transform hover:scale-105"
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-book-free-call"
              >
                <Calendar className="mr-2" />
                Book Free Career Clarity Call
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-300"
                data-testid="button-watch-intro"
              >
                <Play className="mr-2" />
                Watch Introduction
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter target={500} suffix="+" />
                </div>
                <div className="text-blue-200 text-sm">Professionals Guided</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter target={20} suffix="+" />
                </div>
                <div className="text-blue-200 text-sm">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter target={95} suffix="%" />
                </div>
                <div className="text-blue-200 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10 animate-float flex items-center justify-center">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white border-opacity-20">
                <img 
                  src={karmaPathLogo}
                  alt="KarmaPath Career Counseling Logo" 
                  className="w-80 h-auto mx-auto"
                  data-testid="img-karmapath-logo"
                />
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-white bg-opacity-20 rounded-full animate-float" style={{animationDelay: '-2s'}}></div>
            <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-white bg-opacity-20 rounded-full animate-float" style={{animationDelay: '-4s'}}></div>
            <div className="absolute top-1/2 -left-20 w-12 h-12 bg-gradient-to-r from-blue-300 to-blue-200 rounded-full animate-float" style={{animationDelay: '-1s'}}></div>
            <div className="absolute top-1/4 -right-16 w-8 h-8 bg-gradient-to-r from-white to-blue-100 rounded-full animate-float" style={{animationDelay: '-3s'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
