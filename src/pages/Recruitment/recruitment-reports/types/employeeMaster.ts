import { type PaginationRequest } from "./pagination";

export interface EmployeeMasterListRequest
  extends PaginationRequest {
  unitId?: number;
  subUnitId?: number;
  departmentId?: number;
  sectionId?: number;
  cellId?: number;
  employeeNatureId?: number;
  includeInactive?: boolean;

  joiningFromDate?: string;
  joiningToDate?: string;
}