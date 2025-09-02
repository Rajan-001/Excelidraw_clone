"use client"

import { Game } from "@/draw/Game"
import { useEffect, useRef, useState } from "react"
import { IconButton } from "./IconButton"
import { CaseSensitive, Circle, Diamond, Eraser, MoveUpRight, Pencil, RectangleHorizontalIcon } from "lucide-react"
import { Socket } from "socket.io-client"
import { useRouter } from "next/navigation"


export type Tool = ""|"circle" | "rect" | "pencil" | "arrow" | "eraser" | "diamond" |"text"
export function Canvas({
  roomId,
  socket,
}: {
  roomId: number
  socket: Socket
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router=useRouter()
  const [game, setGame] = useState<Game>()
  const [selectedTool, setSelectedTool] = useState<Tool>("circle")
  useEffect(() => {
    //@ts-ignore
    return game?.setTool(selectedTool)
  }, [selectedTool, game])

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket)
      setGame(g)
    }
  }, [canvasRef])
  return (
    <div>
        <div onClick={() => router.push("/room")} className="text-white fixed cursor-pointer top-4 right-10 border-2 p-2 rounded-full px-4 ">Leave Room</div>
  
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
      <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
    </div>
  )
}

function Topbar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool
  setSelectedTool: (s: Tool) => void
}) {
  return (
    <div className="relative"> 
     <div
      style={{
        position: "fixed",
        top: 10,
        left: 10,
      }}
    >
     
      <IconButton
        onClick={() => {
          setSelectedTool("pencil")
        }}
        activated={selectedTool === "pencil"}
        icon={<Pencil />}
      />
      <IconButton
        onClick={() => {
          setSelectedTool("rect")
        }}
        activated={selectedTool === "rect"}
        icon={<RectangleHorizontalIcon />}
      />
      <IconButton
        onClick={() => {
          setSelectedTool("circle")
        }}
        activated={selectedTool === "circle"}
        icon={<Circle />}
      />
       <IconButton
        onClick={() => {
          setSelectedTool("arrow")
        }}
        activated={selectedTool === "arrow"}
        icon={ <MoveUpRight />}
      />
        <IconButton
        onClick={() => {
          setSelectedTool("eraser")
        }}
        activated={selectedTool === "eraser"}
        icon={  <Eraser /> }
      />
       <IconButton
        onClick={() => {
          setSelectedTool("diamond")
        }}
        activated={selectedTool === "diamond"}
        icon={   <Diamond /> }
      />
        <IconButton
        onClick={() => {
          setSelectedTool("text")
        }}
        activated={selectedTool === "text"}
        icon={   <CaseSensitive /> }
      />
    </div>
    </div>
  )
}
