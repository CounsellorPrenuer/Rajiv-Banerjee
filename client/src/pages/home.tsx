import { useEffect } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import AboutSection from "@/components/about-section";
import TestimonialsSection from "@/components/testimonials-section";
import BlogSection from "@/components/blog-section";
import ResourcesSection from "@/components/resources-section";
import ContactSection from "@/components/contact-section";
import MentoriaSection from "@/components/mentoria-section";
import Footer from "@/components/footer";

export default function Home() {
  useEffect(() => {
    // Set up intersection observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);
    
    // Wait for the DOM to be ready and then observe elements
    const setupObserver = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach(el => {
        observer.observe(el);
      });
    };

    // Setup observer immediately and also after a small delay to catch dynamically rendered content
    setupObserver();
    const timeoutId = setTimeout(setupObserver, 1000);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector((anchor as HTMLElement).getAttribute('href') || '');
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <TestimonialsSection />
        <BlogSection />
        <ResourcesSection />
        <ContactSection />
        <MentoriaSection />
      </main>
      <Footer />
    </div>
  );
}
