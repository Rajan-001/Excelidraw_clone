import { Button } from "@repo/ui/button"
import { Card } from "@repo/ui/card"
import { Pencil, Share2, Users2, Sparkles, Download } from "lucide-react"
import { Github } from "lucide-react"
import Link from "next/link"

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="lines z-5">
		<div className="line"></div> 
    <div className="line"></div> 
    <div className="line"></div>
    <div className="line"></div> 
    <div className="line"></div> 
    <div className="line"></div> 
    <div className="line"></div> 
    <div className="line"></div>
    <div className="line"></div> 
    <div className="line"></div> 


    </div>
      {/* Hero Section */}
      <header className="relative overflow-hidden z-10">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
              Collaborative Whiteboarding
              <span className="text-primary block">Made Simple</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Create, collaborate, and share beautiful diagrams and sketches
              with our intuitive drawing tool. Sign-up required.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 ">
             
              <Link href="/profile ">
                <Button variant={"primary"} size="lg" className="h-12 px-6 z-30 border-2 cursor-pointer border-black bg-black text-white rounded-xl font-bold text-base">
                  Create A New Account
                </Button>
              </Link>

              <Link href={"/profile"}>
                <Button variant={"primary"} size="lg" className="h-12 px-6 z-30 border-2 cursor-pointer border-black rounded-xl font-bold text-base">
                  Sign in
                </Button>
              </Link>
             
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
        
            <Card className="p-8 border-2 rounded-3xl py-14 transition-colors z-20 group hover:bg-neutral-900 bg-neutral-200 text-neutral-900  hover:text-neutral-100" title={""} href={""}>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg ">
                <Share2 className="h-6 w-6  rounded-full animate-bounce card-animation "/>

                </div>
                <h3 className="text-xl font-semibold  ">
                  Real-time Collaboration
                </h3>
              </div>
              <p className="mt-4 text-md ">
                Work together with your team in real-time. Share your drawings
                instantly with a simple link.
              </p>
            </Card>

            <Card className="p-8 border-2 py-14 hover:border-primary z-20 rounded-3xl  transition-colors group hover:bg-neutral-900 bg-neutral-200 text-neutral-900  hover:text-neutral-100" title={""} href={""}>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users2 className="h-6 w-6 text-primary animate-bounce card-animation" />
                </div>
                <h3 className="text-xl font-semibold">Multiplayer Editing</h3>
              </div>
              <p className="mt-4 text-base">
                Multiple users can edit the same canvas simultaneously. See
                who&apos;s drawing what in real-time.
              </p>
            </Card>

            <Card className="p-8 border-2 py-14 hover:border-primary z-20 transition-colors rounded-3xl group hover:bg-neutral-900 bg-neutral-200 text-neutral-900  hover:text-neutral-100 " title={""}  href={""}>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary animate-bounce card-animation " />
                </div>
                <h3 className="text-xl font-semibold">Smart Drawing</h3>
              </div>
              <p className="mt-4 text-base">
                Intelligent shape recognition and drawing assistance helps you
                create perfect diagrams.
              </p>
            </Card>
          </div>
        </div>
      </section>

    

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2024 Ikoot. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://github.com"
                className="text-muted-foreground hover:text-primary"
              >
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Download className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
