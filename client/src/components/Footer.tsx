import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-card border-t border-border mt-auto">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl text-foreground">SevaBook</span>
          </div>
          <p className="text-sm text-muted-foreground">Your trusted platform for daily home services. Book skilled professionals in minutes.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Services</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services?category=plumber" className="hover:text-foreground transition-colors">Plumbing</Link></li>
            <li><Link to="/services?category=electrician" className="hover:text-foreground transition-colors">Electrical</Link></li>
            <li><Link to="/services?category=cleaner" className="hover:text-foreground transition-colors">Cleaning</Link></li>
            <li><Link to="/services?category=painter" className="hover:text-foreground transition-colors">Painting</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><span className="hover:text-foreground transition-colors cursor-pointer">About Us</span></li>
            <li><span className="hover:text-foreground transition-colors cursor-pointer">Careers</span></li>
            <li><span className="hover:text-foreground transition-colors cursor-pointer">Contact</span></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">For Workers</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/register?type=worker" className="hover:text-foreground transition-colors">Register as Professional</Link></li>
            <li><Link to="/login?type=worker" className="hover:text-foreground transition-colors">Worker Login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SevaBook. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
