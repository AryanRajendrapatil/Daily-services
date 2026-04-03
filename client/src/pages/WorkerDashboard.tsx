import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import type { Booking } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingStatusBadge from "@/components/BookingStatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const WorkerDashboard = () => {
  const { isAuthenticated, worker } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "completed">("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?type=worker");
      return;
    }
    const load = async () => {
      const data = await api.getBookings();
      setBookings(data);
      setLoading(false);
    };
    load();
  }, [isAuthenticated, navigate]);

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.bookingStatus === filter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.bookingStatus === "pending").length,
    accepted: bookings.filter(b => b.bookingStatus === "accepted").length,
    completed: bookings.filter(b => b.bookingStatus === "completed").length,
  };

  const handleAccept = (id: string) => {
    setBookings(prev => prev.map(b => b._id === id ? { ...b, bookingStatus: "accepted" as const } : b));
    toast.success("Booking accepted!");
  };

  const handleReject = (id: string) => {
    setBookings(prev => prev.map(b => b._id === id ? { ...b, bookingStatus: "rejected" as const } : b));
    toast.info("Booking rejected");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Worker Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, {worker?.name || "Professional"} • 
            <span className="capitalize"> {worker?.serviceType || "Service Provider"}</span>
          </p>
          {worker && (
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-sm font-medium">{worker.rating} rating</span>
              </div>
              {worker.isVerified ? (
                <Badge className="bg-success/10 text-success border-0 text-xs">Verified</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">Pending Verification</Badge>
              )}
              {worker.isAvailable ? (
                <Badge className="bg-success/10 text-success border-0 text-xs">Available</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">Unavailable</Badge>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Jobs", value: stats.total },
            { label: "Pending", value: stats.pending },
            { label: "Active", value: stats.accepted },
            { label: "Completed", value: stats.completed },
          ].map((s, i) => (
            <Card key={i} className="p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "accepted", "completed"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                filter === f ? "gradient-hero text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No bookings in this category</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(booking => (
              <Card key={booking._id} className="p-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{booking.serviceId}</h3>
                      <BookingStatusBadge status={booking.bookingStatus} />
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {booking.bookingDate}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {booking.bookingTime}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {booking.location}</span>
                    </div>
                  </div>
                  {booking.bookingStatus === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAccept(booking._id)} className="gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReject(booking._id)} className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10">
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WorkerDashboard;
