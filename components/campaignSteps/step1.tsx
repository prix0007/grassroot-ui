import {
  useToast,
  Heading,
  Flex,
  Avatar,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Textarea,
  InputGroup,
  InputRightElement,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { makeGraphQLInstance } from "../../graphql";
import { useTokensQuery, useUserQuery } from "../../hooks/user";
import { IProfileDetails } from "../../pages/dao/[id]/campaign/new";

type IForm1 = {
  adminDetails: IProfileDetails;
  setAdminDetails: (key: string, value: string | string[]) => any;
};

const Step1: React.FC<IForm1> = ({ adminDetails, setAdminDetails }) => {
  const toast = useToast();
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    switch (e.target.name) {
      case "avatar":
        const target = e.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];
        // Handle Upload to backend here.
        setAdminDetails(e.target.name, URL.createObjectURL(file));
        break;
      case "websites":
        break;
      default:
        setAdminDetails(e.target.name, e.target.value);
    }
  };

  const handleRemove = (idx: number) => {
    const newWebsites = adminDetails.websites.filter(
      (_, index) => index !== idx
    );
    setAdminDetails("websites", newWebsites);
  };

  const [newWebsite, setNewWebsite] = useState("");

  const urlPatternValidation = (URL) => {
    const regex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    );
    return regex.test(URL);
  };

  const handleAddWebsite = () => {
    const isValidWebsite = urlPatternValidation(newWebsite || "");
    if (newWebsite && isValidWebsite) {
      const newWebsites = [...adminDetails?.websites, newWebsite];
      setNewWebsite("");
      setAdminDetails("websites", newWebsites);
    } else {
      toast({
        title: "Invalid Website",
        description: "Enter a valid website.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleWebsiteChange = (value: string, idx: number) => {
    const isValidWebsite = urlPatternValidation(value);
    if (isValidWebsite) {
      const newWebsites = adminDetails?.websites.map((website, index) => {
        if (index === idx) {
          return value;
        } else {
          return website;
        }
      });
      setAdminDetails("websites", newWebsites);
    } else {
      toast({
        title: "Invalid Website",
        description: "Enter a valid website.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        DAO Creator Details
      </Heading>
      {/* Optional Avatar */}

      {adminDetails.avatar && (
        <Flex my="5" alignItems={"center"} justifyContent={"center"}>
          <Box position={"relative"}>
            <Avatar src={adminDetails.avatar} size="2xl" />
            <Box
              position={"absolute"}
              bottom={1}
              right={1}
              borderWidth="1px"
              borderColor={"gray.300"}
              p={2}
              borderRadius={"20px"}
              backgroundColor="gray.300"
              _hover={{
                backgroundColor: "none",
              }}
            >
              <BsFillImageFill color="green" />
              <Input
                id="avatar"
                type="file"
                name="avatar"
                variant={"unstyled"}
                accept="image/*"
                width={"auto"}
                position={"absolute"}
                bottom={0}
                right={0}
                opacity={0}
                zIndex={0}
                onChange={handleChange}
              />
            </Box>
          </Box>
        </Flex>
      )}
      <Flex>
        <FormControl mr="5%">
          <FormLabel htmlFor="first-name" fontWeight={"normal"}>
            First name
          </FormLabel>
          <Input
            id="first-name"
            placeholder="First name"
            name="firstName"
            value={adminDetails.firstName}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="last-name" fontWeight={"normal"}>
            Last name
          </FormLabel>
          <Input
            id="last-name"
            placeholder="First name"
            name="lastName"
            value={adminDetails.lastName}
            onChange={handleChange}
          />
        </FormControl>
      </Flex>

      <FormControl mt="2%">
        <FormLabel htmlFor="address" fontWeight={"normal"}>
          Your Wallet Address
        </FormLabel>
        <Input id="address" type="text" disabled value={adminDetails.address} />
        <FormHelperText>This is prefilled your ETH Address.</FormHelperText>
      </FormControl>
      <FormControl mt="2%">
        <FormLabel htmlFor="biography" fontWeight={"normal"}>
          Biography
        </FormLabel>
        <Textarea
          id="biography"
          name="biography"
          placeholder="Enter about yourself"
          onChange={handleChange}
          value={adminDetails.biography}
        />
      </FormControl>

      {/* Optional Websites */}
      {adminDetails.websites.length > 0 && (
        <Box>
          <Text my={4}>Websites</Text>
          {adminDetails.websites.map((website, idx) => {
            return (
              <InputGroup size="md" mb={"2"} key={website}>
                <Input
                  pr="4.5rem"
                  type={"text"}
                  placeholder="Enter a Website"
                  value={website}
                  onChange={(e) => handleWebsiteChange(e.target.value, idx)}
                />
                <InputRightElement width="6.0rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => handleRemove(idx)}
                    colorScheme={"red"}
                  >
                    Remove
                  </Button>
                </InputRightElement>
              </InputGroup>
            );
          })}
        </Box>
      )}
      <InputGroup size="md" my={3}>
        <Input
          pr="4.5rem"
          type={"text"}
          placeholder="Enter a Website"
          value={newWebsite}
          onChange={(e) => setNewWebsite(e.target.value)}
        />
        <InputRightElement width="7.5rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={() => handleAddWebsite()}
            colorScheme={"green"}
          >
            Add Website
          </Button>
        </InputRightElement>
      </InputGroup>
    </>
  );
};

export default Step1;
