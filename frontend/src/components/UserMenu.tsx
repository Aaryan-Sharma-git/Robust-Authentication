import { logout } from "@/lib/api";
import { Avatar, Box, Menu, Portal } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router"

const UserMenu = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {mutate: logOut} = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.invalidateQueries();
            queryClient.clear();
            navigate("/login", {replace: true})
        }
    });

  return (
    <Box position="fixed" bottom="0" left="0" p="5">
        <Menu.Root positioning={{ placement: "bottom-start" }} >
        <Menu.Trigger rounded="full" focusRing="outside">
            <Avatar.Root size="xl" variant="subtle" colorPalette={"blue"}> 
                <Avatar.Fallback />
                <Avatar.Image src="https://bit.ly/broken-link"/>
            </Avatar.Root>
        </Menu.Trigger>
        <Portal>
            <Menu.Positioner>
            <Menu.Content>
                <Menu.Item value="account" onClick={() => {navigate('/')}}>Profile</Menu.Item>
                <Menu.Item value="settings" onClick={() => {navigate('/settings')}}>Settings</Menu.Item>
                <Menu.Item value="logout" onClick={() => {logOut()}}>Logout</Menu.Item>
            </Menu.Content>
            </Menu.Positioner>
        </Portal>
        </Menu.Root>
    </Box>
  )
}

export default UserMenu