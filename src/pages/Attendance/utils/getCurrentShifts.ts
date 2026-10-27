import { API_ROUTES } from "../../../api/routes";
import { useGet } from "../../../hooks/useGet";

export const useCurrentShift = () => {
    const { data: shifts = [] } = useGet<any[]>({
        key: ["shifts"],
        url: `${API_ROUTES.SHIFTS}?includeInactive=false`,
    });

    const rosterShifts = shifts.filter(
        (shift: any) => shift.shiftType === "Roster" && shift.isActive
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


    const getPreviousShift = () => {
        const currentShift = getCurrentShift();

        if (!currentShift || rosterShifts.length === 0) {
            return undefined;
        }

        const toMinutes = (time: string) => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes;
        };

        const currentStart = toMinutes(currentShift.startTime);

        // Find the shift that ends closest to the current shift's start.
        return rosterShifts
            .filter((shift) => shift.id !== currentShift.id)
            .map((shift) => {
                const start = toMinutes(shift.startTime);
                let end = toMinutes(shift.endTime);

                if (end <= start) {
                    end += 24 * 60;
                }

                // Calculate how long ago this shift ended.
                let elapsed = currentStart - end;

                if (elapsed < 0) {
                    elapsed += 24 * 60;
                }

                return { shift, elapsed };
            })
            .sort((a, b) => a.elapsed - b.elapsed)[0]?.shift;
    };


    return {
        shifts,
        rosterShifts,
        currentShift: getCurrentShift(),
        previousShift: getPreviousShift(),
    };
};