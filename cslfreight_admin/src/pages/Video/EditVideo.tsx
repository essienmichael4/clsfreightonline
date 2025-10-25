import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";
import { Textarea } from "@/components/ui/textarea";
import useAxiosToken from "@/hooks/useAxiosToken";
import { VideoSchema, type VideoSchemaType } from "@/schema/video";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Info, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import PremierePicker from "./_components/PremierePicker";
import Tags from "../Invoices/_components/Tags";
import type { Video } from "@/lib/types";

const EditVideo = () => {
  const axios_instance_token = useAxiosToken();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState<File | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const { id } = useParams();

  // 🔹 Fetch existing video details
  const { data: video, isLoading } = useQuery<Video>({
    queryKey: ["videos", id],
    queryFn: async () => {
      const res = await axios_instance_token.get(`/videos/${id}/details`);
      return res.data;
    },
    enabled: !!id,
  });

  // 🔹 Form setup
  const form = useForm<VideoSchemaType>({
    resolver: zodResolver(VideoSchema),
    defaultValues: {
      title: "",
      description: "",
      premiere: "Public",
    },
  });

  // 🔹 Populate form when video data arrives
  useEffect(() => {
    if (video) {
      form.reset({
        title: video.title,
        description: video.description,
        premiere: video.premiere as "Public" | "Private" | "Unlisted" | "Scheduled",
      });
      setTags(video.tags || []);
    }
  }, [video]);

  // 🔹 Handlers
  const handlePremiereChange = (value: "Public" | "Unlisted" | "Private" | "Scheduled") => {
    form.setValue("premiere", value);
  };

  const handleFileChange = (value: File[] | undefined) => {
    setThumbnail(value?.[0]);
  };

  const handleChange = (e: string[]) => {
    setTags(e);
  };

  // 🔹 Edit video mutation
  const editVideo = async (data: VideoSchemaType) => {
    if (thumbnail) {
      const formData = new FormData();
      formData.append("tags", JSON.stringify(tags));
      formData.append("key", video?.key as string);
      formData.append("title", data.title as string);
      formData.append("description", data.description as string);
      formData.append("premiere", data.premiere);
      formData.append("file", thumbnail);

      const response = await axios_instance_token.patch(`/videos/${id}/edit`, formData, {
        headers: { "content-type": "multipart/form-data" },
      });
      return response.data;
    } else {
      const response = await axios_instance_token.patch(`/videos/${id}/video-meta`, {
        ...data,
        tags,
        key: video?.key
      });
      return response.data;
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: editVideo,
    onSuccess: () => {
      toast.success("Video updated successfully", { id: "edit-video" });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      navigate(-1);
    },
    onError: (err: any) => {
      const message = axios.isAxiosError(err)
        ? err?.response?.data?.message
        : "Something went wrong";
      toast.error(message, { id: "edit-video" });
    },
  });

  const onSubmit = (data: VideoSchemaType) => {
    toast.loading("Updating video...", { id: "edit-video" });
    mutate(data);
  };

  if (isLoading) {
    return <p className="text-center py-6 text-gray-500">Loading video details...</p>;
  }

  return (
    <div className="container mx-auto py-4">
      <div className="w-full px-4">
        <button
          onClick={() => form.handleSubmit(onSubmit)()}
          className="text-xs px-4 py-1.5 bg-blue-700 text-white rounded-md hover:bg-blue-800"
        >
          {!isPending ? "Publish" : <Loader2 className="animate-spin" />}
        </button>
        <div className="text-xs flex items-center gap-2 mt-2">
          <Info className="w-4 h-4 text-gray-500" />
          <p className="text-gray-500">Click "Publish" to update the video details.</p>
        </div>

        

        <Form {...form}>
          <form className="mt-4 flex flex-col md:flex-row gap-4">
            {/* Left column */}
            <div className="md:w-3/5 space-y-3 px-1">
                {video?.thumbnail && <div className="relative aspect-video w-1/2 overflow-hidden rounded-md group">
                    {/* Thumbnail */}
                    <img
                    src={video?.thumbnail}
                    alt={video?.title}
                    className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                    />
                </div>}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-xs">Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-xs">Video Tags</FormLabel>
                    <FormControl>
                      <Tags
                        value={tags}
                        placeholder="Tutorial, Lessons, Info"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Right column */}
            <div className="md:w-2/5 px-1 space-y-3">
              <FormField
                name="premiere"
                render={() => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-xs">Premiere</FormLabel>
                    <FormControl>
                      <PremierePicker onChange={handlePremiereChange} initialValue={video?.premiere as "Public" | "Private" | "Unlisted" | "Scheduled"} />
                    </FormControl>
                  </FormItem>
                )}
              />

                {/* New Thumbnail Preview */}
                {thumbnail && (
                    <div className="relative aspect-video w-full rounded-md overflow-hidden border mt-2">
                    <img
                        src={URL.createObjectURL(thumbnail)}
                        alt="New thumbnail preview"
                        className="w-full h-full object-cover"
                    />
                    <p className="absolute bottom-0 bg-blue-600 text-white text-xs w-full text-center py-1">
                        New Thumbnail (unsaved)
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                        setThumbnail(undefined);
                        toast.info("Thumbnail cleared.");
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded hover:bg-red-700 transition"
                    >
                        Remove
                    </button>
                    </div>
                )}

              <FormField
                name="thumbnail"
                render={() => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-xs">Video Thumbnail</FormLabel>
                    <FormControl>
                      <Dropzone
                        maxFiles={1}
                        accept={{ "image/*": [] }}
                        onDrop={handleFileChange}
                      >
                        <DropzoneEmptyState />
                        <DropzoneContent />
                      </Dropzone>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditVideo;
