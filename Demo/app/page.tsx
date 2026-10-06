import { Closing } from "@/components/landing/closing";
import { FAQ } from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LogoCloud } from "@/components/landing/logo-cloud";
import { Pricing } from "@/components/landing/pricing";
import { Showcase } from "@/components/landing/showcase";
import { Testimonials } from "@/components/landing/testimonials";
import { getCustomers, getMetrics, getRecentTransactions } from "@/lib/ledger";

export default function HomePage() {
  const metrics = getMetrics("30d");
  const recent = getRecentTransactions(4);
  const customers = getCustomers({
    range: "30d",
    q: "",
    segment: "all",
    sort: "spend",
    dir: "desc",
    page: 1,
    pageSize: 4,
  });

  return (
    <>
      <Header />
      <main id="content">
        <Hero metrics={metrics} recent={recent} />
        <LogoCloud />
        <Features metrics={metrics} />
        <Showcase metrics={metrics} customers={customers.items} />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
