import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const Blogs = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    async function fetchBlogs(){
      setLoading(true)
      setError('')
      try{
        const res = await api.get('/blogs')
        if(!isMounted) return
        setBlogs(Array.isArray(res.data) ? res.data : [])
      }catch(e){
        setError('Failed to load blogs')
      }finally{
        if(isMounted) setLoading(false)
      }
    }
    fetchBlogs()
    return () => { isMounted = false }
  },[])

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Blogs</h1>
      {error && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blogs.map((b) => (
            <Link key={b._id} to={`/blogs/${b._id}`} className="block bg-white rounded-xl shadow p-4 hover:shadow-md">
              {b.image && (
                <img 
                  src={b.image.startsWith('http') ? b.image : `http://localhost:5000${b.image}`} 
                  alt={b.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-xl font-semibold">{b.title}</h2>
              <p className="text-gray-500 text-sm">{b.author || ''}</p>
              <p className="mt-2 line-clamp-3">{b.content}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Blogs