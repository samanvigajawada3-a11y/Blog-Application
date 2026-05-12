import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router"
import { useAuth } from "../store/authStore"
import { useEffect } from "react"

function RootLayout() {

  // import check checkAuth
  const checkAuth = useAuth(state=>state.checkAuth)

  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  return (
    <div>
      <Header/>
      <div className="min-h-screen mx-32">
        <Outlet/>
      </div>
      <Footer/>
    </div>
  )
}

export default RootLayout