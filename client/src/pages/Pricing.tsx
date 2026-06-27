import { useState } from "react";
import PricingTabs from "@/components/PricingTabs";
import CustomPlans from "@/components/CustomPlans";
import BookingModal from "@/components/booking-modal";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Sparkles } from "lucide-react";
import { useCms } from "@/hooks/useCms";

type SelectedPlan = {
  planId: string;
  title: string;
  category: string;
  price: number;
};

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const { data } = useCms();

  const standardPlans = data?.standardPlans ?? [];
  const customPlans = data?.customPlans ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Mentoria Packages</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
              Choose Your Path to Success
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Tailored programs for every stage of your career journey
            </p>
          </div>

          <PricingTabs
            plans={standardPlans}
            onBuyClick={(plan, category) =>
              setSelectedPlan({ planId: plan.planId, title: plan.title, category, price: plan.price })
            }
          />
          <CustomPlans
            plans={customPlans}
            onBuyClick={(plan) =>
              setSelectedPlan({ planId: plan.planId, title: plan.title, category: "Custom Mentorship", price: plan.price })
            }
          />
        </div>
      </div>

      {selectedPlan && (
        <BookingModal
          open
          onOpenChange={(open) => !open && setSelectedPlan(null)}
          {...selectedPlan}
        />
      )}
      <Footer />
    </div>
  );
}
