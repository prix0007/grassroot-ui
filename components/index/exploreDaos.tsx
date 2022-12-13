import { Box, Heading, SimpleGrid, Stack } from "@chakra-ui/react";
import React from "react";
import DAOCard from "../DaoCard";

const ExploreDaos = () => {
  const daos = [
    {
      name: "DOG CULT",
      author: "By 0xf2700...45da",
      members: [
        "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      ],
      image:
        "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      name: "CAT CULT",
      author: "By 0x63e00...45da",
      members: [
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=843&q=80",
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=843&q=80",
      ],
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=843&q=80",
    },
  ];

  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 10, md: 18 }}
      direction={{ base: "column" }}
    >
      <Heading>Explore DAOs</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px">
        {daos.map((dao, index) => {
          return (
            <DAOCard
              key={index}
              name={dao.name}
              author={dao.author}
              members={dao.members}
              image={dao.image}
              href={`/dao/${index + 1}`}
            />
          );
        })}
      </SimpleGrid>
    </Stack>
  );
};

export default ExploreDaos;
