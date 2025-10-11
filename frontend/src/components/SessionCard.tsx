import useDeleteSession from "@/hooks/useDeleteSession"
import type { sessionSchema } from "@/schemas/authSchemas"
import { Badge, Center, CloseButton, Flex, Heading, Text } from "@chakra-ui/react"

const SessionCard = ({_id, userAgent, createdAt, isCurrent = false}: Omit<sessionSchema, "userId">) => {

  const {sessionDelete} = useDeleteSession();

  return (
    <Flex direction="row" justify={"space-between"} gap={"10"} w="full" p="3" borderWidth={"1px"} rounded={"sm"}>
        <Flex direction="column" gap={"2"}>
            <Heading size={"lg"}>Created At:{` ${new Date(createdAt).toLocaleString()} `}{isCurrent && <Badge colorPalette="green" w="fit">Current</Badge>}</Heading>
            {userAgent && <Text color="whiteAlpha.500">User Agent:{` ${userAgent}`}</Text>}
            
        </Flex>
        <Center>
            {!isCurrent && <CloseButton variant="subtle" onClick={() => {sessionDelete(_id)}}/>}
        </Center>
    </Flex>
  )
}

export default SessionCard