import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import BackButton from "../../components/common/BackButton";

const Index = () => {
  const router = useRouter();
  const handleBack = () => {
    router.push("/");
  };
  return (
    <Box p={4}>
      <br />
      <BackButton onClick={handleBack} />
      <br />
      <Text textAlign={"center"}>This feature is coming soon..</Text>
    </Box>
  );
};

export default Index;
