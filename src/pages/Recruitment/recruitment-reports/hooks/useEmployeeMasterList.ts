import { keepPreviousData, useQuery } from "@tanstack/react-query";


import { getEmployeeMasterList } from "../api/employeeMasterApi";
import { type EmployeeMasterListRequest } from "../types/employeeMaster";

export default function useEmployeeMasterList(
    request: EmployeeMasterListRequest
) {

    console.log("request-->", request);
    return useQuery({
        queryKey: ["employee-master-list", {
            ...request,
            includeInactive: false,
        }],
        queryFn: () => getEmployeeMasterList({
            ...request,
            includeInactive: false,
        }),

        placeholderData: keepPreviousData,

        staleTime: 0,
    });
}