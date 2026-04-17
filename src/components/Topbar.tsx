import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, ChevronDown } from "lucide-react";

export default function Topbar() {
  const [userOpen, setUserOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const navigate = useNavigate();

  const userRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);

  // ✅ Define companies list (you missed this)
  const companies = ["NZ Denim", "ABC Textiles", "Demo Company"];

  // ✅ Single outside click handler (clean)
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

  const toggleSelect = (company: string) => {
    setSelected((prev) =>
      prev.includes(company)
        ? prev.filter((c) => c !== company)
        : [...prev, company]
    );
  };

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
        
        {/* Company Multi-Select Dropdown */}
        <div className="relative" ref={companyRef}>
          <div
            onClick={() => setCompanyOpen(!companyOpen)}
            className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-md cursor-pointer min-w-[180px]"
          >
            <MapPin size={16} />
            <span className="text-sm truncate">
              {selected.length > 0 ? selected.join(", ") : "Select Company"}
            </span>
            <ChevronDown size={14} />
          </div>

          {companyOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-lg p-2">
              {companies.map((company) => (
                <label
                  key={company}
                  className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(company)}
                    onChange={() => toggleSelect(company)}
                    className="accent-blue-500"
                  />
                  {company}
                </label>
              ))}
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