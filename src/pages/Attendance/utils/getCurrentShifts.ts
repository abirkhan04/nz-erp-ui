import { API_ROUTES } from "../../../api/routes";
import { useGet } from "../../../hooks/useGet";

export const useCurrentShift = () => {
    const { data: shifts = [] } = useGet<any[]>({
        key: ["shifts"],
        url: `${API_ROUTES.SHIFTS}?includeInactive=false`,
    });

    const rosterShifts = shifts.filter(
        (shift:any) => shift.shiftType === "Roster" && shift.isActive
    );

    const getCurrentShift = () => {
        const now = new Date();

        const currentMinutes =
            now.getHours() * 60 + now.getMinutes();

        return rosterShifts.find((shift) => {
            const [startHour, startMinute] =
                shift.startTime.split(":").map(Number);

            const [endHour, endMinute] =
                shift.endTime.split(":").map(Number);

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

    return {
        shifts,
        rosterShifts,
        currentShift: getCurrentShift(),
    };
};