import React, { useContext, useEffect, useState } from "react";
import { MdFavorite, MdFavoriteBorder, MdDelete } from "react-icons/md";
import { userContext } from "../../App";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Followingpost = () => {
  const [comment, setComment] = useState("");
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(userContext);

  let userData = typeof state == "string" ? JSON.parse(state) : state;

  useEffect(() => {
    fetch("http://localhost:2048/followingpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("http://localhost:2048/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("http://localhost:2048/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    if (comment !== "") {
      setComment("");
      fetch("http://localhost:2048/comment", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId,
          text,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          const newData = data.map((item) => {
            if (item._id === result._id) {
              return result;
            } else {
              return item;
            }
          });
          setData(newData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deletePost = (postId) => {
    fetch(`http://localhost:2048/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result.deletedPostDetails._id;
        });
        toast.success(result.Message);
        setData(newData);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <div className="flex flex-col items-center gap-6 w-[100%]">
      {userData.following.length > 0 ? (
        [
          data.map((item) => (
            <div
              className="flex flex-col w-[90%] sm:w-[500px] shadow-[0px_0px_8px_1px_rgba(0,0,0,0.3)] p-2 mt-8"
              key={item._id}
            >
              <div className="p-2 flex justify-between">
                <Link
                  className="flex items-center gap-2"
                  to={
                    item.postedBy._id === userData._id
                      ? "/profile"
                      : `/profile/${item.postedBy._id}`
                  }
                >
                  <img
                    src={item.postedBy.dp}
                    alt=""
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <h5>{item.postedBy.name}</h5>
                </Link>
                {userData
                  ? item.postedBy._id === userData._id && (
                      <MdDelete
                        style={{
                          color: "red",
                          cursor: "pointer",
                          fontSize: "2rem",
                        }}
                        title="Delete Post"
                        onClick={() => deletePost(item._id)}
                      />
                    )
                  : "loading"}
              </div>
              <div className="w-[100%] h-[550px]">
                <img
                  src={item.picture}
                  alt="Post"
                  className="w-full h-[100%] object-cover "
                />
              </div>
              <div className="p-4 flex flex-col gap-2">
                {userData
                  ? [
                      item.likes.includes(userData._id) ? (
                        <MdFavorite
                          style={{
                            color: "red",
                            cursor: "pointer",
                            fontSize: "2rem",
                          }}
                          onClick={() => unlikePost(item._id)}
                        />
                      ) : (
                        <MdFavoriteBorder
                          style={{ cursor: "pointer", fontSize: "2rem" }}
                          onClick={() => likePost(item._id)}
                        />
                      ),
                    ]
                  : "loading"}

                <h6>
                  <Link to={`/likeslist/${item._id}`}>
                    {item.likes.length} likes{" "}
                  </Link>{" "}
                </h6>
                <h6 className="font-semibold">{item.title}</h6>
                <p>{item.body}</p>
                {item.comments.map((record) => (
                  <h6 key={record._id} style={{ fontWeight: "400" }}>
                    <span style={{ fontWeight: "600" }}>
                      {record.postedBy.name}
                    </span>{" "}
                    - {record.text}
                  </h6>
                ))}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(e.target[0].value, item._id);
                  }}
                >
                  <div className="w-full flex justify-between items-center gap-2">
                    <input
                      type="text"
                      placeholder="add a comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="border-b-2 w-[100%] p-2 outline-none"
                    />
                    <span
                      onClick={() => {
                        makeComment(comment, item._id);
                      }}
                      className="bg-neutral-200 cursor-pointer py-2 px-3 rounded-sm"
                    >
                      Comment
                    </span>
                  </div>
                </form>
              </div>
            </div>
          )),
        ]
      ) : (
        <>
          <h4 style={{ textAlign: "center" }}>
            You are not following. Please follow to see their post
          </h4>
        </>
      )}
    </div>
  );
};

export default Followingpost;
