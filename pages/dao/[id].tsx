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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import DaoTabs from "../../components/dao/daoTabs";
import { makeGraphQLInstance } from "../../graphql";
import { useDaoQuery } from "../../hooks/daos";

const DAO = () => {
  const {
    query: { id },
  } = useRouter();

  const client = makeGraphQLInstance("");

  const { isLoading, isError, isFetched, data } = useDaoQuery(client, {
    id: id as string,
  });

  console.log(data?.daoById);

  const fontSize = useBreakpointValue({ base: "3xl", md: "4xl" });

  return (
    <VStack w={"full"} p={"10px"}>
      {isLoading && <CircularProgress isIndeterminate color={"brand.700"} />}
      {isError && <Text>Some error occured while fetching!!</Text>}
      {isFetched && !isError && (
        <Flex flexDirection={{ base: "column", md: "row" }}>
          <Stack
            minW={"350px"}
            height={"100%"}
            align={"flex-end"}
            justifyContent={"center"}
            spacing={6}
            padding={"20px"}
          >
            <Heading
              color={"brand.700"}
              fontWeight={700}
              lineHeight={1.2}
              mt={"20px"}
            >
              {data?.daoById?.name}
            </Heading>
            <Text
              color={"white"}
              fontWeight={500}
              lineHeight={1}
              fontSize={"md"}
            >
              {data?.daoById?.description}
            </Text>
            <Text wordBreak={"break-all"}>
              Administered By: {data?.daoById?.adminAddress}
            </Text>
          </Stack>
          <Box>
            <Image
              src={new URL(data?.daoById?.profilePicture).toString()}
              alt={data?.daoById?.name}
            />
          </Box>
        </Flex>
      )}
      <DaoTabs />
    </VStack>
  );
};

export default DAO;
