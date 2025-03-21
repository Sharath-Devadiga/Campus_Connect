import AdminLeftbar from "@/components/admin/AdminLeftbar"
import ReportedPostFeed from "@/components/ReportedPostFeed"
import { axiosInstance } from "@/lib/axios"
import { Post } from "@/lib/utils"
import { useEffect, useState } from "react"

const ReportedPosts = () => {
  const [reportedPosts, setReportedPosts] = useState<Post[]>()
  useEffect(() => {
    const fetchReprtedPosts = async() => {
      const res = await axiosInstance.get('/admin/report')
      setReportedPosts(res.data)
    }
    fetchReprtedPosts()
  },[])
  return <div className="min-h-screen">
    <div className="fixed hidden md:block ">
      <AdminLeftbar />
    </div>
    <div className="mt-20">
    <div>
        {reportedPosts && reportedPosts.length > 0 ? (
          reportedPosts.map((post) => (
            <ReportedPostFeed key={post._id} post={post} />
          ))
        ) : (
          <p>Loading posts...</p> 
        )}
      </div>
    </div>
      
    </div>
  
}

export default ReportedPosts