import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { SERVICE_CATEGORIES } from "@/types";
import type { ServiceCategory } from "@/types";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [searchParams] = useSearchParams();
  const isWorker = searchParams.get("type") === "worker";
  const [tab, setTab] = useState<"user" | "worker">(isWorker ? "worker" : "user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginAsUser, loginAsWorker } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "user") {
        const res = await api.loginUser(email, password);
        loginAsUser(res.user, res.token);
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        const res = await api.loginWorker(email, password);
        loginAsWorker(res.worker, res.token);
        toast.success("Welcome back!");
        navigate("/worker-dashboard");
      }
    } catch {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
          </div>

          {/* Tab */}
          <div className="flex bg-secondary rounded-lg p-1 mb-6">
            <button
              onClick={() => setTab("user")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tab === "user" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Customer
            </button>
            <button
              onClick={() => setTab("worker")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tab === "worker" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Professional
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to={`/register${tab === "worker" ? "?type=worker" : ""}`} className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

const Register = () => {
  const [searchParams] = useSearchParams();
  const isWorker = searchParams.get("type") === "worker";
  const [tab, setTab] = useState<"user" | "worker">(isWorker ? "worker" : "user");
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "", serviceType: "plumber" as ServiceCategory, experience: 1,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginAsUser, loginAsWorker } = useAuth();
  const navigate = useNavigate();

  const update = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      if (tab === "user") {
        const res = await api.registerUser(formData);
        loginAsUser(res.user, "mock-token");
        toast.success("Account created successfully!");
        navigate("/dashboard");
      } else {
        const res = await api.registerWorker(formData);
        loginAsWorker(res.worker, "mock-token");
        toast.success("Professional account created!");
        navigate("/worker-dashboard");
      }
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join SevaBook today</p>
          </div>

          <div className="flex bg-secondary rounded-lg p-1 mb-6">
            <button
              onClick={() => setTab("user")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tab === "user" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Customer
            </button>
            <button
              onClick={() => setTab("worker")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tab === "worker" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Professional
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input placeholder="John Doe" value={formData.name} onChange={e => update("name", e.target.value)} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="your@email.com" value={formData.email} onChange={e => update("email", e.target.value)} required />
            </div>
            <div>
              <Label>Phone</Label>
              <Input type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={e => update("phone", e.target.value)} required />
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="Min 6 characters" value={formData.password} onChange={e => update("password", e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {tab === "worker" && (
              <>
                <div>
                  <Label>Service Type</Label>
                  <Select value={formData.serviceType} onValueChange={v => update("serviceType", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SERVICE_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.icon} {cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Years of Experience</Label>
                  <Input type="number" min={0} value={formData.experience} onChange={e => update("experience", parseInt(e.target.value))} required />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to={`/login${tab === "worker" ? "?type=worker" : ""}`} className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export { Login, Register };
