import { NavLink } from "react-router"
import {useAuth} from "../store/authStore"
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
} from "../styles/common";

function Header() {
  const isAuthenticated = useAuth((state)=>state.isAuthenticated)
  const user = useAuth((state)=>state.currentUser)

    // decide profile route based on role
    const getProfilePath = () => {
    if (!user) return "/";

    switch (user.role) {
      case "AUTHOR":
        return "/author-profile";
      case "ADMIN":
        return "/admin-profile";
      default:
        return "/user-profile";
    }
  };

  return (
    <nav className={navbarClass}>
        <img className="w-15 rounded-full ml-6" src="https://img.freepik.com/free-vector/cute-sleeping-koala-with-star-logo_779267-3206.jpg?semt=ais_hybrid&w=740&q=80" alt="LOGO" />
        <div className={navContainerClass}>
          {/* LOGO */}
          <ul className={navLinksClass}>
            {/* HOME */}
            <li>
              <NavLink 
                  to="" 
                  className={({isActive})=>
                    isActive ? navLinkActiveClass : navLinkClass
                  }>Home</NavLink>
            </li>
          {/* NOT LOGGED IN */}
            {!isAuthenticated && (
            <>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? navLinkActiveClass : navLinkClass
                  }
                >
                  Register
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? navLinkActiveClass : navLinkClass
                  }
                >
                  Login
                </NavLink>
              </li>
            </>
          )}

          {/* LOGGED IN */}
          {isAuthenticated && (
            <li>
              <NavLink
                to={getProfilePath()}
                className={({ isActive }) =>
                  isActive ? navLinkActiveClass : navLinkClass
                }
              >
                Profile
              </NavLink>
            </li>
          )}

          </ul>
        </div>      
    </nav>
  )
}

export default Header