import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Createpost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      fetch("http://localhost:2048/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          picture: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
           toast.error(data.error)
          } else {
            toast.success("Post created successfully")
            navigate("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [url]);
  const navigate = useNavigate();
  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Insta Clone");
    data.append("cloud_name", "ascoder");
    fetch("https://api.cloudinary.com/v1_1/ascoder/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <div
        className="flex flex-col items-center gap-4 w-[80%] sm:w-[400px] shadow-[0px_0px_5px_1px_rgba(0,0,0,0.3)] py-4 px-2"
      >
        <h2 className="text-4xl font-medium">Create Post</h2>
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-b-2 border-gray-300 p-2 outline-none w-full focus:border-blue-500 "
        />
        <input
          type="text"
          placeholder="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="border-b-2 border-gray-300 p-2 outline-none w-full focus:border-blue-500 "
        />
        <label className="flex w-full gap-2 items-center px-1">
                    <span className="text-black font-medium">Upload Image</span>
                    <input type="file" className="file:border file:border-solid block text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    " onChange={(e) => setImage(e.target.files[0])} />
                </label>
        <button
          className='w-full bg-blue-400 py-2 text-md font-medium rounded-sm hover:bg-blue-500 duration-300 tracking-wide' 
          onClick={() => postDetails()}
        >
          Submit Post
        </button>
      </div>
    </div>
  );
};

export default Createpost;
