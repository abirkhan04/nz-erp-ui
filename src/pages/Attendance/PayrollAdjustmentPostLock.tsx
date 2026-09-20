import React, { useMemo, useState } from "react";
import axios from "axios";

/* =========================================================
   TYPES
========================================================= */

interface PayrollAdjustmentRequest {
  requestId: string;
  employeeId: string;
  employeeName?: string;

  attendanceMonth: string;
  company: string;
  department?: string;
  designation?: string;

  correctionType: string;
  reason: string;

  basicSalaryImpact: number;
  otImpact: number;
  nightAllowanceImpact: number;
  deductionImpact: number;

  supportingDocument?: string;
  remarks?: string;

  status?: string;
}

interface PayrollAdjustmentPayload {
  employeeId: string;
  attendanceMonth: string;
  company: string;
  department: string;
  designation: string;

  correctionType: string;
  reason: string;

  basicSalaryImpact: number;
  otImpact: number;
  nightAllowanceImpact: number;
  deductionImpact: number;

  supportingDocument: string;
  remarks: string;
}

interface PayrollAdjustmentProps {
  pendingCount?: number;
}

/* =========================================================
   API ROUTE
   Change this according to your backend
========================================================= */

const API_URL = "/api/payroll-adjustments/post-lock";

/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm: PayrollAdjustmentPayload = {
  employeeId: "",
  attendanceMonth: "",
  company: "",
  department: "",
  designation: "",

  correctionType: "Missed Punch",
  reason: "",

  basicSalaryImpact: 0,
  otImpact: 0,
  nightAllowanceImpact: 0,
  deductionImpact: 0,

  supportingDocument: "",
  remarks: "",
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const PayrollAdjustmentPostLock: React.FC<
  PayrollAdjustmentProps
> = ({ pendingCount = 0 }) => {
  /* -------------------------------------------------------
     MODAL STATES
  ------------------------------------------------------- */

  const [listModalOpen, setListModalOpen] =
    useState(false);

  const [formModalOpen, setFormModalOpen] =
    useState(false);

  /* -------------------------------------------------------
     DATA
  ------------------------------------------------------- */

  const [requests, setRequests] = useState<
    PayrollAdjustmentRequest[]
  >([]);

  const [editingRequest, setEditingRequest] =
    useState<PayrollAdjustmentRequest | null>(null);

  /* -------------------------------------------------------
     LOADING / ERROR
  ------------------------------------------------------- */

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  /* -------------------------------------------------------
     FORM
  ------------------------------------------------------- */

  const [form, setForm] =
    useState<PayrollAdjustmentPayload>(
      initialForm
    );

  /* =======================================================
     LOAD REQUESTS
  ======================================================= */

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      setRequests(
        Array.isArray(response.data)
          ? response.data
          : response.data?.data || []
      );
    } catch (err) {
      console.error(
        "Failed to load payroll adjustment requests",
        err
      );

      setError(
        "Failed to load payroll adjustment requests."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     OPEN LIST MODAL
  ======================================================= */

  const handleOpenList = async () => {
    setListModalOpen(true);

    await loadRequests();
  };

  /* =======================================================
     OPEN CREATE FORM
  ======================================================= */

  const handleCreate = () => {
    setEditingRequest(null);

    setForm(initialForm);

    setFormModalOpen(true);
  };

  /* =======================================================
     OPEN EDIT FORM
  ======================================================= */

  const handleEdit = (
    request: PayrollAdjustmentRequest
  ) => {
    setEditingRequest(request);

    setForm({
      employeeId: request.employeeId || "",

      attendanceMonth:
        request.attendanceMonth || "",

      company: request.company || "",

      department:
        request.department || "",

      designation:
        request.designation || "",

      correctionType:
        request.correctionType ||
        "Missed Punch",

      reason: request.reason || "",

      basicSalaryImpact:
        Number(
          request.basicSalaryImpact || 0
        ),

      otImpact:
        Number(request.otImpact || 0),

      nightAllowanceImpact:
        Number(
          request.nightAllowanceImpact || 0
        ),

      deductionImpact:
        Number(
          request.deductionImpact || 0
        ),

      supportingDocument:
        request.supportingDocument || "",

      remarks:
        request.remarks || "",
    });

    setFormModalOpen(true);
  };

  /* =======================================================
     CLOSE FORM
  ======================================================= */

  const handleCloseForm = () => {
    setFormModalOpen(false);

    setEditingRequest(null);

    setForm(initialForm);
  };

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    const numericFields = [
      "basicSalaryImpact",
      "otImpact",
      "nightAllowanceImpact",
      "deductionImpact",
    ];

    setForm((previous) => ({
      ...previous,

      [name]: numericFields.includes(name)
        ? Number(value)
        : value,
    }));
  };

  /* =======================================================
     CREATE / UPDATE
  ======================================================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingRequest) {
        /* -------------------------------
           UPDATE
        -------------------------------- */

        await axios.put(
          `${API_URL}/${editingRequest.requestId}`,
          form
        );
      } else {
        /* -------------------------------
           CREATE
        -------------------------------- */

        await axios.post(API_URL, form);
      }

      handleCloseForm();

      await loadRequests();
    } catch (err) {
      console.error(
        "Failed to save payroll adjustment",
        err
      );

      setError(
        editingRequest
          ? "Failed to update payroll adjustment."
          : "Failed to create payroll adjustment."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (
    requestId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payroll adjustment request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.delete(
        `${API_URL}/${requestId}`
      );

      await loadRequests();
    } catch (err) {
      console.error(
        "Failed to delete payroll adjustment",
        err
      );

      setError(
        "Failed to delete payroll adjustment."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     CALCULATED VALUES
  ======================================================= */

  const totalAddition = useMemo(() => {
    return (
      Number(form.basicSalaryImpact || 0) +
      Number(form.otImpact || 0) +
      Number(form.nightAllowanceImpact || 0)
    );
  }, [
    form.basicSalaryImpact,
    form.otImpact,
    form.nightAllowanceImpact,
  ]);

  const netImpact = useMemo(() => {
    return (
      totalAddition -
      Number(form.deductionImpact || 0)
    );
  }, [
    totalAddition,
    form.deductionImpact,
  ]);

  /* =======================================================
     CARD
  ======================================================= */

  return (
    <>
      {/* =====================================================
          PAYROLL ADJUSTMENT CARD
      ===================================================== */}

      <div className="rounded-lg border border-orange-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100">
              <svg
                className="h-6 w-6 text-orange-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.3 3.6 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
              </svg>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-orange-700">
                Payroll Adjustment
              </h3>

              <p className="text-xs text-gray-500">
                Post-Lock
              </p>
            </div>
          </div>

          {/* Count */}
          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
            {pendingCount}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-500">
            Pending Verification
          </p>

          <button
            type="button"
            onClick={handleOpenList}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            View Details

            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* =====================================================
          LIST MODAL
      ===================================================== */}

      {listModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Payroll Adjustments (Post-Lock)
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Manage payroll adjustment requests
                  received from Attendance Cell.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setListModalOpen(false)
                }
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6 6 18" />
                </svg>
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-3">
              <div className="text-sm text-gray-600">
                Total Requests:{" "}
                <span className="font-semibold text-gray-900">
                  {requests.length}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCreate}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + New Payroll Adjustment
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mx-6 mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Table */}
            <div className="flex-1 overflow-auto p-6">
              {loading ? (
                <div className="py-12 text-center text-sm text-gray-500">
                  Loading payroll adjustment
                  requests...
                </div>
              ) : requests.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
                  <p className="text-sm text-gray-500">
                    No payroll adjustment requests
                    found.
                  </p>

                  <button
                    type="button"
                    onClick={handleCreate}
                    className="mt-3 text-sm font-medium text-blue-600 hover:underline"
                  >
                    Create New Request
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Request ID
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Attendance Month
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Company
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Employee
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold text-gray-700">
                          Net Impact
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Status
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                      {requests.map(
                        (request) => {
                          const total =
                            Number(
                              request.basicSalaryImpact ||
                                0
                            ) +
                            Number(
                              request.otImpact || 0
                            ) +
                            Number(
                              request.nightAllowanceImpact ||
                                0
                            );

                          const net =
                            total -
                            Number(
                              request.deductionImpact ||
                                0
                            );

                          return (
                            <tr
                              key={
                                request.requestId
                              }
                              className="hover:bg-gray-50"
                            >
                              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800">
                                {
                                  request.requestId
                                }
                              </td>

                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                {
                                  request.attendanceMonth
                                }
                              </td>

                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                {request.company}
                              </td>

                              <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-800">
                                  {request.employeeName ||
                                    request.employeeId}
                                </div>

                                {request.employeeName && (
                                  <div className="text-xs text-gray-500">
                                    {
                                      request.employeeId
                                    }
                                  </div>
                                )}
                              </td>

                              <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-green-600">
                                {net.toFixed(2)}
                              </td>

                              <td className="whitespace-nowrap px-4 py-3">
                                <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                                  {request.status ||
                                    "Pending Verification"}
                                </span>
                              </td>

                              <td className="whitespace-nowrap px-4 py-3">
                                <div className="flex justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEdit(
                                        request
                                      )
                                    }
                                    className="rounded border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDelete(
                                        request.requestId
                                      )
                                    }
                                    className="rounded border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t bg-gray-50 px-6 py-3">
              <button
                type="button"
                onClick={() =>
                  setListModalOpen(false)
                }
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      {formModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingRequest
                    ? "Edit Payroll Adjustment"
                    : "New Payroll Adjustment Request"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Payroll Adjustment (Post-Lock)
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6 6 18" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >
              {/* Employee Information */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-800">
                  Employee Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Employee ID */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Employee ID
                    </label>

                    <input
                      type="text"
                      name="employeeId"
                      value={form.employeeId}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter employee ID"
                    />
                  </div>

                  {/* Attendance Month */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Attendance Month
                    </label>

                    <input
                      type="month"
                      name="attendanceMonth"
                      value={
                        form.attendanceMonth
                      }
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Company
                    </label>

                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Department
                    </label>

                    <input
                      type="text"
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Designation
                    </label>

                    <input
                      type="text"
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Correction Type */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Correction Type
                    </label>

                    <select
                      name="correctionType"
                      value={
                        form.correctionType
                      }
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value="Missed Punch">
                        Missed Punch
                      </option>

                      <option value="Attendance Correction">
                        Attendance Correction
                      </option>

                      <option value="Overtime">
                        Overtime
                      </option>

                      <option value="Night Allowance">
                        Night Allowance
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Reason
                </label>

                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Enter reason for payroll adjustment"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Financial Impact */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-800">
                  Financial Impact
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Basic */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Basic Salary Impact
                    </label>

                    <input
                      type="number"
                      name="basicSalaryImpact"
                      value={
                        form.basicSalaryImpact
                      }
                      onChange={handleChange}
                      step="0.01"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  {/* OT */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      OT Impact
                    </label>

                    <input
                      type="number"
                      name="otImpact"
                      value={form.otImpact}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Night Allowance */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Night Allowance Impact
                    </label>

                    <input
                      type="number"
                      name="nightAllowanceImpact"
                      value={
                        form.nightAllowanceImpact
                      }
                      onChange={handleChange}
                      step="0.01"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Deduction */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Deduction Impact
                    </label>

                    <input
                      type="number"
                      name="deductionImpact"
                      value={
                        form.deductionImpact
                      }
                      onChange={handleChange}
                      step="0.01"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Calculated Summary */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-800">
                  Financial Summary
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-500">
                      Total Addition
                    </p>

                    <p className="mt-1 text-sm font-semibold text-green-600">
                      {totalAddition.toFixed(
                        2
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Deduction
                    </p>

                    <p className="mt-1 text-sm font-semibold text-red-600">
                      {Number(
                        form.deductionImpact
                      ).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Net Impact
                    </p>

                    <p className="mt-1 text-sm font-semibold text-blue-600">
                      {netImpact.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Supporting Document */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Supporting Document
                </label>

                <input
                  type="text"
                  name="supportingDocument"
                  value={
                    form.supportingDocument
                  }
                  onChange={handleChange}
                  placeholder="Document reference / URL"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  disabled={saving}
                  className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingRequest
                    ? "Update Request"
                    : "Create Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PayrollAdjustmentPostLock;