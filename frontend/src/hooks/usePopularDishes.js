import { useQuery } from "@tanstack/react-query";
import { getPopularDishes } from "../api";

export const usePopularDishes = () => {
  return useQuery({
    queryKey: ["dishes", "popular"],
    queryFn: getPopularDishes,
    staleTime: 0,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
