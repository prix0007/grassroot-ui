import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tag,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IRewardTier } from "../../pages/dao/[id]/campaign/new";
import { isValidNumberString } from "./step2";

type IStep4 = {
  rewards: IRewardTier[];
  setRewards: (rewardObj: IRewardTier) => any;
};

const blankReward: IRewardTier = {
  title: "",
  minAmount: "",
  rewardType: "",
  rewardDescription: "",
};

const Step4: React.FC<IStep4> = ({ rewards, setRewards }) => {
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [reward, setReward] = useState<IRewardTier>({ ...blankReward });

  const handleAddReward = () => {
    // Do a validation here
    let isValid = true;
    Object.keys(reward).forEach((key) => {
      if (reward[key].trim().length < 1) {
        toast({
          title: `${key} can't be empty`,
          duration: 3000,
          isClosable: true,
          status: "error",
        });

        isValid = false;
      }
    });

    if (isValid) {
      setRewards(reward);
      setReward({ ...blankReward });
      onClose();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    switch (e.target.name) {
      case "minAmount":
        if (isValidNumberString(e.target.value)) {
          setReward({
            ...reward,
            [e.target.name]: e.target.value,
          });
        } else {
          toast({
            title: "Not a valid number.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
        break;
      default:
        setReward({
          ...reward,
          [e.target.name]: e.target.value,
        });
    }
  };

  return (
    <Box>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new reward</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Title for reward"
                name="title"
                onChange={handleChange}
                value={reward.title}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Minimum Amount to Qualify</FormLabel>
              <Input
                placeholder="Enter a minimum amount"
                name="minAmount"
                onChange={handleChange}
                value={reward.minAmount}
              />
              <FormHelperText>
                Enter an amount after which supporters for campaign can avail
                this reward after they meet this minimum threshold contribution.
              </FormHelperText>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Reward Type</FormLabel>
              <Input
                placeholder="physical product, digital access, etc."
                name="rewardType"
                onChange={handleChange}
                value={reward.rewardType}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Reward Description</FormLabel>
              <Textarea
                placeholder="Tell us a little more about what this reward means..."
                name="rewardDescription"
                onChange={handleChange}
                value={reward.rewardDescription}
                rows={10}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddReward}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Heading textAlign={"center"}>Campaign Rewards</Heading>
      <Text color="blue.600" textAlign={"center"} my={3}>
        We believe that, in turn for fellow supporters to support you in your
        cause, they should get something special. You can create Tiers based on
        amount of contribution for rewards.
      </Text>
      <Flex justifyContent={"center"}>
        <Button colorScheme={"green"} onClick={onOpen}>
          Add a new reward
        </Button>
      </Flex>
      <Flex flexWrap={"wrap"} flexDirection={"row"}>
        {rewards &&
          rewards.map((reward, idx) => {
            return reward.title && (
              <Card maxW="xs" key={reward.title} m={2}>
                <CardBody>
                  <Stack mt="6" spacing="3">
                    <Heading size="md">{reward.title}</Heading>
                    <Text>{reward.rewardDescription}</Text>
                    <Flex justifyContent={"space-between"}>
                      <Tag mr={2} wordBreak={"break-all"}>{reward.rewardType}</Tag>
                      <Text color="green.300" fontSize="lg" textAlign={"right"}>
                        Contribution Required: {reward.minAmount}
                      </Text>
                    </Flex>
                  </Stack>
                </CardBody>
              </Card>
            );
          })}
      </Flex>
    </Box>
  );
};

export default Step4;
