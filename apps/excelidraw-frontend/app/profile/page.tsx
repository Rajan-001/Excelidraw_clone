

import { SessionProvider } from "next-auth/react"
import SignUpIn from "../../components/SignUpIn"


export default function page() {
  return( <SessionProvider><SignUpIn/></SessionProvider>)

}
