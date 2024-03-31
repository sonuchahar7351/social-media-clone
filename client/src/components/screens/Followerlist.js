import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../App";
import { Link, useParams } from "react-router-dom";

const Followerlist = () => {
    const {id} = useParams();
  const { state, dispatch } = useContext(userContext);
  const [followerData, setFollowerData] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:2048/followerlist/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setFollowerData(result.result);
      });
  }, []);

  return (
    <div className="w-[100%] h-[100vh] flex flex-col mt-2">
      <h3 className="text-center font-medium sm:text-3xl text-2xl bg-gray-50 mt-1 py-2 ">My Follower List</h3>
      {followerData ? (
        followerData.map((item) => (
          <div className="w-[80%] mt-2 mx-auto flex justify-between items-center py-2 px-4  " key={item._id}>
            <div>
              <Link
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                to={`/profile/${item._id}`}
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
            <button
             className="text-lg text-gray-50 bg-red-400 cursor-pointer px-3 py-1"
            >
              Remove
            </button>
          </div>
        ))
      ) : (
        <h2>loading...</h2>
      )}
    </div>
  );
};

export default Followerlist;
