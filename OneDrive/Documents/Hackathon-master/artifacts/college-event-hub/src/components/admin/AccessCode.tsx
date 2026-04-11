import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { Club } from "../../pages/AdminPortal";
import { validateClubCode } from "../../lib/useClubs";

type Props = { club: Club; onBack: () => void; onSuccess: () => void };

export default function AccessCode({ club, onBack, onSuccess }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const valid = await validateClubCode(club.id, code);
    setLoading(false);
    if (valid) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setCode("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="px-4 pt-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors text-sm">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 w-full max-w-sm"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Lock size={24} className="text-[#e11d2e]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{club.name}</h2>
            <p className="text-gray-500 text-sm mt-1">Enter Club Access Code</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(false); }}
                placeholder="••••••••"
                className={`w-full border rounded-xl px-4 py-3.5 text-center text-lg tracking-widest font-mono focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? "border-red-400 bg-red-50 focus:ring-red-300"
                    : "border-gray-200 focus:ring-[#e11d2e]/30"
                }`}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#e11d2e] text-sm text-center font-medium"
              >
                Incorrect access code. Try again.
              </motion.p>
            )}

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#e11d2e] hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
              {loading ? "Verifying..." : "Enter Dashboard"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
