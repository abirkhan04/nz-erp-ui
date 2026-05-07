import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";


import RecruitmentForm from "./EmployeeInformation/RecruitmentForm";
import EmployeeInformationForm from "./EmployeeInformation/EmployeeBasicForm";
import FinancialDetailsForm from "./EmployeeInformation/FinancialDetailsForm";
import AddressDetailsForm from "./EmployeeInformation/AddressDetailsForm";
import FamilyNomineeForm from "./EmployeeInformation/FamilyAndNomineeForm";
import DocumentsForm from "./EmployeeInformation/DocumentsForm";
import ReviewSubmitForm from "./EmployeeInformation/ReviewAndSubmit";

type StepItem = {
  id: number;
  title: string;
};

const steps: StepItem[] = [
    {
      id: 1,
      title: "Recruitment Form",
    },
    {
      id: 2,
      title: "Employee Information",
    },
    {
      id: 3,
      title: "Financial Details",
    },
    {
      id: 4,
      title: "Address Details",
    },
    {
      id: 5,
      title: "Family & Nominee",
    },
    {
      id: 6,
      title: "Documents",
    },
    {
      id: 7,
      title: "Review & Submit",
    },
  ];

const EmployeeOnboardingParent: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [formData] = useState({});

  const methods = useForm({
    mode: "onChange",
  });

  const handleNext = () => {
    if (activeStep < steps.length) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const renderStepComponent = () => {
    switch (activeStep) {
      case 1: 
         return <RecruitmentForm />  
      case 2:
        return <EmployeeInformationForm setActiveStep={setActiveStep}/>;

      case 3:
        return <FinancialDetailsForm />;

      case 4:
        return <AddressDetailsForm />;

      case 5:
        return <FamilyNomineeForm />;

      case 6:
        return <DocumentsForm />;

      case 7:
        return (
          <ReviewSubmitForm
            onEditStep={setActiveStep}
            formData={formData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-5">
      <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden">
        {/* HEADER / TAB STEPPER */}
<div className="border-b border-gray-200 bg-white px-6 py-4">
  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
    
    {/* STEP TABS */}
    <div className="flex items-center overflow-x-auto w-full scrollbar-hide">
      {steps.map((step) => {
        const isActive = activeStep === step.id;
        const isCompleted = step.id < activeStep;

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => setActiveStep(step.id)}
            className={`
              relative flex items-center gap-3
              px-4 py-3
              min-w-fit
              transition-all
              border-b-2
              
              ${
                isActive
                  ? "border-[#2F49FF]"
                  : "border-transparent"
              }
            `}
          >
            {/* STEP CIRCLE */}
            <div
              className={`
                w-7 h-7 rounded-full
                flex items-center justify-center
                text-xs font-semibold
                transition-all
                
                ${
                  isCompleted
                    ? "bg-[#E8F8EE] text-[#22C55E]"
                    : ""
                }

                ${
                  isActive
                    ? "bg-[#2F49FF] text-white"
                    : ""
                }

                ${
                  !isCompleted && !isActive
                    ? "border border-gray-300 text-gray-500 bg-white"
                    : ""
                }
              `}
            >
              {isCompleted ? "✓" : step.id}
            </div>

            {/* STEP TITLE */}
            <span
              className={`
                text-sm font-medium whitespace-nowrap
                
                ${
                  isActive
                    ? "text-[#2F49FF]"
                    : isCompleted
                    ? "text-[#1F2937]"
                    : "text-gray-500"
                }
              `}
            >
              {step.title}
            </span>
          </button>
        );
      })}
    </div>

    {/* ACTION BUTTONS */}
    <div className="flex items-center gap-3 shrink-0">
      <button
        type="button"
        className="
          h-10 px-5
          rounded-lg
          border border-[#D9DCEC]
          bg-white
          text-sm font-medium
          text-[#344054]
          hover:bg-gray-50
          whitespace-nowrap
        "
      >
        Save as Draft
      </button>

      <button
        type="button"
        onClick={handleNext}
        disabled={activeStep === steps.length}
        className="
          h-10 px-6
          rounded-lg
          bg-[#2F49FF]
          hover:bg-[#1f3cff]
          disabled:opacity-50
          text-white
          text-sm font-medium
          flex items-center gap-2
          whitespace-nowrap
        "
      >
        Next
        <span>→</span>
      </button>
    </div>
  </div>
</div>

        {/* FORM CONTENT */}
        <FormProvider {...methods}>
          <div className="p-6">
            {renderStepComponent()}
          </div>
        </FormProvider>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            disabled={activeStep === 1}
            onClick={handlePrevious}
            className="
              h-10 px-5
              border border-gray-300
              rounded-xl
              text-sm font-medium
              text-gray-700
              hover:bg-gray-50
              disabled:opacity-50
            "
          >
            Previous
          </button>

          <div className="text-sm text-gray-500 font-medium">
            Step {activeStep} of {steps.length}
          </div>

          <button
            type="button"
            disabled={activeStep === steps.length}
            onClick={handleNext}
            className="
              h-10 px-6
              bg-[#4F19FF]
              hover:bg-[#4315db]
              disabled:opacity-50
              text-white
              rounded-xl
              text-sm font-medium
            "
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOnboardingParent;