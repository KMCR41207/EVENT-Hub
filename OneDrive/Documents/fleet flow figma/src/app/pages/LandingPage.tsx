import { useState } from "react";
import { useNavigate } from "react-router";
import { Truck, Package, Users, TrendingUp, MapPin, DollarSign, Shield, Zap, X } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import BlurText from "../components/BlurText";

export function LandingPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="Logistix Logo" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <div className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Logistix 
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">v2.1</span>
                </div>
                <div className="text-xs text-gray-500">by SVLT</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition">About</a>
              <button 
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/hero-background.jpg" 
            alt="Logistics Background"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Subtle dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <BlurText
              text="The Future of Freight Logistics"
              delay={150}
              animateBy="words"
              direction="top"
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            />
            <BlurText
              text="Connect shippers, fleet owners, and drivers in one powerful platform. Streamline operations, maximize profits, and scale your logistics business."
              delay={100}
              animateBy="words"
              direction="top"
              className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed"
            />
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate("/login")}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition text-lg shadow-xl hover:shadow-2xl hover:scale-105 transform"
              >
                User Login
              </button>
              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition text-lg backdrop-blur-sm"
              >
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-gray-600">Fleet Owners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">15,000+</div>
              <div className="text-gray-600">Active Trucks</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Loads Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$120M+</div>
              <div className="text-gray-600">Revenue Tracked</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fleet Flow – Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your logistics operations efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Package className="w-8 h-8" />}
              title="Load Marketplace"
              description="Shippers can post loads with full details such as pickup location, delivery destination, cargo type, and payment. Truck drivers and fleet owners can browse and accept available loads."
              color="blue"
            />
            <FeatureCard 
              icon={<TrendingUp className="w-8 h-8" />}
              title="Fleet Management Dashboard"
              description="Fleet owners can manage their entire fleet from one dashboard and monitor truck activity in real time. See which trucks are running, which drivers are assigned, current load on each truck, and fleet performance."
              color="green"
            />
            <FeatureCard 
              icon={<MapPin className="w-8 h-8" />}
              title="Real-Time Truck Tracking"
              description="Fleet owners can track truck locations on a map and know exactly where their vehicles are during a delivery."
              color="purple"
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8" />}
              title="Driver Management"
              description="Fleet owners can assign drivers to trucks and monitor their activity and performance."
              color="orange"
            />
            <FeatureCard 
              icon={<DollarSign className="w-8 h-8" />}
              title="Revenue & Profit Tracking"
              description="Fleet Flow automatically tracks revenue from each load, profit per truck, and total fleet earnings. This helps owners understand business performance."
              color="indigo"
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8" />}
              title="Load Details Transparency"
              description="All load information is clearly displayed including pickup location, delivery location, cargo details, payment amount, and delivery schedule."
              color="pink"
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8" />}
              title="Smart Notifications"
              description="Users receive alerts when new loads are posted, jobs are accepted, deliveries are completed, and trucks start or finish trips."
              color="blue"
            />
            <FeatureCard 
              icon={<Truck className="w-8 h-8" />}
              title="Easy Job Selection"
              description="Truck drivers can easily browse available loads and select the jobs that match their route and schedule."
              color="green"
            />
            <FeatureCard 
              icon={<TrendingUp className="w-8 h-8" />}
              title="Business Insights"
              description="Fleet Flow provides analytics to help fleet owners improve efficiency and maximize profits."
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* Platform Users */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Every Stakeholder</h2>
            <p className="text-xl text-gray-600">Tailored experiences for each role in the logistics ecosystem</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div 
              onClick={() => setSelectedRole('fleet-owner')}
              className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-xl hover:scale-105 transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Fleet Owners</h3>
              <p className="text-gray-600 mb-6">Comprehensive fleet management with analytics, profit tracking, and operational insights.</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Manage trucks & drivers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Track revenue & costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Real-time GPS monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Profit per truck analytics</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-blue-600 font-semibold">Click to learn more →</p>
            </div>

            <div 
              onClick={() => setSelectedRole('driver')}
              className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-xl hover:scale-105 transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Drivers</h3>
              <p className="text-gray-600 mb-6">Simple interface to view assigned loads, update delivery status, and track earnings.</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">View assigned jobs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Accept/reject loads</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Update delivery status</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Track payment details</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-blue-600 font-semibold">Click to learn more →</p>
            </div>

            <div 
              onClick={() => setSelectedRole('shipper')}
              className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-xl hover:scale-105 transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Shippers</h3>
              <p className="text-gray-600 mb-6">Post loads, track shipments, and get matched with reliable fleet owners instantly.</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Post load details</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">View load status</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Track shipments</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Rate & review drivers</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-blue-600 font-semibold">Click to learn more →</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 text-white overflow-hidden bg-gray-900">
        {/* Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/fleet-flow-video.mp4" type="video/mp4" />
        </video>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Shield className="w-16 h-16 mx-auto mb-6 drop-shadow-lg" />
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Ready to Transform Your Logistics?</h2>
          <p className="text-xl mb-8 text-white drop-shadow-md">
            Join thousands of fleet owners, drivers, and shippers already using Logistix
          </p>
          <button 
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition text-lg shadow-xl"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/logo.png" 
                  alt="Logistix Logo" 
                  className="w-10 h-10 object-contain"
                />
                <span className="text-white font-bold">Logistix</span>
              </div>
              <p className="text-sm">by SVLT</p>
              <p className="text-xs text-gray-500 mt-1">K.Mani Charan Reddy</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><button onClick={() => setIsVideoModalOpen(true)} className="hover:text-white transition text-left">Demo</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2026 Logistix by SVLT. All rights reserved.</p>
            <p className="text-xs text-gray-500 mt-2">Developed by K.Mani Charan Reddy</p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" 
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button 
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition"
            >
              <X className="w-8 h-8" />
            </button>
            
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
              <video 
                controls 
                autoPlay
                className="w-full h-auto"
              >
                <source src="/fleet-flow-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Fleet Owner Detail Modal */}
      {selectedRole === 'fleet-owner' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedRole(null)}>
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Background Image */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <img 
                src="/fleet-owner-bg.jpg" 
                alt="Fleet Owner Background"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-white/50"></div>
            </div>

            {/* Content */}
            <div className="relative rounded-2xl shadow-2xl p-8">
              {/* Close Button */}
              <button 
                onClick={() => setSelectedRole(null)}
                className="absolute top-4 right-4 p-2 bg-white hover:bg-gray-100 rounded-full transition shadow-lg z-10"
              >
                <X className="w-6 h-6 text-gray-900" />
              </button>

              <h2 className="text-4xl font-bold text-gray-900 mb-4 drop-shadow-lg">Fleet Owner Dashboard</h2>
              <p className="text-xl text-gray-600 mb-8 drop-shadow-md">Complete control over your logistics operations</p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Core Functions */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 drop-shadow-md">Core Functions</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Truck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Truck Management</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">Add, edit, and monitor all trucks in your fleet with detailed specifications</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Driver Management</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">Manage driver profiles, assignments, and performance tracking</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Package className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Load Assignment</h4>
                        <p className="text-sm text-gray-600">View available loads and assign them to your trucks and drivers</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Real-Time GPS Tracking</h4>
                        <p className="text-sm text-gray-600">Monitor truck locations and routes in real-time</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Analytics & Reporting */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Analytics & Reporting</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <DollarSign className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Revenue Tracking</h4>
                        <p className="text-sm text-gray-600">Monitor total revenue, monthly trends, and per-truck earnings</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Profit Analytics</h4>
                        <p className="text-sm text-gray-600">Calculate net profit per truck after deducting all costs</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Package className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Cost Management</h4>
                        <p className="text-sm text-gray-600">Track fuel costs, maintenance expenses, and driver wages</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Performance Metrics</h4>
                        <p className="text-sm text-gray-600">View detailed analytics on fleet performance and efficiency</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8 text-center">
                <button 
                  onClick={() => {
                    setSelectedRole(null);
                    navigate("/login");
                  }}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-lg shadow-xl"
                >
                  Get Started as Fleet Owner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Driver Detail Modal */}
      {selectedRole === 'driver' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedRole(null)}>
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Background Image */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <img 
                src="/driver-background.jpg" 
                alt="Driver Background"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-white/50"></div>
            </div>

            {/* Content */}
            <div className="relative rounded-2xl shadow-2xl p-8">
              {/* Close Button */}
              <button 
                onClick={() => setSelectedRole(null)}
                className="absolute top-4 right-4 p-2 bg-white hover:bg-gray-100 rounded-full transition shadow-lg z-10"
              >
                <X className="w-6 h-6 text-gray-900" />
              </button>

              <h2 className="text-4xl font-bold text-gray-900 mb-4 drop-shadow-lg">Driver Dashboard</h2>
              <p className="text-xl text-gray-600 mb-8 drop-shadow-md">Your personal command center for deliveries</p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Job Management */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 drop-shadow-md">Job Management</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Package className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">View Assigned Loads</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">See all loads assigned to you with pickup and delivery details</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Truck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Accept/Reject Jobs</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">Review job details and accept or decline assignments</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Update Delivery Status</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">Mark loads as picked up, in transit, or delivered</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Route Navigation</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">Get optimized routes and turn-by-turn directions</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Earnings & Performance */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 drop-shadow-md">Earnings & Performance</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <DollarSign className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Track Earnings</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">View your earnings per load and total monthly income</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Performance Metrics</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">Monitor your delivery success rate and ratings</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Package className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Trip History</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">Access complete history of all completed deliveries</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <DollarSign className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Payment Details</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">View payment status and transaction history</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8 text-center">
                <button 
                  onClick={() => {
                    setSelectedRole(null);
                    navigate("/login");
                  }}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-lg shadow-xl"
                >
                  Get Started as Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipper Detail Modal */}
      {selectedRole === 'shipper' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedRole(null)}>
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Background Image */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <img 
                src="/shipper-background.png" 
                alt="Shipper Background"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-white/50"></div>
            </div>

            {/* Content */}
            <div className="relative rounded-2xl shadow-2xl p-8">
              {/* Close Button */}
              <button 
                onClick={() => setSelectedRole(null)}
                className="absolute top-4 right-4 p-2 bg-white hover:bg-gray-100 rounded-full transition shadow-lg z-10"
              >
                <X className="w-6 h-6 text-gray-900" />
              </button>

              <h2 className="text-4xl font-bold text-gray-900 mb-4 drop-shadow-lg">Shipper Dashboard</h2>
              <p className="text-xl text-gray-600 mb-8 drop-shadow-md">Streamline your shipping operations</p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Load Management */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 drop-shadow-md">Load Management</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Package className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Post Loads</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">Create detailed load postings with pickup/delivery locations and pricing</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Match with Fleet Owners</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">Get matched with reliable fleet owners instantly</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Track Shipments</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">Real-time tracking of all your shipments in transit</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Package className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Load Status Updates</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">Get notified of pickup, transit, and delivery milestones</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Analytics & Reviews */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 drop-shadow-md">Analytics & Reviews</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Shipment Analytics</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">View statistics on delivery times and success rates</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <DollarSign className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Cost Management</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">Track shipping costs and optimize your logistics budget</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Rate Drivers</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">Provide feedback and ratings for completed deliveries</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 drop-shadow-sm">Reliable Network</h4>
                        <p className="text-sm text-gray-600 drop-shadow-sm">Access verified fleet owners and drivers only</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8 text-center">
                <button 
                  onClick={() => {
                    setSelectedRole(null);
                    navigate("/login");
                  }}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-lg shadow-xl"
                >
                  Get Started as Shipper
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    indigo: "bg-indigo-100 text-indigo-600",
    pink: "bg-pink-100 text-pink-600",
  }[color];

  // Mark Smart Notifications as new feature
  const isNewFeature = title === "Smart Notifications";

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition relative group">
      {isNewFeature && (
        <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          NEW
        </div>
      )}
      <div className={`w-16 h-16 rounded-lg ${colorClasses} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition">
        <p className="text-xs text-blue-600 font-semibold">Available Now →</p>
      </div>
    </div>
  );
}

interface UserTypeCardProps {
  title: string;
  description: string;
  features: string[];
  onClick: () => void;
}

function UserTypeCard({ title, description, features, onClick }: UserTypeCardProps) {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-xl transition">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <button 
        onClick={onClick}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
      >
        Get Started
      </button>
    </div>
  );
}