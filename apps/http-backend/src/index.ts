import express from "express"
import { Hono } from "hono";
import jwt from "jsonwebtoken"
import { UserSchema } from "@repo/common/types"
import { SignInSchema } from "@repo/common/types"
import {CreateRoomSchema } from "@repo/common/types"
  import { prisma} from "@repo/db/client"
import { middleware } from "./middleware"
const { JWT_SECRET } = require("@repo/backend-common/config")
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
app.use(express.json())

dotenv.config();
app.use(cookieParser())
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"


app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === FRONTEND_URL) {
      callback(null, true);
    } else {
      console.warn("Blocked CORS request from origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.post("/signup", async (req, res) => {
  const parsedData = UserSchema.safeParse(req.body)

  if (!parsedData.success) {
    res.json({
      message: "Incorrect Correnditial",
    })
    return
  }
  try {
  
    const user = await prisma.user.create({
      data: {
        email: parsedData.data.email,
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    })
    
    if(user)
    {
      res.status(200).json({
        message:"user is registered"
      })
    }
    else{
      res.status(405).json({
        message:"user is not registerd"
      })
    }
  } catch (e) {
    res.status(411).json({
      message: "User already exists with this username",
    })
  }
})

app.post("/signin", async (req, res) => {
  const parsedData = SignInSchema.safeParse(req.body)
  if (!parsedData.success) {
    res.json({
      message: "Incorrect Inputs",
    })
    return
  }
  console.log(parsedData)
  try {
      
    const response = await prisma.user.findFirst({
          where: {
            email: parsedData.data.email,
            password: parsedData.data.password,
          },
        });

     if(response&&response.id){
      
          const token=jwt.sign({userId:response.id},JWT_SECRET!)
        
       res.cookie("token", token, {
            httpOnly: true,   // ✅ cannot be accessed via JS
            secure: false,    // ✅ set to true only if you have HTTPS (you can change later)
            sameSite: "lax" // ✅ prevents CSRF
            });
            res.status(200).json({
              message:"User is able to do Sign In"
            })
        }
        else{
          res.status(407).json({
            message:"token is not created"
          })
        }
        
 } 
  catch (e) {
    res.status(403).json({
      message: "Not able to found database",
    })
  }
})

app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body)
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    })
    return
  }
  //@ts-ignore
  const userId = req.userId
  try {
    const room = await prisma.room.create({
      data: {
        slug: parsedData.data.slug,
        admin: userId,
      }

    })
    res.json({
      roomId: room.id,
    })
  } catch (e) {
    res.status(411).json({
      message: "Room already exist with this Room name",
    })
  }
})

app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId)
    const messages = await prisma.chat.findMany({
      where: {
        roomName: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    })
    console.log(messages)
    res.json({
      messages,
    })
  } catch (e) {
    res.json({
      message: [],
    })
  }
})

app.get("/room/:slug", async (req, res) => {
  const slug = Number(req.params.slug)
  const room = await prisma.room.findFirst({
    where: {
      slug,
    },
  })
  res.json({
    room,
  })
})

app.post("/",async(req,res)=>{
res.status(200).json({
  message:"it is worknig"
})  
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



