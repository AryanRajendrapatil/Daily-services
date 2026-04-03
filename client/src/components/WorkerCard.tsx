import { Star } from "lucide-react";
import type { Worker } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const WorkerCard = ({ worker }: { worker: Worker }) => {
  const initials = worker.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <Link to={`/worker/${worker._id}`}>
      <Card className="group overflow-hidden hover:shadow-elevated transition-all duration-300 cursor-pointer border border-border hover:border-primary/30">
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-lg">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground truncate">{worker.name}</h3>
                {worker.isVerified && (
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">Verified</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground capitalize">{worker.serviceType}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="text-sm font-medium">{worker.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">{worker.experience} yrs exp</span>
                {worker.isAvailable ? (
                  <Badge className="text-xs bg-success/10 text-success border-0 px-2 py-0.5">Available</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">Busy</Badge>
                )}
              </div>
            </div>
          </div>
          {/* Services preview */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {worker.services.slice(0, 3).map((s, i) => (
              <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                {s.title}
              </span>
            ))}
            {worker.services.length > 3 && (
              <span className="text-xs text-muted-foreground px-2 py-1">+{worker.services.length - 3} more</span>
            )}
          </div>
          {/* Price range */}
          {worker.services.length > 0 && (
            <p className="text-sm text-muted-foreground mt-3">
              Starting from <span className="font-semibold text-foreground">₹{Math.min(...worker.services.map(s => s.price))}</span>
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default WorkerCard;
