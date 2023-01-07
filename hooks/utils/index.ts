import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { makeGraphQLInstance } from "../../graphql";

const useUploadFile = (accessToken: string, onSuccess: any) => {
  return useMutation({
    mutationFn: async (data: string) => {
      const form = new FormData();
      form.append(
        "file",
        new File([new Blob([data], { type: "plain/text" })], "metadata.json")
      );
      return axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/files/uploadFile`,
        form,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onSuccess: onSuccess,
  });
};

export { useUploadFile };
