import { resetPassword } from "@/lib/api";
import { Alert, Button, Center, Field, Fieldset, Input, Stack, Link as ChakraLink, Text, Flex } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link as RouterLink } from "react-router";

const ForgotPassword = () => {
    const {mutate: passwordReset, isPending, isError, error, isSuccess} = useMutation({
        mutationFn: resetPassword
    })

    const [email, setEmail] = useState("");
    
  return (
    <Center w="svw" h="svh">
        <Center w="fit" bg="#151518ff" p="10" >
            {isSuccess ? 
            (
                <Flex gap={"5"} direction={"column"} justify={"center"} align={"center"}>
                    <Alert.Root status={"success"} w="fit">
                        <Alert.Indicator/>
                        <Alert.Content>
                            <Alert.Title>Email Sent Successfully</Alert.Title>
                            <Alert.Description>Check you inbox for further details</Alert.Description>
                        </Alert.Content>
                    </Alert.Root>

                    <Text fontSize={"sm"}>
                        Go back to{" "}
                        <ChakraLink colorPalette={"blue"}><RouterLink to="/login">Login</RouterLink></ChakraLink>
                        {" "}or{" "}
                        <ChakraLink colorPalette={"blue"}><RouterLink to="/signup">Sign Up</RouterLink></ChakraLink>
                    </Text>
                </Flex>
            ) 
            : 
            (
                <Fieldset.Root gap="3">
                    <Stack gap="5">
                        <Fieldset.Legend fontSize={20}>
                            Reset Password
                        </Fieldset.Legend>
                        <Fieldset.HelperText>
                            Enter your email below to reset password.
                        </Fieldset.HelperText>
                        {isError && <Text color={"red.600"}>{error.message}</Text>}
                    </Stack>

                    <Fieldset.Content>
                        <Field.Root gap="3">
                            <Field.Label>Email</Field.Label>
                            <Input type="email" placeholder="example@email.com" value={email} autoFocus onChange={(e) => {setEmail(e.target.value)}} onKeyDown={(e) => {
                                if(e.key === "Enter"){
                                    passwordReset(email);
                                }
                            }}/>
                        </Field.Root>
                    </Fieldset.Content>

                    <Button type="submit" colorPalette={"blue"} onClick={() => {passwordReset(email)}} loading={isPending} disabled={!email || isPending}>
                        Reset Password
                    </Button>
                </Fieldset.Root>
            )}
        </Center>
    </Center>
  )
}

export default ForgotPassword