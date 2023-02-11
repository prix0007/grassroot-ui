import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  Link as ChakraLink,
  List,
  ListItem,
  Divider,
  Link,
  Progress,
  useToast,
  Input,
  InputGroup,
  InputRightElement,
  CircularProgress,
  Badge,
  Card,
  CardBody,
  Tag,
} from "@chakra-ui/react";
import axios from "axios";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useSigner } from "wagmi";
import {
  FaDiscord,
  FaFacebook,
  FaInstagram,
  FaSocks,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

import Jdenticon from "react-jdenticon";
import { createEditor, Editor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";

import BackButton from "../../../../components/common/BackButton";
import { CATEGORIES } from "../../../../components/campaignSteps/step2";
import { formatEtherscanLink, shortenHex } from "../../../../util";

import { ICampaignFormState } from "./new";
import { useCampaignById } from "../../../../hooks/campaigns";
import { NOT_FOUND_IMAGE } from "..";
import ImageViewer from "react-image-viewer-hook/dist/ImageViewer";
import ImageViewerGallery from "../../../../components/ImageViewer";
import useCrowdfundingContract from "../../../../hooks/useCrowdfundingContract";
import useCrowdfundingContractState from "../../../../hooks/useCrowdfundingContractState";
import { networkContract } from "../../../../constants";
import { useNetwork } from "wagmi";

const CONTRACT_ADDRESS = networkContract["maticmum"].CAMPAIGNS_ADDRESS;

export const SocialSlugToIcon = (socialSlug: string) => {
  switch (socialSlug) {
    case "twitter":
      return <FaTwitter color="lightblue" />;
    case "instagram":
      return <FaInstagram color="pink" />;
    case "facebook":
      return <FaFacebook color="white" />;
    case "discord":
      return <FaDiscord color="purple" />;
    default:
      return <FaSocks color="green" />;
  }
};

const Campaign = () => {
  const router = useRouter();
  const { chain } = useNetwork();

  const handleBack = () => {
    router.back();
  };

  const campaignId = useMemo(() => {
    if (router.query.campaignid) {
      return router.query.campaignid;
    } else {
      return null;
    }
  }, [router.asPath]);

  const toast = useToast();

  const DECIMALS = 18;

  const {
    data: campaignData,
    isLoading: campaignIsLoading,
    isError: campaignIsError,
  } = useCampaignById(campaignId as string);

  const newCampaign = useMemo(() => campaignData?.campaignById, [campaignData]);
  const ipfsMetadata = newCampaign?.metadata?.metadata;

  const { campaigns } = useCrowdfundingContractState({ chainId: chain?.id });

  const campaign = useMemo(() => {
    return campaigns?.at(campaignData?.campaignById);
  }, [campaigns]);

  const [donateAmount, setDonateAmount] = useState(
    ethers.utils.formatUnits(campaign?.minAmountContribution || "0", DECIMALS)
  );

  const [isLoading, setLoading] = useState(false);

  const percentage = useMemo(() => {
    const collected = parseFloat(
      ethers.utils.formatUnits(campaign?.tokenCollected || "0", DECIMALS)
    );
    const total = parseFloat(
      ethers.utils.formatUnits(campaign?.targetAmount || "0", DECIMALS)
    );
    const percent = (collected / total) * 100;
    return percent.toFixed(2);
  }, []);

  const validUntilDate = new Date(newCampaign?.completionDate);

  const contract = useCrowdfundingContract(CONTRACT_ADDRESS);
  const { data: signer, isError: signerError } = useSigner();

  const handleDonate = async () => {
    if (donateAmount && donateAmount.trim()) {
      setLoading(true);
      try {
        const finalAmount = ethers.utils.parseUnits(donateAmount, 18);

        const tx = await contract
          .connect(signer)
          .donate(campaign.id, finalAmount);
        await tx.wait();

        toast({
          title:
            "Transaction sent successfully. Funds Donated should be reflected soon",
          duration: 5000,
          isClosable: true,
          status: "success",
        });
      } catch (e) {
        toast({
          title: `Error Occured`,
          duration: 3000,
          colorScheme: "red",
          status: "error",
          isClosable: true,
          description: e.toString(),
        });
      }
      setDonateAmount(
        ethers.utils.formatUnits(
          campaign.minAmountContribution.toString(),
          DECIMALS
        )
      );
      setLoading(false);
    } else {
      toast({
        title: `Error Occured`,
        duration: 3000,
        colorScheme: "red",
        status: "error",
        isClosable: true,
        description: `Wrong Input`,
      });
    }
  };

  const grayColorModeValue = useColorModeValue("gray.200", "gray.600");

  // Editor Stuff
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Update the initial content to be pulled from Local Storage if it exists.
  // const initialValue = useMemo(() => ipfsCidData?.story, [ipfsCidData]);

  const images = useMemo(() => {
    if (!newCampaign?.images) {
      return undefined;
    }
    return newCampaign?.images;
  }, [newCampaign]);

  const storyValue = useMemo(() => {
    const story = JSON.parse(
      newCampaign?.metadata?.metadata?.story ||
        JSON.stringify([
          {
            type: "paragraph",
            children: [{ text: "Loading...." }],
          },
        ])
    );

    return story;
  }, [newCampaign]);

  return (
    <Container maxW={"7xl"}>
      <br />
      <BackButton onClick={handleBack} />
      <br />
      <SimpleGrid
        columns={{ base: 1, lg: 1 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 14, md: 16 }}
      >
        <Flex>
          <Image
            rounded={"md"}
            alt={"product image"}
            src={new URL(newCampaign?.images[0] || NOT_FOUND_IMAGE).toString()}
            fit={"cover"}
            align={"center"}
            w={"100%"}
            h={{ base: "100%", sm: "400px", lg: "500px" }}
          />
        </Flex>
        <ImageViewerGallery images={images} />
        <Stack spacing={{ base: 6, md: 6 }}>
          <Box as={"header"}>
            <Text
              color={"green.500"}
              textTransform={"uppercase"}
              fontWeight={800}
              fontSize={"sm"}
              letterSpacing={1.1}
            >
              {CATEGORIES[newCampaign?.metadata?.metadata?.basic?.category]}
            </Text>
            <Stack
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
              >
                {newCampaign?.title}
              </Heading>
              <Link href={`#`} style={{ padding: 0, margin: 0 }}>
                <ExternalLinkIcon />
              </Link>
            </Stack>
          </Box>

          <Stack>
            <Stack>
              <Heading textAlign={"center"} size={"lg"}>
                Target Amount
              </Heading>
              <Text
                textAlign={"center"}
                fontWeight={"bold"}
                color={"green.400"}
              >
                {newCampaign?.goalAmount} USDC
              </Text>
            </Stack>
            <Text color={"gray.500"}>Amount Collected: {percentage} %</Text>
            <Progress hasStripe value={parseInt(percentage)} />
            <Divider my={2} />
            <Text fontWeight={600}>
              Valid Until: {validUntilDate.toLocaleDateString()} |{" "}
              {validUntilDate.toLocaleTimeString()}
            </Text>
            <Divider my={2} />
            <Stack>
              <Flex justifyContent={"space-between"}>
                <Text
                  background={"blue.900"}
                  px={2}
                  borderRadius={"full"}
                  color={"blue.500"}
                  textTransform={"uppercase"}
                  fontWeight={800}
                  fontSize={"sm"}
                  letterSpacing={1.1}
                >
                  {campaign?.isCompleted ? "Completed" : "Active"}
                </Text>
                <Text
                  color={"green.500"}
                  textTransform={"uppercase"}
                  fontWeight={800}
                  fontSize={"sm"}
                  letterSpacing={1.1}
                >
                  {!campaign?.isRedeemed ? "Not Redeemed" : "Redeemed"}
                </Text>
              </Flex>
            </Stack>
            <Divider my={2} />
            <Text color={"gray.500"}>
              Min. Contribution:{" "}
              <Text as={"span"} color={"blue.300"}>
                {ethers.utils.formatUnits(
                  campaign?.minAmountContribution || "0",
                  DECIMALS
                )}{" "}
                USDC
              </Text>
            </Text>
            <ChakraLink
              fontWeight={400}
              target="_blank"
              rel="noopener noreferrer"
              href={formatEtherscanLink("Account", [
                chain?.id,
                campaign?.campaignAdmin,
              ])}
            >
              USDC Address :{" "}
              {shortenHex(
                campaign?.tokenAddress || "0x000000000000000000000000000000",
                4
              )}
            </ChakraLink>
          </Stack>
          <Divider my={2} />
          <Stack direction={"row"} spacing={4} align={"center"}>
            <Jdenticon value={campaign?.campaignAdmin || ""} size={"40"} />
            <Stack
              direction={"column"}
              alignItems={"end"}
              spacing={0}
              fontSize={"sm"}
              w={"full"}
            >
              <ChakraLink
                fontWeight={600}
                target="_blank"
                rel="noopener noreferrer"
                href={formatEtherscanLink("Account", [
                  chain?.id,
                  campaign?.campaignAdmin,
                ])}
              >
                Admin :{" "}
                {shortenHex(
                  campaign?.campaignAdmin || "0x000000000000000000000000000000",
                  6
                )}
              </ChakraLink>
            </Stack>
          </Stack>
          <Stack>
            <InputGroup>
              <Input
                value={donateAmount}
                type="number"
                placeholder="Enter Amount to donate..."
                onChange={(e) => {
                  setDonateAmount(e.target.value);
                }}
              />
              <InputRightElement width={"5.5rem"}>
                <Text color="blue.500" fontWeight={600}>
                  USDC
                </Text>
              </InputRightElement>
            </InputGroup>
            <Button
              size={"sm"}
              colorScheme={"blue"}
              onClick={handleDonate}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress isIndeterminate color="green.300" size={5} />
              ) : (
                "Donate"
              )}
            </Button>
          </Stack>
          {!ipfsMetadata ? (
            <CircularProgress isIndeterminate={true} size={"50"} />
          ) : (
            <Stack spacing={{ base: 4, sm: 6 }} direction={"column"}>
              <VStack spacing={{ base: 4, sm: 6 }}>
                <Text
                  color={grayColorModeValue}
                  fontSize={"2xl"}
                  fontWeight={"300"}
                >
                  {ipfsMetadata?.basic?.subtitle}
                </Text>
              </VStack>
              <Flex>
                <Text>Tags: </Text>
                {ipfsMetadata.basic?.tags.map((tag, idx) => {
                  return (
                    <Badge key={idx + tag} colorScheme={"blue"} m={1}>
                      #{tag}
                    </Badge>
                  );
                })}
              </Flex>
              <StackDivider borderColor={grayColorModeValue} />
              <Stack>
                <Slate editor={editor} value={storyValue}>
                  <Editable />
                </Slate>
              </Stack>
              <StackDivider borderColor={grayColorModeValue} />
              <Stack>
                <Heading size={"lg"}>Rewards</Heading>
                <Flex display={"flex"} flexWrap={"wrap"}>
                  {ipfsMetadata?.rewards?.map((reward, idx) => {
                    return (
                      reward.title && (
                        <Card maxW="sm" key={reward.title} m={2}>
                          <CardBody>
                            <Stack mt="2" spacing="3">
                              <Heading size="md">{reward.title}</Heading>
                              <Text>{reward.rewardDescription}</Text>
                              <Flex justifyContent={"space-between"}>
                                <Tag mr={2} wordBreak={"break-all"}>
                                  {reward.rewardType}
                                </Tag>
                                <Text
                                  color="green.300"
                                  fontSize="lg"
                                  textAlign={"right"}
                                >
                                  Contribution Required: {reward.minAmount}
                                </Text>
                              </Flex>
                            </Stack>
                          </CardBody>
                        </Card>
                      )
                    );
                  })}
                </Flex>
              </Stack>

              <Stack>
                <Heading size={"md"}>Socials</Heading>
                <Flex display={"flex"} flexWrap={"wrap"}>
                  {ipfsMetadata?.socials.map((social) => {
                    return (
                      social.url && (
                        <Box key={social.slug} m={3}>
                          <Link
                            ml={2}
                            href={social.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Text
                              display={"flex"}
                              alignItems={"center"}
                              justifyContent={"center"}
                            >
                              {SocialSlugToIcon(social.slug)} {social.name}
                            </Text>
                          </Link>
                        </Box>
                      )
                    );
                  })}
                </Flex>
              </Stack>
            </Stack>
          )}
        </Stack>
      </SimpleGrid>
    </Container>
  );
};

export default Campaign;
