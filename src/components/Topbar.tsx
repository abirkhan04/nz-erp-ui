import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, ChevronDown, Building2 } from "lucide-react";

export default function Topbar() {
  const [userOpen, setUserOpen] = useState(false);

  const [companyOpen, setCompanyOpen] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const navigate = useNavigate();

  const userRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Data
  const companies = ["Textile", "Fabric", "Denim", "DyFlax", "Apparels"];
  const locations = ["Vulta", "Araihazar", "Head Office"];

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) {
        setCompanyOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle handlers
  const toggleCompany = (company: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(company)
        ? prev.filter((c) => c !== company)
        : [...prev, company]
    );
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc)
        ? prev.filter((l) => l !== loc)
        : [...prev, loc]
    );
  };

  const handleLogout = () => {
    navigate("/login");
  };

  // Display helpers (clean UI when many selected)
  const renderSelected = (items: string[], placeholder: string) => {
    if (items.length === 0) return placeholder;
    if (items.length > 2) return `${items.length} selected`;
    return items.join(", ");
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
      <div className="flex items-center gap-4">
        
        {/* Company Multi-Select */}
        <div className="relative" ref={companyRef}>
          <div
            onClick={() => setCompanyOpen(!companyOpen)}
            className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-md cursor-pointer min-w-[180px]"
          >
            <Building2 size={16} />
            <span className="text-sm truncate">
              {renderSelected(selectedCompanies, "Select Company")}
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
                    checked={selectedCompanies.includes(company)}
                    onChange={() => toggleCompany(company)}
                    className="accent-blue-500"
                  />
                  {company}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Location Multi-Select */}
        <div className="relative" ref={locationRef}>
          <div
            onClick={() => setLocationOpen(!locationOpen)}
            className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-md cursor-pointer min-w-[180px]"
          >
            <MapPin size={16} />
            <span className="text-sm truncate">
              {renderSelected(selectedLocations, "Select Location")}
            </span>
            <ChevronDown size={14} />
          </div>

          {locationOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-lg p-2">
              {locations.map((loc) => (
                <label
                  key={loc}
                  className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(loc)}
                    onChange={() => toggleLocation(loc)}
                    className="accent-blue-500"
                  />
                  {loc}
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
        <div className="text-sm opacity-90 whitespace-nowrap">
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}