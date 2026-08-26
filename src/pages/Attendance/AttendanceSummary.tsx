
import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Users,
  UserCheck,
  UserX,
  Timer,
  CalendarCheck,
  ShieldCheck,
  Bell,
} from "lucide-react";

import { useGet } from "../../hooks/useGet";
import { API_ROUTES } from "../../api/routes";
import { api } from "../../api/client";

/* =========================================================
   Types
========================================================= */

interface DepartmentAttendance {
  department: string;
  totalEmployees: number;
  present: number;
  absent: number;
  otRunning: number;
  totalOnDuty: number;
  percentagePresent: number;
}

interface SummaryCard {
  title: string;
  value: number;
  percentage?: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  valueColor: string;
  percentageColor: string;
  subtitle?: string;
}

const summaryCards: SummaryCard[] = [
  {
    title: "TOTAL EMPLOYEES",
    value: 1248,
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    valueColor: "text-slate-900",
    percentageColor: "",
  },
  {
    title: "PRESENT",
    value: 1032,
    percentage: 82.69,
    icon: UserCheck,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    valueColor: "text-slate-900",
    percentageColor: "text-green-600",
  },
  {
    title: "ABSENT",
    value: 158,
    percentage: 12.66,
    icon: UserX,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    valueColor: "text-slate-900",
    percentageColor: "text-red-600",
  },
  {
    title: "ON OT (RUNNING)",
    value: 48,
    percentage: 3.85,
    icon: Timer,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    valueColor: "text-slate-900",
    percentageColor: "text-orange-500",
  },
  {
    title: "TOTAL ON DUTY",
    value: 1080,
    percentage: 86.54,
    icon: CalendarCheck,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    valueColor: "text-slate-900",
    percentageColor: "text-blue-600",
    subtitle: "(Including OT)",
  },
];

/* =========================================================
   Helpers
========================================================= */

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

/* =========================================================
   Summary Card
========================================================= */

const SummaryCardComponent: React.FC<{
  card: SummaryCard;
}> = ({ card }) => {
  const Icon = card.icon;

  return (
    <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/40 px-4 py-5 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ${card.iconBg}`}
        >
          <Icon className={`h-11 w-11 ${card.iconColor}`} strokeWidth={2} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[13px] font-bold tracking-wide text-blue-700">
            {card.title}
          </div>

          {card.subtitle && (
            <div className="-mt-1 mb-0.5 text-[11px] font-medium text-blue-700">
              {card.subtitle}
            </div>
          )}

          <div
            className={`text-[38px] font-bold leading-none ${card.valueColor}`}
          >
            {formatNumber(card.value)}
          </div>

          {card.percentage !== undefined && (
            <div
              className={`mt-2 text-[21px] font-bold leading-none ${card.percentageColor}`}
            >
              {card.percentage.toFixed(2)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   Attendance Summary
========================================================= */

const AttendanceSummary: React.FC = () => {
  const { data: shifts = [] } = useGet<any[]>({
    key: ["shifts"],
    url: `${API_ROUTES.SHIFTS}?includeInactive=false`,
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const selectedId = user.employeeId;

  const { data: employee = {} } = useGet<any>({
    key: ["activationSummary", selectedId],
    url: `${API_ROUTES.EMPLOYEES}/employee-detail/${selectedId}`,
    enabled: !!selectedId,
  });

  const rosterShifts = shifts?.filter(
    (shift) => shift.shiftType === "Roster" && shift.isActive
  );

  const getCurrentShift = () => {
    const now = new Date();

    const currentMinutes =
      now.getHours() * 60 + now.getMinutes();

    return rosterShifts?.find((shift) => {
      const [startHour, startMinute] = shift.startTime
        .split(":")
        .map(Number);

      const [endHour, endMinute] = shift.endTime
        .split(":")
        .map(Number);

      const startMinutes =
        startHour * 60 + startMinute;

      let endMinutes =
        endHour * 60 + endMinute;

      if (endMinutes <= startMinutes) {
        endMinutes += 24 * 60;
      }

      let current = currentMinutes;

      if (
        current < startMinutes &&
        endMinutes > 24 * 60
      ) {
        current += 24 * 60;
      }

      return (
        current >= startMinutes &&
        current < endMinutes
      );
    });
  };

  const currentShift = getCurrentShift();

  const shiftId = currentShift?.id;
  const departmentId = employee.departmentId;
  const attendanceDate = new Date().toLocaleDateString("en-CA");

  const { data: attendanceSummary = {} } = useGet({
    key: ["attendanceSummary"],
    url: `${API_ROUTES.ATTENDANCE}/summary?shiftId=${shiftId}&attendanceDate=${attendanceDate}&departmentId=${departmentId}`,
    enabled: !!shiftId && !!departmentId
  });

  const { data: departments = [] } = useGet({ key: ["departments"], url: `${API_ROUTES.DEPARTMENT}` });


  summaryCards.forEach((i) => {
    const summary = attendanceSummary.summary || {};
    if (i.title === "TOTAL EMPLOYEES") {
      i.value = summary.totalEmployees;
    }
    if (i.title === "PRESENT") {
      i.value = summary.presentCount;
      i.percentage = summary.presentPercentage;
    }
    if (i.title === "ABSENT") {
      i.value = summary.absentCount;
      i.percentage = summary.absentPercentage;
    }
    if (i.title === "ON OT (RUNNING)") {
      i.value = summary.onOtCount;
      i.percentage = summary.onOtPercentage;
    }
    if (i.title === "TOTAL ON DUTY") {
      i.value = summary.totalOnDuty;
      i.percentage = summary.totalOnDutyPercentage;
    }
    return i;
  });

  const [departmentData, setDepartmentData] = useState<
    DepartmentAttendance[]
  >([]);

  useEffect(() => {
    const loadDepartmentAttendance = async () => {
      if (!shiftId || !attendanceDate || !departments?.length) {
        setDepartmentData([]);
        return;
      }

      try {
        const results = await Promise.all(
          departments.map(async (department: any) => {
            const response = await api.get(
              `${API_ROUTES.ATTENDANCE}/summary?shiftId=${shiftId}&attendanceDate=${attendanceDate}&departmentId=${department.departmentId}`
            );

            const summary = response.data?.summary ?? {};

            return {
              department: department.departmentName,
              totalEmployees: summary.totalEmployees ?? 0,
              present: summary.presentCount ?? 0,
              absent: summary.absentCount ?? 0,
              otRunning: summary.onOtCount ?? 0,
              totalOnDuty: summary.totalOnDuty ?? 0,
              percentagePresent: summary.presentPercentage ?? 0,
            };
          })
        );

        setDepartmentData(results);
      } catch (error) {
        console.error("Failed to load department-wise attendance:", error);
        setDepartmentData([]);
      }
    };

    loadDepartmentAttendance();
  }, [shiftId, attendanceDate, departments]);

  const totalRow: DepartmentAttendance = departmentData.reduce(
    (total, row) => ({
      department: "TOTAL",
      totalEmployees: total.totalEmployees + row.totalEmployees,
      present: total.present + row.present,
      absent: total.absent + row.absent,
      otRunning: total.otRunning + row.otRunning,
      totalOnDuty: total.totalOnDuty + row.totalOnDuty,
      percentagePresent: 0,
    }),
    {
      department: "TOTAL",
      totalEmployees: 0,
      present: 0,
      absent: 0,
      otRunning: 0,
      totalOnDuty: 0,
      percentagePresent: 0,
    }
  );

  totalRow.percentagePresent =
    totalRow.totalEmployees > 0
      ? (totalRow.present / totalRow.totalEmployees) * 100
      : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1400px] overflow-hidden bg-white">
        {/* =================================================
            HEADER
        ================================================= */}
        <header className="bg-[#031642] px-6 py-5 text-white md:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute h-10 w-12 -skew-y-12 rounded-full border-[9px] border-blue-500 border-l-transparent border-b-transparent" />

                <div className="absolute h-10 w-12 skew-y-12 rounded-full border-[9px] border-cyan-400 border-r-transparent border-t-transparent" />
              </div>

              <div>
                <div className="text-3xl font-bold tracking-wide">
                  SYNEXIS
                </div>

                <div className="text-[11px] font-medium text-cyan-400">
                  Creating Enterprise Synergy
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide md:text-3xl">
                ATTENDANCE SUMMARY
              </h1>

              <div className="text-xl font-bold text-cyan-400 md:text-2xl">
                {attendanceSummary.shift?.shiftName.split("-")[0]} SHIFT
              </div>

              <div className="mt-2 flex items-center justify-center gap-4 rounded-full border border-blue-500/60 bg-[#051b50] px-5 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>  {new Date(attendanceSummary.attendanceDate).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}</span>
                </div>

                <span className="text-blue-300">|</span>

                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  <span>
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Empty area for alignment */}
            <div className="hidden w-[180px] lg:block" />
          </div>
        </header>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}
        <section className="px-5 py-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {summaryCards.map((card) => (
              <SummaryCardComponent
                key={card.title}
                card={card}
              />
            ))}
          </div>
        </section>

        {/* =================================================
            DEPARTMENT SECTION
        ================================================= */}
        <section className="px-5 pb-5">
          {/* Section title */}
          <div className="mb-0 rounded-t-xl border border-blue-100 bg-gradient-to-r from-white to-blue-50 px-4 py-2">
            <h2 className="text-lg font-bold uppercase text-blue-700">
              Department Wise Summary
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
                  <th className="rounded-tl-lg px-5 py-3 text-left text-sm font-bold uppercase">
                    Department
                  </th>

                  <th className="px-4 py-3 text-center text-sm font-bold uppercase">
                    Total Employees
                  </th>

                  <th className="px-4 py-3 text-center text-sm font-bold uppercase">
                    Present
                  </th>

                  <th className="px-4 py-3 text-center text-sm font-bold uppercase">
                    Absent
                  </th>

                  <th className="px-4 py-3 text-center text-sm font-bold uppercase">
                    On OT (Running)
                  </th>

                  <th className="px-4 py-3 text-center text-sm font-bold uppercase">
                    <div>Total On Duty</div>
                    <div className="text-[10px] font-normal">
                      (Including OT)
                    </div>
                  </th>

                  <th className="rounded-tr-lg px-4 py-3 text-center text-sm font-bold uppercase">
                    % Present
                  </th>
                </tr>
              </thead>

              <tbody>
                {departmentData.map((row) => (
                  <tr
                    key={row.department}
                    className="border-b border-blue-100 bg-white transition hover:bg-blue-50/40"
                  >
                    <td className="px-5 py-3 text-left text-sm font-semibold text-slate-800">
                      {row.department}
                    </td>

                    <td className="px-4 py-3 text-center text-sm font-semibold text-slate-800">
                      {formatNumber(row.totalEmployees)}
                    </td>

                    <td className="px-4 py-3 text-center text-sm font-bold text-green-600">
                      {formatNumber(row.present)}
                    </td>

                    <td className="px-4 py-3 text-center text-sm font-bold text-red-500">
                      {formatNumber(row.absent)}
                    </td>

                    <td className="px-4 py-3 text-center text-sm font-bold text-orange-500">
                      {formatNumber(row.otRunning)}
                    </td>

                    <td className="px-4 py-3 text-center text-sm font-bold text-blue-700">
                      {formatNumber(row.totalOnDuty)}
                    </td>

                    <td className="px-4 py-3 text-center text-sm font-bold text-green-600">
                      {row.percentagePresent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* Total */}
              <tfoot>
                <tr className="bg-[#031642] text-white">
                  <td className="rounded-bl-lg px-5 py-3 text-left text-base font-bold">
                    {totalRow.department}
                  </td>

                  <td className="px-4 py-3 text-center text-base font-bold">
                    {formatNumber(totalRow.totalEmployees)}
                  </td>

                  <td className="px-4 py-3 text-center text-base font-bold text-green-500">
                    {formatNumber(totalRow.present)}
                  </td>

                  <td className="px-4 py-3 text-center text-base font-bold text-red-500">
                    {formatNumber(totalRow.absent)}
                  </td>

                  <td className="px-4 py-3 text-center text-base font-bold text-orange-400">
                    {formatNumber(totalRow.otRunning)}
                  </td>

                  <td className="px-4 py-3 text-center text-base font-bold text-blue-400">
                    {formatNumber(totalRow.totalOnDuty)}
                  </td>

                  <td className="rounded-br-lg px-4 py-3 text-center text-base font-bold text-green-500">
                    {totalRow.percentagePresent.toFixed(2)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <a href="/production-floor-portal" >Click here to go to Production Floor Portal</a><br/>
          <a href="/attendance-dashboard">Go to Attendance Dashboard</a>
        </section>

        {/* =================================================
            FOOTER
        ================================================= */}
        <footer className="flex flex-col gap-3 bg-[#031642] px-6 py-4 text-white md:flex-row md:items-center md:justify-between">
          {/* Left */}
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />

            <span>ACCURATE</span>

            <span className="text-cyan-400">•</span>

            <span>RELIABLE</span>

            <span className="text-cyan-400">•</span>

            <span>INTEGRATED</span>
          </div>

          {/* Center */}
          <div className="flex items-center gap-2 text-xs">
            <Bell className="h-5 w-5 text-cyan-400" />

            <span>
              Every Punch Counts! Ensure accurate attendance.
            </span>
          </div>

          {/* Right */}
          <div className="text-xs">
            Powered by{" "}
            <span className="ml-2 text-lg font-bold text-cyan-400">
              SYNEXIS ERP
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AttendanceSummary;