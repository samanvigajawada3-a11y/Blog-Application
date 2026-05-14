import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  articlePageWrapper,
} from "../styles/common";
import {useForm} from "react-hook-form"
import {useLocation,useNavigate,useParams} from "react-router"
import {useEffect} from "react"
import axios from "axios"

function EditArticle() {

  const {register,handleSubmit,setValue,formState:{errors}} = useForm()
  const location = useLocation()
  const navigate = useNavigate()
  const {id} = useParams()

  const article = location.state

  // prefill the form
  useEffect(()=>{
    if(!article) return

    setValue("title",article.title)
    setValue("category",article.category)
    setValue("content",article.content)
  },[article])

  // To submit the edited article
  const updateArticle = async(modifiedUser)=>{
    // add articleId to modified article
    modifiedUser.articleId = article._id
    // maek PUT request to update the article
    let res = await axios.put("https://blog-application-11f0.onrender.com/author-api/articles",modifiedUser,{withCredentials:true})
    // res.data.payload.role = res.data?.author?.role
    if(res.status === 200){
      // navigate to articleById component
      navigate(`/article/${article._id}`,{state:res.data.payload})
    }

  }


  return (
    <div className={`${formCard} mt-10`}>
      <h2 className={formTitle}>Edit Article</h2>
      <form onSubmit={handleSubmit(updateArticle)}>
        {/* Title */}
        <div>
          <label className={labelClass}>Title</label>
          <input type="text"
                  className={inputClass} 
                  {...register("title",{
                    required : "Title is required",
                    },
                  )}/>
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div className={formGroup}>
          <label className={labelClass}>Category</label>
          <select className={inputClass}
                  {...register("category",{
                    required : "Category is required"
                  })}>
            <option value="">Select Category</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="ai">AI</option>
            <option value="web-development">Web Development</option>
          </select>
          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>

        {/* Content */}
        <div className={formGroup}>
          <label className={labelClass}>Content</label>
          <textarea
          rows="14"
          className={inputClass}
          {...register("content",{
            required : "Content is required",
          })}/>
          {errors.content && <p className={errorClass}>{errors.content.message}</p>}
        </div>

        {/* Submit */}
        <button className={submitBtn}>
          Update Article
        </button>
      </form>
    </div>
  )
}

export default EditArticle
