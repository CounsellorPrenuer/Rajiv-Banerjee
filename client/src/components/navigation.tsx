import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import karmaPathLogo from "@assets/Karma Path - RAJIV BANERJEE_1758627126158.png";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home", isRoute: true },
    { href: "/pricing", label: "Pricing", isRoute: true },
    { href: "/#services", label: "Services", isRoute: false },
    { href: "/#about", label: "About", isRoute: false },
    { href: "/testimonials", label: "Testimonials", isRoute: true },
    { href: "/blog", label: "Blog", isRoute: true },
    { href: "/#contact", label: "Contact", isRoute: false },
  ];

  const scrollToSection = (href: string) => {
    const hash = href.includes("#") ? href.split("#")[1] : "";
    if (location !== "/") {
      window.location.href = `${import.meta.env.BASE_URL}${hash ? `#${hash}` : ""}`;
      return;
    }
    if (hash) {
      const target = document.querySelector(`#${hash}`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-card" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3">
            <img
              src={karmaPathLogo}
              alt="KarmaPath Logo"
              className="h-14 w-auto"
              data-testid="nav-logo"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link text-foreground hover:text-primary transition-colors"
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="nav-link text-foreground hover:text-primary transition-colors"
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </button>
              ),
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              className="btn-primary text-primary-foreground px-6 py-2 rounded-lg font-medium"
              onClick={() => scrollToSection("/#contact")}
              data-testid="button-book-consultation"
            >
              Book Consultation
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) =>
                    link.isRoute ? (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors"
                        data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <button
                        key={link.href}
                        onClick={() => scrollToSection(link.href)}
                        className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors"
                        data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                      </button>
                    ),
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
