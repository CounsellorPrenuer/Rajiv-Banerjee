import { Route } from "lucide-react";

const footerSections = [
  {
    title: "Services",
    links: [
      { label: "Career Guidance", href: "#services" },
      { label: "Agile Coaching", href: "#services" },
      { label: "Corporate Workshops", href: "#services" },
      { label: "Enterprise Mentoring", href: "#services" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#blog" },
      { label: "Career Resources", href: "#blog" },
      { label: "Success Stories", href: "#testimonials" },
      { label: "Free Tools", href: "#contact" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "rajivban@gmail.com", href: "mailto:rajivban@gmail.com" },
      { label: "+91 9830115113", href: "tel:+919830115113" },
      { label: "www.KarmaPath.coach", href: "https://www.karmapath.coach" },
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
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Route className="text-primary-foreground text-sm" size={16} />
              </div>
              <span className="text-lg font-display font-bold">KarmaPath</span>
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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/rajivban8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="footer-link-instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2.253c2.262 0 2.53.009 3.426.05.826.037 1.275.174 1.574.289.396.153.678.337.975.634.297.297.481.579.634.975.115.299.252.748.289 1.574.041.896.05 1.164.05 3.426s-.009 2.53-.05 3.426c-.037.826-.174 1.275-.289 1.574a2.588 2.588 0 01-.634.975 2.588 2.588 0 01-.975.634c-.299.115-.748.252-1.574.289-.896.041-1.164.05-3.426.05s-2.53-.009-3.426-.05c-.826-.037-1.275-.174-1.574-.289a2.588 2.588 0 01-.975-.634 2.588 2.588 0 01-.634-.975c-.115-.299-.252-.748-.289-1.574-.041-.896-.05-1.164-.05-3.426s.009-2.53.05-3.426c.037-.826.174-1.275.289-1.574.153-.396.337-.678.634-.975a2.588 2.588 0 01.975-.634c.299-.115.748-.252 1.574-.289.896-.041 1.164-.05 3.426-.05zm0-1.622C7.735.631 7.459.622 6.549.581 5.64.54 5.002.366 4.428.193A4.209 4.209 0 002.193 2.428C2.02 3.002 1.846 3.64 1.805 4.549 1.764 5.459 1.755 5.735 1.755 10s.009 4.541.05 5.451c.041.909.215 1.547.388 2.121a4.209 4.209 0 002.235 2.235c.574.173 1.212.347 2.121.388.91.041 1.186.05 5.451.05s4.541-.009 5.451-.05c.909-.041 1.547-.215 2.121-.388a4.209 4.209 0 002.235-2.235c.173-.574.347-1.212.388-2.121.041-.91.05-1.186.05-5.451s-.009-4.541-.05-5.451c-.041-.909-.215-1.547-.388-2.121A4.209 4.209 0 0015.572.193c-.574-.173-1.212-.347-2.121-.388C12.541.64 12.265.631 10 .631zm0 4.378a3.991 3.991 0 100 7.982 3.991 3.991 0 000-7.982zM10 13.001A3.01 3.01 0 1110 6.999a3.01 3.01 0 010 6.002zm5.906-7.772a.933.933 0 11-1.866 0 .933.933 0 011.866 0z" clipRule="evenodd"/>
                </svg>
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
                        data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a 
                        href={link.href} 
                        className="hover:text-white transition-colors"
                        data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
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
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 KarmaPath. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}
