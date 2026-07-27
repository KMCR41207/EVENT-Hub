import { DashboardLayout } from "../components/DashboardLayout";
import { ChromaGrid } from "../components/ChromaGrid";
import { TradingChart } from "../components/TradingChart";
import { CandlestickChart } from "../components/CandlestickChart";
import { 
  Truck, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  MapPin,
  Clock,
  AlertCircle,
  X,
  CheckCircle,
  Eye,
  Calendar,
  Weight,
  Star,
  Flame
} from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 145000, profit: 42000 },
  { month: "Feb", revenue: 162000, profit: 48000 },
  { month: "Mar", revenue: 178000, profit: 55000 },
  { month: "Apr", revenue: 195000, profit: 61000 },
  { month: "May", revenue: 210000, profit: 68000 },
  { month: "Jun", revenue: 234000, profit: 76000 },
];

const truckStatusData = [
  { name: "Active", value: 42, color: "#10b981" },
  { name: "Idle", value: 8, color: "#f59e0b" },
  { name: "Maintenance", value: 3, color: "#ef4444" },
];

const topPerformingTrucks = [
  { id: "TRK-2401", driver: "John Martinez", loads: 28, revenue: 42500, profit: 12800 },
  { id: "TRK-2398", driver: "Sarah Johnson", loads: 26, revenue: 39800, profit: 11500 },
  { id: "TRK-2405", driver: "Mike Chen", loads: 24, revenue: 38200, profit: 11200 },
  { id: "TRK-2392", driver: "Emily Davis", loads: 23, revenue: 36900, profit: 10800 },
  { id: "TRK-2411", driver: "Carlos Rivera", loads: 22, revenue: 35600, profit: 10400 },
];

const recentLoads = [
  { id: "LD-8821", origin: "Los Angeles, CA", destination: "Phoenix, AZ", truck: "TRK-2401", status: "In Transit", progress: 65 },
  { id: "LD-8822", origin: "Seattle, WA", destination: "Portland, OR", truck: "TRK-2398", status: "In Transit", progress: 85 },
  { id: "LD-8823", origin: "Dallas, TX", destination: "Houston, TX", truck: "TRK-2405", status: "Loading", progress: 15 },
  { id: "LD-8824", origin: "Miami, FL", destination: "Atlanta, GA", truck: "TRK-2392", status: "Delivered", progress: 100 },
];

export function FleetOwnerDashboard() {
  const currentUserId = sessionStorage.getItem('currentUserId') || 'FO001';
  const currentUserName = sessionStorage.getItem('currentUserName') || 'James Anderson';
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [availableLoads, setAvailableLoads] = useState<any[]>([]);
  const [selectedLoad, setSelectedLoad] = useState<any>(null);
  const [isLoadDetailOpen, setIsLoadDetailOpen] = useState(false);

  // Load available loads from localStorage
  useEffect(() => {
    const loadAvailableLoads = () => {
      const loadsData = localStorage.getItem('posted_loads');
      if (loadsData) {
        const loads = JSON.parse(loadsData);
        // Show only pending loads (not yet accepted)
        const pendingLoads = loads.filter((load: any) => load.status === 'pending');
        setAvailableLoads(pendingLoads);
      }
    };

    loadAvailableLoads();
    
    // Refresh loads every 10 seconds
    const interval = setInterval(loadAvailableLoads, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleAcceptLoad = (loadId: string) => {
    const loadsData = localStorage.getItem('posted_loads');
    if (loadsData) {
      const loads = JSON.parse(loadsData);
      const updatedLoads = loads.map((load: any) => 
        load.id === loadId 
          ? { 
              ...load, 
              status: 'accepted', 
              fleetOwnerId: currentUserId,
              fleetOwnerName: currentUserName,
              acceptedAt: new Date().toISOString()
            }
          : load
      );
      localStorage.setItem('posted_loads', JSON.stringify(updatedLoads));
      
      // Refresh available loads
      const pendingLoads = updatedLoads.filter((load: any) => load.status === 'pending');
      setAvailableLoads(pendingLoads);
      
      // Close modal if it was the accepted load
      if (selectedLoad?.id === loadId) {
        setIsLoadDetailOpen(false);
        setSelectedLoad(null);
      }
      
      alert(`Load ${loadId} accepted successfully! You can now assign it to a driver.`);
    }
  };

  const handleViewLoadDetails = (load: any) => {
    setSelectedLoad(load);
    setIsLoadDetailOpen(true);
  };

  return (
    <DashboardLayout role="fleet-owner" userName={currentUserName} userId={currentUserId}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Overview</h1>
          <p className="text-gray-600 mt-1">Monitor your fleet performance and operations</p>
        </div>

        {/* Key Metrics */}
        <ChromaGrid radius={350} columns={4} damping={0.45} fadeOut={0.6}>
          <MetricCard 
            title="Total Trucks"
            value="53"
            change="+3 this month"
            trend="up"
            icon={<Truck className="w-6 h-6" />}
            color="blue"
            onClick={() => setSelectedMetric("trucks")}
          />
          <MetricCard 
            title="Active Drivers"
            value="48"
            change="42 on road now"
            trend="up"
            icon={<Users className="w-6 h-6" />}
            color="green"
            onClick={() => setSelectedMetric("drivers")}
          />
          <MetricCard 
            title="Monthly Revenue"
            value="$234,500"
            change="+12% from last month"
            trend="up"
            icon={<DollarSign className="w-6 h-6" />}
            color="purple"
            onClick={() => setSelectedMetric("revenue")}
          />
          <MetricCard 
            title="Total Profit"
            value="$76,200"
            change="+15% from last month"
            trend="up"
            icon={<TrendingUp className="w-6 h-6" />}
            color="orange"
            onClick={() => setSelectedMetric("profit")}
          />
        </ChromaGrid>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue & Profit Chart */}
          <TradingChart
            title="Revenue & Profit Trends"
            subtitle="Monthly performance analysis"
            data={revenueData}
            dataKey="revenue"
            color="purple"
            icon={<DollarSign className="w-5 h-5" />}
            stats={[
              { label: "Revenue", value: "$234,500", change: "+18%", trend: "up" },
              { label: "Profit", value: "$76,200", change: "+15%", trend: "up" },
              { label: "Margin", value: "32.5%", change: "+2.1%", trend: "up" },
            ]}
            breakdown={[
              { label: "Long Haul Revenue", value: "$145,000", percentage: "61.8%", change: "+$18,000" },
              { label: "Regional Revenue", value: "$62,500", percentage: "26.7%", change: "+$8,500" },
              { label: "Local Revenue", value: "$27,000", percentage: "11.5%", change: "+$3,200" },
            ]}
          />

          {/* Fleet Status Chart */}
          <CandlestickChart
            title="Fleet Performance"
            subtitle="Truck utilization candlestick"
            data={revenueData.map(item => ({ ...item, close: item.revenue / 1000 }))}
            dataKeys={{
              open: "revenue",
              high: "revenue", 
              low: "profit",
              close: "close",
              volume: "profit"
            }}
            color="green"
            icon={<Truck className="w-5 h-5" />}
            height={300}
          />
        </div>

        {/* Top Performing Trucks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Performing Trucks This Month</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Truck ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Driver</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Loads</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Profit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {topPerformingTrucks.map((truck) => (
                  <tr key={truck.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-blue-600">{truck.id}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{truck.driver}</td>
                    <td className="py-3 px-4 text-gray-700">{truck.loads}</td>
                    <td className="py-3 px-4 text-gray-900 font-semibold">${truck.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">${truck.profit.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available Loads */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Available Loads</h2>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {availableLoads.length} Available
              </span>
              <button 
                onClick={() => {
                  const loadsData = localStorage.getItem('posted_loads');
                  if (loadsData) {
                    const loads = JSON.parse(loadsData);
                    const pendingLoads = loads.filter((load: any) => load.status === 'pending');
                    setAvailableLoads(pendingLoads);
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                Refresh
              </button>
            </div>
          </div>
          
          {availableLoads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No available loads at the moment</p>
              <p className="text-sm">New loads will appear here when shippers post them</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableLoads.map((load) => (
                <div key={load.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">{load.id}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          New Load
                        </span>
                        <span className="text-sm text-gray-500">
                          Posted by {load.shipperName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">{load.origin} → {load.destination}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Pickup: {load.pickup}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          <span>{load.cargoType}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Weight className="w-4 h-4" />
                          <span>{load.weight}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-green-600">${load.rate}</div>
                      <div className="text-xs text-gray-500">Offered Rate</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleViewLoadDetails(load)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleAcceptLoad(load.id)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept Load
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Loads */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Active Loads</h2>
            <button 
              onClick={() => alert('View all active loads')}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentLoads.map((load) => (
              <div key={load.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{load.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        load.status === "Delivered" 
                          ? "bg-green-100 text-green-700"
                          : load.status === "In Transit"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {load.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{load.origin} → {load.destination}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Truck</div>
                    <div className="font-semibold text-blue-600">{load.truck}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span>{load.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        load.status === "Delivered" ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${load.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Load Detail Modal */}
      {isLoadDetailOpen && selectedLoad && (
        <LoadDetailModal 
          load={selectedLoad} 
          onClose={() => {
            setIsLoadDetailOpen(false);
            setSelectedLoad(null);
          }}
          onAccept={() => handleAcceptLoad(selectedLoad.id)}
        />
      )}

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
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

function MetricCard({ title, value, change, trend, icon, color, onClick }: MetricCardProps) {
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
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg ${colorClasses.bg} ${colorClasses.text} flex items-center justify-center`}>
            {icon}
          </div>
          {trend === "up" ? (
            <TrendingUp className="w-5 h-5 text-green-500" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500" />
          )}
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600 mb-2">{title}</div>
        <div className="text-xs text-gray-500">{change}</div>
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
    trucks: {
      title: "Total Trucks",
      icon: <Truck className="w-8 h-8" />,
      color: "blue",
      current: "53",
      data: [
        { month: "Jan", value: 45 },
        { month: "Feb", value: 47 },
        { month: "Mar", value: 48 },
        { month: "Apr", value: 49 },
        { month: "May", value: 50 },
        { month: "Jun", value: 53 },
      ],
      breakdown: [
        { label: "Active on Road", value: "42", percentage: "79.2%", change: "+5" },
        { label: "Idle/Available", value: "8", percentage: "15.1%", change: "-1" },
        { label: "In Maintenance", value: "3", percentage: "5.7%", change: "-1" },
      ],
    },
    drivers: {
      title: "Active Drivers",
      icon: <Users className="w-8 h-8" />,
      color: "green",
      current: "48",
      data: [
        { month: "Jan", value: 38 },
        { month: "Feb", value: 40 },
        { month: "Mar", value: 42 },
        { month: "Apr", value: 44 },
        { month: "May", value: 46 },
        { month: "Jun", value: 48 },
      ],
      breakdown: [
        { label: "On Road Now", value: "42", percentage: "87.5%", change: "+8" },
        { label: "Available", value: "4", percentage: "8.3%", change: "-2" },
        { label: "Off Duty", value: "2", percentage: "4.2%", change: "-1" },
      ],
    },
    revenue: {
      title: "Monthly Revenue",
      icon: <DollarSign className="w-8 h-8" />,
      color: "purple",
      current: "$234,500",
      data: [
        { month: "Jan", value: 145000 },
        { month: "Feb", value: 162000 },
        { month: "Mar", value: 178000 },
        { month: "Apr", value: 195000 },
        { month: "May", value: 210000 },
        { month: "Jun", value: 234500 },
      ],
      breakdown: [
        { label: "Long Haul (>500mi)", value: "$145,000", percentage: "61.8%", change: "+$18,000" },
        { label: "Regional (100-500mi)", value: "$62,500", percentage: "26.7%", change: "+$8,500" },
        { label: "Local Delivery (<100mi)", value: "$27,000", percentage: "11.5%", change: "+$3,200" },
      ],
    },
    profit: {
      title: "Total Profit",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "orange",
      current: "$76,200",
      data: [
        { month: "Jan", value: 42000 },
        { month: "Feb", value: 48000 },
        { month: "Mar", value: 55000 },
        { month: "Apr", value: 61000 },
        { month: "May", value: 68000 },
        { month: "Jun", value: 76200 },
      ],
      breakdown: [
        { label: "Operating Profit (32.5%)", value: "$58,400", percentage: "76.6%", change: "+$9,200" },
        { label: "Fuel Savings (5.5%)", value: "$12,800", percentage: "16.8%", change: "+$2,100" },
        { label: "Other Income (2.1%)", value: "$5,000", percentage: "6.6%", change: "+$800" },
      ],
    }
  };

  const data = detailData[metric as keyof typeof detailData];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center text-white">
              {data.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{data.title}</h2>
              <p className="text-3xl font-bold text-white mt-1">{data.current}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-slate-700 flex items-center justify-center transition text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Chart */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">6-Month Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.data}>
                <defs>
                  <linearGradient id={`color${metric}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={
                      data.color === 'blue' ? '#3b82f6' :
                      data.color === 'green' ? '#10b981' :
                      data.color === 'purple' ? '#a855f7' :
                      '#f59e0b'
                    } stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={
                      data.color === 'blue' ? '#3b82f6' :
                      data.color === 'green' ? '#10b981' :
                      data.color === 'purple' ? '#a855f7' :
                      '#f59e0b'
                    } stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={
                    data.color === 'blue' ? '#3b82f6' :
                    data.color === 'green' ? '#10b981' :
                    data.color === 'purple' ? '#a855f7' :
                    '#f59e0b'
                  }
                  strokeWidth={2} 
                  fill={`url(#color${metric})`} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.breakdown.map((item) => (
                <div key={item.label} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <div className="text-sm text-slate-300 mb-1">{item.label}</div>
                  <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{item.percentage}</span>
                    <span className={`text-xs font-semibold ${item.change.startsWith('+') ? 'text-green-400' : item.change.startsWith('-') ? 'text-red-400' : 'text-slate-400'}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricDetailModalProps2 {
  metric: string;
  onClose: () => void;
}

function MetricDetailModal({ metric, onClose }: MetricDetailModalProps2) {
  const detailData = {
    trucks: {
      title: "Total Trucks",
      icon: <Truck className="w-8 h-8" />,
      color: "blue",
      current: "53",
      breakdown: [
        { label: "Active on Road", value: "42", percentage: "79.2%", change: "+5" },
        { label: "Idle/Available", value: "8", percentage: "15.1%", change: "-1" },
        { label: "In Maintenance", value: "3", percentage: "5.7%", change: "-1" },
      ],
      monthlyData: [
        { month: "Jan", value: 45 },
        { month: "Feb", value: 47 },
        { month: "Mar", value: 48 },
        { month: "Apr", value: 49 },
        { month: "May", value: 50 },
        { month: "Jun", value: 53 },
      ]
    },
    drivers: {
      title: "Active Drivers",
      icon: <Users className="w-8 h-8" />,
      color: "green",
      current: "48",
      breakdown: [
        { label: "On Road Now", value: "42", percentage: "87.5%", change: "+8" },
        { label: "Available", value: "4", percentage: "8.3%", change: "-2" },
        { label: "Off Duty", value: "2", percentage: "4.2%", change: "-1" },
      ],
      monthlyData: [
        { month: "Jan", value: 38 },
        { month: "Feb", value: 40 },
        { month: "Mar", value: 42 },
        { month: "Apr", value: 44 },
        { month: "May", value: 46 },
        { month: "Jun", value: 48 },
      ]
    },
    revenue: {
      title: "Monthly Revenue",
      icon: <DollarSign className="w-8 h-8" />,
      color: "purple",
      current: "$234,500",
      breakdown: [
        { label: "Long Haul (>500mi)", value: "$145,000", percentage: "61.8%", change: "+$18,000" },
        { label: "Regional (100-500mi)", value: "$62,500", percentage: "26.7%", change: "+$8,500" },
        { label: "Local Delivery (<100mi)", value: "$27,000", percentage: "11.5%", change: "+$3,200" },
      ],
      monthlyData: [
        { month: "Jan", value: 145000 },
        { month: "Feb", value: 162000 },
        { month: "Mar", value: 178000 },
        { month: "Apr", value: 195000 },
        { month: "May", value: 210000 },
        { month: "Jun", value: 234500 },
      ]
    },
    profit: {
      title: "Total Profit",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "orange",
      current: "$76,200",
      breakdown: [
        { label: "Operating Profit (32.5%)", value: "$58,400", percentage: "76.6%", change: "+$9,200" },
        { label: "Fuel Savings (5.5%)", value: "$12,800", percentage: "16.8%", change: "+$2,100" },
        { label: "Other Income (2.1%)", value: "$5,000", percentage: "6.6%", change: "+$800" },
      ],
      monthlyData: [
        { month: "Jan", value: 42000 },
        { month: "Feb", value: 48000 },
        { month: "Mar", value: 55000 },
        { month: "Apr", value: 61000 },
        { month: "May", value: 68000 },
        { month: "Jun", value: 76200 },
      ]
    }
  };

  const data = detailData[metric as keyof typeof detailData];
  
  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
    green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
    orange: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" },
  }[data.color];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`${colorClasses.bg} ${colorClasses.border} border-b p-6 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 ${colorClasses.bg} ${colorClasses.text} rounded-xl flex items-center justify-center border-2 ${colorClasses.border}`}>
              {data.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
              <p className="text-3xl font-bold text-gray-900 mt-1">{data.current}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-white/50 flex items-center justify-center transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Breakdown */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.breakdown.map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">{item.label}</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{item.value}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{item.percentage}</span>
                    <span className={`text-xs font-semibold ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">6-Month Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.monthlyData}>
                <defs>
                  <linearGradient id={`color${metric}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={
                      data.color === 'blue' ? '#3b82f6' :
                      data.color === 'green' ? '#10b981' :
                      data.color === 'purple' ? '#a855f7' :
                      '#f59e0b'
                    } stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={
                      data.color === 'blue' ? '#3b82f6' :
                      data.color === 'green' ? '#10b981' :
                      data.color === 'purple' ? '#a855f7' :
                      '#f59e0b'
                    } stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={
                    data.color === 'blue' ? '#3b82f6' :
                    data.color === 'green' ? '#10b981' :
                    data.color === 'purple' ? '#a855f7' :
                    '#f59e0b'
                  }
                  strokeWidth={2} 
                  fill={`url(#color${metric})`} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
interface LoadDetailModalProps {
  load: any;
  onClose: () => void;
  onAccept: () => void;
}

function LoadDetailModal({ load, onClose, onAccept }: LoadDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{load.id}</h2>
              <p className="text-blue-100 text-sm mt-1">Load Details</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Route Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Route Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Origin</div>
                <div className="font-semibold text-gray-900">{load.origin}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Destination</div>
                <div className="font-semibold text-gray-900">{load.destination}</div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Schedule
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Pickup</div>
                <div className="font-semibold text-gray-900">{load.pickup}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Delivery</div>
                <div className="font-semibold text-gray-900">{load.delivery || 'TBD'}</div>
              </div>
            </div>
          </div>

          {/* Cargo Details */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Cargo Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Cargo Type</div>
                <div className="font-semibold text-gray-900">{load.cargoType}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Weight</div>
                <div className="font-semibold text-gray-900">{load.weight}</div>
              </div>
              {load.dimensions && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Dimensions</div>
                  <div className="font-semibold text-gray-900">{load.dimensions}</div>
                </div>
              )}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 mb-1">Offered Rate</div>
                <div className="text-2xl font-bold text-green-700">${load.rate}</div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(load.specialRequirements || load.description) && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-4">
                {load.specialRequirements && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="text-sm text-yellow-600 mb-1">Special Requirements</div>
                    <div className="text-gray-900">{load.specialRequirements}</div>
                  </div>
                )}
                {load.description && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Description</div>
                    <div className="text-gray-900">{load.description}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {(load.contactName || load.contactPhone || load.contactEmail) && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-3 gap-4">
                {load.contactName && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Contact Name</div>
                    <div className="font-semibold text-gray-900">{load.contactName}</div>
                  </div>
                )}
                {load.contactPhone && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Phone</div>
                    <div className="font-semibold text-gray-900">{load.contactPhone}</div>
                  </div>
                )}
                {load.contactEmail && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Email</div>
                    <div className="font-semibold text-gray-900">{load.contactEmail}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Shipper Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Shipper Information</h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-blue-600 mb-1">Posted by</div>
                  <div className="font-semibold text-blue-900">{load.shipperName}</div>
                  <div className="text-sm text-blue-700">ID: {load.shipperId}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-600 mb-1">Posted on</div>
                  <div className="font-semibold text-blue-900">
                    {new Date(load.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-blue-700">
                    {new Date(load.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Close
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Accept This Load
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}