// Chakra imports
import {
  AvatarGroup,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "./Card";
import NextLink from "next/link";
// Assets
import React, { useState } from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";

type DAOCardProps = {
  image: string;
  name: string;
  author: string;
  members: Array<string>;
  href: string;
};

export default function DAOCard(props: DAOCardProps) {
  const { image, name, author, members, href } = props;
  const [like, setLike] = useState(false);
  const textColor = useColorModeValue("navy.700", "white");
  const textColorBid = useColorModeValue("brand.700", "white");
  return (
    <NextLink href={href}>
      <Card p="20px" >
        <Flex direction={{ base: "column" }} justify="center">
          <Box mb={{ base: "20px", "2xl": "20px" }} position="relative">
            <Image
              src={image}
              w={{ base: "100%", "3xl": "100%" }}
              h={{ base: "100%", "3xl": "100%" }}
              borderRadius="20px"
            />
            <Button
              position="absolute"
              bg="white"
              _hover={{ bg: "whiteAlpha.900" }}
              _active={{ bg: "white" }}
              _focus={{ bg: "white" }}
              p="0px !important"
              top="14px"
              right="14px"
              borderRadius="50%"
              minW="36px"
              h="36px"
              onClick={() => {
                setLike(!like);
              }}
            >
              <Icon
                transition="0.2s linear"
                w="20px"
                h="20px"
                as={like ? IoHeart : IoHeartOutline}
                color="brand.700"
              />
            </Button>
          </Box>
          <Flex flexDirection="column" justify="space-between" h="100%">
            <Flex
              justify="space-between"
              direction={{
                base: "column",
                md: "column",
                lg: "row",
                xl: "row",
                "2xl": "row",
              }}
              alignItems={{
                base: "center",
                lg: "space-between",
              }}
              mb="auto"
            >
              <Flex
                direction={{ base: "column" }}
                alignItems={{
                  base: "center",
                  lg: "start",
                }}
              >
                <Text
                  color={textColor}
                  fontSize={{
                    base: "xl",
                    md: "lg",
                    lg: "lg",
                    xl: "lg",
                    "2xl": "md",
                    "3xl": "lg",
                  }}
                  mb="5px"
                  fontWeight="bold"
                  me="14px"
                >
                  {name}
                </Text>
                <Text
                  color="secondaryGray.600"
                  fontSize={{
                    base: "sm",
                  }}
                  fontWeight="400"
                  me="14px"
                >
                  {author}
                </Text>
              </Flex>
              <AvatarGroup
                max={3}
                color={textColorBid}
                size="sm"
                mt={{
                  base: "0px",
                  md: "10px",
                  lg: "0px",
                  xl: "10px",
                  "2xl": "0px",
                }}
                fontSize="12px"
              >
                {members.map((avt, key) => (
                  <Avatar key={key} src={avt} />
                ))}
              </AvatarGroup>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </NextLink>
  );
}
