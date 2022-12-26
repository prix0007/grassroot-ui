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
  CircularProgress,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import BackButton from "../../../../components/BackButton";
import { useRouter } from "next/router";
import { BsFillImageFill } from "react-icons/bs";
import Step1 from "../../../../components/campaignSteps/step1";
import Step2, { CATEGORIES } from "../../../../components/campaignSteps/step2";
import { BigNumber, ethers } from "ethers";
import Step3 from "../../../../components/campaignSteps/step3";
import Step4 from "../../../../components/campaignSteps/step4";
import Step5 from "../../../../components/campaignSteps/step5";
import { useWeb3React } from "@web3-react/core";
import useCrowdfundingContract from "../../../../hooks/useCrowdfundingContract";

const CROWDFUNDING_CONTRACT_ADDRESS =
  "0x6ddC3Bde48ADdE719dee30200587A484b5db2bd7";

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
    title: "",
    subtitle: "",
    category: "",
    subcategory: "",
    tags: ["others"],
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

  // State Loading Submission
  const [isLoading, setLoading] = useState(false);

  const { account, chainId } = useWeb3React();

  const crowdfundingContract = useCrowdfundingContract(
    CROWDFUNDING_CONTRACT_ADDRESS
  );

  const [campaignState, setCampaignState] = useState<ICampaignFormState>({
    ...blankCampaign,
  });

  useEffect(() => {
    setCampaignState({
      ...campaignState,
      adminDetails: {
        ...campaignState.adminDetails,
        address: account,
      },
    });
  }, [account]);

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
          if (campaignState.adminDetails[key]?.trim().length < 1) {
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

  const handleCampaignSubmission = async () => {
    const campaignStory = JSON.parse(localStorage.getItem("story"));

    const metadata = {
      ...campaignState,
      story: JSON.stringify(campaignStory),
      version: "0.1",
    };

    console.log("File Metadata Pushing", metadata);
    setLoading(true);
    try {
      const res = await fetch("/api/storage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      });

      const { cid } = await res.json();

      console.log(cid);

      const DECIMALS = 18;
      const futureUnixTimeStamp = new Date(
        metadata.basic.completionDate
      ).getTime();
      const offset = futureUnixTimeStamp - Date.now();

      const finalBCObj = {
        adminAddress: account,
        tokenAddress: metadata.basic.tokenCurrency,
        campaignName: ethers.utils.formatBytes32String(metadata.basic.title),
        metadataCid: cid,
        minAmountContribution: ethers.utils.parseUnits(
          metadata.basic.minAmount,
          DECIMALS
        ),
        targetAmount: ethers.utils.parseUnits(
          metadata.basic.goalAmount,
          DECIMALS
        ),
        category: CATEGORIES.findIndex(
          (category) => category === metadata.basic.category
        ),
        validUntil: parseInt((offset / 1000).toString()),
      };

      console.log(finalBCObj);

      toast({
        title: "Metadata Uploaded",
        description: `Your metadata has been uploaded at ${cid}. Please sign the transaction with metamask to publish it on blockchain.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      try {
        const tx = await crowdfundingContract.createCampaign(
          finalBCObj.adminAddress,
          finalBCObj.tokenAddress,
          finalBCObj.campaignName,
          finalBCObj.metadataCid,
          finalBCObj.minAmountContribution,
          finalBCObj.targetAmount,
          finalBCObj.category,
          finalBCObj.validUntil
        );
        await tx.wait();
        toast({
          title: "Campaign Created Successfully.",
          description: `Your transaction has been successfully sent.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (e) {
        console.log(e);
        toast({
          title: "Something went wrong.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }

      // localStorage.setItem("story", "");
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const handleConnectionValidation = () => {
    return account && chainId === 80001;
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
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                w="7rem"
                isDisabled={step === 5}
                onClick={() => {
                  const { success } = handleStepValidation(step);
                  const isValidNetwork = handleConnectionValidation();

                  if (!isValidNetwork) {
                    toast({
                      title: `Connection not found.`,
                      description:
                        "Make sure you are connected to your metamask, and you are on polygon mumbai testnet.",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                  console.log(success);
                  if (success && isValidNetwork) {
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress
                    color="green.900"
                    isIndeterminate
                    size={10}
                  />
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

const New = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <Box w="100%" p={4} background={"none"}>
      <br />
      <BackButton onClick={handleBack} />
      <br />
      <Heading textAlign={"center"}>Create a new DAO Campaign</Heading>
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
        It&apos;s totally autonomous, we don&apos;t take any charges on extra
        services, only 2% if your goal is reached.
      </Text>
      <Multistep />
    </Box>
  );
};

export default New;
