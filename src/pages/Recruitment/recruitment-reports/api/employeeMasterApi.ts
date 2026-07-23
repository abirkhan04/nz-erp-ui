
import { api } from "../../../../api/client";
import { API_ROUTES } from "../../../../api/routes";
import {
  type EmployeeMasterListRequest,
} from "../types/employeeMaster";

export const getEmployeeMasterList = async (
  params: EmployeeMasterListRequest
) => {
  const response =
    await api.get(
      `${API_ROUTES.EMPLOYEE_REPORTS}/master-list`,
      {
        params,
      }
    );

  return response.data;
};