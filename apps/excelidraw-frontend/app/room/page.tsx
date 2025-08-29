"use client"
import { Button } from "@repo/ui/button";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page(){
 const router=useRouter()
 const [room,SetRoom]=useState("")
    return(
    <div className="w-screen h-screen relative ">

          {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 sm:p-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to start creating?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/80">
                Join thousands of users who are already creating amazing
                diagrams and sketches.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-x-6">
                <input onChange={(e)=>{ SetRoom(e.target.value)}} className="h-12 px-6 border-2 border-neutral-600 hover:border-slate-900" placeholder="Enter Room Id"/>
                <div className="flex mt-4">
                <Button 
                  variant="outline"
                  size="lg"
                  className="block mx-4  h-12 px-6 rounded-md bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                 onClick={()=>{router.push(`/canvas/${room}`)}}
                >
                  Create Room
                  
                </Button>
                   <Button
                  variant="outline"
                  size="lg"
                  className="block h-12 mx-4 px-6 rounded-md bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                    onClick={()=>{router.push(`/canvas/${room}`)}}
               >
                  Join Room
                  
                </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
    )
}