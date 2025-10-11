import { login } from "@/lib/api";
import type { LocationState } from "@/types/location";
import { Button, Field, Fieldset, Input, Link as Chakralink, Stack, Center, Box } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router"

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const location = useLocation();
    const state = location?.state as LocationState || null;

    const redirectUrl = state?.redirectUrl || '/';

    const { mutate:signup, isPending, isError } = useMutation({
        mutationFn: login,
        onSuccess: () => {
            navigate(redirectUrl, {
                replace: true
            });
        }
    })

  return (
    <Center width="svw" height="svh">
        <Fieldset.Root as="form" size="lg" w="fit" bg="#151518ff" p="10" onSubmit={(e) => {e.preventDefault()}}>
            <Stack>
                <Fieldset.Legend fontSize={20}>Login</Fieldset.Legend>
                <Fieldset.HelperText>
                Please provide your login details below.
                </Fieldset.HelperText>
                {isError && <Box color={"red.700"}>Invalid password or email</Box>}
            </Stack>

            <Fieldset.Content>
                <Field.Root>
                    <Field.Label>Email address</Field.Label>
                    <Input name="email" value={email} onChange={(e) => {setEmail(e.target.value)}} autoFocus/>
                </Field.Root>

                <Field.Root>
                    <Field.Label>Password</Field.Label>
                    <Input name="password" type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} onKeyDown={(e) => {
                        if(e.key === "Enter"){
                            return signup({email, password});
                        }
                    }}/>
                    <Fieldset.HelperText>
                        <Chakralink as="div" colorPalette="blue"><RouterLink to="/password/forgot">Forgot password?</RouterLink></Chakralink>
                    </Fieldset.HelperText>
                </Field.Root>
                </Fieldset.Content>

                <Button type="submit" alignSelf={{sm:"flex-start", base:"center"}} colorPalette="blue" disabled={!email || password.length < 6} loading={isPending} onClick={() => {
                    return signup({email, password});
                }}>
                    Submit
                </Button>
                <Fieldset.HelperText>
                    Does not have an account? <Chakralink as="div" colorPalette="blue"><RouterLink to="/signup">Sign up</RouterLink></Chakralink>
                </Fieldset.HelperText>
        </Fieldset.Root>
    </Center>
  )
}

export default Login