import {useEffect,useState} from "react"
import axios from "axios"
import {useAuth} from "../store/authStore.js"
import {useNavigate} from "react-router"
import {
  articleGrid,
  articleCardClass,
  articleTitle,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass,
} from "../styles/common.js";

function AdminProfile() {

  const [users,setUsers] = useState([])
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)
  const navigate = useNavigate()
  const  logout = useAuth((state)=>state.logout)
  const currentUser = useAuth((state)=>state.currentUser)

  useEffect(()=>{
    const getUsers = async()=>{
      try{
      // set Loading
      setLoading(true)
      // Get all the users from the DB
      const res = await axios.get("https://blog-application-11f0.onrender.com/admin-api/users", { withCredentials: true })
      // verify the status code.
      if(res.status === 200){
        setUsers(res.data?.payload)
      }
    }catch(err){
      setError(err.response?.data?.error || "Something went wrong")
    }
    }
    getUsers() 
  },[])

  const changeState = async(userObj)=>{
    // set loading
    setLoading(true)
    // call the patch route to change the state
    const res = await axios.patch("https://blog-application-11f0.onrender.com/admin-api/edit",userObj,{withCredentials:true})
  }

  const onLogout = async ()=>{
    await logout()
    navigate("/login")
  }

  return (
    <div>
      {/* ERROR */}
      {error && <p className={errorClass}>{error}</p>}
      {/* PROFILE HEADER */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mb-8 shadow-sm flex itams-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              className="w-16 h-16 rounded-full object-cover border"
              alt="profile"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center text-xl font-semibold">
              {currentUser?.firstName?.charAt(0).toUpperCase()}
            </div>
          )}
          {/* Name */}
          <div>
            <p className="text-sm text-[#6e6e73]">Welcome back</p>
            <h2 className="text-xl font-semibold text-[#1d1d1f]">{currentUser?.firstName}</h2>
          </div>
        </div>

        {/* Logout */}
        <button className="bg-cyan-700 text-white text-sm px-5 py-1 rounded-full hover:bg-[#d62c23] transition"
          onClick={onLogout}>
          Logout</button>
      </div>
      {
        users.map((userObj)=>(
          <div className={articleCardClass} key={userObj._id}>
            <div className="flex flex-col h-full">
              {/* TOP */}
              <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mb-8 shadow-sm flex itams-center justify-between">
                <p className={articleTitle}>Name : {userObj.firstName}</p>
                <p className="text-sm text-[#6e6e73] mt-1">Email : {userObj.email}</p>
                <p className="text-sm text-[#6e6e73] mt-1">Role : {userObj.role}</p>
              <button type="submit" className="bg-cyan-700 text-white text-sm px-5 py-1 rounded-full hover:bg-[#d62c23] transition" onClick={()=>changeState({email:userObj.email,isUserActive:!(userObj.isUserActive)})}>
                {userObj.isUserActive ? "Block" : "UnBlock"}
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default AdminProfile
