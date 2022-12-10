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
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  FaDiscord,
  FaFacebook,
  FaInstagram,
  FaSocks,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";

import Jdenticon from "react-jdenticon";
import { createEditor, Editor } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";

import BackButton from "../../../components/BackButton";
import { CATEGORIES } from "../../../components/campaignSteps/step2";
import useCrowdfundingContract from "../../../hooks/useCrowdfundingContract";
import useCrowdfundingState from "../../../hooks/useCrowdfundingState";
import { formatEtherscanLink, shortenHex } from "../../../util";
import { CONTRACT_ADDRESS } from "../explore";
import { ICampaignFormState } from "../new";

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
  const handleBack = () => {
    router.push("/crowdfunding/explore");
  };

  const toast = useToast();
  const { chainId } = useWeb3React();

  const DECIMALS = 18;

  const { data } = useCrowdfundingState(CONTRACT_ADDRESS);

  const campaign = useMemo(() => {
    if (router.query.id) {
      const id = parseInt(router.query.id as string);
      if (id < data?.campaigns.length) {
        return data?.campaigns[id];
      }
    }
  }, [data?.campaigns]);

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

  const validUntilDate = new Date(campaign?.validUntil.toNumber() * 1000);

  const contract = useCrowdfundingContract(CONTRACT_ADDRESS);

  const handleDonate = async () => {
    if (donateAmount && donateAmount.trim()) {
      setLoading(true);
      try {
        const finalAmount = ethers.utils.parseUnits(donateAmount, 18);

        const tx = await contract.donate(campaign.id, finalAmount);
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
          description: `${e.data.message}`,
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

  const [ipfsCidData, setIpfsCidData] = useState<ICampaignFormState>();

  useEffect(() => {
    let active = true;
    load();
    return () => {
      active = false;
    };

    async function load() {
      const uri = `https://${campaign?.metadataCid}.ipfs.w3s.link/metadata.json`;
      try {
        const response = await axios.get(uri);
        if (!ipfsCidData) {
          setIpfsCidData(response.data);
        }
      } catch (e) {
        setIpfsCidData(undefined);
      }
    }

    // images, adminDetails, story
  }, [campaign]);

  const grayColorModeValue = useColorModeValue("gray.200", "gray.600");

  // Editor Stuff
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Update the initial content to be pulled from Local Storage if it exists.
  const initialValue = useMemo(
    () =>
      ipfsCidData?.story ,
    [ipfsCidData]
  );

  return (
    <Container maxW={"7xl"}>
      <br />
      <BackButton onClick={handleBack} />
      <br />
      <SimpleGrid
        columns={{ base: 1, lg: 1 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24 }}
      >
        <Flex>
          <Image
            rounded={"md"}
            alt={"product image"}
            src={
              "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE1MDl8MHwxfGFsbHx8fHx8fHx8fDE2Mzg5MzY2MzE&ixlib=rb-1.2.1&q=80&w=1080"
            }
            fit={"cover"}
            align={"center"}
            w={"100%"}
            h={{ base: "100%", sm: "400px", lg: "500px" }}
          />
        </Flex>
        <Stack spacing={{ base: 6, md: 6 }}>
          <Box as={"header"}>
            <Text
              color={"green.500"}
              textTransform={"uppercase"}
              fontWeight={800}
              fontSize={"sm"}
              letterSpacing={1.1}
            >
              {CATEGORIES[campaign?.category]}
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
                {ethers.utils.parseBytes32String(
                  campaign?.campaignName || Array(32).fill(0)
                )}
              </Heading>
              <Link
                href={`/crowdfunding/campaign/${campaign?.id}`}
                style={{ padding: 0, margin: 0 }}
              >
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
                {ethers.utils.formatUnits(
                  campaign?.targetAmount || "0",
                  DECIMALS
                )}{" "}
                USDC
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
                chainId,
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
                  chainId,
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
          {!ipfsCidData ? (
            <CircularProgress isIndeterminate={true} size={"50"} />
          ) : (
            <Stack spacing={{ base: 4, sm: 6 }} direction={"column"}>
              <VStack spacing={{ base: 4, sm: 6 }}>
                <Text
                  color={grayColorModeValue}
                  fontSize={"2xl"}
                  fontWeight={"300"}
                >
                  {ipfsCidData?.basic?.subtitle}
                </Text>
              </VStack>
              <Flex>
                <Text>Tags: </Text>
                {ipfsCidData.basic?.tags.map((tag, idx) => {
                  return (
                    <Badge key={idx + tag} colorScheme={"blue"} m={1}>
                      #{tag}
                    </Badge>
                  );
                })}
              </Flex>
              <StackDivider borderColor={grayColorModeValue} />
              
              <StackDivider borderColor={grayColorModeValue} />
              <Stack>
                <Heading size={"lg"}>Rewards</Heading>
                <Flex display={"flex"} flexWrap={"wrap"}>
                  {ipfsCidData?.rewards?.map((reward, idx) => {
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
                  {ipfsCidData?.socials.map((social) => {
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
