import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const index = () => {
  return (
    <Box>
      <Stack direction={"row"} justifyContent={"space-between"} p={4}>
        <Button as={"div"} colorScheme={"blue"}>
          <Link href="crowdfunding/explore">Explore</Link>
        </Button>
        <Button as={"div"} colorScheme={"green"}>
          <Link href="crowdfunding/new">New</Link>
        </Button>
      </Stack>
      <Stack direction={"column"}>
        <Heading textAlign={"center"} size={"xl"} as={"h3"}>
          Welcome to Grassroot Crowdfunding Platform.
        </Heading>
        <Stack>
          <Heading size={"sm"} color={"blue.700"} textAlign={"center"}>
            Click on `Explore` to view campaigns
          </Heading>
          <Heading size={"sm"} color={"blue.700"} textAlign={"center"}>
            Click on `New` to create a new crowdfunding campaign
          </Heading>
        </Stack>
        <Stack>
          <Text>
            Explaing on How it works or a GIF 
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
};

export default index;
