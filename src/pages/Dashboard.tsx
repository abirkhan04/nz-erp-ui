import React from "react";
import { Users, Clock, Umbrella, DollarSign, Scale, BarChart3 } from "lucide-react";

const cards = [
  { title: "Recruitment", icon: Users, color: "bg-blue-100", btn: "bg-blue-500" },
  { title: "Attendance", icon: Clock, color: "bg-green-100", btn: "bg-green-500" },
  { title: "Leave", icon: Umbrella, color: "bg-yellow-100", btn: "bg-yellow-500" },
  { title: "Payroll", icon: DollarSign, color: "bg-orange-100", btn: "bg-orange-500" },
  { title: "Payroll", icon: DollarSign, color: "bg-cyan-100", btn: "bg-cyan-500" },
  { title: "Compliance", icon: Scale, color: "bg-red-100", btn: "bg-red-500" },
  { title: "Reports", icon: BarChart3, color: "bg-blue-100", btn: "bg-blue-500" },
  { title: "Reports", icon: BarChart3, color: "bg-blue-100", btn: "bg-blue-500" },
];

const Dashboard: React.FC = () => {
  return (
    <div className="flex items-center justify-center bg-gray-100 pt-20">
      <div className="bg-white rounded-2xl shadow-md p-1 w-full max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`rounded-xl p-6 flex flex-col items-center justify-between shadow-sm ${card.color}`}
              >
                <div className="flex flex-col items-center gap-3">
                  <Icon size={36} className="text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-700">
                    {card.title}
                  </h3>
                </div>

                <button
                  className={`mt-4 w-full text-white py-2 rounded-lg ${card.btn}`}
                >
                  {card.title}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
