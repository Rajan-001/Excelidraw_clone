"use client"

import React from "react";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Canvas } from "../../../components/Canvas";

export default  function CanvasPage({
  params,
}: {
  params: Promise<{ roomId: string }>}) {
 
     const { roomId } = React.use(params);
  const numericRoomId = Number(roomId);
  const [socket, setSocket] = useState<Socket | null>(null);
  
   useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"], // force WebSocket
    });


    setSocket(socketInstance);

    return () => {
      console.log("🧹 Disconnecting socket:", socketInstance.id);
      socketInstance.disconnect();
    };
  }, [numericRoomId, roomId]);


    if (!socket) {
      return <div>Connecting To server....</div>
    }
    return (
      <div>
        <Canvas roomId={numericRoomId} socket={socket} />
      </div>
    )
}
