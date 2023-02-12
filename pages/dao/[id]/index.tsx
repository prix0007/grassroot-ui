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
import AboutDao from "../../../components/dao/aboutDao";
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
            minH={{ base: 350, md: 400 }}
            w={"full"}
            overflow={"hidden"}
            backgroundImage={new URL(
              data?.daoById?.backgroundPicture ||
                data?.daoById?.profilePicture ||
                NOT_FOUND_IMAGE
            ).toString()}
            backgroundRepeat={"no-repeat"}
            backgroundSize={"cover"}
            backgroundPosition={"center center"}
          >
            <Box
              position={"absolute"}
              w={"100%"}
              h={"100%"}
              left={0}
              top={0}
              background={"rgba(0,0,0,0.5)"}
            />
            <BackButton
              //@ts-ignore
              position={"absolute"}
              background={"blackAlpha.700"}
              borderWidth={"1px"}
              zIndex={1}
              _hover={{
                background: "blackAlpha.600",
              }}
              mt={"10px"}
              ml={"10px"}
            />
            <Stack
              display={"flex"}
              position={"absolute"}
              bottom={"0px"}
              left={"0px"}
              direction={{
                base: "column",
                md: "row",
              }}
              justify={"center"}
              alignItems={"flex-end"}
              w={"100%"}
              h={"100%"}
            >
              <Box
                display={"flex"}
                justifyContent={"flex-end"}
                flexFlow={"column"}
                alignItems={"center"}
                alignSelf={"stretch"}
                mb={"20px"}
                mt={"10px"}
              >
                <Box borderRadius={"20px"} overflow={"hidden"}>
                  <Image
                    src={new URL(
                      data?.daoById?.profilePicture || NOT_FOUND_IMAGE
                    ).toString()}
                    alt={data?.daoById?.name}
                    maxW={300}
                    maxH={300}
                    borderRadius={"sm"}
                  />
                </Box>
              </Box>
              {/* <Stack
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
              </Stack> */}
            </Stack>
          </Flex>
        )}
      </Box>
      <AboutDao
        metadata={data?.daoById?.metadata?.daoData}
        transactionHash={
          data?.daoById?.metadata?.transactionData?.transactionHash
        }
        ipfsMetadata={{
          cid: data?.daoById?.metadata?.ipfsMetadata?.data?.metadataCid,
          url: data?.daoById?.metadata?.ipfsMetadata?.data?.metadataUrl,
        }}
        daoId={data?.daoById?.id}
      />
      <Box width={"100%"} p={"10px"}>
        <DaoTabs
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
