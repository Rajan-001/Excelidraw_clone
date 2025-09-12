"use client"
import { Button } from "@repo/ui/button";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { motion } from "motion/react"
export default function Page(){
 const router=useRouter()
 const [room,SetRoom]=useState("")
   const [socket, setSocket] = useState<Socket | null>(null)
   const [error,SetError]=useState(false)
   const[action,SetAction]=useState("")

    
      useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      console.log("✅ Connected:", socketInstance.id);
    });

    socketInstance.on("error", (data) => {
      SetError(true);
      console.error("❌ Socket error:", data);
    });

    setSocket(socketInstance);

    // Cleanup when component unmounts
    return () => {
      console.log("🧹 Disconnecting socket:", socketInstance.id);
      socketInstance.disconnect();
    };
  }, []);


   useEffect(()=>{
    if (!socket || !room || !action) return;
   
      const roomId=Number(room)
     console.log(room)
      // Join room
      socket.emit("send_message", JSON.stringify({ room:roomId,type:action,userId:1 }));
      
      socket.on("confirmation",(data)=>{
        
        if(data==="room_created")
        {
          router.push(`/canvas/${room}`)
        }
        else if(data==="room_joined"){
             router.push(`/canvas/${room}`)
        }
      })
      socket.on("error",(data)=>{
     SetError(true)
     })  
   

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };


   },[action, room, router, socket])


    return(
    <div className="w-screen h-screen relative ">

          {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-primary rounded-3xl p-8 sm:p-16"
      >
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl"
          >
            Unleash your ideas, visually.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/80"
          >
            Sketch, brainstorm, and collaborate in real-time. Turn your thoughts
            into clear, shareable diagrams with ease.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.2, delayChildren: 0.4 },
              },
            }}
            className="mt-10 flex flex-col items-center justify-center gap-x-6"
          >
            <motion.input
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              onChange={(e) => {
                SetRoom(e.target.value)
              }}
              className="h-12 px-6 border-2 border-neutral-600 hover:border-slate-900 rounded-md"
              placeholder="Enter Room Id"
            />

            <div className="flex mt-4">
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="block mx-4 h-12 px-6 rounded-2xl hover:bg-neutral-900 hover:text-slate-100 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={() => {
                    SetAction("create_room")
                  }}
                >
                  Create Room
                </Button>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="block mx-4 h-12 px-6 rounded-2xl hover:bg-neutral-900 hover:text-slate-100 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={() => {
                    SetAction("join_room")
                  }}
                >
                  Join Room
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
      </section>

    </div>
    )
}