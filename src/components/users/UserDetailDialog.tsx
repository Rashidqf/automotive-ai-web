import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Car, Phone, Mail, MapPin, CheckCircle, XCircle } from "lucide-react";

export interface UserDetailShape {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  status: string;
  createdAt?: string;
  vehicles: { id: string; vehicleNumber?: string; vehicleType?: string; lastOilChange?: string; serviceStation?: string; isPreferredStation?: boolean }[];
}

interface UserDetailDialogProps {
  user: UserDetailShape | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailDialog({
  user,
  open,
  onOpenChange,
}: UserDetailDialogProps) {
  if (!user) return null;

  // Mock additional user data
  const additionalData = {
    address: "1234 Oak Street, Apt 5B",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-y-auto h-[calc(95vh)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-lg font-semibold text-primary-foreground">
              {user.name.charAt(0)}
            </div>
            <div>
              <span className="text-foreground">{user.name || "—"}</span>
              <p className="text-sm font-normal text-muted-foreground flex items-center gap-1">
                {user.status === "active" ? (
                  <CheckCircle className="h-3 w-3 text-success" />
                ) : (
                  <XCircle className="h-3 w-3 text-destructive" />
                )}
                {user.status}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Contact Information
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{user.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Residential Address */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Residential Address
            </h4>
            <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{additionalData.address}</p>
                <p className="text-sm text-muted-foreground">
                  {additionalData.city}, {additionalData.state} {additionalData.zipCode}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicles */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Vehicles ({user.vehicles.length})
            </h4>
            {user.vehicles.map((vehicle) => (
              <div key={vehicle.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{vehicle.vehicleNumber}</p>
                    <p className="text-sm text-muted-foreground">{vehicle.vehicleType}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary/50 p-2">
                    <p className="text-xs text-muted-foreground">Last Oil Change</p>
                    <p className="font-medium text-foreground text-sm">{vehicle.lastOilChange}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2">
                    <p className="text-xs text-muted-foreground">Service Station</p>
                    <div className="flex items-center gap-1">
                      <p className="font-medium text-foreground text-sm">{vehicle.serviceStation}</p>
                      {vehicle.isPreferredStation ? (
                        <CheckCircle className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-warning" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Member Since */}
          {user.createdAt && (
            <div className="text-center text-sm text-muted-foreground">
              Member since {typeof user.createdAt === "string" ? user.createdAt : new Date(user.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
