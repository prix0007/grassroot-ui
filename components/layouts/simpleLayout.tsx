import React from "react";
import { Box, useStyleConfig } from "@chakra-ui/react";

const SimpleLayout = (props) => {
  const { variant, children, ...rest } = props;
  const styles = useStyleConfig("Box", { variant });

  return (
    <Box __css={styles} px={"20px"} w={"100%"} {...rest}>
      {children}
    </Box>
  );
};

export default SimpleLayout;
