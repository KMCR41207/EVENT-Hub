import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Truck, User, Lock, Eye, EyeOff, Copy, Check } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load users from localStorage on component mount
  useEffect(() => {
    // Default users - these should NEVER be overwritten
    const defaultUsers = {
      "ADMIN001": { role: "admin", password: "admin123", name: "Admin User" },
      "FO001": { role: "fleet-owner", password: "fleet123", name: "Swift Logistics" },
      "FO002": { role: "fleet-owner", password: "fleet123", name: "Fleet Owner 2" },
      "DR001": { role: "driver", password: "driver123", name: "Michael Rodriguez" },
      "DR002": { role: "driver", password: "driver123", name: "Driver 2" },
      "SH001": { role: "shipper", password: "shipper123", name: "Global Shippers" },
      "SH002": { role: "shipper", password: "shipper123", name: "Shipper 2" },
    };

    console.log("=== LOADING USERS ===");
    console.log("Default users:", defaultUsers);

    try {
      let userMap: any = {};
      const savedUsers = localStorage.getItem('logistix_users');

      // Always start with default users
      Object.entries(defaultUsers).forEach(([id, data]) => {
        userMap[id] = { ...data };
      });

      // Then override with any saved users from localStorage
      if (savedUsers) {
        try {
          const userList = JSON.parse(savedUsers);
          console.log("Loaded from localStorage:", userList);
          
          const roleMap: any = {
            "Admin": "admin",
            "Fleet Owner": "fleet-owner",
            "Driver": "driver",
            "Shipper": "shipper",
          };
          
          // Process all users from localStorage
          userList.forEach((user: any) => {
            // Skip if no password is defined
            if (!user.password) {
              console.warn(`User ${user.id} has no password, skipping`);
              return;
            }
            
            let roleValue = user.role;
            if (roleMap[user.role]) {
              roleValue = roleMap[user.role];
            } else if (typeof user.role === 'string') {
              roleValue = user.role.toLowerCase().replace(/\s+/g, '-');
            }
            
            userMap[user.id] = { 
              role: roleValue, 
              password: user.password,
              name: user.name 
            };
          });
        } catch (e) {
          console.error("Error parsing saved users, using defaults");
        }
      }

      // Always ensure default users are saved to localStorage with passwords
      const defaultUsersList = Object.entries(defaultUsers).map(([id, data]) => ({
        id,
        name: data.name,
        role: data.role === "fleet-owner" ? "Fleet Owner" : 
              data.role === "driver" ? "Driver" : 
              data.role === "shipper" ? "Shipper" : "Admin",
        password: data.password,
        status: "active",
        joinDate: new Date().toISOString().split('T')[0]
      }));
      
      if (!savedUsers) {
        localStorage.setItem('logistix_users', JSON.stringify(defaultUsersList));
        console.log("✓ Saved default users to localStorage");
      } else {
        // Merge with existing users, ensuring default users always have passwords
        const existingUsers = JSON.parse(savedUsers);
        const mergedUsers = [...defaultUsersList];
        
        existingUsers.forEach((user: any) => {
          // Only add if not a default user and has a password
          if (!defaultUsers[user.id as keyof typeof defaultUsers] && user.password) {
            mergedUsers.push(user);
          }
        });
        
        localStorage.setItem('logistix_users', JSON.stringify(mergedUsers));
        console.log("✓ Merged and saved users to localStorage");
      }

      console.log("Final users map:", userMap);
      setUsers(userMap);
    } catch (e) {
      console.error("Error loading users:", e);
      setUsers(defaultUsers);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network request
    setTimeout(() => {
      if (Object.keys(users).length === 0) {
        setError("System loading, please try again");
        setIsLoading(false);
        return;
      }

      const normalizedUserId = userId.trim().toUpperCase();
      const user = users[normalizedUserId as keyof typeof users];
      
      if (!user) {
        setError(`User ID not found: ${normalizedUserId}`);
        setIsLoading(false);
        return;
      }

      const enteredPassword = password.trim();
      const storedPassword = user.password;

      console.log("=== LOGIN ===");
      console.log("ID:", normalizedUserId);
      console.log("Stored pass:", storedPassword);
      console.log("Entered pass:", enteredPassword);
      
      // Check if password exists
      if (!storedPassword) {
        console.error("No password stored for this user!");
        setError("Account configuration error. Please contact administrator.");
        setIsLoading(false);
        return;
      }
      
      console.log("Match:", storedPassword === enteredPassword);
      console.log("Stored length:", storedPassword.length);
      console.log("Entered length:", enteredPassword.length);

      if (storedPassword !== enteredPassword) {
        console.error("Password mismatch!");
        console.error("Stored:", JSON.stringify(storedPassword));
        console.error("Entered:", JSON.stringify(enteredPassword));
        setError("Invalid Password");
        setIsLoading(false);
        return;
      }

      console.log("✓ Login successful!");
      sessionStorage.setItem('currentUserId', normalizedUserId);
      sessionStorage.setItem('currentUserName', user.name);
      
      // Normalize role to lowercase with hyphens
      let normalizedRole = user.role;
      if (typeof normalizedRole === 'string') {
        normalizedRole = normalizedRole.toLowerCase().replace(/\s+/g, '-');
      }
      
      setIsLoading(false);
      navigate(`/${normalizedRole}`);
    }, 500);
  };

  const copyCredentials = (userId: string, password: string) => {
    const credentials = `ID: ${userId} | Pass: ${password}`;
    navigator.clipboard.writeText(credentials);
    setCopiedId(userId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userId && password && !isLoading) {
      handleLogin(e as any);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/login-background.jpg" 
          alt="Login Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-4 mb-4 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg">
            <img 
              src="/logo.png" 
              alt="Logistix Logo" 
              className="w-20 h-20 object-contain"
            />
            <div className="text-left">
              <div className="text-4xl font-bold text-gray-900">Logistix</div>
              <div className="text-base text-gray-600 font-semibold">by SVLT</div>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In to Your Account</h2>
          
          <form onSubmit={handleLogin} className="space-y-5">
            {/* User ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.toUpperCase())}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your User ID"
                  required
                  aria-label="User ID"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  required
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <button 
                onClick={() => copyCredentials('ADMIN001', 'admin123')}
                className="bg-gray-50 p-2 rounded hover:bg-gray-100 transition text-left group"
              >
                <div className="font-semibold flex items-center justify-between">
                  Admin
                  <span className="opacity-0 group-hover:opacity-100 transition">
                    {copiedId === 'ADMIN001' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </span>
                </div>
                <div>ID: ADMIN001</div>
                <div className="text-gray-400">Pass: admin123</div>
              </button>
              <button 
                onClick={() => copyCredentials('FO001', 'fleet123')}
                className="bg-gray-50 p-2 rounded hover:bg-gray-100 transition text-left group"
              >
                <div className="font-semibold flex items-center justify-between">
                  Fleet Owner
                  <span className="opacity-0 group-hover:opacity-100 transition">
                    {copiedId === 'FO001' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </span>
                </div>
                <div>ID: FO001</div>
                <div className="text-gray-400">Pass: fleet123</div>
              </button>
              <button 
                onClick={() => copyCredentials('DR001', 'driver123')}
                className="bg-gray-50 p-2 rounded hover:bg-gray-100 transition text-left group"
              >
                <div className="font-semibold flex items-center justify-between">
                  Driver
                  <span className="opacity-0 group-hover:opacity-100 transition">
                    {copiedId === 'DR001' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </span>
                </div>
                <div>ID: DR001</div>
                <div className="text-gray-400">Pass: driver123</div>
              </button>
              <button 
                onClick={() => copyCredentials('SH001', 'shipper123')}
                className="bg-gray-50 p-2 rounded hover:bg-gray-100 transition text-left group"
              >
                <div className="font-semibold flex items-center justify-between">
                  Shipper
                  <span className="opacity-0 group-hover:opacity-100 transition">
                    {copiedId === 'SH001' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </span>
                </div>
                <div>ID: SH001</div>
                <div className="text-gray-400">Pass: shipper123</div>
              </button>
            </div>
          </div>

          {/* Admin Note */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Only Admin can create new user IDs. Contact your administrator for account creation.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button 
            onClick={() => navigate("/")}
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}