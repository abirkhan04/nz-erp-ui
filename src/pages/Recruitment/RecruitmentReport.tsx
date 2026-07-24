import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChartColumn,
  ClipboardList,
  FileText,
  FolderOpen,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Report = {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  uri?: string;
};

const reports: Report[] = [
  {
    id: 1,
    title: "Employee Master List",
    description:
      "View the list of all employees with basic employment details.",
    icon: ClipboardList,
    iconBg: "#EAF3FF",
    iconColor: "#2F80ED",
    uri: "employee-master-list"
  },
  {
    id: 2,
    title: "Employee Detailed Profile",
    description:
      "View detailed profile of an individual employee.",
    icon: UserRound,
    iconBg: "#ECF9EF",
    iconColor: "#16A34A",
    uri: "employee-detail-profile"
  },
  {
    id: 3,
    title: "Joining Report",
    description:
      "View list of employees joined within a selected period.",
    icon: CalendarDays,
    iconBg: "#FFF1E8",
    iconColor: "#F97316",
  },
  {
    id: 4,
    title: "Confirmation Due Report",
    description:
      "View employees whose confirmation is due.",
    icon: BadgeCheck,
    iconBg: "#F2ECFF",
    iconColor: "#7C3AED",
  },
  {
    id: 5,
    title: "Vacancy Report",
    description:
      "View sanctioned, present and vacant positions.",
    icon: FileText,
    iconBg: "#E9FBF7",
    iconColor: "#0F9D8C",
  },
  {
    id: 6,
    title: "Document Status Report",
    description:
      "View document availability status of an employee.",
    icon: FolderOpen,
    iconBg: "#FFEAF2",
    iconColor: "#EC407A",
  },
  {
    id: 7,
    title: "Demographic Report",
    description:
      "View demographic statistics of employees.",
    icon: ChartColumn,
    iconBg: "#FFF8E3",
    iconColor: "#D4A017",
  },
];

export default function RecruitmentReports() {
    const navigate = useNavigate();
  return (
    <div className="p-8 bg-white">
      <div className="border rounded-2xl border-slate-200 bg-white p-8">

        {/* Header */}

        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-100 to-purple-50 flex items-center justify-center">
            <ClipboardList
              size={28}
              className="text-violet-600"
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              Recruitment Reports
            </h2>

            <p className="text-slate-500 mt-1">
              Select any report from the below list to view,
              export or print.
            </p>
          </div>
        </div>

        {/* Cards */}

        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-8">
          {reports.map((report) => {
            const Icon = report.icon;

            return (
              <div
                key={report.id}
                className="rounded-2xl border border-slate-200 bg-white px-1 py-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                  style={{
                    background: report.iconBg,
                  }}
                >
                  <Icon
                    size={40}
                    style={{
                      color: report.iconColor,
                    }}
                  />
                </div>

                <h3 className="mt-6 text-center font-semibold text-xl text-slate-800">
                  {report.id}. {report.title}
                </h3>

                <p className="mt-4 text-center text-slate-500 leading-7 min-h-[72px]">
                  {report.description}
                </p>

                <div className="flex justify-center mt-8">
                  <button
                    className="flex items-center gap-2 border border-indigo-500 text-indigo-600 rounded-lg px-6 py-2.5 font-semibold transition-all hover:bg-indigo-600 hover:text-white"
                    onClick={() => report.uri && navigate(report.uri)}
                  >
                    View Report
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
