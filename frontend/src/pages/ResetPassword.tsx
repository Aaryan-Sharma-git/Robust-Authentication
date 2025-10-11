import { sendPasswordResetDetails } from "@/lib/api";
import { Alert, Button, Center, Field, Fieldset, Input, Stack, Link as ChakraLink, Text, Flex } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router";

const ResetPassword = () => {

    const [searchParams] = useSearchParams();
    const verificationCode = searchParams.get('code');
    const exp = Number(searchParams.get('exp'));

    const linkExpiration = verificationCode && exp && exp > Date.now();

    const {mutate: ResetPassword, isPending, isError, error, isSuccess, } = useMutation({
        mutationFn: sendPasswordResetDetails
    })

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

  return (
        <Center w="svw" h="svh">
            {linkExpiration ? 
            (
            <Center w="fit" bg="#151518ff" p="10" >
                {isSuccess ? 
                (
                    <Flex gap={"5"} direction={"column"} justify={"center"} align={"center"}>
                        <Alert.Root status={"success"} w="fit">
                            <Alert.Indicator/>
                            <Alert.Content>
                                <Alert.Title>Password Reset Successfully</Alert.Title>
                            </Alert.Content>
                        </Alert.Root>
    
                        <Text fontSize={"sm"}>
                            Go to{" "}
                            <ChakraLink colorPalette={"blue"}><RouterLink to="/login" replace>Login</RouterLink></ChakraLink>
                        </Text>
                    </Flex>
                ) 
                : 
                (
                    <Fieldset.Root gap="3">
                        <Stack gap="5">
                            <Fieldset.Legend fontSize={20}>
                                Enter New Password
                            </Fieldset.Legend>
                            {isError && <Text color={"red.600"}>{error.message}</Text>}
                        </Stack>
    
                        <Fieldset.Content>
                            <Field.Root gap="3">
                                <Field.Label>Password</Field.Label>
                                <Input type="password" value={password} autoFocus onChange={(e) => {setPassword(e.target.value)}}/>
                            </Field.Root>
                            <Field.Root gap="3">
                                <Field.Label>Confirm Password</Field.Label>
                                <Input type="password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} onKeyDown={(e) => {
                                    if(e.key === "Enter"){
                                        ResetPassword({verificationCode, password});
                                    }
                                }}/>
                            </Field.Root>
                        </Fieldset.Content>
    
                        <Button type="submit" colorPalette={"blue"} onClick={() => {ResetPassword({verificationCode, password})}} loading={isPending} disabled={!password || !confirmPassword || isPending || password !== confirmPassword}>
                            Reset Password
                        </Button>
                    </Fieldset.Root>
                )}
            </Center>
            ) 
            : 
            (
                <Center w="fit" bg="#151518ff" p="10">
                    <Flex gap={"5"} direction={"column"} justify={"center"} align={"center"}>
                        <Alert.Root status={"error"} w="fit">
                            <Alert.Indicator/>
                            <Alert.Content>
                                <Alert.Title>Invalid Link</Alert.Title>
                                <Alert.Description>The link is either invalid or expired.</Alert.Description>
                            </Alert.Content>
                        </Alert.Root>
    
                        <Text fontSize={"sm"}>
                            Get a new{" "}
                            <ChakraLink colorPalette={"blue"}><RouterLink to="/password/forgot" replace>Link</RouterLink></ChakraLink>
                        </Text>
                    </Flex>
                </Center>
            )}
        </Center>
  )
}

export default ResetPassword