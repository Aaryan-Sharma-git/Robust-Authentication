import type { SocketContextProps } from "@/types/childrenType";
import { createContext, useEffect, useState } from "react";
import { io, Socket} from "socket.io-client";

const socketContext = createContext<Socket | null>(null);

const SocketContext = ({ children }: SocketContextProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        try {
            const socket_io = io(import.meta.env.VITE_API_BASE_URL, {
                withCredentials: true
            });
            setSocket(socket_io);

            return () => {
                socket_io.disconnect();
            };
        } 
        catch (error) {
            console.log("socket initialization error: ", error);
        }
    }, [])
  return (
    <>
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    </>
  );
}

export default SocketContext