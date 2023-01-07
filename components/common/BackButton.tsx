import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

import { IoMdArrowBack } from "react-icons/io";

type IBackButton = {
  onClick?: () => any;
};

const BackButton: React.FC<IBackButton> = ({ onClick, ...props }) => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      onClick={onClick || handleBack}
      colorScheme={"gray"}
      borderRadius={"50px"}
      {...props}
    >
      <IoMdArrowBack fontSize={20} />
    </Button>
  );
};

export default BackButton;
