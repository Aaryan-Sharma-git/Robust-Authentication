import { createAccount } from "@/lib/api";
import { Button, Field, Fieldset, Input, Stack, Center, Box} from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const {mutate:signup, isPending, isError} = useMutation({
        mutationFn: createAccount,
        onSuccess: () => {
            navigate('/', {
                replace: true
            })
        } 
    })

  return (
      <Center width={"svw"} height={"svh"}>
        <Fieldset.Root size="lg" w="fit" bg={"#151518ff"} p={"10"}>
            <Stack>
                <Fieldset.Legend fontSize={20}>Sign up</Fieldset.Legend>
                <Fieldset.HelperText>
                Please provide your signup details below.
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
                    <Input name="password" type="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                    <Fieldset.HelperText>
                    Password must be of minimum 6 characters
                    </Fieldset.HelperText>
                </Field.Root>   
                
                <Field.Root>
                    <Field.Label>Confirm Password</Field.Label>
                    <Input name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} onKeyDown={(e) => {
                        if(e.key === "Enter"){
                            signup({email, password, confirmPassword})
                        }
                    }}/>
                </Field.Root>
                </Fieldset.Content>

                <Button type="submit" alignSelf={{sm:"flex-start", base:"center"}} colorPalette={"blue"} loading={isPending} disabled={password !== confirmPassword || !email || password.length < 6} onClick={() => {
                    signup({email, password, confirmPassword});
                }}>
                    Submit
                </Button>
  
        </Fieldset.Root>
      </Center>
  )
}

export default Signup