import React, { useState } from "react";
import {
    useForm,
    FormProvider,
} from "react-hook-form";
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
        title: "Employee Information",
    },
    {
        id: 2,
        title: "Financial Details",
    },
    {
        id: 3,
        title: "Address Details",
    },
    {
        id: 4,
        title: "Family & Nominee",
    },
    {
        id: 5,
        title: "Documents",
    },
    {
        id: 6,
        title: "Review & Submit",
    },
];

const EmployeeOnboardingParent: React.FC = () => {
    const [activeStep, setActiveStep] = useState<number>(1);
    const [formData, setFormData] = useState({});

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
                return <EmployeeInformationForm />;

            case 2:
                return <FinancialDetailsForm />;

            case 3:
                return <AddressDetailsForm />;

            case 4:
                return <FamilyNomineeForm />;

            case 5:
                return <DocumentsForm />;

            case 6:
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
        <div className="min-h-screen bg-[#f7f8fc] p-4 overflow-x-hidden">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                {/* TOP TAB STEPPER */}
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 px-4 py-5 border-b overflow-hidden">
                    <div className="flex items-center w-full overflow-x-auto">
                        {steps.map((step, index) => {
                            const isCompleted = step.id < activeStep;
                            const isActive = step.id === activeStep;

                            return (
                                <React.Fragment key={step.id}>
                                    <div
                                        className="flex items-center gap-1.5 cursor-pointer shrink-0"
                                        onClick={() => setActiveStep(step.id)}
                                    >
                                        <div
                                            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all

              ${isCompleted
                                                    ? "bg-green-100 text-green-600 border border-green-200"
                                                    : ""
                                                }

              ${isActive
                                                    ? "bg-blue-600 text-white"
                                                    : ""
                                                }

              ${!isCompleted && !isActive
                                                    ? "bg-gray-100 text-gray-500"
                                                    : ""
                                                }
            `}
                                        >
                                            {isCompleted ? "✓" : step.id}
                                        </div>

                                        <div
                                            className={`
              text-xs font-medium whitespace-nowrap
              ${isActive
                                                    ? "text-blue-600"
                                                    : "text-gray-500"
                                                }
            `}
                                        >
                                            {step.title}
                                        </div>
                                    </div>

                                    {index !== steps.length - 1 && (
                                        <div className="w-6 h-[2px] bg-gray-200 mx-2 shrink-0" />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center gap-3 ml-6">
                        <button
                            className="
                px-5 py-2
                border border-gray-300
                rounded-lg
                text-sm font-medium
                hover:bg-gray-50
                whitespace-nowrap
              "
                        >
                            Save as Draft
                        </button>

                        <button
                            onClick={handleNext}
                            className="
                px-6 py-2
                bg-blue-600
                hover:bg-blue-700
                text-white
                rounded-lg
                text-sm font-medium
                whitespace-nowrap
              "
                        >
                            Next →
                        </button>
                    </div>
                </div>

                {/* STEP CONTENT */}
                <FormProvider {...methods}>
                    <div>
                        {renderStepComponent()}
                    </div>
                </FormProvider>

                {/* FOOTER NAVIGATION */}
                <div className="flex justify-between items-center px-6 py-4 border-t">
                    <button
                        disabled={activeStep === 1}
                        onClick={handlePrevious}
                        className="
              px-5 py-2
              border border-gray-300
              rounded-lg
              text-sm
              disabled:opacity-50
            "
                    >
                        Previous
                    </button>

                    <div className="text-sm text-gray-500">
                        Step {activeStep} of {steps.length}
                    </div>

                    <button
                        disabled={activeStep === steps.length}
                        onClick={handleNext}
                        className="
              px-5 py-2
              bg-blue-600
              text-white
              rounded-lg
              text-sm
              disabled:opacity-50
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
