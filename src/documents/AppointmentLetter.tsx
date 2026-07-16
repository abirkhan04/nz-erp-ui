import { forwardRef } from "react";

interface AppointmentLetterProps {
    employee: {
        date: string;
        employeeId: string;
        name: string;
        fatherName: string;
        motherName: string;
        spouseName?: string;
        presentAddress: string;
        permanentAddress: string;
        joiningDate: string;
        grade: string;
        designation: string;
        department: string;
        section: string;
        basicSalary: string;
        houseRent: string;
        medicalAllowance: string;
        conveyanceAllowance: string;
        foodAllowance: string;
        grossSalary: string;
    };
}

const InfoRow = ({
    label,
    value,
}: {
    label: string;
    value: string;
}) => (
    <div className="flex min-w-0">
        <div className="w-[90px] shrink-0">{label}</div>
        <div className="w-4 shrink-0">:</div>
        <div
            className="flex-1 min-w-0"
            style={{
                overflowWrap: "break-word",
                wordBreak: "break-word",
            }}
        >
            {value}
        </div>
    </div>
);

const noBreakStyle: React.CSSProperties = {
    pageBreakInside: "avoid",
    breakInside: "avoid",
};

export const AppointmentLetter = forwardRef<
    HTMLDivElement,
    AppointmentLetterProps
>(({ employee }, ref) => {
    return (
        <div
            ref={ref}
            className="
                w-[190mm]
                mx-auto
                bg-white
                px-[10mm]
                py-[10mm]
                text-[13px]
                leading-[1.9]
                text-black
            "
            style={{
                fontFamily:
                    "'Noto Sans Bengali', sans-serif",
            }}
        >
            <div className="space-y-4">
                {/* Header */}
                <div
                    className="grid grid-cols-3 gap-x-8 gap-y-2 break-inside-avoid"
                    style={noBreakStyle}
                >
                    <InfoRow
                        label="তারিখ"
                        value={employee.date}
                    />

                    <InfoRow
                        label="আই ডি নং"
                        value={employee.employeeId}
                    />

                    <div />

                    <InfoRow
                        label="নাম"
                        value={employee.name}
                    />

                    <InfoRow
                        label="মাতার নাম"
                        value={employee.motherName}
                    />

                    <InfoRow
                        label="স্বামী/স্ত্রীর নাম"
                        value={employee.spouseName ?? ""}
                    />

                    <InfoRow
                        label="পিতার নাম"
                        value={employee.fatherName}
                    />

                    <div />

                    <div />

                    <InfoRow
                        label="বর্তমান ঠিকানা"
                        value={employee.presentAddress}
                    />

                    <InfoRow
                        label="স্থায়ী ঠিকানা"
                        value={employee.permanentAddress}
                    />
                </div>

                <div className="text-center mt-8">
                    <span className="font-bold inline-block border-b border-black pb-1">
                        বিষয়ঃ নিয়োগ পত্র
                    </span>
                </div>

                <p>জনাব/জনাবা,</p>

                <p className="text-justify">
                    আপনার আবেদনপত্র এবং কর্তৃপক্ষের
                    সাথে সাক্ষাৎকারের পরিপ্রেক্ষিতে
                    আপনাকে জানানো যাইতেছে যে,
                    <span className="font-semibold">
                        {" "}
                        {employee.joiningDate}
                    </span>
                    ইং তারিখ হইতে নিম্নবর্ণিত শর্তে
                    আপনাকে অত্র প্রতিষ্ঠানে নিয়োগ
                    প্রদান করা হইল।
                </p>

                {/* Clause 1 */}
                <div
                    className="break-inside-avoid"
                    style={noBreakStyle}
                >
                    <p>
                        ১) আপনার বর্তমান পদবী হইবে -
                    </p>

                    <div className="grid grid-cols-4 gap-4 mt-3 pl-6">
                        <div>
                            পদঃ {employee.designation}
                        </div>

                        <div>
                            গ্রেডঃ {employee.grade}
                        </div>

                        <div>
                            সেকশনঃ {employee.section}
                        </div>

                        <div>
                            বিভাগঃ {employee.department}
                        </div>
                    </div>

                    <p className="pl-6 mt-3">
                        তবে, কর্তৃপক্ষ যে কোন সময়
                        আপনার পদবী/কাজের প্রকৃতি
                        পরিবর্তন করিতে পারিবে।
                    </p>
                </div>

                {/* Salary */}
                <div
                    className="break-inside-avoid"
                    style={noBreakStyle}
                >
                    <p>
                        ২) আপনার মাসিক বেতন বিভাজন
                        হইবে নিম্নরূপঃ
                    </p>

                    <div className="mt-4 pl-8 max-w-[500px] space-y-2">
                        <div className="flex justify-between">
                            <span>ক. মূল মজুরী</span>
                            <span>
                                {employee.basicSalary} টাকা
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>
                                খ. বাড়ী ভাড়া (মূল
                                মজুরীর ৫৫%)
                            </span>

                            <span>
                                {employee.houseRent} টাকা
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>গ. চিকিৎসা ভাতা</span>

                            <span>
                                {
                                    employee.medicalAllowance
                                }{" "}
                                টাকা
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>
                                ঘ. যাতায়াত ভাতা
                            </span>

                            <span>
                                {
                                    employee.conveyanceAllowance
                                }{" "}
                                টাকা
                            </span>
                        </div>

                        <div className="flex justify-between border-b border-black pb-2">
                            <span>ঙ. খাদ্য ভাতা</span>

                            <span>
                                {employee.foodAllowance} টাকা
                            </span>
                        </div>

                        <div className="flex justify-between font-bold text-lg">
                            <span>মোট মজুরী =</span>

                            <span>
                                {employee.grossSalary} টাকা
                            </span>
                        </div>
                    </div>
                </div>

                {/* Clauses */}
                <p
                    className="text-justify break-inside-avoid"
                    style={noBreakStyle}
                >
                    ৩) আপনি চাকুরীর প্রথম (০৩) মাস
                    শিক্ষানবীশ হিসাবে থাকিবেন।
                    শিক্ষানবীশ থাকাকালীন যদি আপনার কাজের মান
                    ভাল না হয়, তবে কর্তৃপক্ষ কোন প্রকার পূর্ব
                    নোটিশ এবং কারণ দর্শানো ব্যতিরেকে আপনাকে
                    চাকুরী হইতে অপসারণ করিতে পারিবে। এই সময়
                    আপনি কোন প্রকার অবকাশ ভাতাদি পাইবেন না।
                    চাকুরী স্থায়ী হওয়ার পর আপনি চাকুরী থেকে
                    ইস্তফা দিতে চাইলে, (০২) দুই মাস আগে
                    কর্তৃপক্ষকে লিখিত আকারে জানাইতে হইবে।
                    অন্যথায়, দুই মাসের সমপরিমাণ মূল বেতন
                    কোম্পানীকে প্রদান করিতে হইবে।
                </p>

                <p
                    className="text-justify break-inside-avoid"
                    style={noBreakStyle}
                >
                    ৪) স্বাভাবিক কর্ম সময় দিনে ৮ ঘন্টা। কর্তৃপক্ষ প্রয়োজন বোধে আপনাকে অতিরিক্ত সময় কাজ করাইতে পারিবে, যা স্বেচ্ছায় নিবেদন যোগ্য। সেই ক্ষেত্রে, এই অতিরিক্ত সময়ের জন্য মূল মজুরীর দ্বিগুণ হারে মজুরী পরিশোধ করা হইবে। যাহার হিসাব এরূপঃ (মূল বেতন / ২০৮) × ২ × অতিরিক্ত কর্মঘন্টা।
                </p>

                <div
                    className="break-inside-avoid"
                    style={noBreakStyle}
                >
                    <p>
                        ৫) প্রতি এক (১) বছরে আপনি
                        নিম্নলিখিত ছুটি ভোগ করিতে
                        পারিবেনঃ
                    </p>

                    <div className="ml-8 mt-2 space-y-1">
                        <p>
                            ক) উৎসব ছুটি - ১৩ দিন
                            (পূর্ণ মজুরী সহ)
                        </p>

                        <p>
                            খ) বার্ষিক ছুটি  –  প্রতি ১৮ কর্ম দিবসের জন্য ১দিন (মূল মজুরী সহ), যাহারা কমপক্ষে ১ বছর চাকুরীর মেয়াদ উত্তীর্ণ করিয়াছে।
                        </p>

                        <p>
                            গ) নৈমিত্তিক ছুটি - ১০ দিন(পূর্ণ মজুরী সহ)
                        </p>

                        <p>
                            ঘ) অসুস্থতা ছুটি - ১৪ দিন(পূর্ণ মজুরী সহ)
                        </p>

                        <p>
                            ঙ) মাতৃত্ব ছুটি - ১২০ দিন
                        </p>
                    </div>
                </div>

                <p
                    className="break-inside-avoid"
                    style={noBreakStyle}
                >
                    ৬) চাকুরী স্থায়ীকরণের পর
                    প্রত্যেক কর্মচারী দুই ঈদে ২ টি
                    বোনাস পাইবেন।
                </p>

                <p
                    className="break-inside-avoid"
                    style={noBreakStyle}
                >
                    ৭)  আপনি যদি কোম্পানীর কোনরূপ ‘অসদাচরণের’ অপরাধে দোষী প্রমাণিত হন, তবে কর্তৃপক্ষ আপনার বিরুদ্ধে বাংলাদেশ শ্রম আইন অনুযায়ী শাস্তিমূলক ব্যবস্থা গ্রহণ করিবে।
                </p>

                <p
                    className="break-inside-avoid"
                    style={noBreakStyle}
                >
                    ৮) কর্তৃপক্ষ যেকোন সময় আপনার চাকুরীর অবসান করিতে পারিবেন। সেক্ষেত্রে ১২০ দিন আগে লিখিত নোটিশ প্রদান করিবে অথবা নোটিশের পরিবর্তে সমপরিমাণ অর্থ বেতন প্রদান করিবে। এছাড়াও অন্যান্য পাওনাদি যেমন অর্জিত ছুটি, গ্রাচুইটি বেনিফিট/গ্র্যাচুইটি এবং চলতি মাসের বেতনসহ ওভার টাইম বাবদ অর্থ প্রদান করিবে।
                </p>

                <p
                    className="break-inside-avoid"
                    style={noBreakStyle}
                >
                    ৯)  আপনি কোম্পানীর অন্যান্য সুযোগ-সুবিধাদি (যেমন মাসিক হাজিরা বোনাস ও অন্যান্য সুবিধা) কোম্পানীর প্রচলিত নিয়ম অনুযায়ী পাইবেন।
                </p>

                <p
                    className="break-inside-avoid"
                    style={noBreakStyle}
                >
                    ১০) আপনার চাকুরীর বয়স শেষ হইবার অবধি ৬ (ছয়) মাস নিয়োগের জন্য পরীক্ষাধীন থাকিবেন।
                </p>

                <p
                    className="break-inside-avoid"
                    style={noBreakStyle}
                >
                    ১১) সর্বোপরি, আপনার চাকুরী অন্যান্য শর্তাবলী কোম্পানীর নিজস্ব আইন এবং বাংলাদেশ শ্রম আইন অনুযায়ী পরিচালিত হইবে।
                </p>

                <div
                    className="mt-12 break-inside-avoid"
                    style={noBreakStyle}
                >
                    <p className="text-center">
                        আমি এই নিয়োগ পত্র পড়িয়া এবং
                        ইহাতে বর্ণিত শর্তাদি সম্পূর্ণ
                        অবগত হইয়া নিয়োগ পত্র গ্রহণ
                        করিয়া স্বাক্ষর করিলাম।
                    </p>

                    <div className="flex justify-between mt-20">
                        <div className="w-56 border-t border-black pt-2 text-center">
                            মানব সম্পদ বিভাগ
                        </div>

                        <div className="w-56 border-t border-black pt-2 text-center">
                            কর্মীর স্বাক্ষর
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

AppointmentLetter.displayName =
    "AppointmentLetter";