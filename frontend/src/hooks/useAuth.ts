import { getUser } from "@/lib/api"
import type { userType } from "@/schemas/authSchemas";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query"

const AUTH = "auth";

const useAuth = (options?: Omit<UseQueryOptions<userType, Error, userType, [string]>, "queryKey" | "queryFn">) => {
    const {data: user, ...rest} = useQuery({
        queryKey: [AUTH],
        queryFn: getUser,
        retry: false,        
        ...options
    });
    return {user, ...rest}
}

export default useAuth;