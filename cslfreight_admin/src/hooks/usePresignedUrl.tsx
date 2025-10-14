// src/hooks/usePresignedUrl.ts
import { useMutation } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";

interface PresignRequest {
    filename: string;
    contentType: string;
}

interface PresignResponse {
    uploadUrl: string;
    key: string;
}

export const usePresignedUrl = () => {
    const axios_instance_token = useAxiosToken()
    
    return useMutation({
        mutationFn: async (payload: PresignRequest): Promise<PresignResponse> => {
            const { data } = await axios_instance_token.post("/videos/presigned-url", payload );
            return data;
        },
    });
};
