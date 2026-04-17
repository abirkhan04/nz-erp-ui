import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, ChevronDown } from "lucide-react";

export default function Topbar() {
  const [userOpen, setUserOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  const navigate = useNavigate();

  const userRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) {
        setCompanyOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="h-16 bg-gradient-to-r from-blue-700 to-blue-500 flex items-center justify-between px-6 text-white shadow-md">
      
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded flex items-center justify-center font-bold">
          S
        </div>
        <h1 className="text-xl font-semibold tracking-wide">SYNEXIS</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        
        {/* Company Dropdown */}
        <div className="relative" ref={companyRef}>
          <div
            onClick={() => setCompanyOpen(!companyOpen)}
            className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-md cursor-pointer"
          >
            <MapPin size={16} />
            <span className="text-sm">NZ Denim</span>
            <ChevronDown size={14} />
          </div>

          {companyOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded-lg shadow-lg overflow-hidden">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                NZ Denim
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                ABC Textiles
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                Demo Company
              </button>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={userRef}>
          <div
            onClick={() => setUserOpen(!userOpen)}
            className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-md cursor-pointer"
          >
            <User size={16} />
            <span className="text-sm">Admin User</span>
            <ChevronDown size={14} />
          </div>

          {userOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Date */}
        <div className="text-sm opacity-90">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}