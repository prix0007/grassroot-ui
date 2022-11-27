import React, { useEffect, useState } from "react";
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
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
  Text,
  Avatar,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import BackButton from "../../components/BackButton";
import { useRouter } from "next/router";
import { BsFillImageFill } from "react-icons/bs";
import Step1 from "../../components/campaignSteps/step1";
import Step2 from "../../components/campaignSteps/step2";
import { BigNumber } from "ethers";
import Step3 from "../../components/campaignSteps/step3";
import Step4 from "../../components/campaignSteps/step4";
import Step5 from "../../components/campaignSteps/step5";

const Form3 = () => {
  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal">
        Social Handles
      </Heading>
      <SimpleGrid columns={1} spacing={6}>
        <FormControl as={GridItem} colSpan={[3, 2]}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
          >
            Website
          </FormLabel>
          <InputGroup size="sm">
            <InputLeftAddon
              bg="gray.50"
              _dark={{
                bg: "gray.800",
              }}
              color="gray.500"
              rounded="md"
            >
              http://
            </InputLeftAddon>
            <Input
              type="tel"
              placeholder="www.example.com"
              focusBorderColor="brand.400"
              rounded="md"
            />
          </InputGroup>
        </FormControl>

        <FormControl id="email" mt={1}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
          >
            About
          </FormLabel>
          <Textarea
            placeholder="you@example.com"
            rows={3}
            shadow="sm"
            focusBorderColor="brand.400"
            fontSize={{
              sm: "sm",
            }}
          />
          <FormHelperText>
            Brief description for your profile. URLs are hyperlinked.
          </FormHelperText>
        </FormControl>
      </SimpleGrid>
    </>
  );
};

// TODO: Rules show in a Modal

// Profile
// - FirstName
// - LastName
// - Address
// - Avatar Image
// - Timezone
// - Biography
// - Websites[]

// Steps

// Basics
// - Title
// - Subtitils
// - Category
// - SubCategory
// - Project Location
// - Tags
// - Images
// - Videos
// - Token Currency
// - Goal Amount
// - Completion Date

// Rewards
// - Reward Tiers
// - + Title
// - + Min Pledge Amount
// - + Reward Type
// - + Reward Description

// Story
// - Write your story about project (make it like a text Editor)

export type IRewardTier = {
  title: string;
  minAmount: string;
  rewardType: string;
  rewardDescription: string;
};

export type IProfileDetails = {
  firstName: string;
  lastName: string;
  address: string;
  avatar?: string;
  timezone?: string;
  biography?: string;
  websites?: string[];
};

export type ICampaignBasicDetails = {
  title: string;
  subtitle: string;
  category: string;
  subcategory: string;
  tags: string[];
  country: string;
  images: string[];
  videos?: string[];
  tokenCurrency: string; // ERC20 Token Address
  minAmount: string;
  goalAmount: string;
  completionDate: string;
};

export type ISocialDetails = {
  name: string;
  url: string;
  slug: string;
};

export type ICampaignFormState = {
  adminDetails: IProfileDetails;
  basic: ICampaignBasicDetails;
  rewards: IRewardTier[];
  story: string;
  socials: ISocialDetails[];
};

const blankCampaign = {
  adminDetails: {
    firstName: "",
    lastName: "",
    address: "",
    avatar: "",
    timezone: "",
    biography: "",
    websites: [],
  },
  basic: {
    title: "My New Campaign",
    subtitle: "This is a new Campaign for Grassroot Platform.",
    category: "",
    subcategory: "",
    tags: ["social", "donation"],
    country: "",
    images: [],
    tokenCurrency: "",
    minAmount: "",
    goalAmount: "",
    completionDate: "",
  },
  rewards: [],
  story: "",
  socials: [
    {
      name: "Twitter",
      slug: "twitter",
      url: "",
    },
    {
      name: "Instagram",
      slug: "instagram",
      url: "",
    },
    {
      name: "Discord",
      slug: "discord",
      url: "",
    },
    {
      name: "Facebook",
      slug: "facebook",
      url: "",
    },
  ],
};

const Multistep = () => {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(20.0);

  const [campaignState, setCampaignState] = useState<ICampaignFormState>({
    ...blankCampaign,
  });

  useEffect(() => {
    const sampleAdminDetails = {
      firstName: "Prince",
      lastName: "Anuragi",
      address: "0xf2700a4f973998496F09051c2E1075de40D69F8B",
      avatar: "https://i.imgur.com/80HvW9r.png",
      timezone: "",
      biography: "A developer with a native love of Web3 and People's power.",
      websites: ["https://grassroot.uk"],
    };

    setCampaignState({
      ...campaignState,
      adminDetails: {
        ...sampleAdminDetails,
      },
    });
  }, []);

  // Steps
  // Step 1 -> Admin Details
  // Step 2 -> Basic Details
  // Step 3 -> Story Details
  // Step 4 -> Rewards Details
  // Step 5 -> Social Detail

  const handleAdminChange = (key: string, value: string) => {
    setCampaignState({
      ...campaignState,
      adminDetails: {
        ...campaignState.adminDetails,
        [key]: value,
      },
    });
  };

  const handleBasicChange = (key: string, value: string) => {
    setCampaignState({
      ...campaignState,
      basic: {
        ...campaignState.basic,
        [key]: value,
      },
    });
  };

  const handleRewardChange = (reward: IRewardTier) => {
    setCampaignState({
      ...campaignState,
      rewards: [...campaignState.rewards, reward],
    });
  };

  const handleSocialChange = (slug: string, value: string) => {
    const newSocials = campaignState.socials.map((social) => {
      if (social.slug === slug) {
        return {
          ...social,
          url: value,
        };
      } else {
        return social;
      }
    });
    setCampaignState({
      ...campaignState,
      socials: [...newSocials],
    });
  };

  const resolveFormStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          <Step1
            adminDetails={campaignState.adminDetails}
            setAdminDetails={handleAdminChange}
          />
        );
      case 2:
        return (
          <Step2
            basicDetails={campaignState.basic}
            setBasicDetails={handleBasicChange}
          />
        );
      case 3:
        return <Step3 />;
      case 4:
        return (
          <Step4
            rewards={campaignState.rewards}
            setRewards={handleRewardChange}
          />
        );
      case 5:
        return (
          <Step5
            socials={campaignState.socials}
            setSocial={handleSocialChange}
          />
        );
    }
  };

  const handleStepValidation = (step: number): { success: boolean } => {
    let isValid = true;
    switch (step) {
      case 1:
        // Checks for firstName, lastName, address, biography

        ["firstName", "lastName", "address", "biography"].forEach((key) => {
          if (campaignState.adminDetails[key].trim().length < 1) {
            toast({
              title: `${key} is required`,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            isValid = false;
          }
        });
        return { success: isValid };
        break;
      case 2:
        [
          "title",
          "subtitle",
          "category",
          "subcategory",
          "country",
          "tokenCurrency",
          "minAmount",
          "goalAmount",
          "completionDate",
        ].forEach((key) => {
          if (campaignState.basic[key].trim().length < 1) {
            toast({
              title: `${key} is required`,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            isValid = false;
          }
        });
        if (campaignState.basic.images.length === 0) {
          toast({
            title: `Atleast one image is required!`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          isValid = false;
        }
        return { success: isValid };
        break;
      case 3:
        // No Checks as Story is optional..
        return { success: true };
        break;
      case 4:
        // No Checks as these are optional..
        return { success: true };
        break;
      case 5:
        // No Checks as Social Links are optional..
        return { success: true };
        break;
    }
  };

  const handleCampaignSubmission = () => {
    console.log("Submission Called");
    console.log(campaignState);
    const campaignStory = JSON.parse(localStorage.getItem("story"));
    console.log(campaignStory);
    toast({
      title: "Account created.",
      description: "We've created your account for you.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
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
        {resolveFormStep(step)}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1);
                  setProgress(progress - 20.0);
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
                isDisabled={step === 5}
                onClick={() => {
                  const { success } = handleStepValidation(step);
                  console.log(success);
                  if (success) {
                    setStep(step + 1);
                    if (step === 5) {
                      setProgress(100);
                    } else {
                      setProgress(progress + 20.0);
                    }
                  }
                }}
                colorScheme="teal"
                variant="outline"
              >
                Next
              </Button>
            </Flex>
            {step === 5 ? (
              <Button
                w="7rem"
                colorScheme="red"
                variant="solid"
                onClick={handleCampaignSubmission}
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

const New = () => {
  const router = useRouter();
  const handleBack = () => {
    router.push("/crowdfunding");
  };

  return (
    <Box w="100%" p={4} background={"none"}>
      <br />
      <BackButton onClick={handleBack} />
      <br />
      <Heading textAlign={"center"}>Create a new Crowdfunding Campaign</Heading>
      <Heading
        textAlign={"center"}
        size={"sm"}
        color={"blue.700"}
        my={4}
        fontWeight={"normal"}
      >
        Fill out the form below to help us help you in your `cause`.
      </Heading>
      <Text textAlign={"center"} color={"blue.500"}>
        It&apos;s totally free and autonomous, we don&apos;t take any charges on
        crowdfunding services.
      </Text>
      <Multistep />
    </Box>
  );
};

export default New;
