
import SignUpIn from "@/components/SignUpIn"
import { SessionProvider } from "next-auth/react"


export default function page() {
  return( <SessionProvider><SignUpIn/></SessionProvider>)

}
