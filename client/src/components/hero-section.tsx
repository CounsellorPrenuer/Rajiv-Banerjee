import { Button } from "@/components/ui/button";
import { Calendar, Play, Star, TrendingUp, Users, Sparkles } from "lucide-react";
import AnimatedCounter from "@/components/animated-counter";

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
            {/* Animated Graphics Container */}
            <div className="relative z-10 animate-float flex items-center justify-center">
              <div className="bg-gradient-to-br from-white/10 to-blue-500/20 backdrop-blur-lg rounded-3xl p-16 shadow-2xl border border-white/30 overflow-hidden">
                {/* Career Path Visualization */}
                <div className="relative w-80 h-80">
                  {/* Central Hub */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-xl">
                    <Star className="w-10 h-10 text-white animate-spin" style={{animationDuration: '8s'}} />
                  </div>
                  
                  {/* Orbiting Career Elements */}
                  <div className="absolute top-1/2 left-1/2 w-60 h-60 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative w-full h-full animate-spin" style={{animationDuration: '20s'}}>
                      {/* Career Growth */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Leadership */}
                      <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Innovation */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Success */}
                      <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Connecting Lines Animation */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
                    <circle
                      cx="160"
                      cy="160"
                      r="120"
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                      strokeDasharray="10,5"
                      className="animate-spin"
                      style={{animationDuration: '15s', animationDirection: 'reverse'}}
                    />
                    <circle
                      cx="160"
                      cy="160"
                      r="80"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                      strokeDasharray="5,10"
                      className="animate-spin"
                      style={{animationDuration: '10s'}}
                    />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Enhanced Floating Elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-float shadow-xl" style={{animationDelay: '-2s'}}></div>
            <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-float shadow-xl" style={{animationDelay: '-4s'}}></div>
            <div className="absolute top-1/2 -left-20 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-float shadow-lg" style={{animationDelay: '-1s'}}></div>
            <div className="absolute top-1/4 -right-16 w-8 h-8 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-float shadow-lg" style={{animationDelay: '-3s'}}></div>
            <div className="absolute bottom-1/4 right-10 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-float shadow-md" style={{animationDelay: '-5s'}}></div>
            <div className="absolute top-3/4 left-5 w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-float shadow-lg" style={{animationDelay: '-6s'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
