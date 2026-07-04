import React from "react";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CircleCheck,
  CircleUser,
  Clock3,
  TriangleAlert,
  UserX,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { dashboardMenus } from "./DashboardMenus";
import bgImage from "../assets/db-background.png";
import logo from "../assets/logo.png";

const stats = [
  {
    title: "Total Employees",
    value: "32,500",
    subtitle: "All Companies",
    icon: Users,
    color: "text-blue-500",
  },
  {
    title: "Present Today",
    value: "29,850",
    subtitle: "91.85%",
    icon: CircleCheck,
    color: "text-green-500",
  },
  {
    title: "Absent Today",
    value: "2,650",
    subtitle: "8.15%",
    icon: UserX,
    color: "text-red-500",
  },
  {
    title: "On Leave",
    value: "680",
    subtitle: "2.09%",
    icon: BriefcaseBusiness,
    color: "text-amber-500",
  },
  {
    title: "On OT",
    value: "1,320",
    subtitle: "4.06%",
    icon: Clock3,
    color: "text-cyan-500",
  },
  {
    title: "Alerts",
    value: "12",
    subtitle: "Pending Actions",
    icon: TriangleAlert,
    color: "text-purple-500",
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Content */}
      <div className="mx-auto max-w-[1700px] px-8 pb-10">

        {/* Header */}
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-4">
            <img src={logo} alt="logo" className="h-14" />
            <div>
              <h5
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 350,
                  letterSpacing: "1px",
                  transform: "scaleX(1.08)",
                  transformOrigin: "left center",
                }}
                className="text-[32px] text-white leading-none"
              >
                SYNEXIS
              </h5>
              <p
                style={{
                  fontWeight: 600,
                  letterSpacing: "0.2px",
                }}
                className="text-[#25C7F6] text-[12px]"
              >
                Creating Enterprise Synergy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white/10 px-4 py-2 text-white backdrop-blur-sm">
              Tuesday, May 20, 2025
            </div>

            <div className="relative">
              <Bell className="h-6 w-6 text-white" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                8
              </span>
            </div>

            <CircleUser className="h-9 w-9 text-white" />
          </div>
        </div>

        {/* Mother Dashboard */}
        <div className="mt-0 text-center">
          <h1 className="text-[32px] font-bold tracking-wide text-[#173a80]">
            MOTHER DASHBOARD
          </h1>

          <div className="mt-2 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-blue-300" />
            <p className="text-xl text-[#1e2f69]">
              One Platform. All HR Operations.
            </p>
            <div className="h-px w-12 bg-blue-300" />
          </div>
        </div>

        {/* NZX Group */}
        <div className="mt-12 text-center">
          <h2 className="text-[24px] font-bold text-[#173a80]">
            NZ TEX GROUP
          </h2>

          <div className="mt-3 flex justify-center">
            <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400" />
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {dashboardMenus.map((menu, index) => (
            <div
              key={index}
              onClick={() => navigate(menu.path)}
              className="group flex h-[380px] cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className={`mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full ${menu.bgTint}`}>
                <menu.icon
                  size={58}
                  className={menu.iconColor}
                />
              </div>

              <h3
                className={`text-center text-2xl font-bold ${menu.titleColor}`}
              >
                {menu.title}
              </h3>

              <div
                className={`mx-auto mt-3 h-[2px] w-10 ${menu.lineColor}`}
              />

              <div className="mt-5 h-[90px] overflow-hidden">
                <p className="text-center text-sm leading-7 text-slate-600 line-clamp-4">
                  {menu.description}
                </p>
              </div>

              <button
                className={`mt-6 flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-semibold ${menu.buttonBorder} ${menu.buttonText}`}
              >
                View Details
                <ArrowRight size={16} />
              </button>

              <div
                className={`mt-5 h-2 rounded-full ${menu.bottomBar}`}
              />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 rounded-2xl bg-white/95 shadow-lg backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-6 ${index !== stats.length - 1
                    ? "border-r border-slate-200"
                    : ""
                    }`}
                >
                  <Icon
                    size={40}
                    className={stat.color}
                  />

                  <div>
                    <p className="text-sm text-slate-500">
                      {stat.title}
                    </p>

                    <p className="text-3xl font-bold text-[#173a80]">
                      {stat.value}
                    </p>

                    <p className="text-sm text-slate-500">
                      {stat.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
