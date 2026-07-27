import { DashboardLayout } from "../components/DashboardLayout";
import { 
  Package, 
  Plus, 
  Search,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Zap,
  Target
} from "lucide-react";

const loads = [
  { 
    id: "LD-8821", 
    origin: "Los Angeles, CA", 
    destination: "Phoenix, AZ",
    shipper: "TechCorp Inc",
    distance: "373 miles",
    pickup: "Today, 2:00 PM",
    delivery: "Tomorrow, 10:00 AM",
    rate: 1250,
    cargo: "Electronics",
    weight: "24,000 lbs",
    status: "in-transit",
    truck: "TRK-2401",
    driver: "John Martinez",
    progress: 65
  },
  { 
    id: "LD-8822", 
    origin: "Seattle, WA", 
    destination: "Portland, OR",
    shipper: "Northwest Distributors",
    distance: "173 miles",
    pickup: "Today, 8:00 AM",
    delivery: "Today, 2:00 PM",
    rate: 750,
    cargo: "Food Products",
    weight: "18,000 lbs",
    status: "in-transit",
    truck: "TRK-2398",
    driver: "Sarah Johnson",
    progress: 85
  },
  { 
    id: "LD-8823", 
    origin: "Dallas, TX", 
    destination: "Houston, TX",
    shipper: "Texas Supply Co",
    distance: "239 miles",
    pickup: "Today, 3:00 PM",
    delivery: "Tomorrow, 9:00 AM",
    rate: 890,
    cargo: "Building Materials",
    weight: "32,000 lbs",
    status: "loading",
    truck: "TRK-2405",
    driver: "Mike Chen",
    progress: 15
  },
  { 
    id: "LD-8824", 
    origin: "Miami, FL", 
    destination: "Atlanta, GA",
    shipper: "Southern Freight LLC",
    distance: "660 miles",
    pickup: "Yesterday, 6:00 AM",
    delivery: "Today, 6:00 PM",
    rate: 1580,
    cargo: "Consumer Goods",
    weight: "28,000 lbs",
    status: "delivered",
    truck: "TRK-2392",
    driver: "Emily Davis",
    progress: 100
  },
  { 
    id: "LD-8825", 
    origin: "Chicago, IL", 
    destination: "Detroit, MI",
    shipper: "Midwest Industries",
    distance: "282 miles",
    pickup: "Tomorrow, 7:00 AM",
    delivery: "Tomorrow, 2:00 PM",
    rate: 850,
    cargo: "Auto Parts",
    weight: "22,000 lbs",
    status: "pending",
    truck: null,
    driver: null,
    progress: 0
  },
  { 
    id: "LD-8826", 
    origin: "San Diego, CA", 
    destination: "Las Vegas, NV",
    shipper: "Desert Logistics",
    distance: "332 miles",
    pickup: "Tomorrow, 8:00 AM",
    delivery: "Tomorrow, 6:00 PM",
    rate: 980,
    cargo: "Furniture",
    weight: "18,500 lbs",
    status: "assigned",
    truck: "TRK-2411",
    driver: "Carlos Rivera",
    progress: 0
  },
];

export function LoadManagement() {
  const activeLoads = loads.filter(l => l.status === "in-transit" || l.status === "loading");
  const pendingLoads = loads.filter(l => l.status === "pending");
  const completedLoads = loads.filter(l => l.status === "delivered");

  return (
    <DashboardLayout role="fleet-owner" userName="James Anderson">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Load Management</h1>
            <p className="text-gray-600 mt-1">Track and manage all your loads</p>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-600/30">
            <Plus className="w-5 h-5" />
            Assign New Load
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            title="Active Loads"
            value={activeLoads.length.toString()}
            icon={<Package className="w-6 h-6" />}
            color="blue"
          />
          <StatCard 
            title="Pending Assignment"
            value={pendingLoads.length.toString()}
            icon={<Clock className="w-6 h-6" />}
            color="orange"
          />
          <StatCard 
            title="Completed Today"
            value={completedLoads.length.toString()}
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
          />
          <StatCard 
            title="Total Revenue"
            value={`$${loads.reduce((sum, l) => sum + l.rate, 0).toLocaleString()}`}
            icon={<DollarSign className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search loads by ID, shipper, or location..."
                className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
              <option>All Status</option>
              <option>In Transit</option>
              <option>Loading</option>
              <option>Pending</option>
              <option>Delivered</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Active Loads */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Active Loads</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              {activeLoads.length} Active
            </span>
          </div>

          <div className="space-y-4">
            {activeLoads.map((load) => (
              <div key={load.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">{load.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        load.status === "in-transit" ? "bg-blue-100 text-blue-700" :
                        load.status === "loading" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {load.status === "in-transit" ? "In Transit" : "Loading"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{load.origin} → {load.destination}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">${load.rate}</div>
                    <div className="text-xs text-gray-500">{load.distance}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Shipper</div>
                    <div className="text-sm font-semibold text-gray-900">{load.shipper}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Truck / Driver</div>
                    <div className="text-sm font-semibold text-blue-600">{load.truck}</div>
                    <div className="text-xs text-gray-600">{load.driver}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Cargo</div>
                    <div className="text-sm font-semibold text-gray-900">{load.cargo}</div>
                    <div className="text-xs text-gray-600">{load.weight}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Delivery ETA</div>
                    <div className="text-sm font-semibold text-gray-900">{load.delivery}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span>{load.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`rounded-full h-2 transition-all duration-300 ${
                        load.status === "in-transit" ? "bg-blue-500" : "bg-yellow-500"
                      }`}
                      style={{ width: `${load.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Loads */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Pending Assignment</h2>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
              {pendingLoads.length} Pending
            </span>
          </div>

          <div className="space-y-4">
            {pendingLoads.map((load) => (
              <div key={load.id} className="border-2 border-orange-200 rounded-lg p-5 hover:shadow-md transition bg-orange-50/30">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">{load.id}</span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                        Needs Assignment
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{load.origin} → {load.destination}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">${load.rate}</div>
                    <div className="text-xs text-gray-500">{load.distance}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Shipper</div>
                    <div className="text-sm font-semibold text-gray-900">{load.shipper}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Cargo</div>
                    <div className="text-sm font-semibold text-gray-900">{load.cargo}</div>
                    <div className="text-xs text-gray-600">{load.weight}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Pickup</div>
                    <div className="text-sm font-semibold text-gray-900">{load.pickup}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Delivery</div>
                    <div className="text-sm font-semibold text-gray-900">{load.delivery}</div>
                  </div>
                </div>

                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <Package className="w-5 h-5" />
                  Assign Truck & Driver
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Loads */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recently Completed</h2>
          <div className="space-y-3">
            {completedLoads.map((load) => (
              <div key={load.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{load.id}</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Delivered
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{load.origin} → {load.destination}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {load.truck} • {load.driver}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">${load.rate}</div>
                  <div className="text-xs text-gray-500">{load.shipper}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  }[color];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
}
