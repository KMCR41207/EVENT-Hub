import { DashboardLayout } from "../components/DashboardLayout";
import { ChromaGrid } from "../components/ChromaGrid";
import { TradingChart } from "../components/TradingChart";
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertCircle,
  Navigation,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const assignedLoads = [
  { 
    id: "LD-8821", 
    origin: "Los Angeles, CA", 
    destination: "Phoenix, AZ", 
    distance: "373 miles",
    pickup: "Today, 2:00 PM",
    delivery: "Tomorrow, 10:00 AM",
    rate: 1250,
    cargo: "Electronics",
    weight: "24,000 lbs",
    status: "assigned",
    fleetOwner: "James Anderson",
    truck: "TRK-2401"
  },
  { 
    id: "LD-8819", 
    origin: "San Diego, CA", 
    destination: "Las Vegas, NV", 
    distance: "332 miles",
    pickup: "Tomorrow, 8:00 AM",
    delivery: "Tomorrow, 6:00 PM",
    rate: 980,
    cargo: "Furniture",
    weight: "18,500 lbs",
    status: "assigned",
    fleetOwner: "James Anderson",
    truck: "TRK-2398"
  },
];

const activeLoads = [
  { 
    id: "LD-8815", 
    origin: "Seattle, WA", 
    destination: "Portland, OR", 
    progress: 65,
    eta: "2 hours 15 minutes",
    rate: 750,
    status: "in-transit"
  },
];

const completedLoads = [
  { id: "LD-8812", origin: "Denver, CO", destination: "Salt Lake City, UT", date: "2 days ago", earnings: 1150 },
  { id: "LD-8809", origin: "Phoenix, AZ", destination: "Albuquerque, NM", date: "4 days ago", earnings: 890 },
  { id: "LD-8805", origin: "San Francisco, CA", destination: "Sacramento, CA", date: "6 days ago", earnings: 450 },
  { id: "LD-8801", origin: "Los Angeles, CA", destination: "San Diego, CA", date: "1 week ago", earnings: 380 },
];

export function DriverDashboard() {
  const currentDriverId = sessionStorage.getItem('currentUserId') || 'DR001';
  const currentDriverName = sessionStorage.getItem('currentUserName') || 'Michael Rodriguez';
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [loads, setLoads] = useState(assignedLoads);
  const [selectedLoad, setSelectedLoad] = useState<any>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Load driver's loads from localStorage on mount
  useEffect(() => {
    const loadsData = localStorage.getItem('posted_loads');
    if (loadsData) {
      const allLoads = JSON.parse(loadsData);
      // Filter loads assigned to this driver
      const driverLoads = allLoads.filter((load: any) => 
        load.driverId === currentDriverId || 
        (load.status === 'assigned' && load.truck === 'TRK-2401') // Temporary: match by truck
      );
      if (driverLoads.length > 0) {
        setLoads(driverLoads);
      }
    }
  }, [currentDriverId]);

  const handleStatusUpdate = (loadId: string, newStatus: string, additionalData?: any) => {
    // Check if trying to start a new load while one is already active
    if (newStatus === 'picking-up') {
      const hasActiveLoad = loads.some(l => 
        l.status === 'picking-up' || 
        l.status === 'loaded' || 
        l.status === 'in-transit'
      );
      
      if (hasActiveLoad) {
        alert('You already have an active load in progress. Please complete it before starting a new one.');
        return;
      }
    }

    // Update local state
    setLoads(prevLoads => 
      prevLoads.map(load => 
        load.id === loadId 
          ? { ...load, status: newStatus, ...additionalData }
          : load
      )
    );

    // Update in localStorage for fleet owner to see
    const loadsData = localStorage.getItem('posted_loads');
    if (loadsData) {
      const allLoads = JSON.parse(loadsData);
      const updatedLoads = allLoads.map((load: any) => 
        load.id === loadId 
          ? { 
              ...load, 
              status: newStatus,
              driverStatus: newStatus,
              lastUpdated: new Date().toISOString(),
              updatedBy: currentDriverName,
              ...additionalData
            }
          : load
      );
      localStorage.setItem('posted_loads', JSON.stringify(updatedLoads));
    }

    // Create status update notification for fleet owner
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push({
      id: `notif-${Date.now()}`,
      type: 'status_update',
      from: currentDriverName,
      fromId: currentDriverId,
      to: 'fleet-owner',
      loadId: loadId,
      status: newStatus,
      message: `Load ${loadId} status updated to ${newStatus}`,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));

    alert(`Load ${loadId} status updated to ${newStatus}`);
  };

  const openStatusModal = (load: any) => {
    setSelectedLoad(load);
    setIsStatusModalOpen(true);
  };

  // Check if driver has any active load
  const hasActiveLoad = loads.some(l => 
    l.status === 'picking-up' || 
    l.status === 'loaded' || 
    l.status === 'in-transit'
  );

  return (
    <DashboardLayout role="driver" userName="Michael Rodriguez">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your loads and track your earnings</p>
        </div>

        {/* Key Metrics */}
        <ChromaGrid radius={350} columns={4} damping={0.45} fadeOut={0.6}>
          <MetricCard 
            title="This Month's Earnings"
            value="$8,450"
            subtitle="12 loads completed"
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
            onClick={() => setSelectedMetric("earnings")}
          />
          <MetricCard 
            title="Active Load"
            value="1"
            subtitle="In transit to Portland"
            icon={<Package className="w-6 h-6" />}
            color="blue"
            onClick={() => setSelectedMetric("active")}
          />
          <MetricCard 
            title="Assigned Loads"
            value="2"
            subtitle="Ready for pickup"
            icon={<Package className="w-6 h-6" />}
            color="orange"
            onClick={() => setSelectedMetric("assigned")}
          />
          <MetricCard 
            title="On-Time Rate"
            value="98%"
            subtitle="Excellent performance"
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
            onClick={() => setSelectedMetric("ontime")}
          />
        </ChromaGrid>

        {/* Active Load - In Transit */}
        {loads.filter(l => l.status === 'in-transit').length > 0 && (
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-blue-100 mb-1">ACTIVE LOAD</div>
                <h2 className="text-2xl font-bold">{loads.filter(l => l.status === 'in-transit')[0].id}</h2>
              </div>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm">
                In Transit
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-lg mb-4">
              <MapPin className="w-5 h-5" />
              <span>{loads.filter(l => l.status === 'in-transit')[0].origin} → {loads.filter(l => l.status === 'in-transit')[0].destination}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-blue-100">Distance</div>
                <div className="font-semibold">{loads.filter(l => l.status === 'in-transit')[0].distance}</div>
              </div>
              <div>
                <div className="text-sm text-blue-100">Earnings</div>
                <div className="font-semibold">${loads.filter(l => l.status === 'in-transit')[0].rate}</div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span>Delivery Progress</span>
                <span>{loads.filter(l => l.status === 'in-transit')[0].progress || 0}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-300"
                  style={{ width: `${loads.filter(l => l.status === 'in-transit')[0].progress || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2">
                <Navigation className="w-5 h-5" />
                Navigate
              </button>
              <button 
                onClick={() => handleStatusUpdate(loads.filter(l => l.status === 'in-transit')[0].id, 'delivered', { 
                  deliveredAt: new Date().toISOString(),
                  progress: 100 
                })}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Mark as Delivered
              </button>
            </div>
          </div>
        )}

        {/* In Progress Loads */}
        {loads.filter(l => l.status === 'picking-up' || l.status === 'loaded').length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">In Progress</h2>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                {loads.filter(l => l.status === 'picking-up' || l.status === 'loaded').length} Active
              </span>
            </div>

            <div className="space-y-4">
              {loads.filter(l => l.status === 'picking-up' || l.status === 'loaded').map((load) => (
                <div key={load.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">{load.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          load.status === 'picking-up' 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {load.status === 'picking-up' ? 'Picking Up' : 'Loaded'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{load.origin} → {load.destination}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">${load.rate}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {load.status === 'picking-up' && (
                      <button 
                        onClick={() => handleStatusUpdate(load.id, 'loaded', { loadedAt: new Date().toISOString() })}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        Confirm Loaded
                      </button>
                    )}
                    {load.status === 'loaded' && (
                      <button 
                        onClick={() => handleStatusUpdate(load.id, 'in-transit', { 
                          transitStarted: new Date().toISOString(),
                          progress: 0 
                        })}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Start Transit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assigned Loads - Only show if no active loads */}
        {!hasActiveLoad && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Assigned Loads</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {loads.filter(l => l.status === 'assigned').length} Assigned by Fleet Owner
              </span>
            </div>

            <div className="space-y-4">
              {loads.filter(l => l.status === 'assigned').map((load) => (
                <div key={load.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">{load.id}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          Assigned
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{load.origin} → {load.destination}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Assigned by: <span className="font-semibold text-gray-700">{load.fleetOwner}</span> • Truck: <span className="font-semibold text-blue-600">{load.truck}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">${load.rate}</div>
                      <div className="text-sm text-gray-500">{load.distance}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Cargo Type</div>
                      <div className="text-sm font-semibold text-gray-900">{load.cargo}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Weight</div>
                      <div className="text-sm font-semibold text-gray-900">{load.weight}</div>
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

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleStatusUpdate(load.id, 'picking-up', { pickupStarted: new Date().toISOString() })}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Start Pickup
                    </button>
                    <button 
                      onClick={() => openStatusModal(load)}
                      className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
              {loads.filter(l => l.status === 'assigned').length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No assigned loads at the moment</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notice when load is active */}
        {hasActiveLoad && loads.filter(l => l.status === 'assigned').length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Active Load in Progress</h3>
                <p className="text-yellow-800 text-sm">
                  You have {loads.filter(l => l.status === 'assigned').length} other assigned load(s), but you must complete your current load before starting a new one.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Completed Loads */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Completed Loads</h2>
          <div className="space-y-3">
            {completedLoads.map((load) => (
              <div key={load.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{load.id}</div>
                    <div className="text-sm text-gray-600">{load.origin} → {load.destination}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">${load.earnings}</div>
                  <div className="text-xs text-gray-500">{load.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Detail Modals */}
      {selectedMetric && (
        <TradingMetricModal 
          metric={selectedMetric} 
          onClose={() => setSelectedMetric(null)} 
        />
      )}

      {/* Status Update Modal */}
      {isStatusModalOpen && selectedLoad && (
        <StatusUpdateModal
          load={selectedLoad}
          onClose={() => {
            setIsStatusModalOpen(false);
            setSelectedLoad(null);
          }}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </DashboardLayout>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

function MetricCard({ title, value, subtitle, icon, color, onClick }: MetricCardProps) {
  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600", spotlight: "rgba(59, 130, 246, 0.4)" },
    green: { bg: "bg-green-100", text: "text-green-600", spotlight: "rgba(16, 185, 129, 0.4)" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", spotlight: "rgba(168, 85, 247, 0.4)" },
    orange: { bg: "bg-orange-100", text: "text-orange-600", spotlight: "rgba(245, 158, 11, 0.4)" },
  }[color];

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div 
      className="chroma-card"
      onClick={onClick}
      onMouseMove={handleCardMove}
      style={{
        '--spotlight-color': colorClasses.spotlight
      } as React.CSSProperties}
    >
      <div className="chroma-card-content">
        <div className={`w-12 h-12 rounded-lg ${colorClasses.bg} ${colorClasses.text} flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm font-semibold text-gray-700 mb-1">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </div>
  );
}

interface MetricDetailModalProps {
  metric: string;
  onClose: () => void;
}

function MetricDetailModal({ metric, onClose }: MetricDetailModalProps) {
  const detailData = {
    earnings: {
      title: "This Month's Earnings",
      subtitle: "Earnings by distance category",
      icon: <DollarSign className="w-8 h-8" />,
      color: "green",
      data: [
        { month: "Jan", value: 6200 },
        { month: "Feb", value: 6800 },
        { month: "Mar", value: 7100 },
        { month: "Apr", value: 7600 },
        { month: "May", value: 8000 },
        { month: "Jun", value: 8450 },
      ],
      breakdown: [
        { label: "Long Haul (>500mi)", value: "$5,200", percentage: "61.5%", change: "+$850" },
        { label: "Regional (100-500mi)", value: "$2,400", percentage: "28.4%", change: "+$320" },
        { label: "Local (<100mi)", value: "$850", percentage: "10.1%", change: "+$120" },
      ],
      stats: [
        { label: "Total", value: "$8,450", change: "+$1,250", trend: "up" as const },
        { label: "Avg Load", value: "$704", change: "+$104", trend: "up" as const },
        { label: "Growth", value: "+36.2%", change: "+6.2%", trend: "up" as const },
      ]
    },
    active: {
      title: "Active Load",
      subtitle: "Current load status",
      icon: <Package className="w-8 h-8" />,
      color: "blue",
      data: [
        { month: "Jan", value: 2 },
        { month: "Feb", value: 3 },
        { month: "Mar", value: 2 },
        { month: "Apr", value: 3 },
        { month: "May", value: 2 },
        { month: "Jun", value: 1 },
      ],
      breakdown: [
        { label: "In Transit", value: "1", percentage: "100%", change: "0" },
        { label: "Loading", value: "0", percentage: "0%", change: "0" },
        { label: "Unloading", value: "0", percentage: "0%", change: "0" },
      ],
      stats: [
        { label: "Active", value: "1", change: "0", trend: "up" as const },
        { label: "Progress", value: "65%", change: "+15%", trend: "up" as const },
        { label: "ETA", value: "2.5h", change: "-0.5h", trend: "up" as const },
      ]
    },
    assigned: {
      title: "Assigned Loads",
      subtitle: "Loads ready for pickup",
      icon: <Package className="w-8 h-8" />,
      color: "orange",
      data: [
        { month: "Jan", value: 18 },
        { month: "Feb", value: 20 },
        { month: "Mar", value: 22 },
        { month: "Apr", value: 24 },
        { month: "May", value: 26 },
        { month: "Jun", value: 28 },
      ],
      breakdown: [
        { label: "Ready for Pickup", value: "2", percentage: "100%", change: "+2" },
        { label: "In Progress", value: "0", percentage: "0%", change: "0" },
        { label: "Completed Today", value: "0", percentage: "0%", change: "0" },
      ],
      stats: [
        { label: "Assigned", value: "2", change: "+2", trend: "up" as const },
        { label: "Avg Value", value: "$1,115", change: "+$115", trend: "up" as const },
        { label: "Total Value", value: "$2,230", change: "+$230", trend: "up" as const },
      ]
    },
    ontime: {
      title: "On-Time Rate",
      subtitle: "Delivery performance",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "purple",
      data: [
        { month: "Jan", value: 96.5 },
        { month: "Feb", value: 97.0 },
        { month: "Mar", value: 97.5 },
        { month: "Apr", value: 97.8 },
        { month: "May", value: 98.0 },
        { month: "Jun", value: 98.3 },
      ],
      breakdown: [
        { label: "On-Time Deliveries", value: "118", percentage: "98.3%", change: "+5" },
        { label: "Delayed", value: "2", percentage: "1.7%", change: "-1" },
        { label: "Early Deliveries", value: "45", percentage: "37.5%", change: "+8" },
      ],
      stats: [
        { label: "Success Rate", value: "98.3%", change: "+1.8%", trend: "up" as const },
        { label: "On-Time", value: "118", change: "+5", trend: "up" as const },
        { label: "Delayed", value: "2", change: "-1", trend: "up" as const },
      ]
    }
  };

  const data = detailData[metric as keyof typeof detailData];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-700">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-lg hover:bg-slate-700 flex items-center justify-center transition text-slate-400 hover:text-white z-10"
        >
          <X className="w-6 h-6" />
        </button>
        <TradingChart
          title={data.title}
          subtitle={data.subtitle}
          data={data.data}
          dataKey="value"
          color={data.color}
          icon={data.icon}
          breakdown={data.breakdown}
          stats={data.stats}
          height={300}
        />
      </div>
    </div>
  );
}

interface StatusUpdateModalProps {
  load: any;
  onClose: () => void;
  onUpdateStatus: (loadId: string, status: string, data?: any) => void;
}

function StatusUpdateModal({ load, onClose, onUpdateStatus }: StatusUpdateModalProps) {
  const [notes, setNotes] = useState("");

  const statusOptions = [
    { value: 'picking-up', label: 'Picking Up', color: 'yellow', icon: <Package className="w-5 h-5" /> },
    { value: 'loaded', label: 'Loaded', color: 'green', icon: <CheckCircle className="w-5 h-5" /> },
    { value: 'in-transit', label: 'In Transit', color: 'blue', icon: <Navigation className="w-5 h-5" /> },
    { value: 'delivered', label: 'Delivered', color: 'green', icon: <CheckCircle className="w-5 h-5" /> },
  ];

  const handleUpdate = (status: string) => {
    const updateData: any = {
      updatedAt: new Date().toISOString(),
      notes: notes || undefined
    };

    if (status === 'picking-up') {
      updateData.pickupStarted = new Date().toISOString();
    } else if (status === 'loaded') {
      updateData.loadedAt = new Date().toISOString();
    } else if (status === 'in-transit') {
      updateData.transitStarted = new Date().toISOString();
      updateData.progress = 0;
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date().toISOString();
      updateData.progress = 100;
    }

    onUpdateStatus(load.id, status, updateData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Update Load Status</h2>
              <p className="text-blue-100 text-sm mt-1">{load.id}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Load Info */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{load.origin} → {load.destination}</span>
            </div>
            <div className="text-sm text-gray-500">
              Truck: <span className="font-semibold text-blue-600">{load.truck}</span> • 
              Cargo: <span className="font-semibold text-gray-700">{load.cargo}</span>
            </div>
          </div>

          {/* Status Options */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Select New Status</h3>
            <div className="grid grid-cols-2 gap-3">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleUpdate(option.value)}
                  className={`p-4 rounded-lg border-2 transition hover:shadow-lg ${
                    option.color === 'yellow' ? 'border-yellow-300 hover:bg-yellow-50' :
                    option.color === 'green' ? 'border-green-300 hover:bg-green-50' :
                    option.color === 'blue' ? 'border-blue-300 hover:bg-blue-50' :
                    'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      option.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                      option.color === 'green' ? 'bg-green-100 text-green-600' :
                      option.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {option.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500">
                        {option.value === 'picking-up' && 'Start pickup process'}
                        {option.value === 'loaded' && 'Cargo loaded'}
                        {option.value === 'in-transit' && 'On the way'}
                        {option.value === 'delivered' && 'Complete delivery'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Add any notes about this status update..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
