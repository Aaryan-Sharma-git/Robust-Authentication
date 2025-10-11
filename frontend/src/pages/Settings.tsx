import SessionCard from "@/components/SessionCard"
import useSessions from "@/hooks/useSessions"
import { Center, Flex, Heading, Spinner, Text, VStack } from "@chakra-ui/react"

const Settings = () => {
  const {sessions, isPending, isError} = useSessions({
    staleTime: Infinity,
    retry: false
  })
  return (
    <Center w="full" h="full" direction={"column"}>
      <Flex w={{md: "60%", sm: "85%", base: "100%"}} h="full" py={"10"} gap={"5"} direction={"column"}>
        <Heading size="3xl" px="3" >My Sessions</Heading>
        <VStack overflow={"auto"} gap={"5"} h="full" px="3">
          {isPending ?
          (<Spinner/>) 
          : isError ? 
            (<Text color={"red.600"}>Could not get sessions.</Text>) 
            : 
            (sessions?.map((session) => <SessionCard key={session._id} _id={session._id} userAgent={session.userAgent} createdAt={session.createdAt} isCurrent={session.isCurrent}/>))}
        </VStack>
      </Flex>
    </Center>
  )
}

export default Settings