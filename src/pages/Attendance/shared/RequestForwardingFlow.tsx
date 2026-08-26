import React from "react";
import { ArrowRight } from "lucide-react";

export interface WorkflowItem {
    number: string;
    title: string;
    subtitle: string;
    description: React.ReactNode;
    icon: React.ElementType;
    iconClass: string;
    circleClass: string;
    titleClass: string;
}


import {
    Factory,
    UserRound,
    Users,
    UserRoundCheck,
} from "lucide-react";

const RequestForwardingFlow = () => {

        const workflow:WorkflowItem[] = [
        {
            number: "1.",
            title: "PRODUCTION FLOOR",
            subtitle: "(You)",
            description: (
                <>
                    Create Request
                </>
            ),
            icon: Factory,
            iconClass: "text-[#1764e8]",
            circleClass: "bg-[#edf4ff] border-[#cbdcff]",
            titleClass: "text-[#174bd4]",
        },
        {
            number: "2.",
            title: "DIRECTOR",
            subtitle: "",
            description: (
                <>
                    Review & Approve
                    <br />
                    Request
                </>
            ),
            icon: UserRound,
            iconClass: "text-[#f27b00]",
            circleClass: "bg-[#fff5e8] border-[#ffe0bb]",
            titleClass: "text-[#ed6b00]",
        },
        {
            number: "3.",
            title: "EMPLOYEE MOVEMENT CELL",
            subtitle: "",
            description: (
                <>
                    Review & Forward to
                    <br />
                    HR Branch Manager
                </>
            ),
            icon: Users,
            iconClass: "text-[#00974d]",
            circleClass: "bg-[#eefaf3] border-[#ccebd9]",
            titleClass: "text-[#008f43]",
        },
        {
            number: "4.",
            title: "HR BRANCH MANAGER",
            subtitle: "",
            description: (
                <>
                    Review & Forward to
                    <br />
                    CEO
                </>
            ),
            icon: UserRound,
            iconClass: "text-[#175de0]",
            circleClass: "bg-[#edf4ff] border-[#cbdcff]",
            titleClass: "text-[#174bd4]",
        },
        {
            number: "5.",
            title: "CEO",
            subtitle: "",
            description: (
                <>
                    Final Approval
                </>
            ),
            icon: UserRoundCheck,
            iconClass: "text-[#5914d9]",
            circleClass: "bg-[#f7f0ff] border-[#dfceff]",
            titleClass: "text-[#5914d9]",
        },
    ];
    return (
        <section className="mt-7 rounded-lg border border-[#e0e5ef] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">

            <div className="flex items-start">

                {/* Flow title */}
                <div className="w-[205px] shrink-0">

                    <h3 className="text-[12px] font-extrabold text-[#071990]">
                        REQUEST FORWARDING FLOW
                    </h3>

                    <p className="mt-3 text-[11px] font-medium leading-5 text-[#19245b]">
                        All requests will follow the
                        <br />
                        approval workflow below.
                    </p>

                </div>

                {/* Workflow */}
                <div className="flex flex-1 items-start justify-between">

                    {workflow.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <React.Fragment key={item.number}>

                                <div className="flex min-w-[135px] flex-col items-center text-center">

                                    {/* Icon */}
                                    <div
                                        className={`flex h-[61px] w-[61px] items-center justify-center rounded-full border ${item.circleClass}`}
                                    >
                                        <Icon
                                            size={32}
                                            className={item.iconClass}
                                            strokeWidth={2}
                                        />
                                    </div>

                                    {/* Number + title */}
                                    <div
                                        className={`mt-3 text-[10px] font-extrabold ${item.titleClass}`}
                                    >
                                        {item.number} {item.title}
                                    </div>

                                    {item.subtitle && (
                                        <div
                                            className={`text-[10px] font-extrabold ${item.titleClass}`}
                                        >
                                            {item.subtitle}
                                        </div>
                                    )}

                                    <div className="mt-2 text-[10px] font-medium leading-4 text-[#1d285b]">
                                        {item.description}
                                    </div>

                                </div>

                                {/* Arrow */}
                                {index < workflow.length - 1 && (
                                    <div className="flex h-[61px] items-center px-1">

                                        <ArrowRight
                                            size={29}
                                            strokeWidth={1.5}
                                            className="text-[#174bd4]"
                                        />

                                    </div>
                                )}

                            </React.Fragment>
                        );
                    })}

                </div>

            </div>

        </section>
    );
};

export default RequestForwardingFlow;