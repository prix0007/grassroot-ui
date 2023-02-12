import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";

const NoticeAlpha = () => {
  const bgColor = useColorModeValue("red.300", "red.900");

  return (
    <Box p={"10px"} backgroundColor={bgColor} w={"100%"}>
      <Text textAlign={"center"}>
        Notice: This application is only available in{" "}
        <span style={{ fontWeight: 900 }}>polygon mumbai testnet</span>.
      </Text>
      <Text textAlign={"center"} fontSize={"x-small"}>
        Version: Alpha
      </Text>
    </Box>
  );
};

export default NoticeAlpha;
