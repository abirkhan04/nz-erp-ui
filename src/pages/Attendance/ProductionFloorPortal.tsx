import React from "react";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Clock3,
  LogOut,
  ShieldCheck,
  UserCircle,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PortalOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  onClick?: () => void;
  url?: string;
}

const portalOptions: PortalOption[] = [
  {
    id: "ot",
    title: "OT",
    description: "Forward OT Request\nto Time Cell",
    icon: Clock3,
    gradient: "from-blue-600 to-blue-700",
    url: "/ot-forwarding"
  },
  {
    id: "leave",
    title: "LEAVE",
    description: "Forward Leave &\nLeave Encashment\nto Attendance Cell",
    icon: CalendarDays,
    gradient: "from-teal-500 to-teal-700",
    url: "/leave-portal"
  },
  {
    id: "increment",
    title: "INCREMENT &\nPROMOTION",
    description: "Forward Increment &\nPromotion Request to\nMovement Cell",
    icon: BarChart3,
    gradient: "from-violet-600 to-purple-800",
  },
];

const features = [
  {
    title: "ACCURATE",
    subtitle: "Ensure accurate data",
    icon: ShieldCheck,
  },
  {
    title: "RELIABLE",
    subtitle: "Ensure reliability",
    icon: ShieldCheck,
  },
  {
    title: "INTEGRATED",
    subtitle: "Ensure integration",
    icon: Zap,
  },
];

const ProductionFloorPortal: React.FC = () => {

    const navigate = useNavigate();
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const handleOptionClick = (option: PortalOption) => {
    console.log(`Selected: ${option.id}`);
    navigate(option.url?option.url: "/production-floor-portal");
    option.onClick?.();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-2 sm:p-3">
      <div className="mx-auto flex min-h-[calc(100vh-16px)] max-w-[1400px] flex-col overflow-hidden bg-white shadow-sm">

        {/* ================= HEADER ================= */}
        <header className="relative z-10 bg-[#03143d] text-white">
          <div className="flex min-h-[96px] items-center justify-between px-5 py-4 sm:px-8 lg:px-10">

            {/* Logo */}
            <div className="flex items-center gap-4">
              {/* Logo Symbol */}
              <div className="relative flex h-12 w-12 items-center justify-center">
                <div className="absolute h-10 w-10 -rotate-12 rounded-full bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-600" />
                <div className="absolute h-6 w-10 rotate-12 rounded-full bg-[#03143d]" />
                <div className="absolute h-3 w-8 -rotate-12 rounded-full bg-cyan-400" />
              </div>

              <div className="leading-none">
                <h1 className="text-3xl font-bold tracking-wide sm:text-4xl">
                  SYNEXIS
                </h1>

                <p className="mt-1 text-xs font-medium tracking-wide text-cyan-400 sm:text-sm">
                  Creating Enterprise Synergy
                </p>
              </div>
            </div>

            {/* Center Title */}
            <div className="hidden text-center md:block">
              <h2 className="text-2xl font-bold tracking-wide lg:text-3xl">
                PRODUCTION FLOOR PORTAL
              </h2>

              <p className="mt-1 text-base font-medium text-cyan-400 lg:text-lg">
                Production Representative Dashboard
              </p>
            </div>

            {/* User */}
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="hidden items-center gap-3 lg:flex">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/60">
                  <UserCircle size={38} strokeWidth={1.4} />
                </div>

                <div>
                  <p className="text-sm font-semibold">JAHID HOSSAIN</p>
                  <p className="mt-1 text-xs font-medium text-cyan-400">
                    Weaving Section - A Shift
                  </p>
                </div>
              </div>

              <div className="hidden h-12 w-px bg-cyan-500/40 lg:block" />

              <button
                type="button"
                onClick={handleLogout}
                className="group flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-white/10"
              >
                <LogOut
                  size={27}
                  className="text-cyan-400 transition-transform group-hover:translate-x-1"
                />

                <span className="hidden text-sm lg:block">
                  Logout
                </span>
              </button>
            </div>
          </div>

          {/* Mobile title */}
          <div className="border-t border-white/10 px-5 py-3 text-center md:hidden">
            <h2 className="text-lg font-bold">
              PRODUCTION FLOOR PORTAL
            </h2>
            <p className="mt-1 text-xs text-cyan-400">
              Production Representative Dashboard
            </p>
          </div>
        </header>

        {/* ================= MAIN ================= */}
        <main className="relative flex flex-1 flex-col overflow-hidden">

          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 overflow-hidden opacity-70">
            <div className="absolute -bottom-20 left-[-10%] h-40 w-[120%] -rotate-3 rounded-[50%] border border-sky-200" />
            <div className="absolute -bottom-12 left-[-10%] h-32 w-[120%] rotate-2 rounded-[50%] border border-sky-100" />
            <div className="absolute bottom-0 left-[-10%] h-24 w-[120%] -rotate-1 rounded-[50%] border border-cyan-100" />
          </div>

          {/* Heading */}
          <section className="relative z-10 px-5 pb-4 pt-9 text-center sm:pt-10">
            <h3 className="text-2xl font-bold text-[#071b4d] sm:text-3xl">
              Welcome to Production Floor Portal
            </h3>

            <p className="mt-2 text-base text-gray-600 sm:text-lg">
              Please select an option to continue
            </p>
          </section>

          {/* Cards */}
          <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-5 pb-10 pt-5">
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 md:gap-7 lg:gap-8">
              {portalOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionClick(option)}
                    className={`
                      group relative flex min-h-[350px]
                      flex-col overflow-hidden rounded-2xl
                      bg-gradient-to-br ${option.gradient}
                      px-7 py-8 text-left text-white
                      shadow-lg
                      transition-all duration-300
                      hover:-translate-y-2
                      hover:shadow-2xl
                      focus:outline-none
                      focus:ring-4 focus:ring-blue-300/50
                    `}
                  >
                    {/* Card shine */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-150" />

                    {/* Icon */}
                    <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/90">
                        <Icon
                          size={58}
                          strokeWidth={1.7}
                          className="text-black"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative mt-6 flex flex-1 flex-col text-center">
                      <h4 className="whitespace-pre-line text-2xl font-bold leading-tight sm:text-3xl">
                        {option.title}
                      </h4>

                      <p className="mt-3 whitespace-pre-line text-base font-medium leading-6 text-white/95 sm:text-lg">
                        {option.description}
                      </p>
                    </div>

                    {/* Bottom arrow */}
                    <div className="relative mt-auto flex items-center gap-3">
                      <div className="h-px flex-1 bg-white/30 transition-colors group-hover:bg-white/60" />
                      <ArrowRight
                        size={30}
                        strokeWidth={1.5}
                        className="transition-transform duration-300 group-hover:translate-x-2"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </main>

        {/* ================= FOOTER ================= */}
        <footer className="relative z-10 bg-[#03143d] text-white">
          <div className="flex min-h-[88px] flex-col justify-between gap-6 px-6 py-5 sm:flex-row sm:items-center sm:px-10">

            {/* Features */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 lg:gap-10">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <React.Fragment key={feature.title}>
                    <div className="flex items-center gap-3">
                      <Icon
                        size={32}
                        strokeWidth={1.5}
                        className="text-cyan-400"
                      />

                      <div>
                        <p className="text-sm font-semibold tracking-wide">
                          {feature.title}
                        </p>

                        <p className="text-xs text-white/80">
                          {feature.subtitle}
                        </p>
                      </div>
                    </div>

                    {index < features.length - 1 && (
                      <div className="hidden h-9 w-px bg-cyan-500/40 sm:block" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Powered By */}
            <div className="flex items-center justify-end gap-2">
              <span className="text-sm text-white/70">
                Powered by
              </span>

              <span className="text-xl font-bold tracking-wide">
                SYNEXIS
                <span className="text-cyan-400"> ERP</span>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProductionFloorPortal;