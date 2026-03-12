import { DashboardLayout } from "../components/DashboardLayout";
import { ChromaGrid } from "../components/ChromaGrid";
import { TradingChart } from "../components/TradingChart";
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle,
  MapPin,
  DollarSign,
  TrendingUp,
  Plus,
  Filter,
  X,
  TrendingDown
} from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const activeShipments = [
  { 
    id: "LD-8821", 
    origin: "Los Angeles, CA", 
    destination: "Phoenix, AZ",
    truck: "TRK-2401",
    driver: "John Martinez",
    status: "in-transit",
    progress: 65,
    pickup: "Nov 1, 2:00 PM",
    delivery: "Nov 2, 10:00 AM",
    rate: 1250,
    cargo: "Electronics",
    weight: "24,000 lbs"
  },
  { 
    id: "LD-8819", 
    origin: "San Diego, CA", 
    destination: "Las Vegas, NV",
    truck: "TRK-2398",
    driver: "Sarah Johnson",
    status: "assigned",
    progress: 0,
    pickup: "Nov 2, 8:00 AM",
    delivery: "Nov 2, 6:00 PM",
    rate: 980,
    cargo: "Furniture",
    weight: "18,500 lbs"
  },
];

const pendingLoads = [
  { 
    id: "LD-8825", 
    origin: "Miami, FL", 
    destination: "Orlando, FL",
    pickup: "Nov 5, 9:00 AM",
    rate: 650,
    cargo: "Medical Supplies",
    weight: "8,500 lbs",
    responses: 3
  },
  { 
    id: "LD-8826", 
    origin: "Chicago, IL", 
    destination: "Detroit, MI",
    pickup: "Nov 6, 7:00 AM",
    rate: 850,
    cargo: "Auto Parts",
    weight: "22,000 lbs",
    responses: 7
  },
];

const completedShipments = [
  { id: "LD-8812", origin: "Denver, CO", destination: "Salt Lake City, UT", date: "Oct 30", cost: 1150, rating: 5 },
  { id: "LD-8809", origin: "Phoenix, AZ", destination: "Albuquerque, NM", date: "Oct 28", cost: 890, rating: 5 },
  { id: "LD-8805", origin: "San Francisco, CA", destination: "Sacramento, CA", date: "Oct 26", cost: 450, rating: 4 },
  { id: "LD-8801", origin: "Los Angeles, CA", destination: "San Diego, CA", date: "Oct 24", cost: 380, rating: 5 },
];

export function ShipperDashboard() {
  const navigate = useNavigate();
  const currentUserId = sessionStorage.getItem('currentUserId') || 'SH001';
  const currentUserName = sessionStorage.getItem('currentUserName') || 'Jennifer Chen';
  const [userStatus, setUserStatus] = useState('active');
  const [postedLoads, setPostedLoads] = useState<any[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Check user status and load posted loads
  useEffect(() => {
    // Check if user is suspended
    const usersData = localStorage.getItem('logistix_users');
    if (usersData) {
      const users = JSON.parse(usersData);
      const currentUser = users.find((user: any) => user.id === currentUserId);
      if (currentUser) {
        setUserStatus(currentUser.status || 'active');
      }
    }

    // Load posted loads
    const loadsData = localStorage.getItem('posted_loads');
    if (loadsData) {
      const loads = JSON.parse(loadsData);
      const userLoads = loads.filter((load: any) => load.shipperId === currentUserId);
      setPostedLoads(userLoads);
    }
  }, [currentUserId]);

  const handlePostNewLoad = () => {
    if (userStatus === 'suspended') {
      alert('Your account has been suspended. You cannot post new loads. Please contact support.');
      return;
    }
    navigate('/shipper/post');
  };

  // Filter loads based on user status
  const visiblePendingLoads = userStatus === 'suspended' ? [] : pendingLoads;
  const visibleActiveShipments = userStatus === 'suspended' ? [] : activeShipments;

  return (
    <DashboardLayout role="shipper" userName={currentUserName} userId={currentUserId}>
      <div className="space-y-6">
        {/* Suspension Notice */}
        {userStatus === 'suspended' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Account Suspended</h3>
                <p className="text-red-700 text-sm">Your account has been suspended. You cannot view or post loads. Please contact support for assistance.</p>
              </div>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipper Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your shipments and track deliveries</p>
          </div>
          <button 
            onClick={handlePostNewLoad}
            disabled={userStatus === 'suspended'}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg ${
              userStatus === 'suspended' 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30'
            }`}
          >
            <Plus className="w-5 h-5" />
            Post New Load
          </button>
        </div>

        {/* Key Metrics */}
        <ChromaGrid radius={350} columns={4} damping={0.45} fadeOut={0.6}>
          <MetricCard 
            title="Active Shipments"
            value={userStatus === 'suspended' ? '0' : '2'}
            subtitle={userStatus === 'suspended' ? 'Account suspended' : 'Both on schedule'}
            icon={<Truck className="w-6 h-6" />}
            color="blue"
            onClick={() => setSelectedMetric("shipments")}
          />
          <MetricCard 
            title="Pending Loads"
            value={userStatus === 'suspended' ? '0' : postedLoads.filter(load => load.status === 'pending').length.toString()}
            subtitle={userStatus === 'suspended' ? 'Account suspended' : 'Awaiting assignment'}
            icon={<Clock className="w-6 h-6" />}
            color="orange"
            onClick={() => setSelectedMetric("pending")}
          />
          <MetricCard 
            title="This Month"
            value={userStatus === 'suspended' ? '$0' : '$12,450'}
            subtitle={userStatus === 'suspended' ? 'Account suspended' : '18 loads shipped'}
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
            onClick={() => setSelectedMetric("revenue")}
          />
          <MetricCard 
            title="Success Rate"
            value={userStatus === 'suspended' ? '0%' : '99.2%'}
            subtitle={userStatus === 'suspended' ? 'Account suspended' : 'On-time deliveries'}
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
            onClick={() => setSelectedMetric("success")}
          />
        </ChromaGrid>

        {/* Active Shipments */}
        {userStatus !== 'suspended' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Active Shipments</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            <div className="space-y-4">
              {visibleActiveShipments.map((shipment) => (
              <div key={shipment.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">{shipment.id}</span>
                      {shipment.status === "in-transit" && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          In Transit
                        </span>
                      )}
                      {shipment.status === "assigned" && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Assigned
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{shipment.origin} → {shipment.destination}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">${shipment.rate}</div>
                    <div className="text-xs text-gray-500">Total Cost</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Truck</div>
                    <div className="text-sm font-semibold text-blue-600">{shipment.truck}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Driver</div>
                    <div className="text-sm font-semibold text-gray-900">{shipment.driver}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Pickup</div>
                    <div className="text-sm font-semibold text-gray-900">{shipment.pickup}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Delivery</div>
                    <div className="text-sm font-semibold text-gray-900">{shipment.delivery}</div>
                  </div>
                </div>

                {shipment.status === "in-transit" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Delivery Progress</span>
                      <span>{shipment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${shipment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">
                    Track Shipment
                  </button>
                  <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">
                    Contact Driver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Pending Loads */}
        {userStatus !== 'suspended' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Pending Loads</h2>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
              {visiblePendingLoads.length} Awaiting Assignment
            </span>
          </div>

          <div className="space-y-4">
            {visiblePendingLoads.map((load) => (
              <div key={load.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">{load.id}</span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                        Pending
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{load.origin} → {load.destination}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">${load.rate}</div>
                    <div className="text-xs text-gray-500">Offered Rate</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Cargo Type</div>
                    <div className="text-sm font-semibold text-gray-900">{load.cargo}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Weight</div>
                    <div className="text-sm font-semibold text-gray-900">{load.weight}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Pickup Time</div>
                    <div className="text-sm font-semibold text-gray-900">{load.pickup}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Recent Completed Shipments */}
        {userStatus !== 'suspended' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Completed Shipments</h2>
          <div className="space-y-3">
            {completedShipments.map((shipment) => (
              <div key={shipment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{shipment.id}</div>
                    <div className="text-sm text-gray-600">{shipment.origin} → {shipment.destination}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bold text-gray-900">${shipment.cost}</div>
                    <div className="text-xs text-gray-500">{shipment.date}</div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: shipment.rating }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>

      {/* Metric Detail Modals */}
      {selectedMetric && (
        <TradingMetricModal 
          metric={selectedMetric} 
          onClose={() => setSelectedMetric(null)} 
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

function TradingMetricModal({ metric, onClose }: MetricDetailModalProps) {
  const detailData = {
    shipments: {
      title: "Active Shipments",
      subtitle: "Shipment tracking overview",
      icon: <Truck className="w-8 h-8" />,
      color: "blue",
      data: [
        { month: "Jan", value: 8 },
        { month: "Feb", value: 12 },
        { month: "Mar", value: 15 },
        { month: "Apr", value: 18 },
        { month: "May", value: 22 },
        { month: "Jun", value: 24 },
      ],
      breakdown: [
        { label: "In Transit", value: "1", percentage: "50%", change: "+1" },
        { label: "Assigned", value: "1", percentage: "50%", change: "0" },
        { label: "Delayed", value: "0", percentage: "0%", change: "0" },
      ],
      stats: [
        { label: "Active", value: "2", change: "+1", trend: "up" as const },
        { label: "Avg Time", value: "2.5h", change: "-0.5h", trend: "up" as const },
        { label: "Success", value: "100%", change: "0%", trend: "up" as const },
      ]
    },
    pending: {
      title: "Pending Loads",
      subtitle: "Awaiting fleet assignment",
      icon: <Clock className="w-8 h-8" />,
      color: "orange",
      data: [
        { month: "Jan", value: 5 },
        { month: "Feb", value: 3 },
        { month: "Mar", value: 4 },
        { month: "Apr", value: 6 },
        { month: "May", value: 3 },
        { month: "Jun", value: 2 },
      ],
      breakdown: [
        { label: "Awaiting Assignment", value: "2", percentage: "100%", change: "+2" },
        { label: "Under Review", value: "0", percentage: "0%", change: "0" },
        { label: "Cancelled", value: "0", percentage: "0%", change: "0" },
      ],
      stats: [
        { label: "Pending", value: "2", change: "+2", trend: "up" as const },
        { label: "Avg Wait", value: "4.2h", change: "+1.2h", trend: "down" as const },
        { label: "Response Rate", value: "85%", change: "+5%", trend: "up" as const },
      ]
    },
    revenue: {
      title: "Monthly Revenue",
      subtitle: "Revenue by distance category",
      icon: <DollarSign className="w-8 h-8" />,
      color: "green",
      data: [
        { month: "Jan", value: 8500 },
        { month: "Feb", value: 9200 },
        { month: "Mar", value: 10100 },
        { month: "Apr", value: 10800 },
        { month: "May", value: 11500 },
        { month: "Jun", value: 12450 },
      ],
      breakdown: [
        { label: "Long Distance (>500mi)", value: "$7,800", percentage: "62.6%", change: "+$1,200" },
        { label: "Regional (100-500mi)", value: "$3,210", percentage: "25.8%", change: "+$450" },
        { label: "Local (<100mi)", value: "$1,440", percentage: "11.6%", change: "+$180" },
      ],
      stats: [
        { label: "Total", value: "$12,450", change: "+$950", trend: "up" as const },
        { label: "Avg Load", value: "$1,245", change: "+$95", trend: "up" as const },
        { label: "Growth", value: "+46.4%", change: "+8.2%", trend: "up" as const },
      ]
    },
    success: {
      title: "Success Rate",
      subtitle: "On-time delivery performance",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "purple",
      data: [
        { month: "Jan", value: 97.5 },
        { month: "Feb", value: 98.2 },
        { month: "Mar", value: 98.8 },
        { month: "Apr", value: 99.0 },
        { month: "May", value: 99.1 },
        { month: "Jun", value: 99.2 },
      ],
      breakdown: [
        { label: "On-Time Deliveries", value: "124", percentage: "99.2%", change: "+8" },
        { label: "Delayed", value: "1", percentage: "0.8%", change: "-2" },
        { label: "Issues Resolved", value: "100%", percentage: "100%", change: "0" },
      ],
      stats: [
        { label: "Success Rate", value: "99.2%", change: "+1.7%", trend: "up" as const },
        { label: "On-Time", value: "124", change: "+8", trend: "up" as const },
        { label: "Delayed", value: "1", change: "-2", trend: "up" as const },
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
