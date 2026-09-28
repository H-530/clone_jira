import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/rpc";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from 'sonner';
import {useRouter} from "next/navigation";
import Routes from "@/utils/Routes";

type ResponseType = InferResponseType<typeof client.api.workspaces['$post']>;
type RequestType = InferRequestType<typeof client.api.workspaces['$post']>;

export const useCreateWorkspace = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({form}) => {
            const response = await client.api.workspaces['$post']({form});

            if (!response.ok) {
                throw new Error('Unable to create workspace');
            }

            return await response.json();
        },
        onSuccess: ({data}) => {
            toast.success('Workspace created');
            const workspaces = queryClient.invalidateQueries({queryKey: ['workspaces']});
            router.push(Routes.workspaceIdPath(data.$id));
            console.log('workspaces from onSuccess:', workspaces);
        },
        onError: () => {
            toast.error('Unable to create workspace');
        },
    });

    return mutation;
}
