import { forwardRef } from "react";

interface AppointmentLetterProps {
  employee: {
    date: string;
    employeeId: string;
    name: string;
    fatherName: string;
    motherName: string;
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
  <div className="flex mb-1 text-sm">
    <div className="w-32">{label}</div>
    <div className="w-4">:</div>
    <div className="flex-1">{value}</div>
  </div>
);

export const AppointmentLetter = forwardRef<HTMLDivElement, AppointmentLetterProps>(
    ({ employee }, ref) => {
        return (
    <div
      ref={ref}
      id="appointment-letter"
      className="
        w-[210mm]
        min-h-[297mm]
        mx-auto
        bg-white
        p-10
        text-[12px]
        leading-6
        text-black
      "
      style={{
        fontFamily: "'Noto Sans Bengali', sans-serif",
      }}
    >
      <h1 className="text-center text-2xl font-bold mb-5">
        এন জেড এ্যাপারেলস লিমিটেড
      </h1>

      <InfoRow label="তারিখ" value={employee.date} />

      <InfoRow label="নাম" value={employee.name} />
      <InfoRow label="পিতার নাম" value={employee.fatherName} />
      <InfoRow label="মাতার নাম" value={employee.motherName} />
      <InfoRow label="আইডি নং" value={employee.employeeId} />

      <InfoRow
        label="বর্তমান ঠিকানা"
        value={employee.presentAddress}
      />

      <InfoRow
        label="স্থায়ী ঠিকানা"
        value={employee.permanentAddress}
      />

      <InfoRow
        label="যোগদানের তারিখ"
        value={employee.joiningDate}
      />

      <InfoRow label="গ্রেড" value={employee.grade} />
      <InfoRow label="পদবী" value={employee.designation} />
      <InfoRow label="বিভাগ" value={employee.department} />
      <InfoRow label="সেকশন" value={employee.section} />

      <h2 className="text-center text-lg font-semibold underline my-5">
        বিষয়ঃ নিয়োগ পত্র
      </h2>

      <p className="text-justify mb-4">
        আপনার আবেদনপত্র এবং সাক্ষাৎকারের ফলাফলের ভিত্তিতে আপনাকে
        নিম্নবর্ণিত শর্তসাপেক্ষে প্রতিষ্ঠানে নিয়োগ প্রদান করা হলো।
      </p>

      <table className="w-full mb-5">
        <tbody>
          <tr>
            <td className="py-1">মূল বেতন</td>
            <td className="text-right">{employee.basicSalary}</td>
          </tr>

          <tr>
            <td className="py-1">বাড়ী ভাড়া</td>
            <td className="text-right">{employee.houseRent}</td>
          </tr>

          <tr>
            <td className="py-1">চিকিৎসা ভাতা</td>
            <td className="text-right">
              {employee.medicalAllowance}
            </td>
          </tr>

          <tr>
            <td className="py-1">যাতায়াত ভাতা</td>
            <td className="text-right">
              {employee.conveyanceAllowance}
            </td>
          </tr>

          <tr>
            <td className="py-1">খাদ্য ভাতা</td>
            <td className="text-right">{employee.foodAllowance}</td>
          </tr>

          <tr className="font-semibold">
            <td className="py-1">মোট বেতন</td>
            <td className="text-right">{employee.grossSalary}</td>
          </tr>
        </tbody>
      </table>

      <div className="space-y-3 text-justify">
        <p>
          ৩) আপনি চাকুরীর প্রথম (০৩) মাস শিক্ষানবীশ হিসেবে থাকিবেন।
        </p>

        <p>৪) স্বাভাবিক কর্ম সময় দৈনিক ৮ ঘন্টা।</p>

        <div>
          <p>
            ৫) প্রতি বছর আপনি নিম্নলিখিত ছুটি ভোগ করিতে পারিবেন:
          </p>

          <div className="ml-6 mt-2 space-y-1">
            <p>ক) উৎসব ছুটি - ১০ দিন</p>
            <p>খ) বার্ষিক ছুটি - প্রতি ১৮ কর্মদিবসে ১ দিন</p>
            <p>গ) নৈমিত্তিক ছুটি - ১০ দিন</p>
            <p>ঘ) অসুস্থতাজনিত ছুটি - ১৪ দিন</p>
            <p>ঙ) মাতৃত্বকালীন ছুটি - ১২০ দিন</p>
          </div>
        </div>

        <p>
          ৬) স্থায়ীকরণের পর বছরে দুইটি উৎসব বোনাস প্রদান করা হবে।
        </p>

        <p>
          ৭) প্রতিষ্ঠানের শৃঙ্খলা ভঙ্গের ক্ষেত্রে শ্রম আইন অনুযায়ী ব্যবস্থা
          গ্রহণ করা হবে।
        </p>

        <p>
          ৮) প্রতিষ্ঠান প্রয়োজনে চাকুরীর অবসান ঘটাতে পারবে।
        </p>

        <p>
          ৯) কোম্পানির প্রচলিত নিয়ম অনুযায়ী সকল সুবিধা প্রদান করা হবে।
        </p>

        <p>
          ১০) মাসিক বেতন পরবর্তী ৭ কর্মদিবসের মধ্যে পরিশোধ করা হবে।
        </p>

        <p>
          ১১) অন্যান্য শর্তাবলী বাংলাদেশের শ্রম আইন অনুযায়ী পরিচালিত হবে।
        </p>
      </div>

      <p className="text-justify mt-5">
        আমি এই নিয়োগপত্রের শর্তাবলী পড়িয়া এবং বুঝিয়া গ্রহণ করিলাম।
      </p>

      <div className="flex justify-between mt-20">
        <div className="w-40 border-t border-black pt-2 text-center">
          মানব সম্পদ বিভাগ
        </div>

        <div className="w-40 border-t border-black pt-2 text-center">
          কর্মীর স্বাক্ষর
        </div>
      </div>
    </div>
  );
})
