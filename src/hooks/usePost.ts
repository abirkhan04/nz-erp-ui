import { useMutation } from "@tanstack/react-query";
import { api } from "../api/client";

export const usePost = <TResponse = any, TPayload = any>(
  url: string
) => {
  return useMutation({
    mutationFn: async (payload: TPayload): Promise<TResponse> => {
      const response = await api.post(url, payload);
      return response.data;
    },
  });
};