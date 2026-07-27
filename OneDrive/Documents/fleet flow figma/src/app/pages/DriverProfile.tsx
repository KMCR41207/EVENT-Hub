import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Truck, 
  Star, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Award,
  Heart
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";

export function DriverProfile() {
  const navigate = useNavigate();
  const { driverId } = useParams();

  // Mock driver data - In production, fetch from API
  const driverData = {
    id: "DR001",
    name: "Michael Rodriguez",
    email: "michael.rodriguez@email.com",
    phone: "+1 (555) 123-4567",
    location: "Los Angeles, CA",
    joinDate: "2024-01-15",
    licenseNumber: "DL123456789",
    licenseExpiry: "2026-03-20",
    status: "active",
    avatar: "M",
    
    // Performance Metrics
    totalTrips: 245,
    completionRate: 98.5,
    onTimeRate: 96.2,
    averageRating: 4.8,
    totalRatings: 189,
    
    // Financial Info
    totalEarnings: "$12,450.50",
    monthlyEarnings: "$2,150.75",
    pendingPayment: "$450.00",
    
    // Vehicle Info
    assignedTruck: "TR-2024-001",
    truckModel: "Volvo FH16",
    licensePlate: "ABC-1234",
    
    // Status
    currentStatus: "In Transit",
    lastActive: "2 minutes ago",
    
    // Documents
    documents: [
      { name: "Driver License", status: "verified", date: "2024-01-15" },
      { name: "Insurance Certificate", status: "verified", date: "2024-02-01" },
      { name: "Background Check", status: "verified", date: "2024-01-20" },
      { name: "Medical Certificate", status: "pending", date: "2024-03-15" }
    ]
  };

  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Driver Profile</h1>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {driverData.avatar}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{driverData.name}</h2>
                <p className="text-gray-600 text-lg">Driver ID: {driverData.id}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-semibold">{driverData.status.charAt(0).toUpperCase() + driverData.status.slice(1)}</span>
                  <span className="text-gray-500">• {driverData.lastActive}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-2xl font-bold text-gray-900">{driverData.averageRating}</span>
                <span className="text-gray-600">({driverData.totalRatings} ratings)</span>
              </div>
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                {driverData.currentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Contact & Personal Info */}
          <div className="col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900 font-semibold">{driverData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-gray-900 font-semibold">{driverData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-gray-900 font-semibold">{driverData.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-gray-900 font-semibold">{driverData.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* License Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">License Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">License Number</p>
                    <p className="text-gray-900 font-semibold">{driverData.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expiry Date</p>
                    <p className="text-gray-900 font-semibold">{driverData.licenseExpiry}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Vehicle */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Assigned Vehicle</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Truck ID</p>
                    <p className="text-gray-900 font-semibold">{driverData.assignedTruck}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Model</p>
                    <p className="text-gray-900 font-semibold">{driverData.truckModel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">License Plate</p>
                    <p className="text-gray-900 font-semibold">{driverData.licensePlate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Documents & Verification</h3>
              <div className="space-y-3">
                {driverData.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {doc.status === "verified" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.date}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      doc.status === "verified" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Performance & Financial */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Performance</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="font-bold text-gray-900">{driverData.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${driverData.completionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">On-Time Rate</span>
                    <span className="font-bold text-gray-900">{driverData.onTimeRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${driverData.onTimeRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Total Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{driverData.totalTrips}</p>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Financial Summary</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-blue-600">{driverData.totalEarnings}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-green-600">{driverData.monthlyEarnings}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600">Pending Payment</p>
                  <p className="text-2xl font-bold text-yellow-600">{driverData.pendingPayment}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                Send Message
              </button>
              <button className="w-full px-4 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition">
                View Trip History
              </button>
              <button className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition">
                Suspend Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
