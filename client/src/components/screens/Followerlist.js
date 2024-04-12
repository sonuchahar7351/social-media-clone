import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../App";
import { Link, useParams } from "react-router-dom";

const Followerlist = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(userContext);
  const [followerData, setFollowerData] = useState([]);
  const [removeFollower, setRemoveFollower] = useState(false);
  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = () => {
    fetch(`http://localhost:2048/followerlist/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setFollowerData(result.result);
      });
  }
  const remove = (followerId) => {
    fetch('http://localhost:2048/removeFollower', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followerId: followerId,
      }),
    }).then(res => res.json())
      .then(async result => {
        await dispatch({ type: "UPDATE", payload: { following: result.currentUser.following, followers: result.currentUser.followers } })
        localStorage.setItem('user', JSON.stringify(result.currentUser));
        setRemoveFollower(true);
      })
  }

  useEffect(() => {
    if (removeFollower) {
      fetchList();
    }
  }, [removeFollower])


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
        await dispatch({ type: "UPDATE", payload: { following: data.currentUser.following, followers: data.currentUser.followers } })
        localStorage.setItem('user', JSON.stringify(data.currentUser));
      });
  };

  // //follow user function
  const followUser = (userid) => {
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
        await dispatch({ type: "UPDATE", payload: { following: data.currentUser.following, followers: data.currentUser.followers } })
        localStorage.setItem('user', JSON.stringify(data.currentUser));
      });
  };

  return (
    <div className="w-[100%] h-[100vh] flex flex-col mt-2">
      <h3 className="text-center font-medium sm:text-3xl text-2xl bg-gray-50 mt-1 py-2 ">Followers</h3>
      {followerData ? (
        followerData.map((item) => (
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
            {id === state._id ? (
              <button
                className="text-lg text-gray-50 bg-red-400 cursor-pointer px-3 py-1"
                onClick={() => remove(item._id)}
              >
                Remove
              </button>
            ) : (state._id === item._id ? '' : (
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
            ))}
          </div>
        ))
      ) : (
        <h2>loading...</h2>
      )}
    </div>
  );
};

export default Followerlist;
