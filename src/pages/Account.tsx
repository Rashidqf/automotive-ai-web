import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Shield, Bell, Palette, Save, Camera, Lock, Mail, Phone } from "lucide-react";

const Account = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@appauto.ai",
    phone: "+1 (555) 123-4567",
    role: "Super Admin",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    serviceReminders: true,
    offerUpdates: false,
    weeklyReports: true,
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [appearance, setAppearance] = useState({
    darkMode: true,
    compactView: false,
    showAnimations: true,
  });

  const handleProfileSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handlePasswordChange = () => {
    if (security.newPassword !== security.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    if (security.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleNotificationsSave = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleAppearanceSave = () => {
    toast({
      title: "Appearance Updated",
      description: "Your appearance settings have been saved.",
    });
  };

  return (
    <DashboardLayout
      title="My Account"
      subtitle="Manage your account settings and preferences"
    >
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="rounded-xl bg-card p-6 shadow-card max-w-2xl">
            <h3 className="text-lg font-semibold text-foreground mb-6">Profile Information</h3>
            
            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full gradient-primary text-2xl font-semibold text-primary-foreground">
                  {profile.name.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-secondary border border-border hover:bg-secondary/80">
                  <Camera className="h-4 w-4 text-foreground" />
                </button>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{profile.name}</h4>
                <p className="text-sm text-muted-foreground">{profile.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={profile.role}
                    disabled
                    className="bg-secondary/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
              <Button className="gap-2" onClick={handleProfileSave}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="rounded-xl bg-card p-6 shadow-card max-w-2xl">
            <h3 className="text-lg font-semibold text-foreground mb-6">Change Password</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={security.newPassword}
                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
              <Button className="gap-2" onClick={handlePasswordChange}>
                <Shield className="h-4 w-4" />
                Update Password
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                <div>
                  <p className="font-medium text-foreground">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="rounded-xl bg-card p-6 shadow-card max-w-2xl">
            <h3 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                <div>
                  <p className="font-medium text-foreground">Email Alerts</p>
                  <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                </div>
                <Switch 
                  checked={notifications.emailAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Get instant notifications in your browser</p>
                </div>
                <Switch 
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                <div>
                  <p className="font-medium text-foreground">Service Reminders</p>
                  <p className="text-sm text-muted-foreground">Alerts for upcoming vehicle services</p>
                </div>
                <Switch 
                  checked={notifications.serviceReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, serviceReminders: checked })}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                <div>
                  <p className="font-medium text-foreground">Offer Updates</p>
                  <p className="text-sm text-muted-foreground">Notifications about new offers and promotions</p>
                </div>
                <Switch 
                  checked={notifications.offerUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, offerUpdates: checked })}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                <div>
                  <p className="font-medium text-foreground">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                </div>
                <Switch 
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                />
              </div>
              <Button className="gap-2" onClick={handleNotificationsSave}>
                <Save className="h-4 w-4" />
                Save Preferences
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <div className="rounded-xl bg-card p-6 shadow-card max-w-2xl">
            <h3 className="text-lg font-semibold text-foreground mb-6">Appearance Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
                </div>
                <Switch 
                  checked={appearance.darkMode}
                  onCheckedChange={(checked) => setAppearance({ ...appearance, darkMode: checked })}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                <div>
                  <p className="font-medium text-foreground">Compact View</p>
                  <p className="text-sm text-muted-foreground">Show more content with less spacing</p>
                </div>
                <Switch 
                  checked={appearance.compactView}
                  onCheckedChange={(checked) => setAppearance({ ...appearance, compactView: checked })}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                <div>
                  <p className="font-medium text-foreground">Animations</p>
                  <p className="text-sm text-muted-foreground">Enable UI animations and transitions</p>
                </div>
                <Switch 
                  checked={appearance.showAnimations}
                  onCheckedChange={(checked) => setAppearance({ ...appearance, showAnimations: checked })}
                />
              </div>
              <Button className="gap-2" onClick={handleAppearanceSave}>
                <Save className="h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Account;
