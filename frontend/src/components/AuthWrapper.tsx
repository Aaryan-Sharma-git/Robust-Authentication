import useAuth from "@/hooks/useAuth"
import { Box, Center, Spinner } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router";
import UserMenu from "./UserMenu";
import NavigatorInitializer from "./NavigateInitializer";

const AuthWrapper = () => {

    const {user, isLoading} = useAuth({
      staleTime: Infinity,
      retry: false,
    });

  return (
    <>
      <NavigatorInitializer/>
      {isLoading ? 
        <Center w="svw" h="svh">
          <Spinner/>
        </Center>
        : user ? 
            <Box w="svw" h="svh" position="relative">
              <UserMenu/>
              <Outlet/>
            </Box> 
            :
            <Navigate to="/login" replace state={{
                redirectUrl: window.location.pathname
            }}/>
      }
    </>
  )
}

export default AuthWrapper