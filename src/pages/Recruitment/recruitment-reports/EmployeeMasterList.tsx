import { useMemo, useState } from "react";

import EmployeeMasterFilter from "./components/EmployeeMasterFilter";
import { employeeMasterColumns } from "./components/EmployeeMasterColumns";
import useEmployeeMasterList from "./hooks/useEmployeeMasterList";
import ReportTable from "../../../components/table/ReportTable";
import type { EmployeeMasterListRequest } from "./types/employeeMaster";
import type { EmployeeMasterFilterModel } from "../../../types/interfaces";
import { FileText, FileSpreadsheet } from "lucide-react";
import { api } from "../../../api/client";
import { API_ROUTES } from "../../../api/routes";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import BackButton from "../../../components/BackButton";

pdfMake.addVirtualFileSystem(pdfFonts);

export default function EmployeeMasterList() {


    const handleExportExcel = async (
        request: EmployeeMasterListRequest
    ) => {
        const response = await api.get(
            `${API_ROUTES.EMPLOYEE_REPORTS}/master-list/export`,
            {
                params: {
                    ...request,
                    includeInactive: false,
                    pageNumber: 1,
                    pageSize: 10000,
                },
                responseType: "blob",
            }
        );

        const blob = new Blob([response.data], {
            type: response.headers["content-type"],
        });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;

        // Try to get filename from Content-Disposition header
        const contentDisposition = response.headers["content-disposition"];
        const match = contentDisposition?.match(/filename="?(.+?)"?$/);

        link.download = match?.[1] ?? "EmployeeMasterList.xlsx";

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const handleExportPdf = async (
        request: EmployeeMasterListRequest
    ) => {
        const response = await api.get(
            `${API_ROUTES.EMPLOYEE_REPORTS}/master-list`,
            {
                params: {
                    ...request,
                    pageNumber: 1,
                    pageSize: 10000,
                },
            }
        );

        const employees = response.data.employees;

        const documentDefinition:TDocumentDefinitions = {
            pageSize: "A4",
            pageOrientation: "landscape",

            content: [
                {
                    text: "Employee Master List",
                    style: "header",
                    margin: [0, 0, 0, 10],
                },
                {
                    table: {
                        headerRows: 1,
                        widths: [
                            70, // Employee Code
                            "*", // Employee Name
                            "*", // Department
                            "*", // Designation
                            80, // Nature
                            70, // Cell
                            80, // Section
                            70, // Join Date
                            45, // Active
                        ],

                        body: [
                            [
                                { text: "Code", style: "tableHeader" },
                                { text: "Name", style: "tableHeader" },
                                { text: "Department", style: "tableHeader" },
                                { text: "Designation", style: "tableHeader" },
                                { text: "Nature", style: "tableHeader" },
                                { text: "Cell", style: "tableHeader" },
                                { text: "Section", style: "tableHeader" },
                                { text: "Joining Date", style: "tableHeader" },
                                { text: "Active", style: "tableHeader" },
                            ],

                            ...employees.map((e: any) => [
                                e.employeeCode ?? "",
                                e.employeeName ?? "",
                                e.departmentName ?? "",
                                e.designationName ?? "",
                                e.employeeNature ?? "",
                                e.cellName ?? "",
                                e.sectionName ?? "",
                                e.joiningDate
                                    ? new Date(e.joiningDate).toLocaleDateString()
                                    : "",
                                e.isActive ? "Yes" : "No",
                            ]),
                        ],
                    },

                    layout: "lightHorizontalLines",
                },
            ],

            styles: {
                header: {
                    fontSize: 16,
                    bold: true,
                    alignment: "center",
                },

                tableHeader: {
                    bold: true,
                    fillColor: "#E5E7EB",
                    alignment: "left",
                },
            },

            defaultStyle: {
                fontSize: 9,
            },
        };

        pdfMake.createPdf(documentDefinition).print();
    };


    const [request, setRequest] =
        useState<EmployeeMasterListRequest>({
            pageNumber: 1,
            pageSize: 10,
        });

    const {
        data,
        isLoading,
        isFetching,
    } = useEmployeeMasterList(request);

    const columns = useMemo(
        () => employeeMasterColumns,
        []
    );

    const handleSearch = (
        filters: EmployeeMasterFilterModel
    ) => {
        setRequest((prev) => ({
            ...prev,

            ...filters,

            pageNumber: 1,
        }));

    };

    const handleReset = () => {

        setRequest({
            pageNumber: 1,
            pageSize: request.pageSize,
        });

    };

    return (
        <div className="space-y-6">
            <BackButton url={"/recruitment/recruitment-reports"}/>
            <EmployeeMasterFilter

                loading={isFetching}

                onSearch={handleSearch}

                onReset={handleReset}

            />

            <ReportTable

                data={data?.employees ?? []}

                columns={columns}

                loading={isLoading || isFetching}

                pageNumber={request.pageNumber}

                pageSize={request.pageSize}

                totalCount={data?.totalCount ?? 0}

                onPageChange={(page) =>
                    setRequest((prev) => ({
                        ...prev,
                        pageNumber: page,
                    }))
                }

                onPageSizeChange={(size) =>
                    setRequest((prev) => ({
                        ...prev,
                        pageNumber: 1,
                        pageSize: size,
                    }))
                }

            />

            <div className="mt-4 flex justify-center gap-3">
                <button
                    type="button"
                    onClick={() => handleExportExcel(request)}
                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-medium text-emerald-700 shadow-sm transition-all hover:bg-emerald-100 hover:border-emerald-300"
                >
                    <FileSpreadsheet size={18} />
                    Export to Excel
                </button>

                <button
                    type="button"
                    onClick={() => handleExportPdf(request)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-700 shadow-sm transition-all hover:bg-red-100 hover:border-red-300"
                >
                    <FileText size={18} />
                    Export to PDF
                </button>
            </div>

        </div>
    );
}
