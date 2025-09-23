import { Linkedin, Instagram, Shield, FileText } from "lucide-react";
import karmaPathLogo from "@assets/Karma Path - RAJIV BANERJEE_1758627126158.png";

const footerSections = [
  {
    title: "Services",
    links: [
      { label: "Career Guidance", href: "#services" },
      { label: "Agile Coaching", href: "#services" },
      { label: "Mentorship", href: "#services" },
      { label: "Corporate Workshops", href: "#services" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "About", href: "#about" },
      { label: "Packages", href: "#services" },
      { label: "Blog", href: "#blog" },
      { label: "Contact", href: "#contact" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
    ],
  },
  {
    title: "Trust & Compliance",
    links: [
      { label: "GDPR-compliant", href: "#privacy" },
      { label: "Confidential", href: "#privacy" },
      { label: "Certified Coaching", href: "#about" },
    ],
  },
];

export default function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer className="bg-foreground text-background py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={karmaPathLogo}
                alt="KarmaPath Logo" 
                className="w-12 h-auto"
                data-testid="footer-logo"
              />
            </div>
            <p className="text-gray-400 mb-6">
              Guiding professionals and students towards career clarity and growth with 20+ years of experience.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/in/rajiv-banerjee/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="footer-link-linkedin"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/rajivban8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="footer-link-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/rajibane" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="footer-link-twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
            </div>
          </div>
          
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-gray-400">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('#') ? (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="hover:text-white transition-colors text-left"
                        data-testid={`footer-link-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a 
                        href={link.href} 
                        className="hover:text-white transition-colors"
                        data-testid={`footer-link-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 space-y-4 md:space-y-0">
            <p>&copy; 2025 KarmaPath – All Rights Reserved</p>
            <div className="flex items-center space-x-2">
              <span>Made with</span>
              <div className="text-red-500">❤️</div>
              <span>by</span>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors font-semibold">
                Mentoria
              </a>
            </div>
            <p className="text-sm">
              In partnership with Mentoria for enhanced career guidance services.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}