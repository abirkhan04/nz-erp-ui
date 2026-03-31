import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

type UseGetOptions<T> = {
  key: any[];
  url?: string;
  queryFn?: () => Promise<T>;
  enabled?: boolean;
};

export const useGet = <T = any>({
  key,
  url,
  queryFn,
  enabled = true,
}: UseGetOptions<T>) => {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      // 🔥 Priority: custom queryFn
      if (queryFn) return queryFn();

      // 🔥 Otherwise use API client
      if (url) {
        const { data } = await api.get(url);
        return data;
      }

      throw new Error("Either url or queryFn must be provided");
    },
    enabled,
  });
};