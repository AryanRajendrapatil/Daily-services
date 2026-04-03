import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import type { Worker, Service } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Shield, ArrowLeft, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const WorkerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const data = await api.getWorkerById(id);
      setWorker(data || null);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleBook = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to book a service");
      navigate("/login");
      return;
    }
    if (!bookingDate || !bookingTime || !selectedService) {
      toast.error("Please fill in all booking details");
      return;
    }
    try {
      await api.createBooking({
        userId: "u1",
        workerId: worker!._id,
        serviceId: selectedService.title,
        bookingDate,
        bookingTime,
        bookingStatus: "pending",
        paymentStatus: "pending",
        location: "User Location",
      });
      toast.success("Booking created successfully!");
      setBookingOpen(false);
      setBookingDate("");
      setBookingTime("");
      setSelectedService(null);
    } catch {
      toast.error("Failed to create booking");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-xl text-muted-foreground">Worker not found</p>
          <Button onClick={() => navigate("/services")}>Browse Services</Button>
        </div>
      </div>
    );
  }

  const initials = worker.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile info */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="text-center">
                <div className="w-24 h-24 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold text-3xl">{initials}</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">{worker.name}</h1>
                <p className="text-muted-foreground capitalize">{worker.serviceType}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold text-lg">{worker.rating}</span>
                  <span className="text-sm text-muted-foreground">({worker.reviews.length} reviews)</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{worker.experience} years experience</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Service area available</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  {worker.isVerified ? (
                    <>
                      <Shield className="h-4 w-4 text-success" />
                      <span className="text-success font-medium">ID Verified</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Verification pending</span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6">
                {worker.isAvailable ? (
                  <Badge className="w-full justify-center py-1.5 bg-success/10 text-success border-0">Available Now</Badge>
                ) : (
                  <Badge variant="secondary" className="w-full justify-center py-1.5">Currently Busy</Badge>
                )}
              </div>
            </Card>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-foreground mb-4">Services Offered</h2>
            <div className="space-y-4">
              {worker.services.map((service, i) => (
                <Card key={i} className="p-5 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-foreground">₹{service.price}</p>
                    <Dialog open={bookingOpen && selectedService?.title === service.title} onOpenChange={(open) => {
                      setBookingOpen(open);
                      if (open) setSelectedService(service);
                    }}>
                      <DialogTrigger asChild>
                        <Button size="sm" disabled={!worker.isAvailable} className="mt-2 gap-1">
                          <Calendar className="h-3.5 w-3.5" /> Book
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Book {service.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <Label>Date</Label>
                            <Input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                          </div>
                          <div>
                            <Label>Time</Label>
                            <Input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} />
                          </div>
                          <div className="bg-secondary rounded-lg p-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Service</span>
                              <span className="font-medium">{service.title}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-muted-foreground">Price</span>
                              <span className="font-bold">₹{service.price}</span>
                            </div>
                          </div>
                          <Button className="w-full" onClick={handleBook}>Confirm Booking</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WorkerProfile;
