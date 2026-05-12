// import {createBrowserRouter,RouterProvider} from "react-router"
// import RootLayout from "./components/RootLayout"
// import Home from "./components/Home"
// import Register from "./components/Register"
// import Login from "./components/Login"
// import UserProfile from "./components/UserProfile"
// import AuthorProfile from "./components/AuthorProfile"
// import AdminProfile from "./components/AdminProfile"
// import Articles from "./components/Articles"
// import WriteArticle from "./components/WriteArticle"
// import AuthorArticles from "./components/AuthorArticles"
// import UsersList from "./components/UsersList"
// import AuthorsList from "./components/AuthorsList"
// import ArticleById from "./components/ArticleById"
// import EditArticle from "./components/EditArticle"



// function App() {
//   const routerObj = createBrowserRouter([
//     {
//       path : "/",
//       element : <RootLayout/>,
//       children : [
//         {
//           path : "",
//           element : <Home/>
//         },
//         {
//           path : "register",
//           element : <Register/>
//         },
//         {
//           path : "login",
//           element : <Login/>,
//           children : [
//               {
//                 path : "user-profile",
//                 element : <UserProfile/>,
//                 children : [
//                   {
//                     path : "articles",
//                     element : <Articles/>,
//                     children : [
//                       {
//                         path : "article-by-id",
//                         element : <ArticleById/>,
//                         children : [
//                           {
//                             path : "edit-article",
//                             element : <EditArticle/>
//                           }
//                         ]
//                       }
//                     ]
//                   }
//                 ]
//               },
//               {
//                 path : "author-profile",
//                 element : <AuthorProfile/>,
//                 children : [
//                   {
//                     path : "write-article",
//                     element : <WriteArticle/>
//                   },
//                   {
//                     path : "author-article",
//                     element : <AuthorArticles/>,
//                     children : [
//                       {
//                         path : "article-by-id",
//                         element : <ArticleById/>,
//                         children : [
//                           {
//                             path : "edit-article",
//                             element : <EditArticle/>
//                           }
//                         ]
//                       }
//                     ]
//                   }
//                 ]
//               },
//               {
//                 path : "admin-profile",
//                 element : <AdminProfile/>,
//                 children : [
//                   {
//                     path : "user-list",
//                     element : <UsersList/>
//                   },
//                   {
//                     path : "authors-list",
//                     element : <AuthorsList/>
//                   }
//                 ]
//               },
//           ]
//         }
//       ]
//     }
//   ])


//   return (
//     <RouterProvider router={routerObj}/>
//   )
// }

// export default App


import { createBrowserRouter,RouterProvider } from 'react-router'
import RootLayout from './components/RootLayout'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import UserProfile from './components/UserProfile'
import AuthorProfile from './components/AuthorProfile'
import AdminProfile from './components/AdminProfile'
import ProtectedRoute from "./components/ProtectedRoute"
import {Toaster} from "react-hot-toast"
import AuthorArticles from "./components/AuthorArticles"
import WriteArticle from "./components/WriteArticle"
import ArticleById from "./components/ArticleById"
import Unauthorized from "./components/Unauthorized"
import EditArticle from "./components/EditArticle"

function App() {
  const routerObj=createBrowserRouter([
    {
      path:"/",
      element:<RootLayout/>,
      children:[
        {
          path:"",
          element:<Home/>
        },
        {
          path:"register",
          element:<Register/>
        },
        {
          path:"login",
          element:<Login/>
        },
        {
          path:"user-profile",
          element:(
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserProfile/>
            </ProtectedRoute>
          )
        },
        {
          path:"author-profile",
          element:(
            <ProtectedRoute allowedRoles={["AUTHOR"]}>
              <AuthorProfile/>
            </ProtectedRoute>
          ),
          children:[
           {
              index: true,
              element: <AuthorArticles />,
            },
            {
              path: "articles",
              element: <AuthorArticles />,
            },
            {
              path: "write-article",
              element: <WriteArticle />,
            },
          ]
        },
        {
          path : "article/:id",
          element : <ArticleById/>
        },
        {
          path: "edit-article",
          element: <EditArticle />,
        },
        {
          path: "unauthorized",
          element: <Unauthorized />,
        },
        {
          path:"admin-profile",
          element:<AdminProfile/>
        }
      ]
    }
  ])
  return (
    <div>
      {/* Toaster - it displays quick feedback messages. We use it for the best user experience. */}
      <Toaster position="top-center" reverseOrder={false}/>
      <RouterProvider router={routerObj}/>
    </div>
  )
}

export default App