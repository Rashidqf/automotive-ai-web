import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MessageSquare,
  Clock,
  Star,
  ChevronRight,
  Calendar,
  AlertCircle
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "new" | "contacted" | "qualified" | "negotiation" | "won" | "lost";
  source: string;
  interestedIn: string;
  lastContact: string;
  nextFollowUp: string;
  notes: string;
  priority: "high" | "medium" | "low";
}

const mockLeads: Lead[] = [
  { id: "1", name: "John Smith", email: "john.smith@email.com", phone: "(555) 123-4567", status: "negotiation", source: "Website", interestedIn: "2024 Toyota Camry", lastContact: "2 hours ago", nextFollowUp: "Today, 3:00 PM", notes: "Ready to close, needs financing approval", priority: "high" },
  { id: "2", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "(555) 234-5678", status: "qualified", source: "Referral", interestedIn: "2024 Honda CR-V", lastContact: "Yesterday", nextFollowUp: "Tomorrow, 10:00 AM", notes: "Comparing with RAV4, follow up on pricing", priority: "high" },
  { id: "3", name: "Mike Wilson", email: "mike.w@email.com", phone: "(555) 345-6789", status: "contacted", source: "Walk-in", interestedIn: "2024 Ford F-150", lastContact: "2 days ago", nextFollowUp: "Jan 30, 2:00 PM", notes: "Interested in trade-in options", priority: "medium" },
  { id: "4", name: "Emily Brown", email: "emily.b@email.com", phone: "(555) 456-7890", status: "new", source: "Phone Call", interestedIn: "Any SUV", lastContact: "Just now", nextFollowUp: "Today, 5:00 PM", notes: "New inquiry, call back scheduled", priority: "medium" },
  { id: "5", name: "David Lee", email: "david.l@email.com", phone: "(555) 567-8901", status: "qualified", source: "Social Media", interestedIn: "Tesla Model 3", lastContact: "3 days ago", nextFollowUp: "Jan 31, 11:00 AM", notes: "Waiting on test drive availability", priority: "low" },
];

const statusConfig = {
  new: { label: "New", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  contacted: { label: "Contacted", color: "bg-purple-500/10 text-purple-600 border-purple-200" },
  qualified: { label: "Qualified", color: "bg-yellow-500/10 text-yellow-600 border-yellow-200" },
  negotiation: { label: "Negotiation", color: "bg-orange-500/10 text-orange-600 border-orange-200" },
  won: { label: "Won", color: "bg-green-500/10 text-green-600 border-green-200" },
  lost: { label: "Lost", color: "bg-gray-500/10 text-gray-600 border-gray-200" },
};

const priorityConfig = {
  high: { color: "text-red-500", icon: AlertCircle },
  medium: { color: "text-yellow-500", icon: Clock },
  low: { color: "text-green-500", icon: Clock },
};

export function CRMTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredLeads = mockLeads.filter((lead) =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.interestedIn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: mockLeads.length,
    new: mockLeads.filter((l) => l.status === "new").length,
    hot: mockLeads.filter((l) => l.priority === "high").length,
    followUps: mockLeads.filter((l) => l.nextFollowUp.includes("Today")).length,
  };

  const handleOpenDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Star className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.new}</p>
                <p className="text-xs text-muted-foreground">New Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.hot}</p>
                <p className="text-xs text-muted-foreground">Hot Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Calendar className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.followUps}</p>
                <p className="text-xs text-muted-foreground">Follow-ups Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Cards */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lead Pipeline
            </CardTitle>
            <div className="flex gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Lead
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map((lead) => {
              const PriorityIcon = priorityConfig[lead.priority].icon;
              return (
                <Card 
                  key={lead.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleOpenDetail(lead)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {lead.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.source}</p>
                        </div>
                      </div>
                      <PriorityIcon className={`h-4 w-4 ${priorityConfig[lead.priority].color}`} />
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{lead.interestedIn}</p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={statusConfig[lead.status].color}>
                        {statusConfig[lead.status].label}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {lead.lastContact}
                      </div>
                    </div>
                    
                    {lead.nextFollowUp.includes("Today") && (
                      <div className="mt-3 p-2 rounded-md bg-orange-500/10 text-orange-600 text-xs flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Follow-up: {lead.nextFollowUp}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lead Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {selectedLead.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{selectedLead.name}</p>
                  <Badge variant="outline" className={statusConfig[selectedLead.status].color}>
                    {statusConfig[selectedLead.status].label}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedLead.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedLead.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedLead.interestedIn}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{selectedLead.notes}</p>
              </div>

              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-200">
                <p className="text-xs text-orange-600 mb-1">Next Follow-up</p>
                <p className="text-sm font-medium text-orange-700">{selectedLead.nextFollowUp}</p>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2">
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Note
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Car(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}
