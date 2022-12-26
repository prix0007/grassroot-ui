import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  CircularProgress,
  Flex,
  IconButton,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export interface ImageDropperManyProps {
  handleFileUploaded: (propKey: string, url: string[]) => any;
  currentImages: string[];
  token: string;
  propKey: string;
  heading: string;
}

const ImageDropperMany: React.FC<ImageDropperManyProps> = ({
  handleFileUploaded,
  propKey,
  currentImages,
  token,
  heading,
}) => {
  const toast = useToast();
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
      toast({
        title: "Uploaded Image",
        description: `Image Uploaded.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      return handleFileUploaded(propKey, [...currentImages, imageUrl]);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file: File) => {
      mutation.mutate(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 5,
  });

  const handleRemoveImage = (idx: number) => {
    const newUrls = currentImages.filter((imgUrl, index) => index !== idx);
    handleFileUploaded(propKey, [...newUrls]);
  };

  return (
    <Box w={"100%"}>
      <Text fontSize={"xl"} fontWeight={"bold"}>
        {heading}
      </Text>
      <Flex flexWrap={"wrap"}>
        {currentImages.map((imageUrl, idx) => {
          return (
            <Box m={2} key={imageUrl + idx} position={"relative"}>
              <IconButton
                position={"absolute"}
                right={-2}
                top={-2}
                onClick={() => handleRemoveImage(idx)}
                aria-label={"remove image"}
                borderColor={"red.300"}
                borderWidth={"2px"}
                colorScheme={"red"}
                borderRadius={"50px"}
                size={"sm"}
              >
                <CloseIcon color={"red.800"} />
              </IconButton>
              <Image
                src={imageUrl}
                alt={"selected image"}
                width={200}
                height={150}
              />
            </Box>
          );
        })}
      </Flex>
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
                files (max. 5)
              </Text>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ImageDropperMany;
