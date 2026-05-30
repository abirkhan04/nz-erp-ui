import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

(pdfMake as any).vfs = pdfFonts.vfs;

import checkMark from "../../assets/checkmark.png";

pdfMake.fonts = {
    Roboto: {
        normal: "Roboto-Regular.ttf",
        bold: "Roboto-Medium.ttf",
        italics: "Roboto-Italic.ttf",
        bolditalics: "Roboto-MediumItalic.ttf",
    },
};

const imageToBase64 = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement("canvas");

            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");

            ctx?.drawImage(img, 0, 0);

            resolve(canvas.toDataURL("image/png"));
        };

        img.onerror = reject;
        img.src = src;
    });
};

export const generateMedicalFitnessSlip = async (
    report: any,
    employee?: any,
    employeePhoto?: string
) => {

    const checkMarkBase64 = await imageToBase64(checkMark);
    const bloodGroupMap: Record<number, string> = {
        1: "B+",
        2: "A+",
        3: "AB+",
        4: "O+",
        5: "B-",
        6: "A-",
        7: "AB-",
        8: "O-",
    };

    const bloodGroup =
        bloodGroupMap[report.bloodGroupTested] || "-";

    const gender =
        report.gender === 1
            ? "Male"
            : report.gender === 2
                ? "Female"
                : "Other";

    const physicalExam = JSON.parse(
        report.physicalExaminationDataJson || "{}"
    );

    const infoRow = (
        label: string,
        value?: string
    ) => ({
        columns: [
            {
                text: label,
                width: 110,
                bold: true,
                fontSize: 10,
            },
            {
                text: ":",
                width: 10,
            },
            {
                text: value || "-",
                width: "*",
                fontSize: 10,
            },
        ],
        margin: [0, 0, 0, 4],
    });

    const docDefinition: any = {
        pageSize: "A4",

        pageMargins: [12, 12, 12, 12],

        defaultStyle: {
            fontSize: 10,
        },

        content: [
            {
                table: {
                    widths: [180, "*", 120],

                    body: [
                        [
                            {
                                border: [true, true, false, true],

                                stack: [
                                    {
                                        text: report.companyName,
                                        fontSize: 18,
                                        bold: true,
                                        color: "#0b1f78",
                                    },

                                    {
                                        text: "Gazipur, Bangladesh",
                                        fontSize: 10,
                                    },
                                ],
                            },

                            {
                                border: [false, true, false, true],

                                stack: [
                                    {
                                        text: "MEDICAL FITNESS SLIP",
                                        alignment: "center",
                                        bold: true,
                                        fontSize: 20,
                                        color: "#0b1f78",
                                    },

                                    {
                                        text: "(FIT FOR EMPLOYMENT)",
                                        alignment: "center",
                                        bold: true,
                                        fontSize: 14,
                                        color: "#0b1f78",
                                        margin: [0, 5, 0, 0],
                                    },
                                ],
                            },

                            {
                                table: {
                                    widths: ["*"],
                                    body: [
                                        [
                                            {
                                                text: "SLIP NO.",
                                                bold: true,
                                                alignment: "center",
                                                margin: [0, 5],
                                            },
                                        ],
                                        [
                                            {
                                                text: report.medicalFitnessCheckId.substring(0, 8).toUpperCase(),
                                                alignment: "center",
                                                margin: [0, 5],
                                            },
                                        ],
                                        [
                                            {
                                                text: "DATE",
                                                bold: true,
                                                alignment: "center",
                                                margin: [0, 5],
                                            },
                                        ],
                                        [
                                            {
                                                text: new Date(
                                                    report.examinationDateTime
                                                ).toLocaleDateString(),
                                                alignment: "center",
                                                margin: [0, 5],
                                            },
                                        ],
                                    ],
                                },
                                layout: {
                                    hLineWidth: () => 1,
                                    vLineWidth: () => 1,
                                },
                            },
                        ],
                    ],
                },
            },

            {
                text:
                    "This is to certify that the candidate mentioned below has been medically examined and found fit for employment.",
                alignment: "center",
                margin: [0, 12, 0, 15],
            },

            {
                columns: [
                    {
                        width: 180,

                        table: {
                            body: [
                                [
                                    {
                                        text:
                                            "Temporary Candidate ID",
                                        alignment: "center",
                                        bold: true,
                                    },
                                ],

                                [
                                    {
                                        text: report.enrollmentId,
                                        alignment: "center",
                                        fontSize: 18,
                                        bold: true,
                                        color: "#0b1f78",
                                        margin: [0, 12],
                                    },
                                ],

                                [
                                    {
                                        text:
                                            "|||||||||||||||||||||||||||||||",
                                        alignment: "center",
                                    },
                                ],
                            ],
                        },
                    },

                    {
                        width: "*",

                        margin: [15, 0, 10, 0],

                        stack: [
                            infoRow(
                                "Candidate Name",
                                report.employeeName
                            ),

                            infoRow(
                                "Father's Name",
                                report.fatherName
                            ),

                            infoRow(
                                "Mother's Name",
                                report.motherName
                            ),

                            infoRow(
                                "Date of Birth",
                                report.dateOfBirth
                                    ? new Date(
                                        report.dateOfBirth
                                    ).toLocaleDateString()
                                    : "-"
                            ),

                            infoRow("Gender", gender),

                            infoRow(
                                "Blood Group",
                                bloodGroup
                            ),
                        ],
                    },
                    employeePhoto
                        ? {
                            width: 120,

                            table: {
                                widths: [110],
                                heights: [140],

                                body: [
                                    [
                                        {
                                            image: employeePhoto,
                                            fit: [100, 130],
                                            alignment: "center",
                                        },
                                    ],
                                ],
                            },
                        }
                        : {
                            width: 120,

                            table: {
                                widths: [110],
                                heights: [130],

                                body: [
                                    [
                                        {
                                            text: "",
                                        },
                                    ],
                                ],
                            },
                        },
                ],
            },

            {
                margin: [0, 15, 0, 0],

                table: {
                    widths: ["33%", "33%", "34%"],

                    body: [
                        [
                            {
                                stack: [
                                    {
                                        text: "PRESENT ADDRESS",
                                        bold: true,
                                        alignment: "center",
                                        color: "#0b1f78",
                                        margin: [0, 0, 0, 10],
                                    },

                                    infoRow(
                                        "Village",
                                        report.presentVillageAreaRoad
                                    ),

                                    infoRow(
                                        "Post Office",
                                        report.presentPostOffice
                                    ),

                                    infoRow(
                                        "PS / Thana",
                                        report.presentThana
                                    ),

                                    infoRow(
                                        "District",
                                        report.presentDistrict
                                    ),

                                    infoRow(
                                        "Division",
                                        report.presentDivision
                                    ),
                                ],
                            },

                            {
                                stack: [
                                    {
                                        text: "JOB INFORMATION",
                                        bold: true,
                                        alignment: "center",
                                        color: "#0b1f78",
                                        margin: [0, 0, 0, 10],
                                    },

                                    infoRow(
                                        "Company",
                                        report.companyName
                                    ),

                                    infoRow(
                                        "Department",
                                        report.departmentName
                                    ),

                                    infoRow(
                                        "Section",
                                        report.sectionName
                                    ),

                                    infoRow(
                                        "Designation",
                                        report.designationName
                                    ),

                                    infoRow(
                                        "Employee ID",
                                        report.enrollmentId
                                    ),
                                ],
                            },

                            {
                                stack: [
                                    {
                                        text: "MEDICAL DETAILS",
                                        bold: true,
                                        alignment: "center",
                                        color: "#0b1f78",
                                        margin: [0, 0, 0, 10],
                                    },

                                    infoRow(
                                        "Height",
                                        `${report.heightCm || "-"} cm`
                                    ),

                                    infoRow(
                                        "Weight",
                                        `${report.weightKg || "-"} kg`
                                    ),

                                    infoRow(
                                        "Blood Group",
                                        bloodGroup
                                    ),

                                    infoRow(
                                        "Remarks",
                                        report.remarks
                                    ),
                                ],
                            },
                        ],
                    ],
                },
            },

            {
                margin: [0, 18, 0, 0],

                table: {
                    headerRows: 2,

                    widths: [30, 180, 70, 70, "*"],

                    body: [
                        [
                            {
                                text:
                                    "PHYSICAL EXAMINATION",
                                colSpan: 5,
                                alignment: "center",
                                bold: true,
                                fillColor: "#f4f6fb",
                                color: "#0b1f78",
                                margin: [0, 5],
                            },
                            {},
                            {},
                            {},
                            {},
                        ],

                        [
                            {
                                text: "SL.",
                                bold: true,
                                alignment: "center",
                            },

                            {
                                text: "CHECKUP ITEMS",
                                bold: true,
                            },

                            {
                                text: "NORMAL",
                                bold: true,
                                alignment: "center",
                            },

                            {
                                text: "ABNORMAL",
                                bold: true,
                                alignment: "center",
                            },

                            {
                                text: "REMARKS",
                                bold: true,
                            },
                        ],

                        [
                            "1",
                            "Vision",

                            physicalExam.vision?.toLowerCase() === "normal"
                                ? {
                                    image: checkMarkBase64,
                                    fit: [24, 24],
                                    alignment: "center",
                                }
                                : {
                                    text: "",
                                },

                            physicalExam.vision?.toLowerCase() !== "normal"
                                ? {
                                    image: checkMarkBase64,
                                    fit: [12, 12],
                                    alignment: "center",
                                }
                                : {
                                    text: "",
                                },

                            physicalExam.vision || "",
                        ],

                        [
                            "2",

                            "Hearing",

                            physicalExam.hearing?.toLowerCase() === "normal"
                                ? {
                                    image: checkMarkBase64,
                                    fit: [18, 18],
                                    alignment: "center",
                                }
                                : "",

                            physicalExam.hearing?.toLowerCase() !== "normal"
                                ? {
                                    image: checkMarkBase64,
                                    fit: [18, 18],
                                    alignment: "center",
                                }
                                : "",

                            physicalExam.hearing || "",
                        ],

                        [
                            "3",

                            "Heart",

                            physicalExam.heart?.toLowerCase() === "normal"
                                ? {
                                    image: checkMarkBase64,
                                    fit: [18, 18],
                                    alignment: "center",
                                }
                                : "",

                            physicalExam.heart?.toLowerCase() !== "normal"
                                ? {
                                    image: checkMarkBase64,
                                    fit: [18, 18],
                                    alignment: "center",
                                }
                                : "",

                            physicalExam.heart || "",
                        ],
                        [
                            "4",

                            "Chest / Lungs",

                            physicalExam.chestLungs?.toLowerCase() === "normal"
                                ? {
                                    image: checkMarkBase64,
                                    fit: [18, 18],
                                    alignment: "center",
                                }
                                : "",

                            physicalExam.chestLungs?.toLowerCase() !== "normal"
                                ? {
                                    image: checkMarkBase64,
                                    fit: [18, 18],
                                    alignment: "center",
                                }
                                : "",

                            physicalExam.chestLungs || "",
                        ],
                    ],
                },
            },

            {
                margin: [0, 18, 0, 0],

                table: {
                    widths: ["33%", "33%", "34%"],

                    body: [
                        [
                            {
                                stack: [
                                    {
                                        text:
                                            "OVERALL FITNESS STATUS",
                                        bold: true,
                                        alignment: "center",
                                        margin: [0, 0, 0, 15],
                                    },

                                    {
                                        text:
                                            report.isFit
                                                ? "FIT"
                                                : "NOT FIT",

                                        alignment: "center",

                                        bold: true,

                                        fontSize: 22,

                                        color: "white",

                                        fillColor:
                                            report.isFit
                                                ? "#1e8e3e"
                                                : "#d93025",

                                        margin: [20, 8],
                                    },
                                ],
                            },

                            {
                                stack: [
                                    {
                                        text:
                                            "FITNESS DECISION",
                                        bold: true,
                                        alignment: "center",
                                        margin: [0, 0, 0, 15],
                                    },

                                    {
                                        text: report.isFit
                                            ? "[X] Fit For Employment"
                                            : "[ ] Fit For Employment",

                                        margin: [10, 5],
                                    },

                                    {
                                        text: !report.isFit
                                            ? "[X] Not Fit For Employment"
                                            : "[ ] Not Fit For Employment",

                                        margin: [10, 5],
                                    },
                                ],
                            },

                            {
                                stack: [
                                    {
                                        text: "REMARKS",
                                        bold: true,
                                        alignment: "center",
                                        margin: [0, 0, 0, 15],
                                    },

                                    {
                                        text:
                                            report.remarks ||
                                            "Fit for employment",
                                    },
                                ],
                            },
                        ],
                    ],
                },
            },

            {
                margin: [0, 25, 0, 0],

                table: {
                    widths: ["33%", "34%", "33%"],

                    body: [
                        [
                            {
                                stack: [
                                    {
                                        text:
                                            "EXAMINED BY (DOCTOR)",

                                        bold: true,
                                    },

                                    {
                                        text:
                                            report.examinedByDoctor ||
                                            "Dr. S. Rahman",

                                        margin: [0, 20, 0, 5],
                                    },

                                    {
                                        text:
                                            "Company Doctor",
                                    },
                                ],
                            },

                            {
                                stack: [
                                    {
                                        text:
                                            "DOCTOR SIGNATURE",

                                        bold: true,

                                        alignment: "center",
                                    },

                                    {
                                        text:
                                            report.examinedByDoctor ||
                                            "",

                                        italics: true,

                                        fontSize: 18,

                                        alignment: "center",

                                        margin: [0, 20, 0, 5],
                                    },

                                    {
                                        text:
                                            "_________________",

                                        alignment: "center",
                                    },
                                ],
                            },

                            {
                                stack: [
                                    {
                                        text:
                                            "EXAMINATION DATE",

                                        bold: true,
                                    },

                                    {
                                        text: new Date(
                                            report.examinationDateTime
                                        ).toLocaleString(),

                                        margin: [0, 20, 0, 0],
                                    },
                                ],
                            },
                        ],
                    ],
                },
            },

            {
                margin: [0, 25, 0, 0],

                text:
                    "PLEASE HAND OVER THIS SLIP TO HR EXECUTIVE FOR FURTHER PROCESSING",

                alignment: "center",

                bold: true,

                color: "#0b1f78",

                fontSize: 11,
            },
        ],
    };

    pdfMake.createPdf(docDefinition).open();
};