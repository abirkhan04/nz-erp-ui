import { useMutation } from "@tanstack/react-query";
import { api } from "../api/client";

export const useDelete = (url: string) => {
  return useMutation({
    mutationFn: () => api.delete(url),
  });
};
