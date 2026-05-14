import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  inputClass,
  commentsWrapper,
  commentCard,
  commentHeader,
  commentUserRow,
  avatar,
  commentUser,
  commentTime,
  commentText,
} from "../styles/common.js";
import {useState,useEffect} from "react"
import {useLocation,useNavigate,useParams} from "react-router"
import {useAuth} from "../store/authStore.js"
import {useForm} from "react-hook-form"
import axios from "axios"
import {toast} from "react-hot-toast"

function ArticleById() {

  const {id} = useParams()
  const location = useLocation()
  const [article,setArticle] = useState(location.state || null)
  const {register,handleSubmit} = useForm()
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)
  // const [commentOb,setCommentOb] = useState(null)


  const user = useAuth((state)=>state.currentUser)
  const navigate = useNavigate()

  useEffect(() => {
    //if aticle is transferred, then use it
    if (article) return;

    //otherwise, make api req to read that article by id
    const getArticle = async () => {
      setLoading(true);
       try {
        const res = await axios.get(`https://blog-application-11f0.onrender.com/user-api/article/${id}`, { withCredentials: true });
        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id]);

  const formateDate = (date)=>{
    return new Date(date).toLocaleString("en-IN",{
      timeZone : "Asia/Kolkata",
      dateStyle : "medium",
      timeStyle : "short"
    })
  }

  // edit article
  const editArticle = (articleObj)=>{
    navigate("/edit-article",{state : articleObj})
  }

  // delete & restore article
  const toggleArticleStatus = async () =>{
    const newStatus = !article.isArticleActive

    const confirmMsg = newStatus ? "Restore this article?" : "Delete this article?"
    if(!window.confirm(confirmMsg)) return

    try{
      const res = await axios.patch(
        "https://blog-application-11f0.onrender.com/author-api/articles",
        {articleId : article._id,isArticleActive : newStatus},
        {withCredentials : true}
      )

      setArticle(res.data.payload)
    }catch(err){
      const msg = err.response?.data?.message
      if(err.response?.status === 400){
        toast(msg)
      }else{
        setError(msg || "Operation failed")
      }
    }
  }

  // To addd a comment
  const addComment = async(commentObj)=>{
    // add articleId
    commentObj.articleId = article._id;
    let res = await axios.put("https://blog-application-11f0.onrender.com/user-api/articles",commentObj,{withCredentials:true})
    if(res.status === 200){
      setArticle(res.data.payload)
    }
    // setCommentOb(commentObj)
  }

  if (loading) return <p className={loadingClass}>Loading article...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return null;


  return (
    <div className={articlePageWrapper}>
      {/* Header */}
      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>
        <h1 className={`${articleMainTitle} uppercase`}>{article.title}</h1>
        <div className={articleAuthorRow}>
          <div className={authorInfo}>{user?.role}</div>
          <div>{formateDate(article.createdAt)}</div>
        </div>
      </div>
      {/* Content */}
      <div className={articleContent}>{article.content}</div>
      
      {/* Author actions */}
      {user?.role === "AUTHOR" && (
        <div className={articleActions}>
          <button className={editBtn} onClick={() => editArticle(article)}>
            Edit</button>
          <button className={deleteBtn} onClick={toggleArticleStatus}>
            {article.isArticleActive ? "Delete" : "Restore"}</button>
        </div>
      )}
      {/* Form to add comment if the role is "USER" */}
      {/* User actions */}
      {user?.role === "USER" && (
        <div className={articleActions}>
          <form onSubmit={handleSubmit(addComment)}>
            <input type="text" 
              {...register("comment")} 
              className={inputClass}
              placeholder="Write your comment here..."/>
              <button type="submit" className="bg-cyan-700 text-white px-5 py-2 rounded-2xl mt-5">
                Add comment</button>
          </form>
        </div>
      )}
      {/* Comments */}
      <div className={commentsWrapper}>
        {article.comments?.length === 0 && <p className="text-[#a1a1a6] text-sm text-center">No comments yet</p>}
        {article.comments?.map((commentObj,index)=>{
          const name = commentObj.user?.email || "User"
          const firstLetter = name.charAt(0).toUpperCase()   
          return(
            <div key={index} className={commentCard}>
              {/* Header */}
              <div className={commentHeader}>
                <div className={commentUserRow}>
                  <div className={avatar}>{firstLetter}</div>
                  <div>
                    <p className={commentUser}>{name}</p>
                    <p className={commentTime}>{commentObj.createdAt ? formateDate(commentObj.createdAt) : " "}</p>
                  </div> 
                </div>
              </div>
              {/* Comment */}
              <p className={commentText}>{commentObj.comment}</p>
            </div>
          )
        })}
      </div>
      {/* Footer */}
      <div className={articleFooter}>Last upload : {formateDate(article.createdAt)}</div>
    </div>
)}

export default ArticleById
