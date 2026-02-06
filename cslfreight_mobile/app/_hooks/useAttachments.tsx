import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import { Attachment } from "../_lib/types";

export interface AttachmentResponse {
    data: Attachment[];
    meta: {
        page: number;
        take: number;
        itemCount: number;
        pageCount: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    };
}

export const useAttachments = (page: number = 1, limit: number = 10) => {
    const axios_instance_token = useAxiosToken();
    return useQuery<AttachmentResponse>({
        queryKey: ["attachments", page, limit],
        queryFn: async () => {
            const response = await axios_instance_token.get(`/attachments`, {
                params: { page, take: limit },
            });
            return response.data;
        },
    });
};
