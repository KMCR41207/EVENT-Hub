import { DashboardLayout } from "../components/DashboardLayout";
import { Truck, TrendingUp, DollarSign, Users, X, Package, CheckCircle, MapPin, Calendar, Shield, Lock } from "lucide-react";
import { useState } from "react";

export function AdminFleetOwners() {
  const currentUserId = sessionStorage.getItem('currentUserId') || 'ADMIN001';
  const currentUserName = sessionStorage.getItem('currentUserName') || 'Admin';
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewingOwner, setViewingOwner] = useState<any>(null);

  const fleetOwners = [
    { 
      id: "FO001", 
      name: "Swift Logistics Inc", 
      trucks: 145, 
      drivers: 320, 
      revenue: "$2.45M", 
      status: "active",
      joinDate: "2024-01-15",
      location: "Los Angeles, CA",
      completedLoads: 3820,
      activeLoads: 45,
      rating: 4.8
    },
    { 
      id: "FO002", 
      name: "TransNational Freight", 
      trucks: 128, 
      drivers: 280, 
      revenue: "$2.18M", 
      status: "active",
      joinDate: "2024-01-20",
      location: "Chicago, IL",
      completedLoads: 3450,
      activeLoads: 38,
      rating: 4.7
    },
    { 
      id: "FO003", 
      name: "Premium Transport Co", 
      trucks: 98, 
      drivers: 210, 
      revenue: "$1.85M", 
      status: "active",
      joinDate: "2024-02-05",
      location: "Dallas, TX",
      completedLoads: 2890,
      activeLoads: 32,
      rating: 4.9
    },
    { 
      id: "FO004", 
      name: "Global Haul Systems", 
      trucks: 87, 
      drivers: 190, 
      revenue: "$1.62M", 
      status: "active",
      joinDate: "2024-02-12",
      location: "Atlanta, GA",
      completedLoads: 2560,
      activeLoads: 28,
      rating: 4.6
    },
  ];

  const handleViewDetails = (owner: any) => {
    setViewingOwner(owner);
    setIsProfileModalOpen(true);
  };

  return (
    <DashboardLayout role="admin" userName={currentUserName} userId={currentUserId}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Owners Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all fleet owner accounts</p>
        </div>

        {/* Fleet Owners Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fleetOwners.map((owner) => (
            <div key={owner.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{owner.name}</h3>
                  <p className="text-sm text-gray-600">{owner.id}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {owner.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700"><strong>{owner.trucks}</strong> Trucks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700"><strong>{owner.drivers}</strong> Drivers</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">Revenue: <strong>{owner.revenue}</strong></span>
                </div>
              </div>

              <button 
                onClick={() => handleViewDetails(owner)}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Fleet Owner Profile Modal */}
      {isProfileModalOpen && viewingOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Close Button */}
            <button 
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg">
                  <Truck className="w-12 h-12" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{viewingOwner.name}</h2>
                  <div className="flex items-center gap-4 text-blue-100">
                    <span className="font-semibold">{viewingOwner.id}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {viewingOwner.location}
                    </span>
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">
                      {viewingOwner.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="p-8 space-y-6 overflow-y-auto flex-1">
              {/* Key Metrics */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Fleet Overview</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <div className="text-sm text-blue-600 font-semibold">Trucks</div>
                    </div>
                    <div className="text-3xl font-bold text-blue-700">{viewingOwner.trucks}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-green-600" />
                      <div className="text-sm text-green-600 font-semibold">Drivers</div>
                    </div>
                    <div className="text-3xl font-bold text-green-700">{viewingOwner.drivers}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <div className="text-sm text-purple-600 font-semibold">Revenue</div>
                    </div>
                    <div className="text-3xl font-bold text-purple-700">{viewingOwner.revenue}</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      <div className="text-sm text-orange-600 font-semibold">Rating</div>
                    </div>
                    <div className="text-3xl font-bold text-orange-700">{viewingOwner.rating}</div>
                  </div>
                </div>
              </div>

              {/* Load Statistics */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Load Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Completed Loads</div>
                    <div className="text-2xl font-bold text-gray-900">{viewingOwner.completedLoads.toLocaleString()}</div>
                    <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      All time
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Active Loads</div>
                    <div className="text-2xl font-bold text-gray-900">{viewingOwner.activeLoads}</div>
                    <div className="text-xs text-blue-600 mt-1">Currently in transit</div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Account Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Fleet Owner ID</div>
                    <div className="font-semibold text-gray-900">{viewingOwner.id}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Join Date</div>
                    <div className="font-semibold text-gray-900">
                      {new Date(viewingOwner.joinDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Location</div>
                    <div className="font-semibold text-gray-900">{viewingOwner.location}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Account Status</div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      {viewingOwner.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">On-Time Delivery Rate</span>
                      <span className="text-sm font-bold text-green-600">96%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Fleet Utilization</span>
                      <span className="text-sm font-bold text-blue-600">88%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Customer Satisfaction</span>
                      <span className="text-sm font-bold text-purple-600">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
