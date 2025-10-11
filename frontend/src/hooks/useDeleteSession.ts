import { deleteSession } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SESSION } from "./useSessions";

const useDeleteSession = () => {
    const queryClient = useQueryClient();
    const {mutate: sessionDelete, ...rest} = useMutation({
        mutationFn: deleteSession,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [SESSION]});
        }
    });

    return {sessionDelete, ...rest};
}

export default useDeleteSession