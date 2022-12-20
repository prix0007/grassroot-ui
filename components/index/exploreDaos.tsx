import {
  Box,
  CircularProgress,
  Heading,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { makeGraphQLInstance } from "../../graphql";
import { useDaosQueries } from "../../hooks/daos";
import DAOCard from "../DaoCard";

const ExploreDaos = () => {
  const client = makeGraphQLInstance("");

  const { isLoading, isError, isFetched, data } = useDaosQueries(client);

  const daos = useMemo(() => {
    if (data?.daos) {
      return data.daos;
    } else {
      return [];
    }
  }, [data]);

  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 10, md: 18 }}
      direction={{ base: "column" }}
    >
      <Heading>Explore DAOs</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px">
        {isLoading && <CircularProgress isIndeterminate color={"brand.700"} />}
        {isFetched &&
          !isError &&
          daos.map((dao) => {
            return (
              <DAOCard
                key={dao?.id}
                name={dao?.name}
                author={dao?.adminAddress}
                members={[]}
                image={dao?.profilePicture}
                href={`/dao/${dao?.id}`}
              />
            );
          })}
      </SimpleGrid>
    </Stack>
  );
};

export default ExploreDaos;
