import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

type MenuItemType = {
  label: string;
  icon?: any;
  path?: string;
  children?: MenuItemType[];
};

/* 🔥 Recursive filter function */
const filterMenu = (menu: MenuItemType[], query: string): MenuItemType[] => {
  if (!query) return menu;

  return menu
    .map((item) => {
      if (item.children) {
        const filteredChildren = filterMenu(item.children, query);

        if (
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          filteredChildren.length > 0
        ) {
          return {
            ...item,
            children: filteredChildren,
          };
        }
        return null;
      }

      return item.label.toLowerCase().includes(query.toLowerCase())
        ? item
        : null;
    })
    .filter(Boolean) as MenuItemType[];
};

const MenuItem = ({
  item,
  level = 0,
  search = "",
}: {
  item: MenuItemType;
  level?: number;
  search?: string;
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const hasChildren = !!item.children;
  const isActive = item.path && location.pathname === item.path;

  /* 🔥 Match logic for auto expand */
  const isMatch = item.label.toLowerCase().includes(search.toLowerCase());

  const hasMatchingChild =
    item.children?.some((child) =>
      JSON.stringify(child).toLowerCase().includes(search.toLowerCase())
    ) ?? false;

  const isOpen = search ? isMatch || hasMatchingChild : open;

  const handleClick = () => {
    if (item.path) {
      navigate(item.path); // ✅ always navigate if path exists
    }

    if (!search && hasChildren) {
      setOpen((prev) => !prev); // ✅ manual toggle only when not searching
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

        {hasChildren &&
          (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
      </div>

      {hasChildren && isOpen && (
        <div className="mt-1">
          {item.children!.map((child, i) => (
            <MenuItem
              key={i}
              item={child}
              level={level + 1}
              search={search}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({ menu }: { menu: MenuItemType[] }) {
  const [search, setSearch] = useState("");

  const filteredMenu = filterMenu(menu, search);

  return (
    <div className="w-64 h-screen bg-[#2f2f2f] text-white flex flex-col">

      {/* Logo */}
      <div className="px-4 py-5 text-xl font-bold border-b border-gray-700">
        ERP
      </div>

      {/* 🔥 Search Box */}
      <div className="p-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-2.5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-gray-800 text-white outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((item, i) => (
            <MenuItem key={i} item={item} search={search} />
          ))
        ) : (
          <div className="text-sm text-gray-400 px-3 py-2">
            No results found
          </div>
        )}
      </div>
    </div>
  );
}