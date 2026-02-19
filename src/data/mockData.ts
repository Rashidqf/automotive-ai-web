// Mock data for the admin dashboard

export interface UserVehicle {
  id: string;
  vehicleNumber: string;
  vehicleType: string;
  lastOilChange: string;
  serviceStation: string;
  isPreferredStation: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicles: UserVehicle[];
  status: "active" | "inactive";
  createdAt: string;
}

// Legacy single-vehicle accessors for backward compatibility
export function getPrimaryVehicle(user: User): UserVehicle | undefined {
  return user.vehicles[0];
}

export interface VehicleRecord {
  id: string;
  vehicleNumber: string;
  vehicleType: string;
  ownerName: string;
  lastServiceDate: string;
  serviceType: string;
  serviceCenter: string;
  isPreferred: boolean;
  nextServiceDue: string;
  totalServices: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  vehicleNumber: string;
  action: string;
  serviceCenter: string;
  isPreferredCenter: boolean;
  timestamp: string;
  details: string;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  discountPercent: number;
  targetAudience: "all" | "non-preferred" | "inactive" | "specific";
  status: "active" | "scheduled" | "expired";
  startDate: string;
  endDate: string;
  redemptions: number;
  totalAssigned: number;
}

export interface Dealership {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  username: string;
  referralCode: string;
  createdAt: string;
  status: "active" | "inactive";
}

export interface Employee {
  id: string;
  name: string;
  designation: string;
  joiningDate: string;
  status: "active" | "inactive";
  createdAt: string;
  access: string[];
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    vehicles: [
      { id: "v1-1", vehicleNumber: "CA-1234-ABC", vehicleType: "Sedan", lastOilChange: "2024-01-15 10:30 AM", serviceStation: "AutoCare Plus", isPreferredStation: true },
      { id: "v1-2", vehicleNumber: "CA-9999-XYZ", vehicleType: "SUV", lastOilChange: "2023-11-20 09:00 AM", serviceStation: "Premium Motors", isPreferredStation: true },
    ],
    status: "active",
    createdAt: "2023-06-15",
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@email.com",
    phone: "+1 (555) 234-5678",
    vehicles: [
      { id: "v2-1", vehicleNumber: "TX-5678-DEF", vehicleType: "SUV", lastOilChange: "2024-01-10 02:15 PM", serviceStation: "Quick Lube Center", isPreferredStation: false },
    ],
    status: "active",
    createdAt: "2023-08-22",
  },
  {
    id: "3",
    name: "Michael Davis",
    email: "michael.davis@email.com",
    phone: "+1 (555) 345-6789",
    vehicles: [
      { id: "v3-1", vehicleNumber: "NY-9012-GHI", vehicleType: "Hatchback", lastOilChange: "2024-01-08 11:00 AM", serviceStation: "Premium Motors", isPreferredStation: true },
      { id: "v3-2", vehicleNumber: "NY-5555-QRS", vehicleType: "Sedan", lastOilChange: "2023-09-05 01:30 PM", serviceStation: "City Auto Workshop", isPreferredStation: false },
      { id: "v3-3", vehicleNumber: "NY-7777-TUV", vehicleType: "SUV", lastOilChange: "2024-01-20 04:00 PM", serviceStation: "AutoCare Plus", isPreferredStation: true },
    ],
    status: "active",
    createdAt: "2023-04-10",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@email.com",
    phone: "+1 (555) 456-7890",
    vehicles: [
      { id: "v4-1", vehicleNumber: "FL-3456-JKL", vehicleType: "Sedan", lastOilChange: "2023-12-20 09:45 AM", serviceStation: "City Auto Workshop", isPreferredStation: false },
    ],
    status: "inactive",
    createdAt: "2023-09-05",
  },
  {
    id: "5",
    name: "Robert Brown",
    email: "robert.brown@email.com",
    phone: "+1 (555) 567-8901",
    vehicles: [
      { id: "v5-1", vehicleNumber: "WA-7890-MNO", vehicleType: "SUV", lastOilChange: "2024-01-18 03:30 PM", serviceStation: "AutoCare Plus", isPreferredStation: true },
      { id: "v5-2", vehicleNumber: "WA-4321-LMN", vehicleType: "Hatchback", lastOilChange: "2023-10-10 10:00 AM", serviceStation: "Speed Service", isPreferredStation: false },
    ],
    status: "active",
    createdAt: "2023-07-28",
  },
  {
    id: "6",
    name: "Jessica Miller",
    email: "jessica.miller@email.com",
    phone: "+1 (555) 678-9012",
    vehicles: [
      { id: "v6-1", vehicleNumber: "IL-2345-PQR", vehicleType: "Hatchback", lastOilChange: "2024-01-05 12:00 PM", serviceStation: "Speed Service", isPreferredStation: false },
    ],
    status: "active",
    createdAt: "2023-11-12",
  },
];

export const mockVehicleRecords: VehicleRecord[] = [
  {
    id: "1",
    vehicleNumber: "CA-1234-ABC",
    vehicleType: "Sedan",
    ownerName: "John Smith",
    lastServiceDate: "2024-01-15",
    serviceType: "Oil Change",
    serviceCenter: "AutoCare Plus",
    isPreferred: true,
    nextServiceDue: "2024-04-15",
    totalServices: 8,
  },
  {
    id: "2",
    vehicleNumber: "TX-5678-DEF",
    vehicleType: "SUV",
    ownerName: "Emily Johnson",
    lastServiceDate: "2024-01-10",
    serviceType: "Full Service",
    serviceCenter: "Quick Lube Center",
    isPreferred: false,
    nextServiceDue: "2024-04-10",
    totalServices: 5,
  },
  {
    id: "3",
    vehicleNumber: "NY-9012-GHI",
    vehicleType: "Hatchback",
    ownerName: "Michael Davis",
    lastServiceDate: "2024-01-08",
    serviceType: "Oil Change",
    serviceCenter: "Premium Motors",
    isPreferred: true,
    nextServiceDue: "2024-04-08",
    totalServices: 12,
  },
  {
    id: "4",
    vehicleNumber: "FL-3456-JKL",
    vehicleType: "Sedan",
    ownerName: "Sarah Williams",
    lastServiceDate: "2023-12-20",
    serviceType: "Oil Change",
    serviceCenter: "City Auto Workshop",
    isPreferred: false,
    nextServiceDue: "2024-03-20",
    totalServices: 6,
  },
  {
    id: "5",
    vehicleNumber: "WA-7890-MNO",
    vehicleType: "SUV",
    ownerName: "Robert Brown",
    lastServiceDate: "2024-01-18",
    serviceType: "Oil Change",
    serviceCenter: "AutoCare Plus",
    isPreferred: true,
    nextServiceDue: "2024-04-18",
    totalServices: 4,
  },
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    userId: "1",
    userName: "John Smith",
    vehicleNumber: "CA-1234-ABC",
    action: "Completed Oil Change",
    serviceCenter: "AutoCare Plus",
    isPreferredCenter: true,
    timestamp: "2024-01-15 10:30 AM",
    details: "User visited recommended service center",
  },
  {
    id: "2",
    userId: "2",
    userName: "Emily Johnson",
    vehicleNumber: "TX-5678-DEF",
    action: "Booked Service",
    serviceCenter: "Quick Lube Center",
    isPreferredCenter: false,
    timestamp: "2024-01-10 02:15 PM",
    details: "User selected alternative service center",
  },
  {
    id: "3",
    userId: "3",
    userName: "Michael Davis",
    vehicleNumber: "NY-9012-GHI",
    action: "Completed Oil Change",
    serviceCenter: "Premium Motors",
    isPreferredCenter: true,
    timestamp: "2024-01-08 11:00 AM",
    details: "User visited recommended service center",
  },
  {
    id: "4",
    userId: "4",
    userName: "Sarah Williams",
    vehicleNumber: "FL-3456-JKL",
    action: "Cancelled Booking",
    serviceCenter: "City Auto Workshop",
    isPreferredCenter: false,
    timestamp: "2023-12-20 09:45 AM",
    details: "User cancelled service at non-preferred center",
  },
  {
    id: "5",
    userId: "5",
    userName: "Robert Brown",
    vehicleNumber: "WA-7890-MNO",
    action: "Completed Oil Change",
    serviceCenter: "AutoCare Plus",
    isPreferredCenter: true,
    timestamp: "2024-01-18 03:30 PM",
    details: "User visited recommended service center",
  },
  {
    id: "6",
    userId: "6",
    userName: "Jessica Miller",
    vehicleNumber: "IL-2345-PQR",
    action: "Redeemed Offer",
    serviceCenter: "Speed Service",
    isPreferredCenter: false,
    timestamp: "2024-01-05 12:00 PM",
    details: "User redeemed 15% discount offer",
  },
];

export const mockOffers: Offer[] = [
  {
    id: "1",
    name: "New Year Special",
    description: "15% off on all oil change services",
    discountPercent: 15,
    targetAudience: "all",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    redemptions: 245,
    totalAssigned: 500,
  },
  {
    id: "2",
    name: "Come Back Offer",
    description: "20% discount for users who haven't visited preferred centers",
    discountPercent: 20,
    targetAudience: "non-preferred",
    status: "active",
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    redemptions: 78,
    totalAssigned: 200,
  },
  {
    id: "3",
    name: "Loyalty Reward",
    description: "10% cashback on next service",
    discountPercent: 10,
    targetAudience: "all",
    status: "scheduled",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    redemptions: 0,
    totalAssigned: 1000,
  },
  {
    id: "4",
    name: "Winter Service Special",
    description: "25% off on winter car care package",
    discountPercent: 25,
    targetAudience: "inactive",
    status: "expired",
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    redemptions: 156,
    totalAssigned: 300,
  },
];

export const mockDealerships: Dealership[] = [
  {
    id: "1",
    name: "Downtown Motors",
    address: "123 Main Street",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    latitude: 34.0522,
    longitude: -118.2437,
    username: "downtown_admin",
    referralCode: "DTM-2023A",
    createdAt: "2023-06-15",
    status: "active",
  },
  {
    id: "2",
    name: "Sunset Auto Group",
    address: "456 Sunset Blvd",
    city: "Miami",
    state: "FL",
    zipCode: "33101",
    latitude: 25.7617,
    longitude: -80.1918,
    username: "sunset_admin",
    referralCode: "SAG-2023B",
    createdAt: "2023-08-22",
    status: "active",
  },
];

export const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "David Anderson",
    designation: "Service Manager",
    joiningDate: "2022-03-15",
    status: "active",
    createdAt: "2022-03-15",
    access: ["dashboard", "vehicles", "services", "customers", "reports", "offers"],
  },
  {
    id: "2",
    name: "Jennifer Taylor",
    designation: "Senior Technician",
    joiningDate: "2021-08-01",
    status: "active",
    createdAt: "2021-08-01",
    access: ["dashboard", "vehicles", "services"],
  },
  {
    id: "3",
    name: "Christopher Martinez",
    designation: "Sales Representative",
    joiningDate: "2023-01-10",
    status: "active",
    createdAt: "2023-01-10",
    access: ["dashboard", "customers", "offers"],
  },
];
