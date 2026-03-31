import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

type MenuItemType = {
  label: string;
  icon?: any;
  path?: string;
  children?: MenuItemType[];
};

const MenuItem = ({
  item,
  level = 0,
}: {
  item: MenuItemType;
  level?: number;
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const hasChildren = !!item.children;
  const isActive = item.path && location.pathname === item.path;

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition
        ${
          isActive
            ? "bg-gray-600 text-white"
            : "text-gray-300 hover:bg-gray-700"
        }`}
        style={{ paddingLeft: `${12 + level * 14}px` }}
      >
        <span className="text-sm">{item.label}</span>

        {hasChildren && (
          open ? <ChevronDown size={14} /> : <ChevronRight size={14} />
        )}
      </div>

      {hasChildren && open && (
        <div className="mt-1">
          {item.children!.map((child, i) => (
            <MenuItem key={i} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({ menu }: { menu: MenuItemType[] }) {
  return (
    <div className="w-64 h-screen bg-[#2f2f2f] text-white flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5 text-xl font-bold border-b border-gray-700">
        ERP
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {menu.map((item, i) => (
          <MenuItem key={i} item={item} />
        ))}
      </div>
    </div>
  );
}