import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";

const PostList = () => {
 const [posts,setPosts] = useState([]);

 useEffect(()=>{
  axios
    .get('http://localhost:5000/api/posts')
    .then(res => setPosts(res.data))
    .catch(err=>console.log(err.response));
 },[]);

 return (
    <div>
      <h1>Posts:</h1>
      {posts.map(post=>(
        <Post key={post.id} post={post}/>
      ))}
    </div>
 );
}

export default PostList;