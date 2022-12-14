import {
  Flex,
  VStack,
  useBreakpointValue,
  Stack,
  Button,
  Text,
  Image,
  CircularProgress,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useDaoQuery } from "../../hooks/useDataFetching";

const DAO = () => {
  const {
    query: { id },
  } = useRouter();

  const daoQuery = useDaoQuery(parseInt(id as string));

  console.log(daoQuery);

  const fontSize = useBreakpointValue({ base: "3xl", md: "4xl" });

  return (
    <Stack
      w={"full"}
      py={"xl"}
      minHeight={"50vh"}
      bgGradient={"linear(to-r, blackAlpha.600, transparent)"}
    >
      {daoQuery.isLoading && (
        <CircularProgress isIndeterminate color={"brand.700"} />
      )}
      {daoQuery.isFetched && !daoQuery.isError ? (
        <VStack w={"full"} mt={"10vh"} height={"100%"} justify={"center"}>
          <Image
            src={new URL(daoQuery?.data?.metadata?.profilePicture).toString()}
            alt={daoQuery?.data?.name}
          />
          <Stack maxW={"2xl"} align={"flex-start"} spacing={6}>
            <Text
              color={"white"}
              fontWeight={700}
              lineHeight={1.2}
              fontSize={fontSize}
            >
              {daoQuery?.data?.name}
            </Text>
            <Text
              color={"white"}
              fontWeight={500}
              lineHeight={1}
              fontSize={"md"}
            >
              {daoQuery?.data?.description}
            </Text>
            <Stack direction={"row"}>
              <Button
                bg={"blue.400"}
                rounded={"full"}
                color={"white"}
                _hover={{ bg: "blue.500" }}
              >
                Show me more
              </Button>
              <Button
                bg={"whiteAlpha.300"}
                rounded={"full"}
                color={"white"}
                _hover={{ bg: "whiteAlpha.500" }}
              >
                Show me more
              </Button>
            </Stack>
          </Stack>
        </VStack>
      ) : (
        <Text>Something went wrong...</Text>
      )}
    </Stack>
  );
};

export default DAO;
