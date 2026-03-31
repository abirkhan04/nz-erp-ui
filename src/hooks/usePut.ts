import { useMutation } from "@tanstack/react-query";
import { api } from "../api/client";

export const usePut = (url: string) => {
  return useMutation({
    mutationFn: (payload: any) => api.put(url, payload),
  });
};