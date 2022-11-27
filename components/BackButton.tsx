import { Button } from "@chakra-ui/react";
import React from "react";

import { IoMdArrowBack } from "react-icons/io";

type IBackButton = {
  onClick: () => any;
};

const BackButton: React.FC<IBackButton> = ({ onClick }) => {
  return (
    <Button onClick={onClick} colorScheme={"gray"} borderRadius={"50px"}>
      <IoMdArrowBack fontSize={20}/>
    </Button>
  );
};

export default BackButton;
