import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone"
import { usePresignedUrl } from "@/hooks/usePresignedUrl";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

interface Props {
    show: boolean,
    onClose?: (value: boolean) => void;
}

const VideoUploadDialog = ({show, onClose}: Props) => {
    const [file, setFile] = useState<File | undefined>()
    const navigate = useNavigate();
    const presignMutation = usePresignedUrl();
    const handleFileChange = (value: File[] | undefined) => {
        setFile(value?.[0]);
    };

    const handleContinue = async () => {
        if (!file) return;

        presignMutation.mutate(
            { filename: file.name, contentType: file.type },
            {
                onSuccess: (data) => {
                    console.log(data);
                    
                navigate("/video-details", {
                    state: {
                    file,
                    uploadUrl: data.uploadUrl,
                    key: data.key,
                    },
                });
                if (onClose) onClose?.(false);
                },
            }
        );
    };
    
    return (
        <div className={`${show ? "flex" : "hidden"} z-50 items-center justify-center absolute inset-0 bg-black/30`}>
            <div className="bg-white rounded-2xl h-auto w-[70%] p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Upload Video</h2>
                    <button
                        onClick={()=>onClose?.(false)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        ✕
                    </button>
                </div>
                <Dropzone 
                    maxFiles={1}
                    accept={{ "video/*": [] }}
                    onDrop={handleFileChange}
                >
                    <DropzoneEmptyState />
                    <DropzoneContent />
                </Dropzone>

                 {file && (
                    <div className="mt-4 flex justify-between items-center">
                        <p className="truncate text-sm text-gray-700 dark:text-gray-300">
                        Selected: <span className="font-medium">{file.name}</span>
                        </p>
                        <button
                            onClick={handleContinue}
                            disabled={presignMutation.isPending}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {presignMutation.isPending ? "Preparing..." : "Continue →"}
                        </button>
                    </div>
                    )}
            </div>
        </div>
    )
}

export default VideoUploadDialog
