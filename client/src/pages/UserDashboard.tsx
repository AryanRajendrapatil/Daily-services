import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import type { Booking, Worker } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingStatusBadge from "@/components/BookingStatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const load = async () => {
      const [b, w] = await Promise.all([api.getBookings(), api.getWorkers()]);
      setBookings(b);
      setWorkers(w);
      setLoading(false);
    };
    load();
  }, [isAuthenticated, navigate]);

  const getWorkerName = (workerId: string) => workers.find(w => w._id === workerId)?.name || "Unknown";

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.bookingStatus === "pending").length,
    completed: bookings.filter(b => b.bookingStatus === "completed").length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name || "User"}</p>
          </div>
          <Button onClick={() => navigate("/services")}>Book a Service</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: stats.total, color: "text-foreground" },
            { label: "Pending", value: stats.pending, color: "text-warning" },
            { label: "Completed", value: stats.completed, color: "text-success" },
          ].map((s, i) => (
            <Card key={i} className="p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </Card>
          ))}
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4">My Bookings</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-2xl mb-2">📋</p>
            <p className="text-muted-foreground mb-4">No bookings yet</p>
            <Button onClick={() => navigate("/services")}>Browse Services</Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {bookings.map(booking => (
              <Card key={booking._id} className="p-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{booking.serviceId}</h3>
                      <BookingStatusBadge status={booking.bookingStatus} />
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {getWorkerName(booking.workerId)}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {booking.bookingDate}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {booking.bookingTime}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {booking.location}</span>
                    </div>
                  </div>
                  {booking.bookingStatus === "pending" && (
                    <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                      Cancel
                    </Button>
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

export default UserDashboard;
