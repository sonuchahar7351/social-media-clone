import React, { useEffect, useState, useContext, useRef } from "react";
import { userContext } from "../../App";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const Profile = () => {
  const { state, dispatch } = useContext(userContext);
  const [mypics, setMyPics] = useState([]);
  const [image, setImage] = useState("");
  const inputDp = useRef(null)

  useEffect(() => {
    fetch("http://localhost:2048/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setMyPics(result.mypost);
      });
  }, []);

  useEffect(() => {
    if (image) {
      toast.info("Uploading dp please wait a moment! this may take time depend on your internet")
      
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
          fetch("http://localhost:2048/updatedp", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              dp: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              if (result.err) {
                toast.error(result.err)
              }else{              
                localStorage.setItem('user',JSON.stringify({...state, dp:data.url}))
                dispatch({type:"UPDATEDP",payload:data.url})
                toast.success('Your dp uploaded successully')
                  inputDp.current.value =""
              }
            });
        })
        .catch((err) => {
          console.log(err);
          toast.error(err)
        });
    }
  }, [image]);
  const updateDp = (file) => {
    setImage(file);
  };
  return (
    <div className="flex flex-col gap-6 px-4">
      <div className="flex flex-col gap-2 border-b-2 md:w-[85%] w-full my-0 mx-auto py-4">
        <div className="flex items-center sm:flex-row flex-col justify-center lg:gap-[100px] md:gap-10 gap-6 py-4">
          <div className="dp">
            <img src={state ? state.dp : "loading"} alt="dp" className="sm:w-[200px] sm:h-[200px] w-[150px] h-[150px] rounded-full object-cover" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl sm:text-4xl font-semibold">{state ? state.name : "loading"}</h3>
            <h5 className="text-2xl font-normal">
              {state ? state.email : "loading"}
            </h5>
            <div className="flex gap-4 text-2xl font-normal text-center">
              <h5>{mypics.length} Posts</h5>
              <Link to={`/followerlist/${state._id}`}><h5>{state ? state.followers.length : "0"} Followers</h5></Link>
              <h5>
                <Link to={`/followinglist/${state._id}`}>
                  {state ? state.following.length : "0"} Following
                </Link>
              </h5>
            </div>
          </div>
        </div>
        <label className="flex w-full gap-2 items-center px-8">
                    <span className="text-black font-medium">Update dp</span>
                    <input type="file" className="file:border file:border-solid block text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
      cursor-pointer
    " onChange={(e) => updateDp(e.target.files[0])} ref={inputDp}/>
                </label>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 place-items-center">
        {mypics.map((item) => (
          <img key={item._id} src={item.picture} alt={item.title} className="h-[22rem] w-[22rem] object-cover " />
        ))}
      </div>
    </div>
  );
};

export default Profile;
