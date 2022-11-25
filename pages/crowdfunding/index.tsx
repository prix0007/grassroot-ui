import { Box, Button, Container, Stack } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

const index = () => {
  return (
    <Box>
      <Stack direction={"row"}>
        <Button as={"div"}>
          <Link href="crowdfunding/new">New</Link>
        </Button>
        <Button as={"div"}>
          <Link href="crowdfunding/explore">Explore</Link>
        </Button>
      </Stack>
      <Container>
        
      </Container>
    </Box>
  )
}

export default index