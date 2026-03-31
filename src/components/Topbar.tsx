import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // later: clear token/localStorage
    navigate("/login");
  };

  return (
    <div className="h-14 bg-white shadow flex items-center justify-between px-6">
      
      {/* Left */}
      <h1 className="text-lg font-semibold">Top Navigation</h1>

      {/* Right */}
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300"
        >
          <User size={18} />
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}