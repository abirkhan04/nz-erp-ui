import React, { useState } from "react";
import { API_ROUTES } from "../api/routes";
import { usePost } from "../hooks/usePost";
import { useForm } from "react-hook-form";

interface FormData {
    locationName: string;
    districtId: string;
}

const Location: React.FC = () => {
    const { register, handleSubmit, reset } = useForm<FormData>();
    const { mutateAsync: createLocation, isPending } = usePost(API_ROUTES.LOCATION);

    const districts = ["Dhaka", "Manikganj", "Gazipur", "Narayanganj"]; // Example district options
    const [submissionStatus, setSubmissionStatus] = useState<"success" | "error" | null>(null);
    const onSubmit = async (data: FormData) => {
        try {
            const response = await createLocation({
                locationName: data.locationName,
                districtId: data.districtId,
            });
            setSubmissionStatus("success"); // Set success status
            reset(); // Reset the form after successful submission
        } catch (error) {
            setSubmissionStatus("error"); // Set error status            
            console.error("Error creating location:", error);
            reset(); // Reset the form after successful submission
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100 h-screen">
            <div className="w-full max-w-md">
                {/* Success or Error Banner */}
                {submissionStatus === "success" && (
                    <div className="mb-4 p-4 text-green-700 bg-green-100 border border-green-500 rounded">
                        Location created successfully!
                    </div>
                )}
                {submissionStatus === "error" && (
                    <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-500 rounded">
                        Failed to create location. Please try again.
                    </div>
                )}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
                >
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                        Add Location
                    </h2>

                    {/* Location Name Input */}
                    <div className="mb-4">
                        <label
                            htmlFor="locationName"
                            className="block text-gray-600 mb-2"
                        >
                            Location Name
                        </label>
                        <input
                            {...register("locationName", { required: true })}
                            type="text"
                            id="locationName"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter location name"
                        />
                    </div>

                    {/* District Dropdown */}
                    <div className="mb-4">
                        <label
                            htmlFor="district"
                            className="block text-gray-600 mb-2"
                        >
                            District
                        </label>
                        <select
                            {...register("districtId", { required: true })}
                            id="district"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>
                                Select a district
                            </option>
                            {districts.map((dist, index) => (
                                <option key={index} value="01HQZXY00000000000000001">
                                    {dist}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                        disabled={isPending}
                    >
                        {isPending ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Location;