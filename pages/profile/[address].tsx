import { Box, Heading, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Profile = () => {
  const { query } = useRouter();
  const router = useRouter();
  const toast = useToast();
  console.log(query);
  //   useEffect(() => {
  //     if(!query.address) {
  //         toast({
  //             title: "No address, Redirecting to home",
  //             duration: 3000,
  //             isClosable: true,
  //             status: "info"
  //         })
  //         router.push("/");
  //     }
  //   }, [])
  return (
    <Box p={4}>
      <Heading textAlign={"center"}>Profile</Heading>
      <Heading size={"md"} textAlign={"center"}>
        {query.address}
      </Heading>
    </Box>
  );
};

export default Profile;
