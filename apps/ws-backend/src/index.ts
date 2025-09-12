
import { Server, Socket } from "socket.io"
const { JWT_SECRET } = require("@repo/backend-common/config")
import { createServer } from "http";
import jwt from "jsonwebtoken"
import {prisma} from "@repo/db/client"
import express from "express"
import { Server as SocketIOServer } from "socket.io";

const app=express()

const httpServer = createServer(app);

const PORT = Number(process.env.PORT) || 3030;

const io = new SocketIOServer(httpServer, {
  cors: { origin: "*" },
});

interface User {
  ws: Socket
  rooms: number[]
  userId: number
}
const users: User[] = []
function checkUser(token: string): number | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (typeof decoded == "string") {
      return null
    }
    if (!decoded || !decoded.userId) {
      return null
    }
    return Number(decoded.userId)
  } catch (e) {
    return null
  }
}

io.on("connection", (socket:Socket)=> {
   console.log("connected with socket",socket.id)

  socket.on("send_message",  async (data)=> {
  
  const item=JSON.parse(data)
    try{
    if (item.type === "create_room") {
      
     

       await prisma.room.create({
         data:{
          slug:item.room,
         adminId:item.userId
         }
        })
         users.push({
          ws:socket,
            rooms:[item.room],
            userId:item.userId
         })   
           const user = users.find((x) => x.ws === socket)
      user?.rooms.push(Number(item.room))
        
         socket.emit("confirmation","room_created")
      }
    }catch(err){
    
      socket.emit("error",{
        message:err
      })
    }
    
    if (item.type === "join_room") {
      const user = users.find((x) => x.ws === socket)
      user?.rooms.push(item.room)
     
       socket.emit("confirmation","room_joined")
    }
    else if (item.type === "leave_room") {
      try{
      const user = users.find((x) => x.ws === socket)
      if (!user) {
        return
      }
      user.rooms = user?.rooms.filter((x) => x === item.room)
      console.log("leave room",users)
    }
    catch(err){

    }
    }
    else if (item.type === "chat") {

      const roomId = item.roomId
      const message = item.message
      const shape=await prisma.chat.create({
        data: {
          message,
          userId:item.userId,
          roomName:roomId
        },
      })
     
      
       io.emit("chat", {
    userId: item.userId,
    message:JSON.parse( message),   // keep as object if possible
    roomId,
    shapeId:shape.id
      });
    
     const totalClients = io.engine.clientsCount;

    }
  })
    socket.on("erase",async (data)=>{
      
        const shaped=JSON.parse(data)
       
        try{
           if(shaped)
           
           {
        shaped.map(async (x:any)=>{
          
          try{
       const res=  await prisma.chat.delete({
        where: { id: x },
      })
      
    }catch(err)
    {
       console.log("deleted shape",err)
    }
        })
      }
      }catch(err)
      {
        console.log(err)
      }
      })
})

httpServer.listen(PORT, () => {
  console.log(`🚀 Express + Socket.IO running on port ${PORT}`);
});
