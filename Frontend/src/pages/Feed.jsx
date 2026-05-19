import React, { useState, useEffect } from 'react'
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([{
    _id: "1",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    caption: "hello",
  }]);

  useEffect(() => {
    console.log("Fetching posts...")
    const backendUrl = import.meta.env.VITE_BACKEND_POST_API_URL || "http://localhost:3000/api/posts";
    axios.get(backendUrl)
      .then((response) => {
        console.log("Full response:", response.data);
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else if (Array.isArray(response.data.posts)) {
          setPosts(response.data.posts);
        } else {
          setPosts([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  return (
    <>
      <div>
        <section className="feed-section">
          {
            posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className='post-card'>
                  <img src={post.image} alt={post.caption} />
                  <p>{post.caption}</p>
                </div>
              ))
            ) : (<h1>No posts yet</h1>)
          }
        </section>
      </div>
    </>
  )
}

export default Feed;
