import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Plus,
  Gift,
  Calendar,
  Users,
  TrendingUp,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  Target,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockOffers } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusColors = {
  active: "badge-success",
  scheduled: "badge-primary",
  expired: "badge-destructive",
};

const audienceLabels = {
  all: "All Users",
  "non-preferred": "Non-Preferred Center Users",
  inactive: "Inactive Users",
  specific: "Specific Users",
};

const Offers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOffers = mockOffers.filter((offer) => {
    const matchesSearch =
      offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || offer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeOffers = mockOffers.filter((o) => o.status === "active").length;
  const totalRedemptions = mockOffers.reduce((sum, o) => sum + o.redemptions, 0);
  const avgConversion = Math.round(
    (mockOffers.reduce((sum, o) => sum + (o.redemptions / o.totalAssigned) * 100, 0) /
      mockOffers.length)
  );

  return (
    <DashboardLayout
      title="Offers & Engagement"
      subtitle="Create and manage promotional offers to boost user engagement"
    >
      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2">
              <Gift className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeOffers}</p>
              <p className="text-sm text-muted-foreground">Active Offers</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalRedemptions}</p>
              <p className="text-sm text-muted-foreground">Total Redemptions</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-2">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{avgConversion}%</p>
              <p className="text-sm text-muted-foreground">Avg. Conversion</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2">
              <Target className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">2,000</p>
              <p className="text-sm text-muted-foreground">Users Targeted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search offers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        <Button className="gap-2 gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4" />
          Create Offer
        </Button>
      </div>

      {/* Offers Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className="rounded-xl bg-card p-6 shadow-card transition-all hover:shadow-elevated"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-accent">
                  <Gift className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{offer.name}</h3>
                  <span className={cn("badge", statusColors[offer.status])}>
                    {offer.status}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2">
                    <Edit className="h-4 w-4" /> Edit Offer
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Send className="h-4 w-4" /> Send to Users
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">{offer.description}</p>

            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-bold text-accent">{offer.discountPercent}% OFF</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Target Audience</span>
                <span className="font-medium text-foreground">
                  {audienceLabels[offer.targetAudience]}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <div className="flex items-center gap-1 text-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{offer.startDate} - {offer.endDate}</span>
                </div>
              </div>
            </div>

            {/* Redemption Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Redemption Rate</span>
                <span className="font-medium text-foreground">
                  {offer.redemptions} / {offer.totalAssigned}
                </span>
              </div>
              <Progress
                value={(offer.redemptions / offer.totalAssigned) * 100}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground text-right">
                {Math.round((offer.redemptions / offer.totalAssigned) * 100)}% redeemed
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1" size="sm">
                View Details
              </Button>
              {offer.status === "active" && (
                <Button className="flex-1 gradient-primary text-primary-foreground" size="sm">
                  Apply to Users
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Offers;
