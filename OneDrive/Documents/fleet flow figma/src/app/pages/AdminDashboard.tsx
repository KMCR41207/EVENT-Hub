import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../components/DashboardLayout";
import { ChromaGrid } from "../components/ChromaGrid";
import { TradingChart } from "../components/TradingChart";
import { 
  Users, 
  Truck, 
  Package, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  X
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const platformStats = [
  { month: "Jul", users: 850, revenue: 125000, loads: 3200 },
  { month: "Aug", users: 920, revenue: 145000, loads: 3800 },
  { month: "Sep", users: 1050, revenue: 168000, loads: 4200 },
  { month: "Oct", users: 1180, revenue: 192000, loads: 4850 },
  { month: "Nov", users: 1340, revenue: 218000, loads: 5420 },
  { month: "Dec", users: 1520, revenue: 245000, loads: 6100 },
];

const userGrowthData = [
  { date: "Week 1", fleetOwners: 520, drivers: 1850, shippers: 980 },
  { date: "Week 2", fleetOwners: 540, drivers: 1920, shippers: 1020 },
  { date: "Week 3", fleetOwners: 565, drivers: 2010, shippers: 1080 },
  { date: "Week 4", fleetOwners: 595, drivers: 2150, shippers: 1140 },
];

const topFleetOwners = [
  { name: "Swift Logistics Inc", trucks: 145, revenue: 2450000, loads: 3820, growth: 15 },
  { name: "TransNational Freight", trucks: 128, revenue: 2180000, loads: 3450, growth: 12 },
  { name: "Premium Transport Co", trucks: 98, revenue: 1850000, loads: 2890, growth: 18 },
  { name: "Global Haul Systems", trucks: 87, revenue: 1620000, loads: 2560, growth: 9 },
  { name: "Elite Carrier Group", trucks: 76, revenue: 1420000, loads: 2280, growth: 22 },
];

const recentActivity = [
  { type: "user", action: "New fleet owner registered", user: "Alpha Logistics LLC", time: "5 min ago" },
  { type: "load", action: "High-value load completed", details: "$12,500 - CA to NY", time: "12 min ago" },
  { type: "alert", action: "Driver safety incident reported", details: "TRK-4521", time: "25 min ago" },
  { type: "payment", action: "Payment processed", details: "$45,800 to Swift Logistics", time: "1 hour ago" },
  { type: "user", action: "15 new drivers onboarded", user: "TransNational Freight", time: "2 hours ago" },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const currentUserId = sessionStorage.getItem('currentUserId') || 'ADMIN001';
  const currentUserName = sessionStorage.getItem('currentUserName') || 'Admin User';
  
  return (
    <DashboardLayout role="admin" userName={currentUserName} userId={currentUserId}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Admin</h1>
            <p className="text-gray-600 mt-1">Monitor and manage Fleet Flow platform operations</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-semibold">All Systems Operational</span>
          </div>
        </div>

        {/* Key Metrics */}
        <ChromaGrid radius={350} columns={4} damping={0.45} fadeOut={0.6}>
          <MetricCard 
            title="Total Users"
            value="3,445"
            change="+12% this month"
            trend="up"
            icon={<Users className="w-6 h-6" />}
            color="blue"
            onClick={() => setSelectedMetric("users")}
          />
          <MetricCard 
            title="Active Trucks"
            value="15,240"
            change="+8% this month"
            trend="up"
            icon={<Truck className="w-6 h-6" />}
            color="green"
            onClick={() => setSelectedMetric("trucks")}
          />
          <MetricCard 
            title="Monthly Loads"
            value="6,100"
            change="+15% this month"
            trend="up"
            icon={<Package className="w-6 h-6" />}
            color="purple"
            onClick={() => setSelectedMetric("loads")}
          />
          <MetricCard 
            title="Platform Revenue"
            value="$245,000"
            change="+18% this month"
            trend="up"
            icon={<DollarSign className="w-6 h-6" />}
            color="orange"
            onClick={() => setSelectedMetric("revenue")}
          />
        </ChromaGrid>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Revenue */}
          <TradingChart
            title="Platform Revenue Growth"
            subtitle="Monthly revenue trend"
            data={platformStats}
            dataKey="revenue"
            color="blue"
            icon={<DollarSign className="w-5 h-5" />}
            stats={[
              { label: "Current", value: "$245,000", change: "+18%", trend: "up" },
              { label: "Average", value: "$189,000", change: "+12%", trend: "up" },
              { label: "Peak", value: "$245,000", change: "+25%", trend: "up" },
            ]}
            breakdown={[
              { label: "Commission Fees", value: "$185,000", percentage: "75.5%", change: "+$28,000" },
              { label: "Subscription", value: "$42,000", percentage: "17.1%", change: "+$6,000" },
              { label: "Premium Features", value: "$18,000", percentage: "7.4%", change: "+$3,000" },
            ]}
          />

          {/* User Distribution */}
          <TradingChart
            title="User Growth by Type"
            subtitle="Weekly user distribution"
            data={userGrowthData.map(item => ({ month: item.date, value: item.drivers }))}
            dataKey="value"
            color="green"
            icon={<Users className="w-5 h-5" />}
            stats={[
              { label: "Fleet Owners", value: "595", change: "+45", trend: "up" },
              { label: "Drivers", value: "2,150", change: "+230", trend: "up" },
              { label: "Shippers", value: "1,140", change: "+60", trend: "up" },
            ]}
            breakdown={[
              { label: "Fleet Owners", value: "595", percentage: "17.3%", change: "+45" },
              { label: "Drivers", value: "2,150", percentage: "62.4%", change: "+230" },
              { label: "Shippers", value: "1,140", percentage: "20.3%", change: "+60" },
            ]}
          />
        </div>

        {/* User Distribution Cards */}
        <ChromaGrid radius={350} columns={3} damping={0.45} fadeOut={0.6}>
          <UserDistributionCard
            title="Fleet Owners"
            value="595"
            change="+45 this month"
            icon={<Truck className="w-6 h-6" />}
            color="blue"
            onClick={() => setSelectedMetric("fleetOwners")}
          />
          <UserDistributionCard
            title="Active Drivers"
            value="2,150"
            change="+230 this month"
            icon={<Users className="w-6 h-6" />}
            color="green"
            onClick={() => setSelectedMetric("drivers")}
            showViewAll={true}
          />
          <UserDistributionCard
            title="Shippers"
            value="1,140"
            change="+60 this month"
            icon={<Package className="w-6 h-6" />}
            color="orange"
            onClick={() => setSelectedMetric("shippers")}
          />
        </ChromaGrid>

        {/* Top Fleet Owners */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Top Fleet Owners</h2>
            <button 
              onClick={() => alert('View all fleet owners')}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Company</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trucks</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Loads</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Growth</th>
                </tr>
              </thead>
              <tbody>
                {topFleetOwners.map((fleet, index) => (
                  <tr key={fleet.name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-gray-900">{fleet.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{fleet.trucks}</td>
                    <td className="py-3 px-4 text-gray-700">{fleet.loads.toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">${(fleet.revenue / 1000000).toFixed(2)}M</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-semibold">{fleet.growth}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.type === "user" ? "bg-blue-100" :
                  activity.type === "load" ? "bg-green-100" :
                  activity.type === "alert" ? "bg-red-100" :
                  "bg-purple-100"
                }`}>
                  {activity.type === "user" && <Users className="w-5 h-5 text-blue-600" />}
                  {activity.type === "load" && <Package className="w-5 h-5 text-green-600" />}
                  {activity.type === "alert" && <Shield className="w-5 h-5 text-red-600" />}
                  {activity.type === "payment" && <DollarSign className="w-5 h-5 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.user || activity.details}</div>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Detail Modals */}
      {selectedMetric && (
        <MetricDetailModal 
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
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <span>{change}</span>
          <span className="text-gray-400">• Updated now</span>
        </div>
      </div>
    </div>
  );
}

interface UserDistributionCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
  showViewAll?: boolean;
}

function UserDistributionCard({ title, value, change, icon, color, onClick, showViewAll }: UserDistributionCardProps) {
  const colorClasses = {
    blue: { 
      gradient: "from-blue-500 to-blue-700", 
      spotlight: "rgba(147, 197, 253, 0.5)",
      accent: "text-blue-200",
      border: "border-blue-400"
    },
    green: { 
      gradient: "from-green-500 to-green-700", 
      spotlight: "rgba(134, 239, 172, 0.5)",
      accent: "text-green-200",
      border: "border-green-400"
    },
    orange: { 
      gradient: "from-orange-500 to-orange-700", 
      spotlight: "rgba(253, 186, 116, 0.5)",
      accent: "text-orange-200",
      border: "border-orange-400"
    },
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
      className="chroma-card cursor-pointer"
      onClick={onClick}
      onMouseMove={handleCardMove}
      style={{
        '--spotlight-color': colorClasses.spotlight,
        background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`
      } as React.CSSProperties}
    >
      <div className={`bg-gradient-to-br ${colorClasses.gradient} rounded-xl p-6 text-white h-full relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              {icon}
            </div>
            <TrendingUp className={`w-5 h-5 ${colorClasses.accent}`} />
          </div>
          <div className="text-3xl font-bold mb-1">{value}</div>
          <div className="text-white/90 text-sm font-semibold mb-1">{title}</div>
          <div className={`text-xs ${colorClasses.accent}`}>{change}</div>
          {showViewAll && (
            <div className={`mt-4 pt-4 border-t ${colorClasses.border} text-center`}>
              <p className="text-xs text-white/90 font-semibold">Click to view details →</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


interface MetricDetailModalProps {
  metric: string;
  onClose: () => void;
}

function MetricDetailModal({ metric, onClose }: MetricDetailModalProps) {
  const [timeframe, setTimeframe] = useState("6M");
  
  const detailData = {
    users: {
      title: "Total Users",
      icon: <Users className="w-8 h-8" />,
      color: "blue",
      current: "3,445",
      data: [
        { month: "Jul", value: 2850 },
        { month: "Aug", value: 2920 },
        { month: "Sep", value: 3050 },
        { month: "Oct", value: 3180 },
        { month: "Nov", value: 3340 },
        { month: "Dec", value: 3445 },
      ],
      breakdown: [
        { label: "Fleet Owners", value: "595", percentage: "17.3%", change: "+45" },
        { label: "Drivers", value: "2,150", percentage: "62.4%", change: "+230" },
        { label: "Shippers", value: "700", percentage: "20.3%", change: "+60" },
      ],
    },
    trucks: {
      title: "Active Trucks",
      icon: <Truck className="w-8 h-8" />,
      color: "green",
      current: "15,240",
      data: [
        { month: "Jul", value: 13200 },
        { month: "Aug", value: 13650 },
        { month: "Sep", value: 14100 },
        { month: "Oct", value: 14520 },
        { month: "Nov", value: 14880 },
        { month: "Dec", value: 15240 },
      ],
      breakdown: [
        { label: "In Transit", value: "8,420", percentage: "55.2%", change: "+320" },
        { label: "Available", value: "5,180", percentage: "34.0%", change: "+180" },
        { label: "Maintenance", value: "1,640", percentage: "10.8%", change: "-50" },
      ],
    },
    loads: {
      title: "Monthly Loads",
      icon: <Package className="w-8 h-8" />,
      color: "purple",
      current: "6,100",
      data: [
        { month: "Jul", value: 4200 },
        { month: "Aug", value: 4580 },
        { month: "Sep", value: 4920 },
        { month: "Oct", value: 5280 },
        { month: "Nov", value: 5650 },
        { month: "Dec", value: 6100 },
      ],
      breakdown: [
        { label: "Completed", value: "5,420", percentage: "88.9%", change: "+680" },
        { label: "In Progress", value: "520", percentage: "8.5%", change: "+45" },
        { label: "Pending", value: "160", percentage: "2.6%", change: "+20" },
      ],
    },
    revenue: {
      title: "Platform Revenue",
      icon: <DollarSign className="w-8 h-8" />,
      color: "orange",
      current: "$245,000",
      data: [
        { month: "Jul", value: 168000 },
        { month: "Aug", value: 185000 },
        { month: "Sep", value: 198000 },
        { month: "Oct", value: 215000 },
        { month: "Nov", value: 228000 },
        { month: "Dec", value: 245000 },
      ],
      breakdown: [
        { label: "Commission Fees", value: "$185,000", percentage: "75.5%", change: "+$28,000" },
        { label: "Subscription", value: "$42,000", percentage: "17.1%", change: "+$6,000" },
        { label: "Premium Features", value: "$18,000", percentage: "7.4%", change: "+$3,000" },
      ],
    },
    fleetOwners: {
      title: "Fleet Owners",
      icon: <Truck className="w-8 h-8" />,
      color: "blue",
      current: "595",
      data: [
        { month: "Jul", value: 480 },
        { month: "Aug", value: 505 },
        { month: "Sep", value: 525 },
        { month: "Oct", value: 545 },
        { month: "Nov", value: 570 },
        { month: "Dec", value: 595 },
      ],
      breakdown: [
        { label: "Active (30+ days)", value: "485", percentage: "81.5%", change: "+38" },
        { label: "New (< 30 days)", value: "85", percentage: "14.3%", change: "+12" },
        { label: "Inactive", value: "25", percentage: "4.2%", change: "-5" },
      ],
    },
    drivers: {
      title: "Active Drivers",
      icon: <Users className="w-8 h-8" />,
      color: "green",
      current: "2,150",
      data: [
        { month: "Jul", value: 1650 },
        { month: "Aug", value: 1750 },
        { month: "Sep", value: 1850 },
        { month: "Oct", value: 1950 },
        { month: "Nov", value: 2050 },
        { month: "Dec", value: 2150 },
      ],
      breakdown: [
        { label: "Currently Driving", value: "1,280", percentage: "59.5%", change: "+145" },
        { label: "Available", value: "720", percentage: "33.5%", change: "+65" },
        { label: "Off Duty", value: "150", percentage: "7.0%", change: "+20" },
      ],
    },
    shippers: {
      title: "Shippers",
      icon: <Package className="w-8 h-8" />,
      color: "orange",
      current: "1,140",
      data: [
        { month: "Jul", value: 920 },
        { month: "Aug", value: 970 },
        { month: "Sep", value: 1010 },
        { month: "Oct", value: 1055 },
        { month: "Nov", value: 1095 },
        { month: "Dec", value: 1140 },
      ],
      breakdown: [
        { label: "Enterprise", value: "180", percentage: "15.8%", change: "+12" },
        { label: "Small Business", value: "685", percentage: "60.1%", change: "+38" },
        { label: "Individual", value: "275", percentage: "24.1%", change: "+10" },
      ],
    }
  };

  const data = detailData[metric as keyof typeof detailData];

  // Filter data based on timeframe
  const filteredData = useMemo(() => {
    const baseData = [...data.data];
    const latestValue = baseData[baseData.length - 1]?.value || 0;
    
    switch (timeframe) {
      case "1D":
        return Array.from({ length: 24 }, (_, i) => ({
          month: `${i}:00`,
          value: Math.round(latestValue * (0.95 + Math.random() * 0.1))
        }));
      case "1W":
        return Array.from({ length: 7 }, (_, i) => ({
          month: `Day ${i + 1}`,
          value: Math.round(latestValue * (0.92 + Math.random() * 0.16))
        }));
      case "1M":
        return Array.from({ length: 4 }, (_, i) => ({
          month: `Week ${i + 1}`,
          value: Math.round(latestValue * (0.88 + Math.random() * 0.24))
        }));
      case "3M":
        return baseData.slice(-3);
      case "6M":
        return baseData;
      case "1Y":
        const yearData = Array.from({ length: 12 }, (_, i) => {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const growthFactor = 0.7 + (i / 12) * 0.6;
          return {
            month: monthNames[i],
            value: Math.round(latestValue * growthFactor * (0.9 + Math.random() * 0.2))
          };
        });
        return yearData;
      default:
        return baseData;
    }
  }, [data.data, timeframe]);

  const currentValue = filteredData[filteredData.length - 1]?.value || 0;
  const previousValue = filteredData[0]?.value || 0;
  const change = currentValue - previousValue;
  const changePercent = previousValue !== 0 ? ((change / previousValue) * 100).toFixed(2) : "0.00";
  const isPositive = change >= 0;

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
              <div className="flex items-center gap-2 mt-1">
                <p className="text-3xl font-bold text-white">{currentValue.toLocaleString()}</p>
                <div className={`flex items-center gap-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm font-semibold">{isPositive ? "+" : ""}{change.toLocaleString()} ({changePercent}%)</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-slate-700 flex items-center justify-center transition text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Timeframe Selector */}
        <div className="px-6 py-4 border-b border-slate-700">
          <div className="flex gap-2">
            {["1D", "1W", "1M", "3M", "6M", "1Y"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  timeframe === tf
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Chart */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Trend Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={filteredData}>
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
