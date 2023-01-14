import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Stack,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  Textarea,
  FormHelperText,
  InputRightElement,
  Tag,
  TagLabel,
  TagCloseButton,
  Text,
  Image,
  CircularProgress,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ACCESS_TOKEN_KEYS } from "../../localStorageKeys";
import Router, { useRouter } from "next/router";
import {
  CATEGORIES,
  COUNTRIES,
  SUBCATEGORIES,
} from "../../components/campaignSteps/step2";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import useDAOSContract from "../../hooks/useDAOContract";
import { DAOS } from "../../contracts/types";
import { makeGraphQLInstance } from "../../graphql";
import { postDao, POSTDAOProps } from "../../hooks/daos";
import ImageDropper from "../../components/ImageDropper";
import BackButton from "../../components/common/BackButton";
import { useSignInUser } from "../../hooks/user";

export type CreateDAOPropsBC = {
  name: string;
  description: string;
  metadata: string;
};

export type CreateDAOProps = {
  name: string;
  description: string;
  adminAddress: string;
  adminId: number | null;
  profilePicture: string;
  backgroundPicture: string;
  country: string;
  categories: string[];
  subCategories: string[];
  tags: string[];
  socials: Social[];
};

export type Social = {
  name: string;
  icon: string;
  url: string;
};

const blankCreateDAOForm: CreateDAOProps = {
  name: "",
  description: "",
  adminAddress: "",
  adminId: 0,
  profilePicture: "",
  backgroundPicture: "",
  categories: [],
  subCategories: [],
  country: "",
  tags: [],
  socials: [],
};

interface FormProp {
  state: CreateDAOProps;
  handleChange: (e: any) => any;
}

interface Form2 extends FormProp {
  tagRef: any;
  handleTagAdd: any;
  handleTagRemove: any;
  handleImageSet: (key: string, url: string) => any;
  accessToken: any;
}

const Form1: React.FC<FormProp> = ({ state, handleChange }) => {
  return (
    <Stack width={"xl"}>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        DAO Registration
      </Heading>
      <Flex>
        <FormControl mr="5%">
          <FormLabel htmlFor="name" fontWeight={"normal"}>
            Name
          </FormLabel>
          <Input
            id="name"
            name="name"
            placeholder="Enter DAO's name"
            value={state.name}
            onChange={handleChange}
          />
        </FormControl>
      </Flex>
      <FormControl mt="2%">
        <FormLabel htmlFor="address" fontWeight={"normal"}>
          Your Address
        </FormLabel>
        <Input id="address" type="text" isDisabled value={state.adminAddress} />
      </FormControl>

      <FormControl mt="20px">
        <FormLabel htmlFor="description" fontWeight={"normal"}>
          Description
        </FormLabel>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter a description for the community which you want to build."
          rows={20}
          value={state.description}
          onChange={handleChange}
        />
      </FormControl>
    </Stack>
  );
};

const Form2: React.FC<Form2> = ({
  state,
  handleChange,
  tagRef,
  handleTagAdd,
  handleTagRemove,
  handleImageSet,
  accessToken,
}) => {
  return (
    <Stack width={"xl"}>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        DAO Details
      </Heading>
      <ImageDropper
        handleFileUploaded={handleImageSet}
        propKey={"profilePicture"}
        heading={"Profile Picture"}
        token={accessToken}
      />
      <ImageDropper
        handleFileUploaded={handleImageSet}
        propKey={"backgroundPicture"}
        heading={"Background Picture"}
        token={accessToken}
      />
      <Flex justifyContent={"space-between"} my={2} direction={"row"}>
        <Box w={"50%"} pr={2}>
          <FormControl as={GridItem} colSpan={[6, 3]}>
            <FormLabel
              htmlFor="category"
              fontSize="md"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              Category
            </FormLabel>
            <Select
              id="category"
              name="category"
              autoComplete="category"
              placeholder="Select option"
              focusBorderColor="brand.400"
              shadow="md"
              size="md"
              rounded="md"
              onChange={handleChange}
            >
              {CATEGORIES.map((category) => {
                return (
                  <option
                    key={category}
                    value={category}
                    style={{ textTransform: "capitalize" }}
                  >
                    {category}
                  </option>
                );
              })}
            </Select>
          </FormControl>
          <Box my={2}>
            {state.categories.map((category, idx) => {
              return (
                <Tag
                  mx={2}
                  my={1}
                  backgroundColor={"brand.700"}
                  key={category + idx}
                >
                  {category}
                </Tag>
              );
            })}
          </Box>
        </Box>
        <Box w={"50%"} pl={2}>
          <FormControl as={GridItem} colSpan={[6, 3]}>
            <FormLabel
              htmlFor="subcategory"
              fontSize="md"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              Sub Category
            </FormLabel>
            <Select
              id="subcategory"
              name="subcategory"
              autoComplete="subcategory"
              placeholder="Select option"
              focusBorderColor="brand.400"
              shadow="md"
              size="md"
              rounded="md"
              onChange={handleChange}
            >
              {CATEGORIES.map((category) =>
                SUBCATEGORIES[category]?.map((subcategory: string) => {
                  return (
                    <option
                      key={subcategory}
                      value={subcategory}
                      style={{ textTransform: "capitalize" }}
                    >
                      {subcategory}
                    </option>
                  );
                })
              )}
            </Select>
          </FormControl>
          <Box my={2}>
            {state.subCategories.map((subcategory, idx) => {
              return (
                <Tag
                  mx={2}
                  my={1}
                  backgroundColor={"brand.700"}
                  key={subcategory + idx}
                >
                  {subcategory}
                </Tag>
              );
            })}
          </Box>
        </Box>
      </Flex>

      <FormControl as={GridItem} colSpan={[6, 3]}>
        <FormLabel
          htmlFor="country"
          fontSize="md"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
        >
          Country
        </FormLabel>
        <Select
          id="country"
          name="country"
          autoComplete="country"
          placeholder="Select country"
          focusBorderColor="brand.400"
          shadow="md"
          size="md"
          w="40%"
          rounded="md"
          value={state.country}
          onChange={handleChange}
        >
          {COUNTRIES?.map((country: string) => {
            return (
              <option
                key={country}
                value={country}
                style={{ textTransform: "capitalize" }}
              >
                {country}
              </option>
            );
          })}
        </Select>
      </FormControl>
      <Box>
        <Text my={4}>Tags</Text>
        {state?.tags.map((tag, idx) => {
          return (
            <Tag
              size={"md"}
              key={tag + idx}
              borderRadius="full"
              variant="solid"
              colorScheme="green"
              my={2}
              mx={1}
            >
              <TagLabel>#{tag}</TagLabel>
              <TagCloseButton onClick={() => handleTagRemove(idx)} />
            </Tag>
          );
        })}
        <InputGroup
          size="md"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Input
            pr="4.5rem"
            type={"text"}
            placeholder="Type to add a new tag."
            ref={tagRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTagAdd();
                e.preventDefault();
              }
            }}
          />
          <InputRightElement width="7.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => handleTagAdd()}
              colorScheme={"green"}
            >
              Add Tag
            </Button>
          </InputRightElement>
        </InputGroup>
      </Box>
    </Stack>
  );
};

interface IDAOForm {
  daoContract: DAOS;
}

const DAOForm: React.FC<IDAOForm> = ({ daoContract }) => {
  // Hooks at top
  const toast = useToast();
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [progress, setProgress] = useState(50.0);

  const { account, library } = useWeb3React();

  const isConnected = library && typeof account === "string";

  const [formState, setFormState] = useState<CreateDAOProps>({
    ...blankCreateDAOForm,
  });

  // A Better way to fetch tokens and check.
  const { isLoggedIn, accessToken, currentUser } = useSignInUser(account);
  // console.log({ isLoggedIn, accessToken, currentUser } )

  const tagRef = useRef<HTMLInputElement>();

  const handleAddTag = () => {
    if (tagRef && tagRef.current) {
      const ipTag = tagRef?.current.value as string;
      const newTags = [...formState?.tags, ipTag];
      setFormState({ ...formState, tags: newTags });
      tagRef.current.value = "";
    }
  };

  const handleRemoveTag = (idx: number) => {
    const newTags = formState?.tags.filter((tag, index) => index !== idx);
    setFormState({ ...formState, tags: newTags });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "category":
        if (
          !formState.categories.includes(e.target.value) &&
          e.target.value.length > 0
        ) {
          setFormState({
            ...formState,
            categories: [...formState.categories, e.target.value],
          });
        }
        break;
      case "subcategory":
        if (
          !formState.subCategories.includes(e.target.value) &&
          e.target.value.length > 0
        ) {
          setFormState({
            ...formState,
            subCategories: [...formState.subCategories, e.target.value],
          });
        }
        break;
      default:
        setFormState({
          ...formState,
          [e.target.name]: e.target.value,
        });
    }
  };

  const handleImageSet = (key: string, url: string) => {
    switch (key) {
      case "profilePicture":
        setFormState({
          ...formState,
          profilePicture: url,
        });
        break;
      case "backgroundPicture":
        setFormState({
          ...formState,
          backgroundPicture: url,
        });
        break;
    }
  };

  const stepCheck = (currentStep: number) => {
    let isValid = true;
    switch (currentStep) {
      case 1:
        ["name", "description"].forEach((key: string) => {
          if (formState[key].trim().length < 3) {
            toast({
              title: "Error!!",
              description: `Your are required to give ${key.toLocaleUpperCase()}.`,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            isValid = false;
          }
        });
        return isValid;
    }
  };

  useEffect(() => {
    if (isConnected) {
      setFormState({
        ...formState,
        adminAddress: account,
      });
    }
  }, [isConnected]);

  // Hook to check if user is logged in and connected.
  // User needs to be logged in for file uploads.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isConnected || !isLoggedIn) {
        toast({
          title: "Error!!",
          description: `Your are required to loggedIn and wallet connected to access this feature.`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        router.back();
      }
    }, 5000);
    return () => clearTimeout(timeout);
  });

  const fileMutation = useMutation({
    mutationFn: (metadata: any) => {
      const form = new FormData();
      form.append(
        "file",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
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
    onError: () => {
      toast({
        title: "Error on Uploading!!",
        description: `Failed to Upload Metadata!!`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    onSuccess: async (fileRepsonse) => {
      const {
        data: { metadataUrl, metadataCid },
      } = fileRepsonse;

      toast({
        title: "Uploaded Metadata",
        description: `Metadata Uploaded.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      try {
        const counter = await daoContract._daosCounter();
        const tx = await daoContract.createDao(formState.name, metadataUrl);
        const txReceipt = await tx.wait();
        const variables: POSTDAOProps = {
          name: formState?.name,
          description: formState?.description,
          backgroundPicture: formState?.backgroundPicture || "",
          profilePicture: formState?.profilePicture,
          blockchainDaoId: counter.toString(),
          metadata: {
            daoData: formState,
            ipfsMetadata: fileRepsonse,
            transactionData: txReceipt,
          },
        };
        daoCreate.mutate(variables);
        toast({
          title: "Created DAO Successfully",
          description: `DAO is created on transaction ${txReceipt.transactionHash}.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        Router.replace("/");
      } catch (e) {
        toast({
          title: "Creating Failed for Blockchain.",
          description: `Failed to send Transaction ${e.message}.`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
  });

  // Login Client to the Backend
  const client = makeGraphQLInstance(accessToken);
  const daoCreate = postDao(client);

  const handleSubmit = async () => {
    // Handle Final Validations.
    const finalJSON = { ...formState };
    fileMutation.mutate(finalJSON);
  };

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        p={6}
        m="10px auto"
        as="form"
      >
        <Progress
          hasStripe
          value={progress}
          mb="5%"
          mx="5%"
          isAnimated
        ></Progress>
        {step === 1 ? (
          <Form1 state={formState} handleChange={handleChange} />
        ) : (
          <Form2
            state={formState}
            handleChange={handleChange}
            tagRef={tagRef}
            handleTagAdd={handleAddTag}
            handleTagRemove={handleRemoveTag}
            accessToken={accessToken}
            handleImageSet={handleImageSet}
          />
        )}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1);
                  setProgress(progress - 50.0);
                }}
                isDisabled={step === 1}
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%"
              >
                Back
              </Button>
              <Button
                w="7rem"
                isDisabled={step === 2}
                onClick={() => {
                  if (stepCheck(step)) {
                    setStep(step + 1);
                    if (step === 2) {
                      setProgress(100);
                    } else {
                      setProgress(progress + 50.0);
                    }
                  }
                }}
                colorScheme="teal"
                variant="outline"
              >
                Next
              </Button>
            </Flex>
            {step === 2 ? (
              <Button
                w="7rem"
                colorScheme="red"
                variant="solid"
                onClick={handleSubmit}
                isDisabled={fileMutation.isLoading}
              >
                {fileMutation.isLoading ? (
                  <CircularProgress isIndeterminate size={"20px"} />
                ) : (
                  "Submit"
                )}
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </>
  );
};

const CreateDao = () => {
  const DAOContract = useDAOSContract(process.env.NEXT_PUBLIC_DAOS_ADDRESS);
  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 20, md: 25 }}
      direction={{ base: "column" }}
    >
      <Flex justifyContent={"space-between"}>
        <BackButton />
        <Heading ml={"50px"}>Create DAO for your CAUSE</Heading>
      </Flex>
      <DAOForm daoContract={DAOContract} />
    </Stack>
  );
};

export default CreateDao;
