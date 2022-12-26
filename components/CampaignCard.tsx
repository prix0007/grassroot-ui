import Link from "next/link";
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Button,
  Flex,
  Divider,
  Link as ChakraLink,
  Progress,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  Image,
  InputGroup,
  InputRightElement,
  useToast,
  CircularProgress,
} from "@chakra-ui/react";
import { ICampaignBC } from "../hooks/useCrowdfundingState";

import Jdenticon from "react-jdenticon";
import { shortenHex, formatEtherscanLink } from "../util";
import { ethers } from "ethers";
import { CATEGORIES } from "./campaignSteps/step2";
import { useWeb3React } from "@web3-react/core";
import { GrassrootCrowdfunding } from "../contracts/types";
import { useMemo, useState } from "react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

type ICampaignCard = {
  campaign: ICampaignBC;
  contract: GrassrootCrowdfunding;
};

const CampaignCard: React.FC<ICampaignCard> = ({ campaign, contract }) => {
  const router = useRouter();

  const { chainId } = useWeb3React();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const DECIMALS = 18;
  const [donateAmount, setDonateAmount] = useState(
    ethers.utils.formatUnits(campaign.minAmountContribution, DECIMALS)
  );

  const [isLoading, setLoading] = useState(false);

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
      setDonateAmount(campaign.minAmountContribution.toString());
      onClose();
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

  return (
    <Center position={"relative"}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Donate to {ethers.utils.parseBytes32String(campaign.campaignName)}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              variant="ghost"
              colorScheme={"blue"}
              disabled={isLoading}
              onClick={handleDonate}
            >
              {isLoading ? (
                <CircularProgress isIndeterminate color="green.300" size={5} />
              ) : (
                "Donate"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box
        h={"100%"}
        width={"100%"}
        pos={"absolute"}
        left={0}
        top={0}
        backgroundImage={
          "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        }
        backgroundSize={"cover"}
      >
      </Box>
      <Box
        maxW={"445px"}
        w={"full"}
        bg={useColorModeValue("whiteAlpha.800", "blackAlpha.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={4}
        overflow={"hidden"}
        zIndex={1}
        mt={"100px"}
      >
        <Stack>
          <Text
            color={"green.500"}
            textTransform={"uppercase"}
            fontWeight={800}
            fontSize={"sm"}
            letterSpacing={1.1}
          >
            {CATEGORIES[campaign.category]}
          </Text>
          <Stack
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Heading
              color={useColorModeValue("gray.700", "white")}
              fontSize={"2xl"}
              fontFamily={"body"}
            >
              {ethers.utils.parseBytes32String(campaign.campaignName)}
            </Heading>
            <Link
              href={`${router.asPath}/campaign/${campaign.id}`}
              style={{ padding: 0, margin: 0 }}
            >
              <ExternalLinkIcon />
            </Link>
          </Stack>
        </Stack>
        <Divider my={2} />
        <Stack direction={"row"} spacing={4} align={"center"}>
          <Jdenticon value={campaign.campaignAdmin} size={"40"} />
          <Stack
            direction={"column"}
            alignItems={"end"}
            spacing={0}
            fontSize={"sm"}
            w={"full"}
          >
            <Button size={"sm"} colorScheme={"blue"} onClick={onOpen}>
              Fund Me
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
};

export default CampaignCard;
