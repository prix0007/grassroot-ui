import {
  Flex,
  VStack,
  useBreakpointValue,
  Stack,
  Button,
  Text,
  Image,
  CircularProgress,
  SimpleGrid,
  Box,
  Heading,
  Grid,
  useTheme,
  Theme,
  useColorMode,
  StackDirection,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import BackButton from "../../../components/common/BackButton";
import DaoTabs from "../../../components/dao/daoTabs";
import { makeGraphQLInstance } from "../../../graphql";
import { useDaoQuery } from "../../../hooks/daos";

export const NOT_FOUND_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png";

const DAO = () => {
  const {
    query: { id },
  } = useRouter();

  const { isLoading, isError, isFetched, data } = useDaoQuery({
    id: id as string,
  });

  const fontSize = useBreakpointValue({ base: "3xl", md: "4xl" });
  const flexDir: StackDirection = useBreakpointValue({
    base: "column",
    md: "row",
  });

  const { colorMode } = useColorMode();

  return (
    <VStack w={"full"} minWidth={"auto"}>
      {isLoading && <CircularProgress isIndeterminate color={"brand.700"} />}
      {isError && <Text>Some error occured while fetching!!</Text>}
      <Box w={"full"}>
        {isFetched && !isError && (
          <Flex
            flexDirection={{ base: "column", md: "row" }}
            position="relative"
            w={"full"}
          >
            <Box
              position="absolute"
              left={0}
              top={0}
              zIndex={-1}
              height={"100%"}
              width={"100%"}
              overflow={"hidden"}
              backgroundImage={new URL(
                data?.daoById?.backgroundPicture ||
                  data?.daoById?.profilePicture ||
                  NOT_FOUND_IMAGE
              ).toString()}
              backgroundRepeat={"no-repeat"}
              backgroundSize={"cover"}
              backgroundPosition={"center center"}
            />
            <BackButton
              //@ts-ignore
              position={"absolute"}
              background={"blackAlpha.700"}
              borderWidth={"1px"}
              _hover={{
                background: "blackAlpha.600",
              }}
              mt={"10px"}
              ml={"10px"}
            />
            <Stack
              display={"flex"}
              direction={flexDir}
              w={"100%"}
              height={"100%"}
              mt={"350px"}
              backgroundColor={
                colorMode === "dark" ? "blackAlpha.700" : "whiteAlpha.700"
              }
              backdropBlur={"lg"}
            >
              <Box
                display={"flex"}
                flexBasis={"15%"}
                justifyContent={"center"}
                flexFlow={"column"}
                alignItems={"center"}
                alignSelf={"stretch"}
              >
                <Image
                  src={new URL(
                    data?.daoById?.profilePicture || NOT_FOUND_IMAGE
                  ).toString()}
                  alt={data?.daoById?.name}
                  maxW={150}
                  maxH={150}
                  mt={"10px"}
                  borderRadius={"sm"}
                />
              </Box>
              <Stack
                align={"flex-start"}
                justifyContent={"center"}
                spacing={6}
                padding={"20px"}
              >
                <Heading color={"brand.700"} fontWeight={700} lineHeight={1.2}>
                  {data?.daoById?.name}
                </Heading>
                <Text fontWeight={500} lineHeight={1} fontSize={"md"}>
                  {data?.daoById?.description?.substring(0, 120)}..
                </Text>
                <Text wordBreak={"break-all"}>
                  Administered By: {data?.daoById?.adminAddress}
                </Text>
              </Stack>
            </Stack>
          </Flex>
        )}
      </Box>
      <Box width={"100%"} p={"10px"}>
        <DaoTabs
          aboutProps={{
            metadata: data?.daoById?.metadata?.daoData,
            transactionHash:
              data?.daoById?.metadata?.transactionData?.transactionHash,
            ipfsMetadata: {
              cid: data?.daoById?.metadata?.ipfsMetadata?.data?.metadataCid,
              url: data?.daoById?.metadata?.ipfsMetadata?.data?.metadataUrl,
            },
          }}
          communicationProps={{}}
          resourceProps={{}}
          treasuryProps={{ adminAddress: data?.daoById?.adminAddress }}
          campaignsProps={{
            activeCampaigns: data?.daoById?.activeCampaigns,
            daoId: data?.daoById?.id,
          }}
        />
      </Box>
    </VStack>
  );
};

export default DAO;
