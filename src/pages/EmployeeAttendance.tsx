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

//   const API_URL =
//     "http://172.16.1.190:8000/virdi/api.php?apikey=Nz@2025&pUnit=ho&pPunchID=30476&pDateFrom=01/12/2025&pDateTo=31/12/2025";

//   useEffect(() => {
//     fetchAttendance();
//   }, []);

//   const fetchAttendance = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(API_URL);
//       const result: AttendanceApiResponse = await response.json();

//       if (result.status === "success") {
//         const processed = buildAttendance(result.data);
//         setRows(processed);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

  /**
   * Remove punches within 10 minutes
   */

   // ADD THIS

const MOCK_RESPONSE: AttendanceApiResponse = {
    status: "success",
    row_count: 73,
    data: [
      "2025-12-01 10:04:47.000",
      "2025-12-01 10:07:02.000",
      "2025-12-01 10:07:14.000",
      "2025-12-01 10:07:53.000",
      "2025-12-01 19:19:07.000",
      "2025-12-02 10:03:26.000",
      "2025-12-02 15:02:51.000",
      "2025-12-02 19:10:16.000",
      "2025-12-02 19:11:01.000",
      "2025-12-03 10:01:31.000",
      "2025-12-03 17:02:47.000",
      "2025-12-04 09:52:59.000",
      "2025-12-04 18:21:02.000",
      "2025-12-06 10:39:01.000",
      "2025-12-07 09:47:35.000",
      "2025-12-07 17:33:14.000",
      "2025-12-08 10:19:38.000",
      "2025-12-08 19:03:18.000",
      "2025-12-09 09:28:59.000",
      "2025-12-09 13:41:47.000",
      "2025-12-09 18:55:10.000",
      "2025-12-10 10:00:59.000",
      "2025-12-10 19:29:36.000",
      "2025-12-11 09:37:31.000",
      "2025-12-11 17:52:24.000",
      "2025-12-11 19:11:49.000",
      "2025-12-11 20:35:05.000",
      "2025-12-13 10:46:36.000",
      "2025-12-13 14:45:32.000",
      "2025-12-13 17:31:28.000",
      "2025-12-13 18:27:29.000",
      "2025-12-14 09:51:34.000",
      "2025-12-14 17:33:29.000",
      "2025-12-14 18:45:28.000",
      "2025-12-15 09:50:00.000",
      "2025-12-15 14:03:28.000",
      "2025-12-15 19:02:36.000",
      "2025-12-17 10:06:05.000",
      "2025-12-17 18:04:09.000",
      "2025-12-18 10:00:17.000",
      "2025-12-20 10:06:23.000",
      "2025-12-20 10:07:49.000",
      "2025-12-20 16:18:09.000",
      "2025-12-20 18:23:36.000",
      "2025-12-20 18:24:26.000",
      "2025-12-21 10:00:55.000",
      "2025-12-21 17:35:48.000",
      "2025-12-21 18:54:15.000",
      "2025-12-21 18:54:44.000",
      "2025-12-22 10:03:14.000",
      "2025-12-22 17:39:32.000",
      "2025-12-22 18:32:18.000",
      "2025-12-22 19:37:24.000",
      "2025-12-22 19:54:33.000",
      "2025-12-23 09:55:58.000",
      "2025-12-23 17:38:27.000",
      "2025-12-23 19:25:10.000",
      "2025-12-23 19:25:14.000",
      "2025-12-24 10:11:16.000",
      "2025-12-24 14:41:13.000",
      "2025-12-24 19:46:49.000",
      "2025-12-27 10:36:57.000",
      "2025-12-27 15:00:24.000",
      "2025-12-27 17:07:57.000",
      "2025-12-28 11:26:56.000",
      "2025-12-28 17:44:56.000",
      "2025-12-28 19:06:14.000",
      "2025-12-29 10:00:43.000",
      "2025-12-29 14:17:36.000",
      "2025-12-29 19:47:24.000",
      "2025-12-30 10:22:17.000",
      "2025-12-30 16:29:28.000",
      "2025-12-30 20:28:54.000",
    ],
  };
  
  useEffect(() => {
    setLoading(true);
  
    setTimeout(() => {
      const processed = buildAttendance(MOCK_RESPONSE.data);
  
      setRows(processed);
  
      setLoading(false);
    }, 500);
  }, []);

  const filterPunches = (punches: Date[]) => {
    if (punches.length === 0) return [];

    const filtered: Date[] = [punches[0]];

    for (let i = 1; i < punches.length; i++) {
      const prev = filtered[filtered.length - 1];

      const diffMinutes =
        (punches[i].getTime() - prev.getTime()) / (1000 * 60);

      if (diffMinutes > 10) {
        filtered.push(punches[i]);
      }
    }

    return filtered;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDuration = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();

    const totalMinutes = Math.ceil(diffMs / (1000 * 60));

    const hours = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");

    const minutes = (totalMinutes % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const buildAttendance = (rawData: string[]): AttendanceRow[] => {
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

    for (let day = 1; day <= 31; day++) {
      const currentDate = `2025-12-${String(day).padStart(2, "0")}`;

      const punches = grouped[currentDate] || [];

      const filteredPunches = filterPunches(
        punches.sort((a, b) => a.getTime() - b.getTime())
      );

      const jsDate = new Date(currentDate);

      const weekDay = jsDate.toLocaleDateString("en-GB", {
        weekday: "short",
      });

      const displayDate = `${day}/${jsDate.getMonth() + 1}/${jsDate.getFullYear()}`;

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

        continue;
      }

      /**
       * No punch
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

        continue;
      }

      const firstIn = filteredPunches[0];
      const lastOut = filteredPunches[filteredPunches.length - 1];

      const hasLogout =
        filteredPunches.length > 1 &&
        firstIn.getTime() !== lastOut.getTime();

      finalRows.push({
        date: displayDate,
        day: weekDay,
        status: "P",
        login: formatTime(firstIn),
        logout: hasLogout ? formatTime(lastOut) : "",
        duration: hasLogout
          ? formatDuration(firstIn, lastOut)
          : "",
      });
    }

    return finalRows;
  };

  const summary = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        if (row.status === "P") acc.present += 1;
        else if (row.status === "A") acc.absent += 1;
        else acc.holiday += 1;

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
      <div className="border border-gray-400">
        <div className="bg-gray-200 text-center font-bold text-lg py-2 border-b">
          Monthly Summary of Mohammad Shahidul Islam ID: 30476
        </div>

        <div className="p-4 grid grid-cols-2 gap-3 text-sm border-b">
          <div>
            <strong>Dimension:</strong> NZ Textile Ltd.
          </div>

          <div>
            <strong>Designation:</strong> AGM
          </div>

          <div>
            <strong>Joining Date:</strong> 01/08/2024
          </div>

          <div>
            <strong>Department:</strong> IT
          </div>

          <div>
            <strong>Grade:</strong> Grade-1
          </div>

          <div>
            <strong>Shift:</strong> Day 09:30-18:00
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Login</th>
              <th className="border p-2">Logout</th>
              <th className="border p-2">Duration</th>
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
            ) : (
              rows.map((row, index) => {
                const isHoliday =
                  row.status !== "P" && row.status !== "A";

                return (
                  <tr
                    key={index}
                    className={`
                      ${
                        isHoliday
                          ? "bg-yellow-200"
                          : row.status === "A"
                          ? "bg-red-100"
                          : ""
                      }
                    `}
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

        <div className="p-4 text-sm border-t">
          <div className="font-semibold">
            Total:
          </div>

          <div className="mt-2">
            P: {summary.present}, A: {summary.absent},
            Holiday: {summary.holiday}
          </div>

          <div className="mt-4 text-gray-600">
            Note:
          </div>

          <ul className="list-disc ml-5 mt-1 text-gray-600">
            <li>
              Any punch within 10 minutes is ignored.
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