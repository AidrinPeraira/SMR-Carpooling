import { apiClientFetch } from "@/lib/api-client";
import {
  GetFileUploadUrlRequest,
  GetFileUploadUrlResult,
} from "@sharemyride/shared";

export async function getFileUploadUrlRequest(
  data: GetFileUploadUrlRequest,
) {
  return await apiClientFetch<GetFileUploadUrlResult>(
    "/api/v1/applications/upload-url",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}
