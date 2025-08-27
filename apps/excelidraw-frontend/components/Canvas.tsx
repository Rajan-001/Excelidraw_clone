"use client"
import { initDraw } from "@/draw"
import { Game } from "@/draw/Game"
import { useEffect, useRef, useState } from "react"
import { IconButton } from "./IconButton"
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react"

export type Tool = "circle" | "rect" | "pencil"
export function Canvas({
  roomId,
  socket,
}: {
  roomId: string
  socket: WebSocket
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [game, setGame] = useState<Game>()
  const [selectedTool, setSelectedTool] = useState<Tool>("circle")
  useEffect(() => {
    game?.setTool(selectedTool)
  }, [selectedTool, game])

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket)
      setGame(g)
    }
  }, [canvasRef])
  return (
    <div>
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
    </div>
  )
}
