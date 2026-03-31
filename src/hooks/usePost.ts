import { useMutation } from "@tanstack/react-query";
import { api } from "../api/client";

export const usePost = (url: string) => {
  return useMutation({
    mutationFn: (payload: any) => api.post(url, payload),
  });
};