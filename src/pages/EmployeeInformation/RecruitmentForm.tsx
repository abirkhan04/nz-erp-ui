import { useFormContext } from "react-hook-form";

import type { EmployeeFormValues } from "./EmployeeFormValues";

const RecruitmentForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();

  return (
        <div
            className="
            w-full
            max-w-[1200px]
            mx-auto
            overflow-x-hidden
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-x-2
            gap-y-5
            px-2
        "
        >
      {/* ======================================================
          ০১. প্রতিষ্ঠানের বিবরণ
      ====================================================== */}
  
      <div className="lg:col-span-2 min-w-0">
        <h2 className="text-lg font-semibold border-b pb-2 mb-4">
          ০১. প্রতিষ্ঠানের বিবরণ
        </h2>
      </div>
  
      {/* Factory Location */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          ফ্যাক্টরি লোকেশন
        </label>
  
        <select
          {...register("companyName")}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">সিলেক্ট করুন</option>
          <option value="Factory 1">Factory 1</option>
          <option value="Factory 2">Factory 2</option>
        </select>
  
        {errors.companyName && (
          <p className="text-red-500 text-sm mt-1 break-words">
            {errors.companyName.message}
          </p>
        )}
      </div>
  
      {/* Department */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          বিভাগ
        </label>
  
        <select
          {...register("department")}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">সিলেক্ট করুন</option>
          <option value="HR">HR</option>
          <option value="Accounts">Accounts</option>
          <option value="Production">Production</option>
        </select>
      </div>
  
      {/* Section */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          সেকশন
        </label>
  
        <select
          {...register("section")}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">সিলেক্ট করুন</option>
          <option value="Section A">Section A</option>
          <option value="Section B">Section B</option>
        </select>
      </div>
  
      {/* ======================================================
          ০২. প্রার্থীর পরিচয় ও তথ্য
      ====================================================== */}
  
      <div className="lg:col-span-2 mt-4 min-w-0">
        <h2 className="text-lg font-semibold border-b pb-2 mb-4">
          ০২. প্রার্থীর পরিচয় ও তথ্য
        </h2>
      </div>
  
      {/* Enrollment ID */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          এনরোলমেন্ট আইডি
        </label>
  
        <input
          type="text"
          {...register("employeeId")}
          placeholder="NZ-ERP-AUTO"
          className="w-full border rounded-md px-3 py-2 bg-gray-100"
          readOnly
        />
      </div>
  
      {/* Candidate Name */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          প্রার্থীর পূর্ণ নাম
        </label>
  
        <input
          type="text"
          {...register("employeeNameEnglish")}
          placeholder="NID অনুযায়ী লিখুন"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* NID */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          জাতীয় পরিচয়পত্র নং
        </label>
  
        <input
          type="text"
          {...register("nidNumber")}
          placeholder="তথ্যটি লিখুন"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* Gender */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          জেন্ডার / লিঙ্গ
        </label>
  
        <select
          {...register("gender")}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">সিলেক্ট করুন</option>
          <option value="Male">পুরুষ</option>
          <option value="Female">মহিলা</option>
          <option value="Other">অন্যান্য</option>
        </select>
      </div>
  
      {/* Date of Birth */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          জন্ম তারিখ
        </label>
  
        <input
          type="date"
          {...register("dateOfBirth")}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* Joining Date */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          যোগদানের তারিখ
        </label>
  
        <input
          type="date"
          {...register("joiningDate")}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* Proposed Salary */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          প্রস্তাবিত বেতন (মাসিক)
        </label>
  
        <input
          type="number"
          {...register("grossSalary")}
          placeholder="টাকা"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* Father Name */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          পিতার নাম
        </label>
  
        <input
          type="text"
          {...register("fatherNameEnglish")}
          placeholder="তথ্যটি লিখুন"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* Mother Name */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          মাতার নাম
        </label>
  
        <input
          type="text"
          {...register("motherNameEnglish")}
          placeholder="তথ্যটি লিখুন"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* ======================================================
          ০৩. প্রার্থীর ঠিকানা
      ====================================================== */}
  
      <div className="lg:col-span-2 mt-4 min-w-0">
        <h2 className="text-lg font-semibold border-b pb-2 mb-4">
          ০৩. প্রার্থীর ঠিকানা
        </h2>
      </div>
  
      {/* Permanent Address */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          স্থায়ী ঠিকানা
        </label>
  
        <input
          type="text"
          {...register("permanentVillageRoadHouse")}
          placeholder="গ্রাম / এলাকা / রাস্তা"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* Permanent Post Office */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          ডাকঘর
        </label>
  
        <input
          type="text"
          {...register("permanentPostOffice")}
          placeholder="ডাকঘর"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* Permanent Thana */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          থানা / উপজেলা
        </label>
  
        <input
          type="text"
          {...register("permanentThanaUpazila")}
          placeholder="থানা / উপজেলা"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* Permanent District */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          জেলা / বিভাগ
        </label>
  
        <input
          type="text"
          {...register("permanentDistrict")}
          placeholder="জেলা / বিভাগ"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* Present Address */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          বর্তমান ঠিকানা
        </label>
  
        <input
          type="text"
          {...register("presentVillageRoadHouse")}
          placeholder="গ্রাম / এলাকা / রাস্তা"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* Present Post Office */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          ডাকঘর
        </label>
  
        <input
          type="text"
          {...register("presentPostOffice")}
          placeholder="ডাকঘর"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* Present Thana */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          থানা / উপজেলা
        </label>
  
        <input
          type="text"
          {...register("presentThanaUpazila")}
          placeholder="থানা / উপজেলা"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* Present District */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          জেলা / বিভাগ
        </label>
  
        <input
          type="text"
          {...register("presentDistrict")}
          placeholder="জেলা / বিভাগ"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* ======================================================
          ০৪. রেফারেন্স বিবরণ
      ====================================================== */}
  
      <div className="lg:col-span-2 mt-4 min-w-0">
        <h2 className="text-lg font-semibold border-b pb-2 mb-4">
          ০৪. রেফারেন্স বিবরণ
        </h2>
      </div>
  
      {/* Reference Name */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          রেফারেন্স ব্যক্তির নাম
        </label>
  
        <input
          type="text"
          {...register("employeeReference")}
          placeholder="তথ্যটি লিখুন"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* Reference ID */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          রেফারেন্স ব্যক্তির আইডি (Ref ID)
        </label>
  
        <input
          type="text"
          {...register("documentNumber")}
          placeholder="তথ্যটি লিখুন"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* ======================================================
          ০৫. অনুমোদন ও যাচাইকরণ
      ====================================================== */}
  
      <div className="lg:col-span-2 mt-4 min-w-0">
        <h2 className="text-lg font-semibold border-b pb-2 mb-4">
          ০৫. অনুমোদন ও যাচাইকরণ
        </h2>
      </div>
  
      {/* Security Clearance */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          প্রধান গেট - সিকিউরিটি ক্লিয়ারেন্স
        </label>
  
        <input
          type="text"
          placeholder="স্বাক্ষর ও তারিখ"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* Enrollment By */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          এনরোলমেন্ট বাই
        </label>
  
        <input
          type="text"
          placeholder="আইডি ও স্বাক্ষর"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
  
      {/* Biometric Enrolled By */}
      <div className="min-w-0">
        <label className="block text-sm font-medium mb-1">
          বায়োমেট্রিক এনরোল্ড বাই
        </label>
  
        <input
          type="text"
          placeholder="আইডি ও স্বাক্ষর"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
    </div>
  );
};

export default RecruitmentForm;
