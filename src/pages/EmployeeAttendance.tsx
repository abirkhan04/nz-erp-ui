import React, { useEffect, useMemo, useState } from "react";

type AttendanceApiResponse = {
  status: string;
  row_count: number;
  data: string[];
};

type AttendanceRow = {
  date: string;
  day: string;
  status: string;
  login: string;
  logout: string;
  duration: string;
};

type FormValues = {
  apikey: string;
  pUnit: string;
  pPunchID: string;
  pDateFrom: string;
  pDateTo: string;
};

const HOLIDAYS: Record<string, string> = {
  "2025-12-05": "Weekly Holiday",
  "2025-12-12": "Weekly Holiday",
  "2025-12-16": "Victory Day",
  "2025-12-19": "Weekly Holiday",
  "2025-12-25": "Christmas Day",
  "2025-12-26": "Weekly Holiday",
  "2025-12-31": "National Mourning Day",
};

const AttendanceTable = () => {
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormValues>({
    apikey: "Nz@2025",
    pUnit: "ho",
    pPunchID: "30476",
    pDateFrom: "01/12/2025",
    pDateTo: "31/12/2025",
  });

  /**
   * Initial Load
   */
  useEffect(() => {
    fetchAttendance();
  }, []);

  /**
   * Fetch Attendance
   */
  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        apikey: form.apikey,
        pUnit: form.pUnit,
        pPunchID: form.pPunchID,
        pDateFrom: formatDateForApi(form.pDateFrom),
        pDateTo: formatDateForApi(form.pDateTo),
      });

      const API_URL = `http://175.29.147.115:8000/virdi/api.php?${queryParams.toString()}`;
      // const API_URL = "http://175.29.147.115:8000/virdi/api.php?apikey=Nz@2025&pUnit=textile&pPunchID=51430046&pDateFrom=01/05/2026&pDateTo=31/05/2026";

      const response = await fetch(API_URL);

      const result: AttendanceApiResponse =
        await response.json();

      if (result.status === "success") {
        const processed = buildAttendance(
          result.data,
          formatDateForApi(form.pDateFrom),
          formatDateForApi(form.pDateTo)
        );

        setRows(processed);
      } else {
        setRows([]);
      }
    } catch (error) {
      console.error(error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Input Change
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle Submit
   */
  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    fetchAttendance();
  };

  /**
   * Remove punches within 10 minutes
   */
  const filterPunches = (punches: Date[]) => {
    if (punches.length === 0) return [];

    const filtered: Date[] = [punches[0]];

    for (let i = 1; i < punches.length; i++) {
      const prev = filtered[filtered.length - 1];

      const diffMinutes =
        (punches[i].getTime() - prev.getTime()) /
        (1000 * 60);

      if (diffMinutes > 10) {
        filtered.push(punches[i]);
      }
    }

    return filtered;
  };

  /**
   * Format Time
   */
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  /**
   * Format Duration
   */
  const formatDuration = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();

    const totalMinutes = Math.ceil(
      diffMs / (1000 * 60)
    );

    const hours = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");

    const minutes = (totalMinutes % 60)
      .toString()
      .padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const formatDateForApi = (date: string) => {
    const [year, month, day] = date.split("-");
  
    return `${day}/${month}/${year}`;
  };

  /**
   * Build Attendance
   */
  const buildAttendance = (
    rawData: string[],
    fromDate: string,
    toDate: string
  ): AttendanceRow[] => {
    const grouped: Record<string, Date[]> = {};

    rawData.forEach((item) => {
      const date = new Date(item);

      const dateKey = item.split(" ")[0];

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(date);
    });

    const finalRows: AttendanceRow[] = [];

    /**
     * Convert DD/MM/YYYY -> Date
     */
    const convertToDate = (dateString: string) => {
      const [day, month, year] =
        dateString.split("/");

      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );
    };

    const startDate = convertToDate(fromDate);

    const endDate = convertToDate(toDate);

    const current = new Date(startDate);

    while (current <= endDate) {
      const year = current.getFullYear();

      const month = String(
        current.getMonth() + 1
      ).padStart(2, "0");

      const day = String(current.getDate()).padStart(
        2,
        "0"
      );

      const currentDate = `${year}-${month}-${day}`;

      const punches = grouped[currentDate] || [];

      const filteredPunches = filterPunches(
        punches.sort(
          (a, b) => a.getTime() - b.getTime()
        )
      );

      const weekDay =
        current.toLocaleDateString("en-GB", {
          weekday: "short",
        });

      const displayDate = `${day}/${month}/${year}`;

      /**
       * Holiday
       */
      if (HOLIDAYS[currentDate]) {
        finalRows.push({
          date: displayDate,
          day: weekDay,
          status: HOLIDAYS[currentDate],
          login: "",
          logout: "",
          duration: "",
        });

        current.setDate(current.getDate() + 1);

        continue;
      }

      /**
       * Absent
       */
      if (filteredPunches.length === 0) {
        finalRows.push({
          date: displayDate,
          day: weekDay,
          status: "A",
          login: "",
          logout: "",
          duration: "",
        });

        current.setDate(current.getDate() + 1);

        continue;
      }

      const firstIn = filteredPunches[0];

      const lastOut =
        filteredPunches[filteredPunches.length - 1];

      const hasLogout =
        filteredPunches.length > 1 &&
        firstIn.getTime() !== lastOut.getTime();

      finalRows.push({
        date: displayDate,
        day: weekDay,
        status: "P",
        login: formatTime(firstIn),
        logout: hasLogout
          ? formatTime(lastOut)
          : "",
        duration: hasLogout
          ? formatDuration(firstIn, lastOut)
          : "",
      });

      current.setDate(current.getDate() + 1);
    }

    return finalRows;
  };

  /**
   * Summary
   */
  const summary = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        if (row.status === "P") {
          acc.present += 1;
        } else if (row.status === "A") {
          acc.absent += 1;
        } else {
          acc.holiday += 1;
        }

        return acc;
      },
      {
        present: 0,
        absent: 0,
        holiday: 0,
      }
    );
  }, [rows]);

  return (
    <div className="p-4 overflow-auto">
      <div className="border border-gray-400 rounded-md overflow-hidden">
        <div className="bg-gray-200 text-center font-bold text-lg py-3 border-b">
          Monthly Attendance Summary
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-b"
        >
          <div>
            <label className="block text-sm mb-1">
              API Key
            </label>

            <input
              type="text"
              name="apikey"
              value={form.apikey}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Unit
            </label>

            <input
              type="text"
              name="pUnit"
              value={form.pUnit}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Punch ID
            </label>

            <input
              type="text"
              name="pPunchID"
              value={form.pPunchID}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Date From
            </label>

            <input
                type="date"
                name="pDateFrom"
                value={form.pDateFrom}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Date To
            </label>

            <input
                type="date"
                name="pDateTo"
                value={form.pDateTo}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Fetch Attendance
            </button>
          </div>
        </form>

        {/* TABLE */}
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>

              <th className="border p-2">
                Status
              </th>

              <th className="border p-2">
                Login
              </th>

              <th className="border p-2">
                Logout
              </th>

              <th className="border p-2">
                Duration
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center p-5 border"
                >
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center p-5 border"
                >
                  No data found
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                const isHoliday =
                  row.status !== "P" &&
                  row.status !== "A";

                return (
                  <tr
                    key={index}
                    className={`${
                      isHoliday
                        ? "bg-yellow-200"
                        : row.status === "A"
                        ? "bg-red-100"
                        : ""
                    }`}
                  >
                    <td className="border p-2">
                      {row.date} {row.day}
                    </td>

                    <td className="border p-2 text-center">
                      {row.status}
                    </td>

                    <td className="border p-2 text-center">
                      {row.login}
                    </td>

                    <td className="border p-2 text-center">
                      {row.logout}
                    </td>

                    <td className="border p-2 text-center">
                      {row.duration}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* SUMMARY */}
        <div className="p-4 text-sm border-t">
          <div className="font-semibold">
            Total:
          </div>

          <div className="mt-2">
            P: {summary.present}, A:{" "}
            {summary.absent}, Holiday:{" "}
            {summary.holiday}
          </div>

          <div className="mt-4 text-gray-600">
            Note:
          </div>

          <ul className="list-disc ml-5 mt-1 text-gray-600">
            <li>
              Any punch within 10 minutes is
              ignored.
            </li>

            <li>
              First punch = Login time.
            </li>

            <li>
              Last punch = Logout time.
            </li>

            <li>
              Duration = Logout - Login.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;