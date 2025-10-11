import { getSessions } from "@/lib/api"
import type { sessionArrayType } from "@/schemas/authSchemas";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query"

export const SESSION = "session";

const useSessions = (options?: Omit<UseQueryOptions<sessionArrayType, Error, sessionArrayType, [string]>, "queryKey" | "queryFn">) => {
    const {data: sessions, ...rest} = useQuery({
        queryKey: [SESSION],
        queryFn: getSessions,
        retry: false,        
        ...options
    });
    return {sessions, ...rest}
}

export default useSessions;