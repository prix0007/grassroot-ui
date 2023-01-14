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
import { shortenHex } from "../util";

type DAOCardProps = {
  image: string;
  name: string;
  author: string;
  members: Array<string>;
  href: string;
};

const DAOCard: React.FC<DAOCardProps> = ({
  image,
  name,
  author,
  members,
  href,
}) => {
  // const [like, setLike] = useState(false);
  const textColor = useColorModeValue("navy.700", "white");
  const textColorBid = useColorModeValue("brand.700", "white");
  const cardBg = useColorModeValue(
    "linear(to-r, pink.100, pink.300)",
    "linear(to-r, brand.700, brand.900)"
  );

  return (
    <Card
      borderRadius={"20px"}
      bgGradient={cardBg}
      boxShadow="xl"
      maxW="400px"
      _hover={{ boxShadow: "md" }}
    >
      <NextLink href={href}>
        <Flex direction={{ base: "column" }} justify="center" p="10px">
          <Box
            mb={{ base: "20px", "2xl": "20px" }}
            maxH={"200px"}
            position="relative"
            overflow={"hidden"}
            borderRadius="20px"
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Image
              src={image}
              w={{ base: "100%", "3xl": "100%" }}
              h={{ base: "100%", "3xl": "100%" }}
              objectFit={"cover"}
            />
            {/* <Button
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
          </Button> */}
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
                  {author && shortenHex(author, 8)}
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
      </NextLink>
    </Card>
  );
};

export default DAOCard;
