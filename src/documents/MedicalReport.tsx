import  { forwardRef } from "react";

interface MedicalReportProps {
    employee: {
        slipNo: string;
        date: string;
        enrollmentId: string;

        name: string;
        fatherName: string;
        motherName: string;
        dateOfBirth: string;
        age: string;
        gender: string;
        bloodGroup: string;

        village: string;
        postOffice: string;
        policeStation: string;
        upazila: string;
        district: string;

        company: string;
        unit: string;
        department: string;
        designation: string;

        height: string;
        weight: string;
        testedBloodGroup: string;
        identificationMark: string;

        doctorName: string;
        doctorQualification: string;

        isFit: boolean;
        remarks: string;

        photoUrl?: string;
    };
}

const LabelValue = ({
    label,
    value,
}: {
    label: string;
    value: string;
}) => (
    <div
        style={{
            display: "grid",
            gridTemplateColumns: "34mm 4mm 1fr",
            marginBottom: "2mm",
            fontSize: "10px",
        }}
    >
        <div>{label}</div>
        <div>:</div>
        <div>{value}</div>
    </div>
);

export const MedicalReport = forwardRef<
    HTMLDivElement,
    MedicalReportProps
>(({ employee }, ref) => {
    const borderColor = "#6b7db8";
    const titleColor = "#29489c";

    return (
        <div
            ref={ref}
            style={{
                width: "210mm",
                maxHeight: "297mm",
                background: "#ffffff",
                padding: "6mm",
                boxSizing: "border-box",
                fontFamily: "'Noto Sans Bengali', sans-serif",
                border: `1.5px solid ${borderColor}`,
                borderRadius: "8px",
                color: "#111",
                fontSize: "10px",
                lineHeight: 1.3,
                overflow: "hidden"
            }}
        >
            {/* ================= HEADER ================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "58mm 82mm 52mm",
                    alignItems: "start",
                }}
            >
                <div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3mm",
                        }}
                    >
                        <img
                            src="/logo.png"
                            alt=""
                            style={{
                                width: "22mm",
                            }}
                        />

                        <div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    fontWeight: 700,
                                }}
                            >
                                এন. জেড টেক্সটাইল লি.
                            </div>

                            <div
                                style={{
                                    marginTop: "1mm",
                                }}
                            >
                                নারায়ণগঞ্জ, বাংলাদেশ
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            marginTop: "8mm",
                            fontSize: "8px",
                        }}
                    >
                        ( ধারা ০৪, ০৬, ০৭ ও ২৭৭ এর বিধি ০৪(১) ও ৩০৪(১)
                        অনুসারে )
                    </div>
                </div>

                <div
                    style={{
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            color: titleColor,
                            fontWeight: 700,
                            fontSize: "6mm",
                            lineHeight: 1,
                        }}
                    >
                        মেডিকেল ফিটনেস স্লিপ
                    </div>

                    <div
                        style={{
                            marginTop: "2mm",
                            fontWeight: 700,
                            fontSize: "4mm",
                        }}
                    >
                        (চাকরির জন্য উপযুক্ত)
                    </div>
                </div>

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "10px",
                    }}
                >
                    <tbody>
                        <tr>
                            <td
                                style={{
                                    border: `1px solid ${borderColor}`,
                                    padding: "2mm",
                                    width: "40%",
                                }}
                            >
                                স্লিপ নং
                            </td>

                            <td
                                style={{
                                    border: `1px solid ${borderColor}`,
                                    padding: "2mm",
                                }}
                            >
                                {employee.slipNo}
                            </td>
                        </tr>

                        <tr>
                            <td
                                style={{
                                    border: `1px solid ${borderColor}`,
                                    padding: "2mm",
                                }}
                            >
                                তারিখ
                            </td>

                            <td
                                style={{
                                    border: `1px solid ${borderColor}`,
                                    padding: "2mm",
                                }}
                            >
                                {employee.date}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ================= CANDIDATE ================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "62mm 82mm 42mm",
                    gap: "4mm",
                    marginTop: "6mm",
                }}
            >
                {/* Enrollment */}
                <div
                    style={{
                        border: `1.5px dashed ${borderColor}`,
                        borderRadius: "6px",
                        padding: "5mm",
                        textAlign: "center",
                        height: "48mm",
                    }}
                >
                    <div
                        style={{
                            fontSize: "6mm",
                            fontWeight: 700,
                            lineHeight: 1.1,
                        }}
                    >
                        এনরোলমেন্ট আইডি
                    </div>

                    <div
                        style={{
                            marginTop: "5mm",
                            fontWeight: 700,
                            fontSize: "7mm",
                            color: titleColor,
                        }}
                    >
                        {employee.enrollmentId}
                    </div>

                    {/* <div
                        style={{
                            marginTop: "6mm",
                        }}
                    >
                        <Barcode
                            value={employee.enrollmentId}
                            width={1.3}
                            height={35}
                            displayValue={false}
                            margin={0}
                        />
                    </div> */}
                </div>

                {/* Candidate */}
                <div>
                    <LabelValue
                        label="প্রার্থীর নাম"
                        value={employee.name}
                    />

                    <LabelValue
                        label="পিতার নাম"
                        value={employee.fatherName}
                    />

                    <LabelValue
                        label="মাতার নাম"
                        value={employee.motherName}
                    />

                    <LabelValue
                        label="জন্ম তারিখ"
                        value={`${employee.dateOfBirth} (${employee.age})`}
                    />

                    <LabelValue
                        label="লিঙ্গ"
                        value={employee.gender}
                    />

                    <LabelValue
                        label="রক্তের গ্রুপ"
                        value={employee.bloodGroup}
                    />
                </div>

                {/* Photo */}
                <div
                    style={{
                        width: "40mm",
                        height: "52mm",
                        border: `1px solid ${borderColor}`,
                        borderRadius: "4px",
                        overflow: "hidden",
                    }}
                >
                    {employee.photoUrl && (
                        <img
                            src={employee.photoUrl}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    )}
                </div>
            </div>

            {/* ================= THREE PANELS ================= */}

            <div
                style={{
                    marginTop: "4mm",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    border: `1px solid ${borderColor}`,
                }}
            >
                {[
                    {
                        title: "বর্তমান ঠিকানা",
                        content: (
                            <>
                                <LabelValue
                                    label="গ্রাম"
                                    value={employee.village}
                                />
                                <LabelValue
                                    label="ডাকঘর"
                                    value={employee.postOffice}
                                />
                                <LabelValue
                                    label="থানা"
                                    value={employee.policeStation}
                                />
                                <LabelValue
                                    label="উপজেলা"
                                    value={employee.upazila}
                                />
                                <LabelValue
                                    label="জেলা"
                                    value={employee.district}
                                />
                            </>
                        ),
                    },
                    {
                        title: "চাকরির তথ্য",
                        content: (
                            <>
                                <LabelValue
                                    label="কোম্পানি / ইউনিট"
                                    value={employee.company}
                                />
                                <LabelValue
                                    label="সাব ইউনিট / শেড"
                                    value={employee.unit}
                                />
                                <LabelValue
                                    label="বিভাগ"
                                    value={employee.department}
                                />
                                <LabelValue
                                    label="আবেদনকৃত পদ"
                                    value={employee.designation}
                                />
                            </>
                        ),
                    },
                    {
                        title: "মেডিকেল তথ্য",
                        content: (
                            <>
                                <LabelValue
                                    label="উচ্চতা"
                                    value={employee.height}
                                />
                                <LabelValue
                                    label="ওজন"
                                    value={employee.weight}
                                />
                                <LabelValue
                                    label="পরীক্ষিত রক্তের গ্রুপ"
                                    value={
                                        employee.testedBloodGroup
                                    }
                                />
                                <LabelValue
                                    label="সনাক্তকরণ চিহ্ন"
                                    value={
                                        employee.identificationMark
                                    }
                                />
                            </>
                        ),
                    },
                ].map((item, i) => (
                    <div
                        key={i}
                        style={{
                            borderRight:
                                i !== 2
                                    ? `1px solid ${borderColor}`
                                    : undefined,
                        }}
                    >
                        <div
                            style={{
                                borderBottom: `1px solid ${borderColor}`,
                                textAlign: "center",
                                padding: "2mm",
                                color: titleColor,
                                fontWeight: 700,
                            }}
                        >
                            {item.title}
                        </div>

                        <div
                            style={{
                                padding: "3mm",
                            }}
                        >
                            {item.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= EXAM TABLE ================= */}

            <table
                style={{
                    width: "100%",
                    marginTop: "4mm",
                    borderCollapse: "collapse",
                    fontSize: "9px",
                }}
            >
                <thead>
                    <tr>
                        <th
                            colSpan={5}
                            style={{
                                border: `1px solid ${borderColor}`,
                                padding: "2mm",
                                color: titleColor,
                            }}
                        >
                            শারীরিক পরীক্ষা
                        </th>
                    </tr>

                    <tr>
                        {[
                            "ক্রঃ নং",
                            "পরীক্ষার বিষয়",
                            "স্বাভাবিক",
                            "অস্বাভাবিক",
                            "মন্তব্য",
                        ].map((x) => (
                            <th
                                key={x}
                                style={{
                                    border: `1px solid ${borderColor}`,
                                    padding: "2mm",
                                }}
                            >
                                {x}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td
                            style={{
                                border: `1px solid ${borderColor}`,
                                textAlign: "center",
                                height: "8mm",
                            }}
                        >
                            ১
                        </td>

                        <td
                            style={{
                                border: `1px solid ${borderColor}`,
                                textAlign: "center",
                            }}
                        >
                            রক্তচাপ
                        </td>

                        <td
                            style={{
                                border: `1px solid ${borderColor}`,
                                textAlign: "center",
                            }}
                        >
                            ✔
                        </td>

                        <td
                            style={{
                                border: `1px solid ${borderColor}`,
                                textAlign: "center",
                            }}
                        >
                            —
                        </td>

                        <td
                            style={{
                                border: `1px solid ${borderColor}`,
                                textAlign: "center",
                            }}
                        >
                            স্বাভাবিক
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* ================= FITNESS ================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    marginTop: "4mm",
                    border: `1px solid ${borderColor}`,
                }}
            >
                <div
                    style={{
                        borderRight: `1px solid ${borderColor}`,
                        padding: "4mm",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            fontWeight: 700,
                            color: titleColor,
                            marginBottom: "4mm",
                        }}
                    >
                        সার্বিক শারীরিক অবস্থা
                    </div>

                    <div
                        style={{
                            width: "28mm",
                            height: "16mm",
                            background: "#0d7d2f",
                            color: "white",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: 700,
                            fontSize: "6mm",
                            margin: "auto",
                        }}
                    >
                        ফিট
                    </div>
                </div>

                <div
                    style={{
                        borderRight: `1px solid ${borderColor}`,
                        padding: "4mm",
                    }}
                >
                    <div
                        style={{
                            color: titleColor,
                            fontWeight: 700,
                            marginBottom: "4mm",
                        }}
                    >
                        ফিটনেস সিদ্ধান্ত
                    </div>

                    <div>☑ চাকরির জন্য উপযুক্ত</div>
                    <div style={{ marginTop: "2mm" }}>
                        ☐ চাকরির জন্য অনুপযুক্ত
                    </div>
                </div>

                <div
                    style={{
                        padding: "4mm",
                    }}
                >
                    <div
                        style={{
                            color: titleColor,
                            fontWeight: 700,
                            marginBottom: "4mm",
                        }}
                    >
                        মন্তব্য (যদি থাকে)
                    </div>

                    {employee.remarks}
                </div>
            </div>

            {/* ================= DECLARATION ================= */}

            <div
                style={{
                    textAlign: "center",
                    marginTop: "4mm",
                    fontSize: "9px",
                }}
            >
                এতদ্বারা প্রত্যয়ন করা যাচ্ছে যে, নিম্নে বর্ণিত
                প্রার্থীকে মেডিকেল পরীক্ষা করা হয়েছে এবং আমাদের
                প্রতিষ্ঠানে চাকরির জন্য শারীরিকভাবে উপযুক্ত (FIT)
                পাওয়া গেছে।
            </div>

            {/* ================= SIGNATURE ================= */}

            <div
                style={{
                    marginTop: "4mm",
                    border: `1px solid ${borderColor}`,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                }}
            >
                <div
                    style={{
                        padding: "4mm",
                        borderRight: `1px solid ${borderColor}`,
                    }}
                >
                    <div
                        style={{
                            color: titleColor,
                            fontWeight: 700,
                            marginBottom: "4mm",
                        }}
                    >
                        পরীক্ষাকারী ডাক্তার
                    </div>

                    <div>{employee.doctorName}</div>
                    <div>{employee.doctorQualification}</div>

                    <div style={{ marginTop: "3mm" }}>
                        কোম্পানী ডাক্তার
                    </div>

                    <div>এন. জেড টেক্সটাইল লি.</div>
                </div>

                <div
                    style={{
                        padding: "4mm",
                        textAlign: "center",
                        borderRight: `1px solid ${borderColor}`,
                    }}
                >
                    <div
                        style={{
                            color: titleColor,
                            fontWeight: 700,
                            marginBottom: "3mm",
                        }}
                    >
                        ডাক্তারের স্বাক্ষর
                    </div>

                    <div
                        style={{
                            fontFamily: "cursive",
                            fontSize: "24px",
                        }}
                    >
                        S. Rahman
                    </div>

                    <div
                        style={{
                            marginTop: "2mm",
                            borderTop:
                                "1px dashed #777",
                            paddingTop: "2mm",
                        }}
                    >
                        কোম্পানীর সিল
                    </div>
                </div>

                <div
                    style={{
                        padding: "4mm",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            color: titleColor,
                            fontWeight: 700,
                            marginBottom: "8mm",
                        }}
                    >
                        কর্মচারীর স্বাক্ষর
                    </div>

                    <div
                        style={{
                            borderTop:
                                "1px solid #777",
                            marginTop: "20mm",
                        }}
                    />

                    <div
                        style={{
                            marginTop: "4mm",
                        }}
                    >
                        তারিখ: ___ / ___ / ______
                    </div>
                </div>
            </div>

            <div
                style={{
                    textAlign: "center",
                    marginTop: "10mm",
                    fontSize: "9px",
                }}
            >
                অনুগ্রহ করে পরবর্তী কার্যক্রমের জন্য এই স্লিপটি
                এইচআর এক্সিকিউটিভের নিকট জমা দিন।
            </div>
        </div>
    );
});

MedicalReport.displayName = "MedicalReport";