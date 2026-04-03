import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Clock, Star, Search } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/types";
import heroImage from "@/assets/hero-services.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Home services professional" width={1280} height={720} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-36">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight text-balance">
              Home Services,
              <br />
              <span className="text-accent">On Demand</span>
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-lg">
              Book verified plumbers, electricians, cleaners & more — at your doorstep within hours.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/services">
                <Button size="lg" className="gap-2 gradient-hero text-primary-foreground border-0 shadow-glow hover:opacity-90">
                  <Search className="h-4 w-4" />
                  Browse Services
                </Button>
              </Link>
              <Link to="/register?type=worker">
                <Button size="lg" variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20">
                  Register as Professional
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Our Services</h2>
            <p className="mt-2 text-muted-foreground">Choose from a wide range of home services</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SERVICE_CATEGORIES.map((cat) => (
              <Link key={cat.value} to={`/services?category=${cat.value}`}>
                <Card className="group p-6 text-center hover:shadow-elevated hover:border-primary/30 transition-all duration-300 cursor-pointer h-full">
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="font-semibold text-foreground">{cat.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{cat.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 gradient-warm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Verified Professionals", desc: "All workers are ID-verified and background checked" },
              { icon: Clock, title: "Quick Booking", desc: "Book services in under 2 minutes, get help within hours" },
              { icon: Star, title: "Rated & Reviewed", desc: "Transparent ratings from real customers" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground">Ready to get started?</h2>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">Join thousands of happy customers who trust SevaBook for their daily home needs.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
