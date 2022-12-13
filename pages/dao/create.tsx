import React, { useEffect, useState } from "react";

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
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";

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
  categories: string[];
  subCategories: string[];
  tags: string[];
  metadata: string;
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
  tags: [],
  metadata: "",
  socials: [],
};

interface FormProp {
  state: CreateDAOProps;
  handleChange: (e: any) => any;
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

const Form2: React.FC<FormProp> = ({ state, handleChange }) => {
  return (
    <Stack width={"xl"}>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        DAO Details
      </Heading>
      <FormControl as={GridItem} colSpan={[6, 3]}>
        <FormLabel
          htmlFor="country"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
        >
          Country / Region
        </FormLabel>
        <Select
          id="country"
          name="country"
          autoComplete="country"
          placeholder="Select option"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        >
          <option>United States</option>
          <option>Canada</option>
          <option>Mexico</option>
        </Select>
      </FormControl>

      <FormControl as={GridItem} colSpan={6}>
        <FormLabel
          htmlFor="street_address"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          Street address
        </FormLabel>
        <Input
          type="text"
          name="street_address"
          id="street_address"
          autoComplete="street-address"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 6, null, 2]}>
        <FormLabel
          htmlFor="city"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          City
        </FormLabel>
        <Input
          type="text"
          name="city"
          id="city"
          autoComplete="city"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="state"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          State / Province
        </FormLabel>
        <Input
          type="text"
          name="state"
          id="state"
          autoComplete="state"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="postal_code"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
          mt="2%"
        >
          ZIP / Postal
        </FormLabel>
        <Input
          type="text"
          name="postal_code"
          id="postal_code"
          autoComplete="postal-code"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>
    </Stack>
  );
};

const DAOForm = () => {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(50.0);

  const { account, library } = useWeb3React();

  const isConnected = library && typeof account === "string";

  const [formState, setFormState] = useState<CreateDAOProps>({
    ...blankCreateDAOForm,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
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
          <Form2 state={formState} handleChange={handleChange} />
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
                onClick={() => {
                  toast({
                    title: "Account created.",
                    description: "We've created your account for you.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                }}
              >
                Submit
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </>
  );
};

const CreateDao = () => {
  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 20, md: 25 }}
      direction={{ base: "column" }}
    >
      <Heading>Create DAO for your CAUSE</Heading>
      <DAOForm />
    </Stack>
  );
};

export default CreateDao;
