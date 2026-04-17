import React, { useMemo, useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { useGet } from "../hooks/useGet";
import type { MenuItemType } from "../types/interfaces";
import { API_ROUTES } from "../api/routes";

// 🎨 Style pool
const styles = [
    { color: "bg-blue-100", btn: "bg-blue-500" },
    { color: "bg-green-100", btn: "bg-green-500" },
    { color: "bg-yellow-100", btn: "bg-yellow-500" },
    { color: "bg-orange-100", btn: "bg-orange-500" },
    { color: "bg-cyan-100", btn: "bg-cyan-500" },
    { color: "bg-red-100", btn: "bg-red-500" },
];

// 🔁 Icon resolver
const getIcon = (iconName?: string) => {
    if (!iconName) return Icons.BarChart3;

    const formatted =
        iconName.charAt(0).toUpperCase() + iconName.slice(1);

    return (Icons as any)[formatted] || Icons.BarChart3;
};

const Dashboard: React.FC = () => {

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);
    // ✅ Get token once

    // ✅ Stable URL (won’t change on re-render)
    const url = useMemo(() => {
        if (!token) return null;
        return API_ROUTES.MENU;
    }, [token]);

    // ✅ Call API only when url is stable
    const { data: menu, isLoading, error } = useGet<MenuItemType[]>({
        key: ["menu", token],
        url: token ? `${API_ROUTES.MENU}/${token}` : undefined,
        enabled: !!token,
    });
    // ✅ Enrich data (memoized)
    const enrichedMenus = useMemo(() => {
        if (!menu) return [];

        return menu.map((item, index) => {
            const style = styles[index % styles.length];

            return {
                ...item,
                color: style.color,
                btn: style.btn,
                iconComponent: getIcon(item.icon),
            };
        });
    }, [menu]);

    // ⏳ Loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <p className="text-gray-500">Loading dashboard...</p>
            </div>
        );
    }

    // ❌ Error
    if (error) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <p className="text-red-500">Failed to load dashboard</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center bg-gray-100 pt-20">
            <div className="bg-white rounded-2xl shadow-md p-4 w-full max-w-6xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {enrichedMenus.map((card, index) => {
                        const Icon = card.iconComponent;

                        return (
                            <div
                                key={index}
                                className={`rounded-xl p-6 flex flex-col items-center justify-between shadow-sm ${card.color}`}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <Icon size={36} className="text-gray-700" />
                                    <h3 className="text-lg font-semibold text-gray-700 text-center">
                                        {card.name}
                                    </h3>
                                </div>

                                <button
                                    className={`mt-4 w-full text-white py-2 rounded-lg ${card.btn}`}
                                >
                                    {card.name}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Empty state */}
                {!isLoading && enrichedMenus.length === 0 && (
                    <div className="text-center text-gray-500 py-10">
                        No menus available
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;