import { Box, Container, Heading } from '@chakra-ui/react';

function Navbar() {
  return (
    <Box bg="white" shadow="sm">
      <Container maxW="container.xl" py={4}>
        <Heading size="lg">Quran App</Heading>
      </Container>
    </Box>
  );
}

export default Navbar;