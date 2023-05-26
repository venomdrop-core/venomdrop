import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/auth";

export const useMe = () => useQuery({ queryKey: ['me'], queryFn: getMe });
