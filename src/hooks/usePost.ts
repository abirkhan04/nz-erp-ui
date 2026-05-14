import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "../api/client";

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

export const usePost = <TResponse = any, TPayload = any>(
  url: string
) => {
  return useMutation<TResponse, Error, TPayload>({
    mutationFn: async (payload: TPayload): Promise<TResponse> => {
      try {
        const response = await api.post(url, payload);
        return response.data;
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>;

        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Something went wrong";

        throw new Error(message);
      }
    },
  });
};