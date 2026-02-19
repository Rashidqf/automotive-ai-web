import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Wrench, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  User,
  Car
} from "lucide-react";

interface ServiceAppointment {
  id: string;
  time: string;
  customer: string;
  vehicle: string;
  service: string;
  assignedTo: string;
  status: "scheduled" | "in_progress" | "completed" | "waiting";
  estimatedDuration: string;
}

interface RepairJob {
  id: string;
  vehicle: string;
  customer: string;
  issue: string;
  status: "diagnosing" | "parts_ordered" | "in_repair" | "quality_check" | "ready";
  progress: number;
  assignedTo: string;
  startedAt: string;
}

const todayAppointments: ServiceAppointment[] = [
  { id: "1", time: "8:00 AM", customer: "John Smith", vehicle: "2022 Toyota Camry", service: "Oil Change", assignedTo: "Mike T.", status: "completed", estimatedDuration: "30 min" },
  { id: "2", time: "9:00 AM", customer: "Sarah Wilson", vehicle: "2021 Honda CR-V", service: "Brake Inspection", assignedTo: "David R.", status: "in_progress", estimatedDuration: "1 hour" },
  { id: "3", time: "10:30 AM", customer: "Robert Brown", vehicle: "2023 Ford F-150", service: "Tire Rotation", assignedTo: "Mike T.", status: "scheduled", estimatedDuration: "45 min" },
  { id: "4", time: "11:00 AM", customer: "Emily Davis", vehicle: "2020 BMW X3", service: "Full Service", assignedTo: "Sarah M.", status: "scheduled", estimatedDuration: "2 hours" },
  { id: "5", time: "1:00 PM", customer: "Michael Lee", vehicle: "2024 Tesla Model 3", service: "Inspection", assignedTo: "David R.", status: "scheduled", estimatedDuration: "1 hour" },
  { id: "6", time: "2:30 PM", customer: "Jennifer Garcia", vehicle: "2022 Chevrolet Tahoe", service: "AC Repair", assignedTo: "Sarah M.", status: "waiting", estimatedDuration: "1.5 hours" },
];

const repairJobs: RepairJob[] = [
  { id: "1", vehicle: "2019 Honda Accord", customer: "Tom Harris", issue: "Engine misfire - Spark plug replacement", status: "in_repair", progress: 75, assignedTo: "Mike T.", startedAt: "2 hours ago" },
  { id: "2", vehicle: "2021 Toyota RAV4", customer: "Lisa Anderson", issue: "Transmission fluid leak", status: "parts_ordered", progress: 30, assignedTo: "David R.", startedAt: "Yesterday" },
  { id: "3", vehicle: "2020 Ford Explorer", customer: "James Wilson", issue: "Suspension repair", status: "quality_check", progress: 90, assignedTo: "Sarah M.", startedAt: "3 hours ago" },
  { id: "4", vehicle: "2018 Chevrolet Malibu", customer: "Nancy Brown", issue: "Brake pad and rotor replacement", status: "ready", progress: 100, assignedTo: "Mike T.", startedAt: "4 hours ago" },
];

const serviceReminders = [
  { id: "1", customer: "John Smith", vehicle: "2022 Toyota Camry", service: "30,000 Mile Service", dueDate: "Feb 5, 2024" },
  { id: "2", customer: "Maria Garcia", vehicle: "2021 Honda Pilot", service: "Oil Change", dueDate: "Feb 8, 2024" },
  { id: "3", customer: "William Johnson", vehicle: "2020 Ford Escape", service: "Tire Rotation", dueDate: "Feb 10, 2024" },
];

const statusColors = {
  scheduled: "bg-blue-500/10 text-blue-600 border-blue-200",
  in_progress: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  completed: "bg-green-500/10 text-green-600 border-green-200",
  waiting: "bg-orange-500/10 text-orange-600 border-orange-200",
};

const repairStatusColors = {
  diagnosing: "bg-purple-500/10 text-purple-600",
  parts_ordered: "bg-orange-500/10 text-orange-600",
  in_repair: "bg-yellow-500/10 text-yellow-600",
  quality_check: "bg-blue-500/10 text-blue-600",
  ready: "bg-green-500/10 text-green-600",
};

export function ServiceTab() {
  const stats = {
    todayTotal: todayAppointments.length,
    completed: todayAppointments.filter((a) => a.status === "completed").length,
    inProgress: todayAppointments.filter((a) => a.status === "in_progress").length,
    pending: repairJobs.filter((j) => j.status !== "ready").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.todayTotal}</p>
                <p className="text-xs text-muted-foreground">Today's Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Wrench className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending Repairs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Today's Schedule
              </CardTitle>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Appointment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 p-3 rounded-lg border bg-muted/30">
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-bold text-primary">{apt.time}</p>
                    <p className="text-xs text-muted-foreground">{apt.estimatedDuration}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{apt.customer}</p>
                    <p className="text-xs text-muted-foreground truncate">{apt.vehicle}</p>
                    <p className="text-xs text-muted-foreground">{apt.service}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="outline" className={statusColors[apt.status]}>
                      {apt.status.replace("_", " ")}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{apt.assignedTo}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Repair Jobs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Active Repairs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {repairJobs.map((job) => (
                <div key={job.id} className="p-3 rounded-lg border bg-muted/30 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{job.vehicle}</p>
                      <p className="text-xs text-muted-foreground">{job.customer}</p>
                    </div>
                    <Badge variant="outline" className={repairStatusColors[job.status]}>
                      {job.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{job.issue}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-1.5" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {job.assignedTo}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Started {job.startedAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Reminders */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Upcoming Service Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {serviceReminders.map((reminder) => (
              <div key={reminder.id} className="p-4 rounded-lg border bg-orange-500/5 border-orange-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Car className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{reminder.customer}</p>
                    <p className="text-xs text-muted-foreground truncate">{reminder.vehicle}</p>
                    <p className="text-xs font-medium text-orange-600 mt-1">{reminder.service}</p>
                    <p className="text-xs text-muted-foreground mt-1">Due: {reminder.dueDate}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                  Send Reminder
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
