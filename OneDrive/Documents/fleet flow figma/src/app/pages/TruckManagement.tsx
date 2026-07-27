import { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  User, 
  DollarSign,
  Calendar,
  Wrench,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Gauge
} from "lucide-react";

const trucks = [
  {
    id: "TRK-2401",
    plateNumber: "CA-7821-XY",
    make: "Freightliner",
    model: "Cascadia",
    year: 2022,
    driver: "John Martinez",
    status: "Active",
    location: "En route to Phoenix, AZ",
    currentLoad: "LD-8821",
    mileage: 42500,
    nextMaintenance: "2026-03-15",
    monthlyRevenue: 42500,
    fuelCost: 8200,
    maintenanceCost: 1500,
    profit: 12800
  },
  {
    id: "TRK-2398",
    plateNumber: "CA-7819-AB",
    make: "Kenworth",
    model: "T680",
    year: 2021,
    driver: "Sarah Johnson",
    status: "Active",
    location: "En route to Portland, OR",
    currentLoad: "LD-8822",
    mileage: 58200,
    nextMaintenance: "2026-03-20",
    monthlyRevenue: 39800,
    fuelCost: 7900,
    maintenanceCost: 1400,
    profit: 11500
  },
  {
    id: "TRK-2405",
    plateNumber: "TX-5512-CD",
    make: "Peterbilt",
    model: "579",
    year: 2023,
    driver: "Mike Chen",
    status: "Active",
    location: "Dallas Terminal",
    currentLoad: "LD-8823",
    mileage: 28100,
    nextMaintenance: "2026-04-10",
    monthlyRevenue: 38200,
    fuelCost: 7600,
    maintenanceCost: 1200,
    profit: 11200
  },
  {
    id: "TRK-2392",
    plateNumber: "FL-9234-EF",
    make: "Volvo",
    model: "VNL 860",
    year: 2022,
    driver: "Emily Davis",
    status: "Idle",
    location: "Miami Terminal",
    currentLoad: null,
    mileage: 51800,
    nextMaintenance: "2026-03-25",
    monthlyRevenue: 36900,
    fuelCost: 7400,
    maintenanceCost: 1600,
    profit: 10800
  },
  {
    id: "TRK-2411",
    plateNumber: "CA-8891-GH",
    make: "Freightliner",
    model: "Cascadia",
    year: 2023,
    driver: "Carlos Rivera",
    status: "Active",
    location: "En route to Denver, CO",
    currentLoad: "LD-8825",
    mileage: 19500,
    nextMaintenance: "2026-05-01",
    monthlyRevenue: 35600,
    fuelCost: 7100,
    maintenanceCost: 1100,
    profit: 10400
  },
  {
    id: "TRK-2387",
    plateNumber: "NY-4421-IJ",
    make: "Mack",
    model: "Anthem",
    year: 2020,
    driver: null,
    status: "Maintenance",
    location: "New York Service Center",
    currentLoad: null,
    mileage: 92300,
    nextMaintenance: "2026-03-05",
    monthlyRevenue: 0,
    fuelCost: 0,
    maintenanceCost: 3200,
    profit: -3200
  },
];

export function TruckManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTruck, setSelectedTruck] = useState<typeof trucks[0] | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const filteredTrucks = trucks.filter(truck => {
    const matchesSearch = truck.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         truck.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         truck.driver?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || truck.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout role="fleet-owner" userName="James Anderson">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Truck Management</h1>
            <p className="text-gray-600 mt-1">Manage your fleet of {trucks.length} trucks</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
            <Plus className="w-5 h-5" />
            Add New Truck
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">42</div>
                <div className="text-sm text-gray-600">Active Trucks</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-600">Idle Trucks</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">In Maintenance</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">$54k</div>
                <div className="text-sm text-gray-600">Avg Profit/Truck</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search by truck ID, plate, or driver..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  statusFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  statusFilter === "active"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter("idle")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  statusFilter === "idle"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Idle
              </button>
              <button
                onClick={() => setStatusFilter("maintenance")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  statusFilter === "maintenance"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Maintenance
              </button>
            </div>
          </div>
        </div>

        {/* Trucks List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTrucks.map((truck) => (
            <div 
              key={truck.id} 
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelectedTruck(truck)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold text-gray-900">{truck.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      truck.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : truck.status === "Idle"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {truck.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{truck.plateNumber}</div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">{truck.make} {truck.model}</span> ({truck.year})
                </div>
                {truck.driver && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{truck.driver}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{truck.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <div className="text-xs text-gray-500">Revenue</div>
                  <div className="text-sm font-semibold text-gray-900">
                    ${(truck.monthlyRevenue / 1000).toFixed(1)}k
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Mileage</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {(truck.mileage / 1000).toFixed(1)}k mi
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Profit</div>
                  <div className={`text-sm font-semibold ${
                    truck.profit > 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    ${(truck.profit / 1000).toFixed(1)}k
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Truck Details Modal */}
        {selectedTruck && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTruck(null)}
          >
            <div 
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedTruck.id}</h2>
                    <p className="text-gray-600">{selectedTruck.make} {selectedTruck.model} ({selectedTruck.year})</p>
                  </div>
                  <button 
                    onClick={() => setSelectedTruck(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Plate Number</div>
                    <div className="font-semibold text-gray-900">{selectedTruck.plateNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Status</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedTruck.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : selectedTruck.status === "Idle"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {selectedTruck.status}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Driver</div>
                    <div className="font-semibold text-gray-900">{selectedTruck.driver || "Unassigned"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Current Load</div>
                    <div className="font-semibold text-blue-600">{selectedTruck.currentLoad || "None"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Mileage</div>
                    <div className="font-semibold text-gray-900">{selectedTruck.mileage.toLocaleString()} mi</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Next Maintenance</div>
                    <div className="font-semibold text-gray-900">{selectedTruck.nextMaintenance}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Location</div>
                  <div className="font-semibold text-gray-900">{selectedTruck.location}</div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-bold text-gray-900 mb-4">Financial Performance (This Month)</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Revenue</span>
                      <span className="font-semibold text-gray-900">${selectedTruck.monthlyRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Fuel Cost</span>
                      <span className="font-semibold text-red-600">-${selectedTruck.fuelCost.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Maintenance Cost</span>
                      <span className="font-semibold text-red-600">-${selectedTruck.maintenanceCost.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="font-bold text-gray-900">Net Profit</span>
                      <span className={`font-bold text-lg ${
                        selectedTruck.profit > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        ${selectedTruck.profit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                    Edit Truck
                  </button>
                  <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold">
                    {showHistory ? "Hide History" : "View History"}
                  </button>
                </div>

                {/* History Section */}
                {showHistory && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip History</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">Load LD-8821</p>
                            <p className="text-sm text-gray-600">Los Angeles, CA → Phoenix, AZ</p>
                          </div>
                          <span className="text-sm font-semibold text-green-600">Completed</span>
                        </div>
                        <p className="text-sm text-gray-500">March 2, 2026 - Revenue: $4,200</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">Load LD-8815</p>
                            <p className="text-sm text-gray-600">San Francisco, CA → Las Vegas, NV</p>
                          </div>
                          <span className="text-sm font-semibold text-green-600">Completed</span>
                        </div>
                        <p className="text-sm text-gray-500">February 28, 2026 - Revenue: $3,800</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">Load LD-8809</p>
                            <p className="text-sm text-gray-600">Seattle, WA → Portland, OR</p>
                          </div>
                          <span className="text-sm font-semibold text-green-600">Completed</span>
                        </div>
                        <p className="text-sm text-gray-500">February 25, 2026 - Revenue: $2,100</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
