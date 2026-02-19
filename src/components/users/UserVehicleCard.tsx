import { Car, CheckCircle, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserVehicle } from "@/data/mockData";

interface UserVehicleCardProps {
  vehicle: UserVehicle;
  onViewHistory: (vehicle: UserVehicle) => void;
}

export function UserVehicleCard({ vehicle, onViewHistory }: UserVehicleCardProps) {
  return (
    <div className="rounded-lg bg-secondary/50 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground text-sm">{vehicle.vehicleNumber}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">{vehicle.serviceStation}</span>
          {vehicle.isPreferredStation ? (
            <CheckCircle className="h-3.5 w-3.5 text-success" />
          ) : (
            <XCircle className="h-3.5 w-3.5 text-warning" />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{vehicle.vehicleType}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs text-primary hover:text-primary"
          onClick={() => onViewHistory(vehicle)}
        >
          <Eye className="h-3.5 w-3.5" />
          View Details
        </Button>
      </div>
    </div>
  );
}
