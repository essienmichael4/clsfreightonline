import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UploadPayload {
  file: File;
  uploadUrl: string;
}

// interface UploadProgress {
//   percent: number;
// }

export const useVideoUpload = (onProgress?: (p: number) => void) => {
    return useMutation({
        mutationFn: async ({ file, uploadUrl }: UploadPayload) => {
        await axios.put(uploadUrl, file, {
            headers: { "Content-Type": file.type },
            onUploadProgress: (event) => {
            if (event.total) {
                const percent = Math.round((event.loaded / event.total) * 100);
                onProgress?.(percent);
            }
            },
        });
        },
    });
};
