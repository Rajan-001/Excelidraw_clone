"use client"


import { Canvas } from "./Canvas"
import { useState, useEffect } from "react"
import { io, Socket } from "socket.io-client"
export function RoomCanvas({ roomId }: { roomId: number }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  useEffect(() => {
   
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"], // force WebSocket (optional)
    });

    
 console.log(socket)
    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
 
  }, [roomId])


  if (!socket) {
    return <div>Connecting To server....</div>
  }
  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  )
}

