import React from "react";
import {
  Users,
  Briefcase,
  UserCheck,
  Building2,
  ChevronRight,
  Stethoscope,
  Fingerprint,
  UserRound,
  Monitor,
  FileText,
  // LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface SummaryCard {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

interface CompanyRecruitment {
  company: string;
  workers: number;
  staffs: number;
  management: number;
  total: number;
}

interface ProcessStep {
  step: number;
  title: string;
  icon: LucideIcon;
  color: string;
  status: string;
  uri?: string;
}

const RecruitmentDashboard = () => {

  const navigate = useNavigate();
  const summaryCards:SummaryCard[] = [
    {
      title: "TOTAL RECRUITED",
      value: "1,248",
      subtitle: "Up to May 20, 2025",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "WORKERS",
      value: "1,012",
      subtitle: "81.09% of Total",
      icon: Briefcase,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "STAFFS",
      value: "186",
      subtitle: "14.90% of Total",
      icon: UserCheck,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "MANAGEMENT",
      value: "50",
      subtitle: "4.01% of Total",
      icon: Building2,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  const companies:CompanyRecruitment[] = [
    {
      company: "NZ Textile Limited",
      workers: 420,
      staffs: 72,
      management: 30,
      total: 522,
    },
    {
      company: "NZ Fabrics Limited",
      workers: 250,
      staffs: 48,
      management: 20,
      total: 318,
    },
    {
      company: "NZ Denim Limited",
      workers: 200,
      staffs: 34,
      management: 12,
      total: 246,
    },
    {
      company: "NZ Dyeing Limited",
      workers: 142,
      staffs: 32,
      management: 8,
      total: 162,
    },
  ];

  const processFlow: ProcessStep[] = [
    {
      step: 1,
      title: "Gate Registration",
      icon: Building2,
      color: "blue",
      status: "ACTIVE",
      uri: "/recruitment/gate-registration",
    },
    {
      step: 2,
      title: "Medical Examination",
      icon: Stethoscope,
      color: "sky",
      status: "DISABLED",
      uri: "/recruitment/medical-examination",
    },
    {
      step: 3,
      title: "HR Executive Entry",
      icon: FileText,
      color: "green",
      status: "DISABLED",
      uri: "/recruitment/hr-executive-entry",
    },
    {
      step: 4,
      title: "Biometric & Picture Capture",
      icon: Fingerprint,
      color: "orange",
      status: "DISABLED",
    },
    {
      step: 5,
      title: "Director Review",
      icon: UserRound,
      color: "purple",
      status: "DISABLED",
    },
    {
      step: 6,
      title: "IT Activation",
      icon: Monitor,
      color: "cyan",
      status: "DISABLED",
    },
    {
      step: 7,
      title: "Recruitment Reports",
      icon: FileText,
      color: "pink",
      status: "DISABLED",
    },
  ];

  const colorStyles = {
    blue: {
      badge: "bg-blue-600",
      icon: "text-blue-600",
      bg: "bg-blue-50",
    },
    sky: {
      badge: "bg-sky-600",
      icon: "text-sky-600",
      bg: "bg-sky-50",
    },
    green: {
      badge: "bg-green-600",
      icon: "text-green-600",
      bg: "bg-green-50",
    },
    orange: {
      badge: "bg-orange-600",
      icon: "text-orange-600",
      bg: "bg-orange-50",
    },
    purple: {
      badge: "bg-purple-600",
      icon: "text-purple-600",
      bg: "bg-purple-50",
    },
    cyan: {
      badge: "bg-cyan-600",
      icon: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    pink: {
      badge: "bg-pink-600",
      icon: "text-pink-600",
      bg: "bg-pink-50",
    },
  } as const;

  const getStatusClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-slate-100 text-slate-500";
    }
  };



  return (
    <div className="min-h-screen bg-[#f4f7fc] p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-[#1f2c73] text-xl">
            RECRUITMENT SUMMARY
            <span className="ml-2 text-gray-500 text-sm font-medium">
              (May 1, 2025 - May 20, 2025)
            </span>
          </h2>

          <button className="border px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50" onClick={() => navigate("/")}>
            ← Back to Main Menu
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className={`
                            rounded-2xl
                            p-5
                            flex
                            items-center
                            gap-4
                            ${card.bg}
                            shadow-md
                            hover:shadow-lg
                            transition-all
                            duration-300
                          `}>
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                  <Icon className={`w-8 h-8 ${card.color}`} />
                </div>

                <div>
                  <h4 className={`text-sm font-bold ${card.color}`}>
                    {card.title}
                  </h4>

                  <h2 className={`text-4xl font-bold ${card.color}`}>
                    {card.value}
                  </h2>

                  <p className="text-sm text-gray-600">{card.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recruitment by Company */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 className="font-bold text-[#1f2c73] text-lg mb-4">
          RECRUITMENT BY COMPANY
        </h3>

        <div className="overflow-hidden rounded-xl shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f3f5fa] text-[#1f2c73]">
                <th className="text-left p-4">Company</th>
                <th className="text-center p-4">Workers</th>
                <th className="text-center p-4">Staffs</th>
                <th className="text-center p-4">Management</th>
                <th className="text-center p-4">Total</th>
              </tr>
            </thead>

            <tbody>
              {companies.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="p-4">{item.company}</td>
                  <td className="text-center p-4">{item.workers}</td>
                  <td className="text-center p-4">{item.staffs}</td>
                  <td className="text-center p-4">{item.management}</td>
                  <td className="text-center p-4 font-bold text-blue-600">
                    {item.total}
                  </td>
                </tr>
              ))}

              <tr className="bg-[#f3f5fa] font-bold text-blue-600">
                <td className="p-4">TOTAL</td>
                <td className="text-center p-4">1,012</td>
                <td className="text-center p-4">186</td>
                <td className="text-center p-4">50</td>
                <td className="text-center p-4">1,248</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Flow */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-bold text-[#1f2c73] text-lg mb-5">
          RECRUITMENT PROCESS FLOW
        </h3>

        <div className="flex items-center gap-4 overflow-x-auto pb-3">
          {processFlow.map((item, index) => {
            const Icon = item.icon;
            const styles =
              colorStyles[item.color as keyof typeof colorStyles];
            return (
              <React.Fragment key={item.step}>
                <div className="relative
                                min-w-[200px]
                                rounded-2xl
                                bg-white
                                p-5
                                shadow-md
                                hover:shadow-lg
                                transition-all
                                duration-300
                                cursor-pointer
                                " onClick={() => item.uri && navigate(item.uri)}>
                  <div className={`absolute top-0 left-0 ${styles.badge} text-white px-3 py-1 rounded-br-xl rounded-tl-2xl font-bold`}>
                    {item.step}
                  </div>

                  <div className="pt-8 text-center">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full ${styles.bg} shadow-sm flex items-center justify-center mb-4`}
                    >
                      <Icon className={`w-8 h-8 ${styles.icon}`} />
                    </div>

                    <h4 className="font-bold text-[#1f2c73] text-sm min-h-[45px]">
                      {item.title}
                    </h4>
                    <span
                      className={`inline-block mt-4 px-4 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {index !== processFlow.length - 1 && (
                  <ChevronRight className="text-gray-400 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Legends */}
        <div className="flex gap-8 mt-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span>
            <span className="text-sm">Active</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm">Pending</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-sm">Completed</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400"></span>
            <span className="text-sm">Disabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentDashboard;
