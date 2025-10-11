import { emailVerification } from "@/lib/api";
import { Alert, Box, Center, Spinner, Stack, VStack, Link as ChakraLink, Text } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router"

const VerifyEmail = () => {

    const {code} = useParams();

    const {isPending, isSuccess} = useQuery({
        queryKey: ["Email Verification", code],
        queryFn: () => emailVerification(code ?? ""),
    })
  return (
    <Center w="svw" pt="20">
        <Box>
            {isPending ? 
            <Spinner/> 
            : 
            <Stack>
                {isSuccess ? 
                <VStack gap="10">
                    <Alert.Root status="success" w="fit">
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>Email Verified!</Alert.Title>
                    </Alert.Content>
                    </Alert.Root>
                    <ChakraLink colorPalette="blue" as="div"><Link to="/" replace>Back to Home</Link></ChakraLink>
                </VStack>
                :
                <VStack gap="10">
                    <Alert.Root status="error" w="fit">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Invalid Link</Alert.Title>
                        </Alert.Content>
                    </Alert.Root>
                    <Text>
                        The link is either expired or invalid.{' '}
                        <ChakraLink colorPalette="blue" as="div"><Link to="/email/resend" replace>Get a new Verification Link</Link></ChakraLink>    
                    </Text>
                </VStack>}
            </Stack>}   
        </Box>
    </Center>
  )
}

export default VerifyEmail