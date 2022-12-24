import { Box, CircularProgress, Image, Text, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export interface ImageDropperProps {
  handleFileUploaded: (propKey: string, url: string) => any;
  token: string;
  propKey: string;
  heading: string
}

const ImageDropper: React.FC<ImageDropperProps> = ({
  handleFileUploaded,
  propKey,
  token,
  heading
}) => {
  const toast = useToast();

  const [selectedFileUrl, setSelectedFileUrl] = useState("");

  const mutation = useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/files/uploadImage`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onError: () => {
      toast({
        title: "Error on Uploading!!",
        description: `Failed to Upload Image.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: (fileRepsonse) => {
      const {
        data: { imageUrl },
      } = fileRepsonse;
      setSelectedFileUrl(imageUrl);
      handleFileUploaded(propKey, imageUrl);
      toast({
        title: "Uploaded Image",
        description: `Image Uploaded.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFileUrl(URL.createObjectURL(acceptedFiles[0]));
      mutation.mutate(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <Box w={"100%"}>
      <Text fontSize={"xl"} fontWeight={"bold"}>
        {heading}
      </Text>
      {selectedFileUrl && <Image src={selectedFileUrl} />}
      <Box
        {...getRootProps()}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        w={"100%"}
        mt={2}
        minHeight={"5rem"}
        borderWidth={"3px"}
        borderColor={"blue.600"}
        borderRadius={"md"}
        borderStyle={"dashed"}
      >
        {mutation.isLoading ? (
          <CircularProgress isIndeterminate color={"brand.700"} />
        ) : (
          <>
            <input {...getInputProps()} />
            {isDragActive ? (
              <Text>Drop the files here ...</Text>
            ) : (
              <Text color="blue.600">
                Drag &apos;n&apos; drop some files here, or click to select
                files
              </Text>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ImageDropper;
