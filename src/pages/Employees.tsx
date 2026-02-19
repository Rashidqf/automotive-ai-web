import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, UserCog, Edit, Trash2, MoreVertical, Shield } from "lucide-react";
import { mockEmployees, Employee } from "@/data/mockData";

const emptyEmployee = {
  name: "",
  designation: "",
  joiningDate: "",
};

const accessOptions = [
  { id: "dashboard", label: "Dashboard" },
  { id: "vehicles", label: "Vehicles" },
  { id: "services", label: "Services" },
  { id: "customers", label: "Customers" },
  { id: "reports", label: "Reports" },
  { id: "offers", label: "Offers" },
  { id: "analytics", label: "Analytics" },
  { id: "notifications", label: "Notifications" },
  { id: "inventory", label: "Inventory" },
  { id: "billing", label: "Billing" },
  { id: "scheduling", label: "Scheduling" },
  { id: "settings", label: "Settings" },
];

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [managingEmployee, setManagingEmployee] = useState<Employee | null>(null);
  const [selectedAccess, setSelectedAccess] = useState<string[]>([]);
  const [formData, setFormData] = useState(emptyEmployee);
  const { toast } = useToast();

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    setFormData(emptyEmployee);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      designation: employee.designation,
      joiningDate: employee.joiningDate,
    });
    setIsDialogOpen(true);
  };

  const handleOpenAccessDialog = (employee: Employee) => {
    setManagingEmployee(employee);
    setSelectedAccess(employee.access || []);
    setIsAccessDialogOpen(true);
  };

  const handleAccessChange = (accessId: string, checked: boolean) => {
    if (checked) {
      setSelectedAccess([...selectedAccess, accessId]);
    } else {
      setSelectedAccess(selectedAccess.filter((id) => id !== accessId));
    }
  };

  const handleSaveAccess = () => {
    if (managingEmployee) {
      setEmployees(employees.map(e =>
        e.id === managingEmployee.id
          ? { ...e, access: selectedAccess }
          : e
      ));
      toast({
        title: "Access Updated",
        description: `${managingEmployee.name}'s access permissions have been updated.`,
      });
      setIsAccessDialogOpen(false);
      setManagingEmployee(null);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.designation || !formData.joiningDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingEmployee) {
      setEmployees(employees.map(e =>
        e.id === editingEmployee.id
          ? { ...e, ...formData }
          : e
      ));
      toast({
        title: "Employee Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      const employee: Employee = {
        id: String(employees.length + 1),
        name: formData.name,
        designation: formData.designation,
        joiningDate: formData.joiningDate,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        access: [],
      };
      setEmployees([...employees, employee]);
      toast({
        title: "Employee Added",
        description: `${employee.name} has been added successfully.`,
      });
    }

    setFormData(emptyEmployee);
    setEditingEmployee(null);
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (employeeToDelete) {
      setEmployees(employees.filter(e => e.id !== employeeToDelete.id));
      toast({
        title: "Employee Deleted",
        description: `${employeeToDelete.name} has been removed.`,
      });
      setEmployeeToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout title="Employees" subtitle="Manage your team members">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button className="gap-2" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
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
                <TableHead>Designation</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="group">
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>{employee.joiningDate}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {employee.access?.length > 0 ? (
                        <Badge variant="outline" className="text-xs">
                          {employee.access.length} permissions
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          No access
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={employee.status === "active" ? "default" : "secondary"}
                    >
                      {employee.status}
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
                          onClick={() => handleOpenAccessDialog(employee)}
                        >
                          <Shield className="h-4 w-4" /> Manage Access
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => handleOpenEdit(employee)}
                        >
                          <Edit className="h-4 w-4" /> Edit
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
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
                placeholder="e.g., Service Manager"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joiningDate">Joining Date *</Label>
              <Input
                id="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              />
            </div>
            <Button className="w-full" onClick={handleSave}>
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
            <p className="text-xs text-muted-foreground">
              Select permissions:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {accessOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={selectedAccess.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleAccessChange(option.id, checked as boolean)
                    }
                    className="h-5 w-5 rounded-none border-2"
                  />
                  <Label
                    htmlFor={option.id}
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
              Are you sure you want to delete "{employeeToDelete?.name}"? This action cannot be undone.
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

export default Employees;
