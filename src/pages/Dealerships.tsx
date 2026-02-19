import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, MapPin, Building2, Edit, Trash2, MoreVertical, Eye, Copy, Link } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockDealerships, Dealership } from "@/data/mockData";

const emptyDealership = {
  name: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  username: "",
};

const Dealerships = () => {
  const navigate = useNavigate();
  const [dealerships, setDealerships] = useState<Dealership[]>(mockDealerships);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDealership, setEditingDealership] = useState<Dealership | null>(null);
  const [dealershipToDelete, setDealershipToDelete] = useState<Dealership | null>(null);
  const [formData, setFormData] = useState(emptyDealership);
  const { toast } = useToast();

  const handleViewDealership = (dealership: Dealership) => {
    navigate(`/dealerships/${dealership.id}`);
  };

  const filteredDealerships = dealerships.filter(
    (dealership) =>
      dealership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dealership.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast({
            title: "Location Retrieved",
            description: `Lat: ${position.coords.latitude.toFixed(4)}, Long: ${position.coords.longitude.toFixed(4)}`,
          });
        },
        () => {
          toast({
            title: "Location Error",
            description: "Unable to retrieve your location.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
    }
  };

  const handleOpenCreate = () => {
    setEditingDealership(null);
    setFormData(emptyDealership);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (dealership: Dealership) => {
    setEditingDealership(dealership);
    setFormData({
      name: dealership.name,
      address: dealership.address,
      city: dealership.city,
      state: dealership.state,
      zipCode: dealership.zipCode,
      username: dealership.username,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.username) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingDealership) {
      setDealerships(dealerships.map(d => 
        d.id === editingDealership.id 
          ? { ...d, ...formData }
          : d
      ));
      toast({
        title: "Dealership Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      const referralCode = formData.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 3) +
        "-" +
        Math.random().toString(36).substring(2, 6).toUpperCase();
      const dealership: Dealership = {
        id: String(dealerships.length + 1),
        ...formData,
        referralCode,
        createdAt: new Date().toISOString().split("T")[0],
        status: "active",
      };
      setDealerships([...dealerships, dealership]);
      toast({
        title: "Dealership Created",
        description: `${dealership.name} has been added successfully.`,
      });
    }

    setFormData(emptyDealership);
    setEditingDealership(null);
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (dealershipToDelete) {
      setDealerships(dealerships.filter(d => d.id !== dealershipToDelete.id));
      toast({
        title: "Dealership Deleted",
        description: `${dealershipToDelete.name} has been removed.`,
      });
      setDealershipToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (dealership: Dealership) => {
    setDealershipToDelete(dealership);
    setIsDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout title="Dealerships" subtitle="Manage your dealership network">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button className="gap-2" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" />
            Add Dealership
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search dealerships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
             <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Referral Link</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDealerships.map((dealership) => (
                <TableRow key={dealership.id} className="group">
                  <TableCell className="font-medium">{dealership.name}</TableCell>
                  <TableCell>
                    {dealership.city}, {dealership.state} {dealership.zipCode}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[180px]">
                        {`${window.location.origin}/r/${dealership.referralCode}`}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(
                            `${window.location.origin}/r/${dealership.referralCode}`
                          );
                          toast({
                            title: "Link Copied",
                            description: "Referral link copied to clipboard.",
                          });
                        }}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{dealership.username}</TableCell>
                  <TableCell>{dealership.createdAt}</TableCell>
                  <TableCell>
                    <Badge
                      variant={dealership.status === "active" ? "default" : "secondary"}
                    >
                      {dealership.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="gap-2"
                          onClick={() => handleViewDealership(dealership)}
                        >
                          <Eye className="h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2"
                          onClick={() => handleOpenEdit(dealership)}
                        >
                          <Edit className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 text-destructive"
                          onClick={() => openDeleteDialog(dealership)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {editingDealership ? "Edit Dealership" : "Create New Dealership"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Dealership Name *</Label>
              <Input
                id="name"
                placeholder="Enter dealership name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="CA"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="90001"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                placeholder="dealer_username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={handleUseCurrentLocation}
            >
              <MapPin className="h-4 w-4" />
              Use Current Location
            </Button>
            <Button className="w-full" onClick={handleSave}>
              {editingDealership ? "Update Dealership" : "Create Dealership"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dealership</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{dealershipToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Dealerships;
