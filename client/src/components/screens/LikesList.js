import React, { useContext, useEffect, useState } from 'react'
import { MdFavorite } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { userContext } from '../../App';
const LikesList = () => {
  const { postid } = useParams();
  const [userData, setUserData] = useState([]);
  const { state, dispatch } = useContext(userContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`http://localhost:2048/likeslist/${postid}`, {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      }
    }).then(res => res.json())
      .then(data => {
        if (data.err) {
          toast.error(data.err)
        } else {
          setUserData(data)
        }
      })
  }, [postid])

  //follow user function
  const followUser = (userid)=>{
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
      });
  }

  //unfollow user function 
  const unfollowUser = (userid) => {
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
      });
  };
  return (
    <>
      {userData.length>0 ? [
        <div className="w-[100%] h-[100vh] flex flex-col mt-2">
      <h3 className="flex justify-center items-center font-medium sm:text-3xl text-2xl bg-gray-50 mt-1 py-2 "> <MdFavorite style={{
        color: "black",
        fontSize: "2rem",
        margin:'0rem 0.5rem'
      }}
      />  {userData.length}</h3>
      {userData ? (
        userData.map((item) => (
          <div className="w-[80%] mt-2 mx-auto flex justify-between items-center py-2 px-4  " key={item._id}>
            <div>
              <Link
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                to={state._id === item._id ? `/profile` : `/profile/${item._id}`}
              >
                <img
                  src={item.dp}
                  alt="dp"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <h5>{item.name}</h5>
              </Link>
            </div>
            {state._id === item._id ? '' : (
              !state.following.includes(item._id) ? <button
                style={{ marginTop: "0.5rem", color: "white" }}
                className="bg-blue-500 px-4 py-2"
                  onClick={() => followUser(item._id)}
                >
                  Follow
                </button> : <button
                style={{ marginTop: "0.5rem", color: "green" }}
                className="bg-[#eee] px-4 py-2"
                  onClick={() => unfollowUser(item._id)}
                >
                  Following
                </button>
            )}
          </div>
        ))
      ) : (
        <h2>loading...</h2>
      )}
    </div>
      ] :<h2 className='text-2xl'>Loading...</h2>}
    </>
  )
}

export default LikesList