import type { BookingStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-0" },
  accepted: { label: "Accepted", className: "bg-info/10 text-info border-0" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-0" },
  completed: { label: "Completed", className: "bg-success/10 text-success border-0" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground border-0" },
};

const BookingStatusBadge = ({ status }: { status: BookingStatus }) => {
  const config = statusConfig[status] || statusConfig.pending;
  return <Badge className={config.className}>{config.label}</Badge>;
};

export default BookingStatusBadge;
