import useAuth from "@/hooks/useAuth"
import type { userType } from "@/schemas/authSchemas";
import { Alert, Center, Heading, Text, VStack } from "@chakra-ui/react"

const Home = () => {
  const {user} = useAuth({
    staleTime: Infinity,
    retry: false,
  })

  const {email, createdAt, verified} = user as userType;

  return (
    <Center w="svw" pt="10">
      <VStack>
        <Heading size="2xl">My Account</Heading>
        {!verified && 
        <Alert.Root status={"warning"} w="fit">
          <Alert.Indicator/>
          <Alert.Content>
            <Alert.Title>Please verify your email</Alert.Title>
          </Alert.Content>
        </Alert.Root>}
          <Text>Email:{` ${email}`}</Text>
          <Text>Created At:{` ${new Date(createdAt).toLocaleString()}`}</Text>
      </VStack>
    </Center>
  )
}

export default Home