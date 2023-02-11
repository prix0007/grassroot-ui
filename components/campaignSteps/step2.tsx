import {
  Heading,
  FormControl,
  GridItem,
  FormLabel,
  Select,
  Input,
  useToast,
  Flex,
  Box,
  Text,
  IconButton,
  TagLabel,
  TagCloseButton,
  Tag,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import React, { useCallback, useRef } from "react";
import { ICampaignBasicDetails } from "../../pages/dao/[id]/campaign/new";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { CloseIcon } from "@chakra-ui/icons";
import ImageDropper from "../ImageDropper";
import ImageDropperMany from "../ImageDropperMany";
import { useTokensQuery } from "../../hooks/user";
import { useAccount } from "wagmi";

type IForm2 = {
  basicDetails: ICampaignBasicDetails;
  setBasicDetails: (key: string, value: string | string[]) => any;
};

// Basics
// - Title
// - Subtitils
// - Category
// - SubCategory
// - Project Country
// - Tags
// - Images
// - Videos
// - Token Currency
// - Goal Amount
// - Completion Date

export const CATEGORIES = [
  "electronics",
  "arts",
  "social",
  "buisness",
  "product",
];
export const SUBCATEGORIES = {
  electronics: ["personal", "gadget", "phone", "others"],
  arts: ["digital collection", "museum", "charity art", "NFTs", "others"],
  social: ["charity", "social cause", "others"],
  buisness: ["real estate", "stocks", "new idea", "others"],
  product: ["baby care", "strope", "software", "hardware", "others"],
};

export const COUNTRIES = [
  "India",
  "United Kingdom",
  "United States of America",
];

export const ACCEPTED_TOKENS = [
  {
    name: "USDC",
    address: "0x7163e7B49F2D3bbeed78Ec8FD40Ec93621E0dd15",
    network: "polygon",
  },
];

export const isValidNumberString = (input: string): boolean => {
  const validNumber = new RegExp(/^\d*\.?\d*$/);
  return validNumber.test(input);
};

const Step2: React.FC<IForm2> = ({ basicDetails, setBasicDetails }) => {
  const toast = useToast();

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    switch (e.target.name) {
      case "minAmount":
      case "goalAmount":
        if (isValidNumberString(e.target.value)) {
          setBasicDetails(e.target.name, e.target.value);
        } else {
          toast({
            title: "Not a valid number.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
        break;
      default:
        setBasicDetails(e.target.name, e.target.value);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (Date.now() > date.getTime()) {
      toast({
        title: "Not a date in future.",
        description: "Please select a date and time in future.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setBasicDetails("completionDate", date.toISOString());
  };

  //   React Dropzone
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    const imgUrls = acceptedFiles.map((file: File, idx) => {
      return URL.createObjectURL(file);
    });
    // TODO: Some Bug here or on image selection cause dropdown menu's to reset on Drop or on Click Select
    setBasicDetails("images", [...basicDetails.images, ...imgUrls]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleRemoveImage = (idx: number) => {
    const newUrls = basicDetails?.images.filter(
      (imgUrl, index) => index !== idx
    );
    setBasicDetails("images", newUrls);
  };

  const tagRef = useRef<HTMLInputElement>();

  const handleAddTag = () => {
    if (tagRef && tagRef.current) {
      const ipTag = tagRef?.current.value as string;
      const newTags = [...basicDetails?.tags, ipTag];
      setBasicDetails("tags", newTags);
      tagRef.current.value = "";
    }
  };

  const handleRemoveTag = (idx: number) => {
    const newTags = basicDetails?.tags.filter((tag, index) => index !== idx);
    setBasicDetails("tags", newTags);
  };

  const { address } = useAccount();

  const { data, isLoading, isError } = useTokensQuery(address);

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Campaign Details
      </Heading>
      <FormControl as={GridItem} colSpan={6}>
        <FormLabel
          htmlFor="title"
          fontSize="lg"
          fontWeight="lg"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          Title
        </FormLabel>
        <Input
          type="text"
          name="title"
          id="title"
          placeholder={"Enter title for your project"}
          focusBorderColor="brand.400"
          shadow="lg"
          size="lg"
          w="full"
          rounded="md"
          value={basicDetails.title}
          onChange={(e) => {
            if (e.target.value.length > 32) {
              toast({
                title: "Title must be less than 32 chars.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
              return;
            }
            handleChange(e);
          }}
        />
      </FormControl>
      <FormControl as={GridItem} colSpan={6}>
        <FormLabel
          htmlFor="subtitle"
          fontSize="md"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          Subtitle
        </FormLabel>
        <Input
          type="text"
          name="subtitle"
          id="subtitle"
          placeholder={"Enter Subtitle for your project"}
          focusBorderColor="brand.400"
          shadow="md"
          size="md"
          w="full"
          rounded="md"
          value={basicDetails.subtitle}
          onChange={handleChange}
        />
      </FormControl>
      <Flex justifyContent={"space-between"} my={2} direction={"row"}>
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
            w="40%"
            rounded="md"
            value={basicDetails.category}
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
            w="40%"
            rounded="md"
            value={basicDetails.subcategory}
            onChange={handleChange}
          >
            {SUBCATEGORIES[basicDetails.category]?.map(
              (subcategory: string) => {
                return (
                  <option
                    key={subcategory}
                    value={subcategory}
                    style={{ textTransform: "capitalize" }}
                  >
                    {subcategory}
                  </option>
                );
              }
            )}
          </Select>
        </FormControl>
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
          value={basicDetails.country}
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

      <FormControl as={GridItem} colSpan={[6, 3]} my={3}>
        <FormLabel
          htmlFor="tokenCurrency"
          fontSize="md"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
        >
          Accepted Token
        </FormLabel>
        <Select
          id="tokenCurrency"
          name="tokenCurrency"
          autoComplete="tokenCurrency"
          placeholder="Select tokenCurrency"
          focusBorderColor="brand.400"
          shadow="md"
          size="md"
          w="40%"
          rounded="md"
          value={basicDetails.tokenCurrency}
          onChange={handleChange}
        >
          {ACCEPTED_TOKENS?.map((token) => {
            return (
              <option
                key={token.address}
                value={token.address}
                style={{ textTransform: "capitalize" }}
              >
                {token.name}
              </option>
            );
          })}
        </Select>
      </FormControl>
      <ImageDropperMany
        currentImages={basicDetails?.images}
        handleFileUploaded={setBasicDetails}
        propKey={"images"}
        heading={"Campaign Images"}
        token={data?.accessToken}
      />

      <Box>
        <Text my={4}>Tags</Text>
        {basicDetails.tags.map((tag, idx) => {
          return (
            <Tag
              size={"md"}
              key={tag + idx}
              borderRadius="full"
              variant="solid"
              colorScheme="blue"
              my={2}
              mx={1}
            >
              <TagLabel>#{tag}</TagLabel>
              <TagCloseButton onClick={() => handleRemoveTag(idx)} />
            </Tag>
          );
        })}
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={"text"}
            placeholder="Type to add a new tag."
            ref={tagRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTag();
                e.preventDefault();
              }
            }}
          />
          <InputRightElement width="7.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => handleAddTag()}
              colorScheme={"green"}
            >
              Add Tag
            </Button>
          </InputRightElement>
        </InputGroup>
      </Box>

      <FormControl as={GridItem} colSpan={6}>
        <FormLabel
          htmlFor="minAmount"
          fontSize="md"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          Minimum Contribution Amount
        </FormLabel>
        <Input
          type="text"
          name="minAmount"
          id="minAmount"
          placeholder={"Enter minimum contribution for your project"}
          focusBorderColor="brand.400"
          shadow="md"
          size="md"
          w="full"
          rounded="md"
          value={basicDetails?.minAmount}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={6}>
        <FormLabel
          htmlFor="goalAmount"
          fontSize="md"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          Goal Amount
        </FormLabel>
        <Input
          type="text"
          name="goalAmount"
          id="goalAmount"
          placeholder={"Enter goal for your project"}
          focusBorderColor="brand.400"
          shadow="md"
          size="md"
          w="full"
          rounded="md"
          value={basicDetails.goalAmount}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl as={GridItem} colSpan={6}>
        <FormLabel
          htmlFor="goalAmount"
          fontSize="md"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          Completion Time
        </FormLabel>
        <Input
          placeholder="Select Date and Time"
          size="md"
          type="datetime-local"
          value={basicDetails?.completionDate.substring(0, 16)}
          onChange={handleDateChange}
        />
      </FormControl>
    </>
  );
};

export default Step2;
