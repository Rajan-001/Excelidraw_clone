import express from "express"
import jwt from "jsonwebtoken"
const app = express()
app.use(express.json())
const CreateUserSchema = require("@repo/common/types")
const SignInSchema = require("@repo/common/types")
const CreateRoomSchema = require("@repo/common/types")
const prismaClient = require("@repo/db/client")
import { middleware } from "./middleware"
const { JWT_SECRET } = require("@repo/backend-common/config")

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body)
  console.log(parsedData)
  if (!parsedData.success) {
    res.json({
      message: "Incorrect Correnditial",
    })
    return
  }
  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.username,
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    })
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
  try {
    const user = await prismaClient.user.findFirst({
      //@ts-ignore
      email: parsedData.data.username,
      //@ts-ignore
      password: parsedData.data.password,
    })
    if (!user) {
      res.status(403).json({
        message: "Not Authorized",
      })
      return
    }
    const token = jwt.sign(
      {
        userId: user?.id,
      },
      JWT_SECRET
    )
  } catch (e) {
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
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        admin: userId,
      },
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
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    })
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
  const slug = req.params.slug
  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
  })
  res.json({
    room,
  })
})


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



