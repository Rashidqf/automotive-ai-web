import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminCreateUserBody } from "@/lib/api";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (body: AdminCreateUserBody) => Promise<void>;
  onSuccess: () => void;
  isSubmitting: boolean;
}

export function AddUserDialog({
  open,
  onOpenChange,
  onSubmit,
  onSuccess,
  isSubmitting,
}: AddUserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const full_name = name.trim();
    const emailTrim = email.trim();
    if (!full_name || !emailTrim || !password) return;
    if (password.length < 6) return;
    try {
      await onSubmit({
        full_name,
        email: emailTrim,
        password,
        userType: "user",
      });
      setName("");
      setEmail("");
      setPassword("");
      onSuccess();
      onOpenChange(false);
    } catch (_) {
      // Error toast handled by caller or mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md  overflow-y-auto h-[calc(95vh)]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          New users created by admin are auto-verified (no OTP required).
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="add-name">Full name</Label>
            <Input
              id="add-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-email">Email</Label>
            <Input
              id="add-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-password">Password</Label>
            <Input
              id="add-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              minLength={6}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gradient-primary text-primary-foreground">
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
