import { DashboardLayout } from "../components/DashboardLayout";
import { useState, useEffect } from "react";
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  DollarSign,
  Filter,
  Search,
  Eye,
  Phone,
  Mail,
  User,
  Navigation,
  AlertCircle,
  TrendingUp,
  Download,
  X,
  ChevronDown,
  ChevronRight,
  Radio,
  Zap
} from "lucide-react";

// Sample shipment data - will be replaced with localStorage data
const sampleShipments = [
  {
    id: "LD-8825",
    origin: "Los Angeles, CA",
    destination: "Phoenix, AZ",
    status: "in-transit",
    progress: 65,
    pickup: "Nov 1, 2:00 PM",
    delivery: "Nov 2, 10:00 AM",
    rate: 1250,
    cargoType: "Electronics",
    weight: "24,000 lbs",
    fleetOwner: "James Anderson",
    driver: "John Martinez",
    truck: "TRK-2401",
    postedDate: "Oct 30, 2024",
    acceptedDate: "Oct 31, 2024",
    eta: "2 hours 15 min"
  },
  {
    id: "LD-8824",
    origin: "San Diego, CA",
    destination: "Las Vegas, NV",
    status: "pending",
    progress: 0,
    pickup: "Nov 5, 9:00 AM",
    delivery: "Nov 5, 6:00 PM",
    rate: 980,
    cargoType: "Furniture",
    weight: "18,500 lbs",
    postedDate: "Nov 1, 2024"
  },
  {
    id: "LD-8823",
    origin: "Seattle, WA",
    destination: "Portland, OR",
    status: "delivered",
    progress: 100,
    pickup: "Oct 28, 8:00 AM",
    delivery: "Oct 28, 4:00 PM",
    rate: 750,
    cargoType: "Medical Supplies",
    weight: "8,500 lbs",
    fleetOwner: "James Anderson",
    driver: "Sarah Johnson",
    truck: "TRK-2398",
    postedDate: "Oct 26, 2024",
    acceptedDate: "Oct 27, 2024",
    deliveredDate: "Oct 28, 2024",
    rating: 5
  },
  {
    id: "LD-8822",
    origin: "Miami, FL",
    destination: "Orlando, FL",
    status: "cancelled",
    progress: 0,
    pickup: "Oct 25, 10:00 AM",
    delivery: "Oct 25, 6:00 PM",
    rate: 650,
    cargoType: "Construction Materials",
    weight: "32,000 lbs",
    postedDate: "Oct 23, 2024",
    cancelledDate: "Oct 24, 2024",
    cancelReason: "Shipper request"
  }
];

export function MyShipments() {
  const currentUserId = sessionStorage.getItem('currentUserId') || 'SH001';
  const currentUserName = sessionStorage.getItem('currentUserName') || 'Jennifer Chen';
  const [shipments, setShipments] = useState<any[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    // Load shipments from localStorage
    const loadsData = localStorage.getItem('posted_loads');
    if (loadsData) {
      const loads = JSON.parse(loadsData);
      const userLoads = loads.filter((load: any) => load.shipperId === currentUserId);
      setShipments([...sampleShipments, ...userLoads]);
      setFilteredShipments([...sampleShipments, ...userLoads]);
    } else {
      setShipments(sampleShipments);
      setFilteredShipments(sampleShipments);
    }
  }, [currentUserId]);

  useEffect(() => {
    let filtered = shipments;

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(s => s.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.cargoType?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredShipments(filtered);
  }, [selectedStatus, searchQuery, shipments]);

  const statusCounts = {
    all: shipments.length,
    pending: shipments.filter(s => s.status === "pending").length,
    "in-transit": shipments.filter(s => s.status === "in-transit").length,
    delivered: shipments.filter(s => s.status === "delivered").length,
    cancelled: shipments.filter(s => s.status === "cancelled").length
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      "pending": { bg: "bg-orange-100", text: "text-orange-700", label: "Pending" },
      "in-transit": { bg: "bg-blue-100", text: "text-blue-700", label: "In Transit" },
      "delivered": { bg: "bg-green-100", text: "text-green-700", label: "Delivered" },
      "cancelled": { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" }
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <span className={`px-3 py-1 ${badge.bg} ${badge.text} rounded-full text-xs font-semibold`}>
        {badge.label}
      </span>
    );
  };

  const handleViewDetails = (shipment: any) => {
    setSelectedShipment(shipment);
    setIsDetailOpen(true);
  };

  return (
    <DashboardLayout role="shipper" userName={currentUserName} userId={currentUserId}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Shipments</h1>
            <p className="text-gray-600 mt-1">Track and manage all your shipments</p>
          </div>
          <button 
            onClick={() => window.location.href = '/shipper/post'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-600/30"
          >
            <Package className="w-5 h-5" />
            Post New Load
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard
            label="All Shipments"
            value={statusCounts.all}
            icon={<Package className="w-5 h-5" />}
            color="gray"
            active={selectedStatus === "all"}
            onClick={() => setSelectedStatus("all")}
          />
          <StatCard
            label="Pending"
            value={statusCounts.pending}
            icon={<Clock className="w-5 h-5" />}
            color="orange"
            active={selectedStatus === "pending"}
            onClick={() => setSelectedStatus("pending")}
          />
          <StatCard
            label="In Transit"
            value={statusCounts["in-transit"]}
            icon={<Truck className="w-5 h-5" />}
            color="blue"
            active={selectedStatus === "in-transit"}
            onClick={() => setSelectedStatus("in-transit")}
          />
          <StatCard
            label="Delivered"
            value={statusCounts.delivered}
            icon={<CheckCircle className="w-5 h-5" />}
            color="green"
            active={selectedStatus === "delivered"}
            onClick={() => setSelectedStatus("delivered")}
          />
          <StatCard
            label="Cancelled"
            value={statusCounts.cancelled}
            icon={<XCircle className="w-5 h-5" />}
            color="red"
            active={selectedStatus === "cancelled"}
            onClick={() => setSelectedStatus("cancelled")}
          />
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Load ID, location, or cargo type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2">
              <Filter className="w-5 h-5" />
              More Filters
            </button>
          </div>
        </div>

        {/* Shipments List */}
        <div className="space-y-4">
          {filteredShipments.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No shipments found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          ) : (
            filteredShipments.map((shipment) => (
              <ShipmentCard
                key={shipment.id}
                shipment={shipment}
                onViewDetails={handleViewDetails}
                getStatusBadge={getStatusBadge}
              />
            ))
          )}
        </div>
      </div>

      {/* Shipment Detail Modal */}
      {isDetailOpen && selectedShipment && (
        <ShipmentDetailModal
          shipment={selectedShipment}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedShipment(null);
          }}
          getStatusBadge={getStatusBadge}
        />
      )}
    </DashboardLayout>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  active: boolean;
  onClick: () => void;
}

function StatCard({ label, value, icon, color, active, onClick }: StatCardProps) {
  const colors = {
    gray: { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300", activeBg: "bg-gray-600", activeText: "text-white" },
    orange: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-300", activeBg: "bg-orange-600", activeText: "text-white" },
    blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-300", activeBg: "bg-blue-600", activeText: "text-white" },
    green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-300", activeBg: "bg-green-600", activeText: "text-white" },
    red: { bg: "bg-red-100", text: "text-red-600", border: "border-red-300", activeBg: "bg-red-600", activeText: "text-white" }
  };

  const colorScheme = colors[color as keyof typeof colors];

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
        active 
          ? `${colorScheme.activeBg} ${colorScheme.activeText} border-transparent shadow-lg` 
          : `bg-white ${colorScheme.border} hover:border-${color}-400`
      }`}
    >
      <div className={`flex items-center justify-center w-10 h-10 rounded-lg mb-3 mx-auto ${
        active ? 'bg-white/20' : colorScheme.bg
      }`}>
        <div className={active ? 'text-white' : colorScheme.text}>
          {icon}
        </div>
      </div>
      <div className={`text-2xl font-bold mb-1 ${active ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </div>
      <div className={`text-sm font-semibold ${active ? 'text-white/90' : 'text-gray-600'}`}>
        {label}
      </div>
    </button>
  );
}

interface ShipmentCardProps {
  shipment: any;
  onViewDetails: (shipment: any) => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

function ShipmentCard({ shipment, onViewDetails, getStatusBadge }: ShipmentCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
      {/* Main Card Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{shipment.id}</h3>
              {getStatusBadge(shipment.status)}
              {shipment.status === "in-transit" && shipment.eta && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  ETA: {shipment.eta}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{shipment.origin}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium">{shipment.destination}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Posted: {shipment.postedDate}
              </span>
              {shipment.acceptedDate && (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Accepted: {shipment.acceptedDate}
                </span>
              )}
            </div>
          </div>
          <div className="text-right ml-4">
            <div className="text-3xl font-bold text-green-600">${shipment.rate}</div>
            <div className="text-sm text-gray-500">Total Rate</div>
          </div>
        </div>

        {/* Progress Bar for In-Transit */}
        {shipment.status === "in-transit" && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Delivery Progress</span>
              <span className="font-semibold">{shipment.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-3 transition-all duration-300"
                style={{ width: `${shipment.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
          <div>
            <div className="text-xs text-gray-500 mb-1">Cargo Type</div>
            <div className="text-sm font-semibold text-gray-900">{shipment.cargoType}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Weight</div>
            <div className="text-sm font-semibold text-gray-900">{shipment.weight}</div>
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

        {/* Expandable Section */}
        {(shipment.fleetOwner || shipment.driver) && (
          <div className="mb-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              {expanded ? "Hide" : "Show"} Assignment Details
            </button>
            
            {expanded && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                {shipment.fleetOwner && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Fleet Owner</div>
                    <div className="font-semibold text-gray-900">{shipment.fleetOwner}</div>
                  </div>
                )}
                {shipment.driver && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Driver</div>
                    <div className="font-semibold text-gray-900">{shipment.driver}</div>
                  </div>
                )}
                {shipment.truck && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Truck ID</div>
                    <div className="font-semibold text-blue-600">{shipment.truck}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onViewDetails(shipment)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          {shipment.status === "in-transit" && (
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Track
            </button>
          )}
          {shipment.driver && (
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact
            </button>
          )}
        </div>
      </div>

      {/* Status-specific Footer */}
      {shipment.status === "delivered" && shipment.rating && (
        <div className="bg-green-50 px-6 py-3 border-t border-green-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">
                Delivered on {shipment.deliveredDate}
              </span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: shipment.rating }).map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      )}
      {shipment.status === "cancelled" && (
        <div className="bg-red-50 px-6 py-3 border-t border-red-100">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-semibold text-red-800">
              Cancelled on {shipment.cancelledDate}
            </span>
            {shipment.cancelReason && (
              <span className="text-sm text-red-600">- {shipment.cancelReason}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ShipmentDetailModalProps {
  shipment: any;
  onClose: () => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

function ShipmentDetailModal({ shipment, onClose, getStatusBadge }: ShipmentDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{shipment.id}</h2>
              <p className="text-blue-100 text-sm mt-1">Complete Shipment Details</p>
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
          {/* Status Section */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">Current Status:</div>
              {getStatusBadge(shipment.status)}
            </div>
            {shipment.status === "in-transit" && shipment.eta && (
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <Clock className="w-5 h-5" />
                ETA: {shipment.eta}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {shipment.status === "in-transit" && (
            <div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span className="font-semibold">Delivery Progress</span>
                <span className="font-bold text-blue-600">{shipment.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-4 transition-all duration-300 flex items-center justify-end pr-2"
                  style={{ width: `${shipment.progress}%` }}
                >
                  {shipment.progress > 10 && (
                    <Truck className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Route Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Route Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 mb-1 font-semibold">Origin</div>
                <div className="font-bold text-gray-900">{shipment.origin}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 mb-1 font-semibold">Destination</div>
                <div className="font-bold text-gray-900">{shipment.destination}</div>
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
                <div className="text-sm text-gray-600 mb-1">Pickup Time</div>
                <div className="font-semibold text-gray-900">{shipment.pickup}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Delivery Time</div>
                <div className="font-semibold text-gray-900">{shipment.delivery}</div>
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
                <div className="font-semibold text-gray-900">{shipment.cargoType}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Weight</div>
                <div className="font-semibold text-gray-900">{shipment.weight}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 col-span-2">
                <div className="text-sm text-green-600 mb-1 font-semibold">Total Rate</div>
                <div className="text-3xl font-bold text-green-700">${shipment.rate}</div>
              </div>
            </div>
          </div>

          {/* Assignment Details */}
          {(shipment.fleetOwner || shipment.driver) && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-600" />
                Assignment Details
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {shipment.fleetOwner && (
                    <div>
                      <div className="text-sm text-blue-600 mb-1 font-semibold">Fleet Owner</div>
                      <div className="font-bold text-blue-900">{shipment.fleetOwner}</div>
                    </div>
                  )}
                  {shipment.driver && (
                    <div>
                      <div className="text-sm text-blue-600 mb-1 font-semibold">Driver</div>
                      <div className="font-bold text-blue-900">{shipment.driver}</div>
                    </div>
                  )}
                  {shipment.truck && (
                    <div>
                      <div className="text-sm text-blue-600 mb-1 font-semibold">Truck ID</div>
                      <div className="font-bold text-blue-900">{shipment.truck}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Shipment Timeline
            </h3>
            <div className="space-y-3">
              <TimelineItem
                icon={<Package className="w-4 h-4" />}
                label="Load Posted"
                date={shipment.postedDate}
                completed={true}
              />
              {shipment.acceptedDate && (
                <TimelineItem
                  icon={<CheckCircle className="w-4 h-4" />}
                  label="Accepted by Fleet Owner"
                  date={shipment.acceptedDate}
                  completed={true}
                />
              )}
              {shipment.status === "in-transit" && (
                <TimelineItem
                  icon={<Truck className="w-4 h-4" />}
                  label="In Transit"
                  date="Current"
                  completed={false}
                  active={true}
                />
              )}
              {shipment.deliveredDate && (
                <TimelineItem
                  icon={<CheckCircle className="w-4 h-4" />}
                  label="Delivered"
                  date={shipment.deliveredDate}
                  completed={true}
                />
              )}
              {shipment.cancelledDate && (
                <TimelineItem
                  icon={<XCircle className="w-4 h-4" />}
                  label="Cancelled"
                  date={shipment.cancelledDate}
                  completed={true}
                  cancelled={true}
                />
              )}
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
            {shipment.status === "in-transit" && (
              <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                <Navigation className="w-5 h-5" />
                Track Shipment
              </button>
            )}
            {shipment.driver && (
              <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Driver
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TimelineItemProps {
  icon: React.ReactNode;
  label: string;
  date: string;
  completed: boolean;
  active?: boolean;
  cancelled?: boolean;
}

function TimelineItem({ icon, label, date, completed, active, cancelled }: TimelineItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        cancelled ? 'bg-red-100 text-red-600' :
        active ? 'bg-blue-100 text-blue-600 animate-pulse' :
        completed ? 'bg-green-100 text-green-600' :
        'bg-gray-100 text-gray-400'
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className={`font-semibold ${
          cancelled ? 'text-red-900' :
          active ? 'text-blue-900' :
          completed ? 'text-gray-900' :
          'text-gray-500'
        }`}>
          {label}
        </div>
        <div className="text-sm text-gray-500">{date}</div>
      </div>
      {completed && !cancelled && (
        <CheckCircle className="w-5 h-5 text-green-600" />
      )}
      {active && (
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
      )}
    </div>
  );
}
