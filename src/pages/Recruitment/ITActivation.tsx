import React, { useState, useMemo, useEffect } from "react";
import { useGet } from "../../hooks/useGet";
import { API_ROUTES } from "../../api/routes";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Document {
    type: string;
    description: string;
    status: "Ready" | "Pending" | "Missing";
}

interface Candidate {
    enrollmentId: string;
    employeeName: string;
    fatherName: string;
    dateOfBirth: string;
    gender: string;
    bloodGroup: string;
    religion: string;
    nomineeName: string;
    nomineeRelation: string;
    mobile: string;
    approvedByDirector: boolean;
    company: string;
    department: string;
    section: string;
    cell: string;
    designation: string;
    grade: string;
    shift: string;
    weekday: string;
    typeOfWorker: string;
    proposedSalary: number;
    payBasis: string;
    dateOfJoining: string;
    probationPeriod: string;
    employmentType: string;
    workLocation: string;
    reportingTo: string;
    documents: Document[];
    totalDocuments: number;
    informationVerified: boolean;
    finalInformationLocked: boolean;
    readyForActivation: boolean;
    activationDate: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const InfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div style={{ display: "flex", gap: 6, marginBottom: 5, fontSize: 13 }}>
        <span style={{ color: "#6b7280", minWidth: 130, flexShrink: 0 }}>{label}</span>
        <span style={{ color: "#374151", fontWeight: 600 }}>: {value}</span>
    </div>
);

const StatusBadge: React.FC<{ status: "Ready" | "Pending" | "Missing" }> = ({ status }) => {
    const colors: Record<string, { bg: string; text: string; dot: string }> = {
        Ready: { bg: "#dcfce7", text: "#15803d", dot: "#16a34a" },
        Pending: { bg: "#fef9c3", text: "#92400e", dot: "#d97706" },
        Missing: { bg: "#fee2e2", text: "#dc2626", dot: "#ef4444" },
    };
    const c = colors[status];
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 10px",
            borderRadius: 20, background: c.bg, color: c.text, fontSize: 12, fontWeight: 600,
        }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
            {status}
        </span>
    );
};

const CheckRow: React.FC<{ label: string; value: boolean | string }> = ({ label, value }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f3f4f6", fontSize: 13 }}>
        <span style={{ color: "#6b7280" }}>{label}</span>
        {typeof value === "boolean" ? (
            <span style={{ color: value ? "#16a34a" : "#dc2626", fontWeight: 700 }}>{value ? "Yes" : "No"}</span>
        ) : (
            <span style={{ color: "#1d4ed8", fontWeight: 600 }}>{value}</span>
        )}
    </div>
);

const AvatarIcon: React.FC = () => (
    <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
        <circle cx="40" cy="40" r="40" fill="#e5e7eb" />
        <circle cx="40" cy="30" r="14" fill="#9ca3af" />
        <ellipse cx="40" cy="65" rx="22" ry="14" fill="#9ca3af" />
    </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ITActivationPage: React.FC = () => {
    const { data: candidates = [], refetch } = useGet<Candidate[]>({
        key: ["candidates"],
        url: `${API_ROUTES.EMPLOYEES_BY_STATUS}?status=DirectorReview`,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedId, setSelectedId] = useState<string>(candidates[0]?.enrollmentId);
    const [dropdownOpen, setDropdownOpen] = useState(false);


    useEffect(() => {
        if (candidates.length && !selectedId) {
            setSelectedId(candidates[0].enrollmentId);
        }
    }, [candidates, selectedId]);

    const filteredCandidates = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        if (!term) return candidates;

        return candidates.filter(
            (c) =>
                c.employeeName?.toLowerCase().includes(term) ||
                c.enrollmentId?.toLowerCase().includes(term)
        );
    }, [candidates, searchTerm]);

    const selected = useMemo(() =>
        candidates.find(c => c.enrollmentId === selectedId) ?? candidates[0],
        [selectedId]);

    const handleActivateNext = () => {
        // Payload to be provided by user later
        alert(`Activate & Next triggered for: ${selected.enrollmentId}`);
    };

    const handleActivate = () => {
        alert(`Activating employee: ${selected.employeeName} (${selected.enrollmentId})`);
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f1f5f9",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}>

            {/* ── Page Title Bar ── */}
            <div style={{
                background: "#fff", borderBottom: "2px solid #e2e8f0",
                padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: -0.5 }}>
                    Candidate Ready for IT Activation
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>Activation Date :</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0f2044" }}>{selected?.activationDate}</span>
                    <button style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8,
                        padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "#374151", fontWeight: 600,
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* ── Search Bar ── */}
            <div style={{ padding: "16px 24px 0", position: "relative" }}>
                <div style={{
                    background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10,
                    display: "flex", alignItems: "center", gap: 10, padding: "0 14px",
                    maxWidth: 420, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by Temporary ID or Name..."
                        value={searchTerm}
                        onFocus={() => setDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                        onChange={e => { setSearchTerm(e.target.value); setDropdownOpen(true); }}
                        style={{
                            border: "none", outline: "none", background: "transparent",
                            fontSize: 13, padding: "10px 0", width: "100%", color: "#374151",
                        }}
                    />
                    {searchTerm && (
                        <button onClick={() => { setSearchTerm(""); setDropdownOpen(false); }}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Dropdown */}
                {dropdownOpen && filteredCandidates.length > 0 && (
                    <div style={{
                        position: "absolute", top: "100%", left: 24, zIndex: 100,
                        background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden",
                        maxWidth: 420, marginTop: 4,
                    }}>
                        {filteredCandidates.map(c => (
                            <div key={c.enrollmentId}
                                onMouseDown={() => { setSelectedId(c.enrollmentId); setSearchTerm(c.employeeName); setDropdownOpen(false); }}
                                style={{
                                    padding: "10px 16px", cursor: "pointer", display: "flex",
                                    justifyContent: "space-between", alignItems: "center",
                                    background: c.enrollmentId === selectedId ? "#eff6ff" : "#fff",
                                    borderBottom: "1px solid #f3f4f6",
                                    transition: "background 0.15s",
                                }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{c.employeeName}</div>
                                    <div style={{ fontSize: 11, color: "#6b7280" }}>{c.enrollmentId} &bull; {c.department}</div>
                                </div>
                                {c.enrollmentId === selectedId && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3">
                                        <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                )}
                            </div>
                        ))}
                        {filteredCandidates.length === 0 && (
                            <div style={{ padding: "16px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                                No candidates found
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Info Banner ── */}
            <div style={{ padding: "12px 24px 0" }}>
                <div style={{
                    background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8,
                    padding: "10px 16px", display: "flex", alignItems: "flex-start", gap: 10,
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#2563eb" style={{ marginTop: 1, flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <div style={{ fontSize: 12.5, color: "#1d4ed8", lineHeight: 1.6 }}>
                        After activation, Temporary ID will be deactivated and Permanent Employee ID will be generated automatically.<br />
                        All documents and records will be stored in the employee's personal folder.
                    </div>
                </div>
            </div>

            {/* ── Main 3-col Grid ── */}
            <div style={{ padding: "16px 24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

                {/* ── Col 1: Candidate Information ── */}
                <div style={{
                    background: "#fff", borderRadius: 12, border: "1.5px solid #e2e8f0",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.05)", overflow: "hidden",
                }}>
                    <div style={{
                        background: "linear-gradient(90deg, #0f2044 0%, #1a3a6b 100%)",
                        padding: "10px 16px",
                    }}>
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Candidate Information</span>
                        <span style={{ color: "#93c5fd", fontSize: 11, marginLeft: 8 }}>(Read Only)</span>
                    </div>
                    <div style={{ padding: 16 }}>
                        <div style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
                            <div style={{ flexShrink: 0 }}>
                                <AvatarIcon />
                                {selected?.approvedByDirector && (
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: 4,
                                        background: "#dcfce7", border: "1px solid #86efac",
                                        borderRadius: 20, padding: "3px 8px", marginTop: 6, fontSize: 11, color: "#15803d", fontWeight: 600,
                                    }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
                                            <path d="M20 6 9 17l-5-5" />
                                        </svg>
                                        Approved by Director
                                    </div>
                                )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <InfoRow label="Temporary ID" value={selected?.enrollmentId} />
                                <InfoRow label="Full Name" value={selected?.employeeName} />
                                <InfoRow label="Father's Name" value={selected?.fatherName} />
                                <InfoRow label="Date of Birth" value={selected?.dateOfBirth} />
                                <InfoRow label="Gender" value={selected?.gender} />
                                <InfoRow label="Blood Group" value={selected?.bloodGroup} />
                                <InfoRow label="Religion" value={selected?.religion} />
                                <InfoRow label="Nominee Name" value={selected?.nomineeName} />
                                <InfoRow label="Nominee Relation" value={selected?.nomineeRelation} />
                                <InfoRow label="Mobile" value={selected?.mobile} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Col 2: Final Service Information ── */}
                <div style={{
                    background: "#fff", borderRadius: 12, border: "1.5px solid #e2e8f0",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.05)", overflow: "hidden",
                }}>
                    <div style={{
                        background: "linear-gradient(90deg, #0f2044 0%, #1a3a6b 100%)",
                        padding: "10px 16px",
                    }}>
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Final Service Information</span>
                        <span style={{ color: "#93c5fd", fontSize: 11, marginLeft: 8 }}>(Read Only)</span>
                    </div>
                    <div style={{ padding: 16 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                            <div>
                                <InfoRow label="Company" value={selected?.company} />
                                <InfoRow label="Department" value={selected?.department} />
                                <InfoRow label="Section" value={selected?.section} />
                                <InfoRow label="Cell" value={selected?.cell} />
                                <InfoRow label="Designation" value={selected?.designation} />
                                <InfoRow label="Grade" value={selected?.grade} />
                                <InfoRow label="Shift" value={selected?.shift} />
                                <InfoRow label="Weekday" value={selected?.weekday} />
                            </div>
                            <div>
                                <InfoRow label="Type of Worker" value={selected?.typeOfWorker} />
                                <InfoRow label="Proposed Salary" value={`${selected?.proposedSalary.toLocaleString()} BDT`} />
                                <InfoRow label="Pay Basis" value={selected?.payBasis} />
                                <InfoRow label="Date of Joining" value={selected?.dateOfJoining} />
                                <InfoRow label="Probation Period" value={selected?.probationPeriod} />
                                <InfoRow label="Employment Type" value={selected?.employmentType} />
                                <InfoRow label="Work Location" value={selected?.workLocation} />
                                <InfoRow label="Reporting To" value={selected?.reportingTo} />
                            </div>
                        </div>
                        <div style={{
                            marginTop: 12, background: "#fffbeb", border: "1px solid #fcd34d",
                            borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8,
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#d97706" style={{ flexShrink: 0 }}>
                                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" />
                            </svg>
                            <span style={{ fontSize: 11.5, color: "#92400e", fontWeight: 500 }}>
                                All information above is finalized by Director. IT is not allowed to edit any information.
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Col 3: Activation Summary ── */}
                <div style={{
                    background: "#fff", borderRadius: 12, border: "1.5px solid #e2e8f0",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.05)", overflow: "hidden",
                }}>
                    <div style={{
                        background: "linear-gradient(90deg, #0f2044 0%, #1a3a6b 100%)",
                        padding: "10px 16px",
                    }}>
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Activation Summary</span>
                    </div>
                    <div style={{ padding: 16 }}>
                        <CheckRow label="Total Documents" value={String(selected?.totalDocuments)} />
                        <CheckRow label="Information Verified" value={selected?.informationVerified} />
                        <CheckRow label="Final Information Locked" value={selected?.finalInformationLocked} />
                        <CheckRow label="Ready for Activation" value={selected?.readyForActivation} />
                        <div style={{ marginTop: 8, padding: "6px 0", display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                            <span style={{ color: "#6b7280" }}>Action</span>
                            <span style={{ color: "#2563eb", fontWeight: 700 }}>Activate Employee</span>
                        </div>

                        {/* After Activation Notes */}
                        <div style={{
                            marginTop: 14, background: "#f8fafc", border: "1px solid #e2e8f0",
                            borderRadius: 8, padding: 12,
                        }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>After Activation</div>
                            {[
                                "Temporary ID will be deactivated and cease to operate.",
                                "Permanent Employee ID will be the official Company ID.",
                                "Employee will be available in all modules (Attendance, Payroll, etc.).",
                                "Employee folder will be created and all records stored permanently.",
                            ].map((note, i) => (
                                <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5, alignItems: "flex-start" }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" style={{ marginTop: 1, flexShrink: 0 }}>
                                        <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                    <span style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.5 }}>{note}</span>
                                </div>
                            ))}
                        </div>

                        {/* Candidate Selector Quick Switch */}
                        <div style={{ marginTop: 14 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Quick Switch Candidate</div>
                            {candidates.map(c => (
                                <div key={c.enrollmentId}
                                    onClick={() => setSelectedId(c.enrollmentId)}
                                    style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        padding: "8px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 4,
                                        background: c.enrollmentId === selectedId ? "#eff6ff" : "#f8fafc",
                                        border: `1.5px solid ${c.enrollmentId === selectedId ? "#bfdbfe" : "#e2e8f0"}`,
                                        transition: "all 0.15s",
                                    }}>
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{c.employeeName}</div>
                                        <div style={{ fontSize: 11, color: "#6b7280" }}>{c.enrollmentId}</div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                                        <span style={{
                                            fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
                                            background: c.readyForActivation ? "#dcfce7" : "#fee2e2",
                                            color: c.readyForActivation ? "#15803d" : "#dc2626",
                                        }}>
                                            {c.readyForActivation ? "Ready" : "Not Ready"}
                                        </span>
                                        {c.enrollmentId === selectedId && (
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3">
                                                <path d="M20 6 9 17l-5-5" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Documents & Records ── */}
            <div style={{ padding: "0 24px 16px" }}>
                <div style={{
                    background: "#fff", borderRadius: 12, border: "1.5px solid #e2e8f0",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.05)", overflow: "hidden",
                }}>
                    <div style={{
                        background: "linear-gradient(90deg, #0f2044 0%, #1a3a6b 100%)",
                        padding: "10px 16px",
                    }}>
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Documents &amp; Records</span>
                        <span style={{ color: "#93c5fd", fontSize: 11, marginLeft: 8 }}>(Read Only)</span>
                    </div>
                    <div style={{ padding: 16, overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                                    {["#", "Document Type", "Description", "Status"].map(h => (
                                        <th key={h} style={{
                                            padding: "8px 12px", textAlign: "left",
                                            color: "#374151", fontWeight: 700, fontSize: 12,
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {selected?.documents?.map((doc, i) => (
                                    <tr key={i} style={{
                                        borderBottom: "1px solid #f3f4f6",
                                        background: i % 2 === 0 ? "#fff" : "#fafafa",
                                    }}>
                                        <td style={{ padding: "9px 12px", color: "#6b7280", fontWeight: 600 }}>{i + 1}</td>
                                        <td style={{ padding: "9px 12px", color: "#0f172a", fontWeight: 600 }}>{doc.type}</td>
                                        <td style={{ padding: "9px 12px", color: "#6b7280" }}>{doc.description}</td>
                                        <td style={{ padding: "9px 12px" }}><StatusBadge status={doc.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Action Buttons ── */}
            <div style={{
                background: "#fff", borderTop: "2px solid #e2e8f0",
                padding: "14px 24px", display: "flex", gap: 12, flexWrap: "wrap",
                position: "sticky", bottom: 0, zIndex: 10,
                boxShadow: "0 -4px 12px rgba(0,0,0,0.06)",
            }}>
                <button style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: "#f8fafc", border: "1.5px solid #e2e8f0",
                    borderRadius: 8, padding: "9px 20px", cursor: "pointer",
                    fontSize: 13, color: "#374151", fontWeight: 600,
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                    Refresh
                </button>

                <button style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: "#1d4ed8", border: "none",
                    borderRadius: 8, padding: "9px 20px", cursor: "pointer",
                    fontSize: 13, color: "#fff", fontWeight: 600,
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                    </svg>
                    Preview Company ID Card
                </button>

                <button
                    onClick={handleActivate}
                    disabled={!selected?.readyForActivation}
                    style={{
                        display: "flex", alignItems: "center", gap: 7,
                        background: selected?.readyForActivation ? "#16a34a" : "#9ca3af",
                        border: "none", borderRadius: 8, padding: "9px 24px",
                        cursor: selected?.readyForActivation ? "pointer" : "not-allowed",
                        fontSize: 13, color: "#fff", fontWeight: 700,
                    }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Activate Employee
                </button>

                <button
                    onClick={handleActivateNext}
                    disabled={!selected?.readyForActivation}
                    style={{
                        display: "flex", alignItems: "center", gap: 7,
                        background: selected?.readyForActivation ? "#0f2044" : "#9ca3af",
                        border: "none", borderRadius: 8, padding: "9px 24px",
                        cursor: selected?.readyForActivation ? "pointer" : "not-allowed",
                        fontSize: 13, color: "#fff", fontWeight: 700,
                    }}>
                    Activate &amp; Next
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </button>

                <button style={{
                    display: "flex", alignItems: "center", gap: 7, marginLeft: "auto",
                    background: "#fff", border: "1.5px solid #ef4444",
                    borderRadius: 8, padding: "9px 20px", cursor: "pointer",
                    fontSize: 13, color: "#dc2626", fontWeight: 600,
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                    Cancel Activation
                </button>
            </div>

            {/* ── Warning Footer ── */}
            <div style={{
                background: "#fffbeb", borderTop: "1px solid #fcd34d",
                padding: "10px 24px", display: "flex", alignItems: "center", gap: 8,
            }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#d97706" style={{ flexShrink: 0 }}>
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    <line x1="12" y1="17" x2="12.01" y2="17" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: 12, color: "#92400e", fontWeight: 500 }}>
                    Once activated, this action cannot be undone. Please verify all information and documents before activation.
                </span>
            </div>
        </div>
    );
};

export default ITActivationPage;
