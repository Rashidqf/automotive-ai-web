import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Search,
} from "lucide-react";
import { mockEmployees, Employee } from "@/data/mockData";

const accessOptions = [
  { id: "dashboard", label: "Dashboard" },
  { id: "inventory", label: "Inventory" },
  { id: "sales", label: "Sales" },
  { id: "crm", label: "CRM" },
  { id: "service", label: "Service" },
  { id: "finance", label: "Finance" },
  { id: "reports", label: "Reports" },
  { id: "notifications", label: "Notifications" },
  { id: "settings", label: "Settings" },
];

const emptyEmployee = {
  name: "",
  designation: "",
  joiningDate: "",
};

interface EmployeesTabProps {
  dealershipId: string;
}

export function EmployeesTab({ dealershipId }: EmployeesTabProps) {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");

  // Employee Dialog States
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState(emptyEmployee);

  // Access Dialog States
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  const [managingEmployee, setManagingEmployee] = useState<Employee | null>(null);
  const [selectedAccess, setSelectedAccess] = useState<string[]>([]);

  // Delete Dialog States
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreateEmployee = () => {
    setEditingEmployee(null);
    setFormData(emptyEmployee);
    setIsEmployeeDialogOpen(true);
  };

  const handleOpenEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      designation: employee.designation,
      joiningDate: employee.joiningDate,
    });
    setIsEmployeeDialogOpen(true);
  };

  const handleSaveEmployee = () => {
    if (!formData.name || !formData.designation) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingEmployee) {
      setEmployees(
        employees.map((e) =>
          e.id === editingEmployee.id ? { ...e, ...formData } : e
        )
      );
      toast({
        title: "Employee Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      const newEmployee: Employee = {
        id: String(employees.length + 1),
        ...formData,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        access: [],
      };
      setEmployees([...employees, newEmployee]);
      toast({
        title: "Employee Added",
        description: `${formData.name} has been added successfully.`,
      });
    }

    setFormData(emptyEmployee);
    setEditingEmployee(null);
    setIsEmployeeDialogOpen(false);
  };

  const handleOpenAccessDialog = (employee: Employee) => {
    setManagingEmployee(employee);
    setSelectedAccess(employee.access || []);
    setIsAccessDialogOpen(true);
  };

  const handleAccessChange = (accessId: string, checked: boolean) => {
    setSelectedAccess((prev) =>
      checked ? [...prev, accessId] : prev.filter((a) => a !== accessId)
    );
  };

  const handleSaveAccess = () => {
    if (managingEmployee) {
      setEmployees(
        employees.map((e) =>
          e.id === managingEmployee.id ? { ...e, access: selectedAccess } : e
        )
      );
      toast({
        title: "Access Updated",
        description: `Permissions for ${managingEmployee.name} have been updated.`,
      });
    }
    setIsAccessDialogOpen(false);
    setManagingEmployee(null);
  };

  const openDeleteDialog = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteEmployee = () => {
    if (employeeToDelete) {
      setEmployees(employees.filter((e) => e.id !== employeeToDelete.id));
      toast({
        title: "Employee Removed",
        description: `${employeeToDelete.name} has been removed.`,
      });
      setEmployeeToDelete(null);
      setIsDeleteDialogOpen(false);
    }
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
                <p className="text-2xl font-bold">{employees.length}</p>
                <p className="text-xs text-muted-foreground">Total Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {employees.filter((e) => e.status === "active").length}
                </p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Table */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">Team Members</h2>
          <div className="flex gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button className="gap-2" onClick={handleOpenCreateEmployee}>
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Access</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>{employee.joiningDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={employee.status === "active" ? "default" : "secondary"}
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {employee.access?.length || 0} permissions
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
                          onClick={() => handleOpenEditEmployee(employee)}
                        >
                          <Edit className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => handleOpenAccessDialog(employee)}
                        >
                          <Shield className="h-4 w-4" /> Manage Access
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-destructive"
                          onClick={() => openDeleteDialog(employee)}
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

      {/* Add/Edit Employee Dialog */}
      <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter employee name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation *</Label>
              <Input
                id="designation"
                placeholder="e.g. Sales Manager"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joiningDate">Joining Date</Label>
              <Input
                id="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={(e) =>
                  setFormData({ ...formData, joiningDate: e.target.value })
                }
              />
            </div>
            <Button className="w-full" onClick={handleSaveEmployee}>
              {editingEmployee ? "Update Employee" : "Add Employee"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Access Dialog */}
      <Dialog open={isAccessDialogOpen} onOpenChange={setIsAccessDialogOpen}>
        <DialogContent className="max-w-xs p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              {managingEmployee?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Select permissions:</p>
            <div className="grid grid-cols-2 gap-2">
              {accessOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`access-${option.id}`}
                    checked={selectedAccess.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleAccessChange(option.id, checked as boolean)
                    }
                    className="h-5 w-5 rounded-none border-2"
                  />
                  <Label
                    htmlFor={`access-${option.id}`}
                    className="text-xs font-medium cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            <Button className="w-full h-8 text-sm" onClick={handleSaveAccess}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{employeeToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmployee}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
