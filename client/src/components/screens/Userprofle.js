import React, { useEffect, useState, useContext } from "react";
import { userContext } from "../../App";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
const Userprofile = () => {
  const { state, dispatch } = useContext(userContext);
  const [userprofile, setUserprofile] = useState(null);
  const [showfollow,setShowfollow] = useState(null)
  const { userid } = useParams();
  useEffect(() => {
    fetch(`http://localhost:2048/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setUserprofile(result)
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
       toast.error('Error fetching user profile')
      });

      //changing the follow and unfollow button according to following list of the current user
      const USER_DETAIL = JSON.parse(localStorage.getItem('user'))
      if(USER_DETAIL.following.includes(userid)){
        setShowfollow(false)
      }else{
        setShowfollow(true);
      }
  }, [userid]);

  const followUser = () => {
    fetch("http://localhost:2048/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        await dispatch({type:"UPDATE",payload:{following:data.currentUser.following,followers:data.currentUser.followers}})
        localStorage.setItem('user',JSON.stringify(data.currentUser));
        setUserprofile((prevState)=>{
          return{
            ...prevState,
            user:{
              ...prevState.user,
              followers:[...prevState.user.followers,data.followedUser._id]
            }
          }
        })
        setShowfollow(false)
      });
  };
  const unfollowUser = () => {
    fetch("http://localhost:2048/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        await dispatch({type:"UPDATE",payload:{following:data.currentUser.following,followers:data.currentUser.followers}})
        localStorage.setItem('user',JSON.stringify(data.currentUser));

        setUserprofile((prevState)=>{
          const newFollowers = prevState.user.followers.filter(item => item != data.followedUser._id)
          return{
            ...prevState,
            user:{
              ...prevState.user,
              followers:newFollowers,
            }
          }
        })
        setShowfollow(true)
      });
  };
  return (
    <>
      {userprofile ? (
        <div className="flex flex-col gap-4 border-b-2 md:w-[85%] w-full my-0 mx-auto py-4">
          <div className="flex items-center sm:flex-row flex-col justify-center lg:gap-[100px] md:gap-10 gap-6 py-4 border-b-4 border-gray-200">
            <div className="dp">
              <img src={userprofile ? userprofile.user.dp : "loading"} alt="dp" className="sm:w-[200px] sm:h-[200px] w-[150px] h-[150px] rounded-full object-cover" />
            </div>
            <div className="flex flex-col gap-2">
              {userprofile && (
                <>
                  <h3 className="text-3xl sm:text-4xl font-semibold">{userprofile ? userprofile.user.name : "loading"}</h3>
                  <h6 className="text-2xl font-normal">{userprofile.user.email}</h6>
                </>
              )}
              <div className="flex gap-4 text-2xl font-normal text-center">
                {userprofile && (
                  <>
                    <h5>{userprofile.posts.length} posts</h5>
                    <h5><Link to={`/followerlist/${userprofile.user._id}`} user={userprofile.user._id}>{userprofile ? userprofile.user.followers.length : "0"} followers</Link></h5>
                    <h5><Link to={`/followinglist/${userprofile.user._id}`} user={userprofile.user._id}>{userprofile ? userprofile.user.following.length : "0"} Following</Link></h5>
                  </>
                )}
              </div>
              {userprofile && showfollow ? <button
              style={{marginTop:"0.5rem"}}
                className="py-2 bg-blue-500 text-yellow-50 font-semibold rounded-sm"
                onClick={() => followUser()}
              >
                Follow
              </button> : <button
              style={{marginTop:"0.5rem",color:'green'}}
                className="py-2 bg-[#eee] font-semibold rounded-sm"
                onClick={() => unfollowUser()}
              >
                Following
              </button>}
            </div>
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 place-items-center">
            {userprofile && (
              userprofile.posts.map(item =>(
                <img src={item.picture} alt={item.title} key={item._id} className="h-[22rem] w-[22rem] object-cover " />
              ))
            )}
          </div>
        </div>
      ) : (
        <h2>Loading...!!!</h2>
      )}
    </>
  );
};

export default Userprofile;
