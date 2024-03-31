import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GiHamburgerMenu } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { userContext } from "../App";
import {toast} from 'react-toastify'
const Navbar = () => {
    const { state, dispatch } = useContext(userContext);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [userDetails, setUserDetails] = useState([])
    const [isActive, setIsActive] = useState(false)
    const [showSearch, setShowSearch] = useState(false)

    //useEffect hook
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            dispatch({ state: "USER", payload: user });
        } else {
            navigate("/signin")
        }
    }, [])

    const renderList = () => {
        if (state) {
            return [
                <li key={1}>
                    <FaSearch className='text-black text-lg inline-block cursor-pointer sm:my-0 my-2' onClick={()=>{setShowSearch(prev =>!prev); setIsActive(prev=>!prev)}} />

                </li>,
                <li key={2}>
                    <Link to={"/profile"} className="hover:text-blue-500 duration-300 px-3 sm:py-2 py-2 sm:my-0 my-2" onClick ={()=>setIsActive(prev=>!prev)} >Profile</Link>
                </li>,
                <li key={3}>
                    <Link to={"/createpost"} className="hover:text-blue-500 duration-300 px-3 sm:py-2 py-2 sm:my-0 my-2" onClick ={()=>setIsActive(prev=>!prev)}>Create</Link>
                </li>,
                <li key={4}>
                    <Link to={"/followingpost"} className="hover:text-blue-500 duration-300 px-3 sm:py-2 py-2 sm:my-0 my-2" onClick ={()=>setIsActive(prev=>!prev)} >My following post</Link>
                </li>,
                <li key={5}>
                    <button className='bg-red-400 px-4 sm:py-2 py-2 text-lg font-medium rounded-md text-white sm:my-0 my-2'
                        onClick={() => {
                            {localStorage.clear();
                            dispatch({ type: "CLEAR" });
                            navigate("/signin");
                            setIsActive(prev=>!prev);
                            toast.success("Logout Successfully")
                        }
                        }}
                        
                    >Logout</button>
                </li>
            ]
        } else {
            return [
                <li key={6}>
                    <Link to={"/signin"} className="hover:text-blue-500 duration-300 px-3 py-2 sm:my-0 my-2" onClick ={()=>setIsActive(prev=>!prev)} >Signin</Link>
                </li>,
                <li key={7}>
                    <Link to={"/signup"} className="hover:text-blue-500 duration-300 px-3 py-2 sm:my-0 my-2" onClick ={()=>setIsActive(prev=>!prev)} >Signup</Link>
                </li>,
            ]
        }
    }
    const searchUser = (query) => {
        setSearch(query)
        fetch("http://localhost:2048/searchuser", {
            method: "post",
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({
                query: query,
            })
        }).then(res => res.json())
            .then(data => {
                setUserDetails(data.user)

            }).catch((err) => {
                console.log(err)
            })
    }
    const SearchDialog = () => {
        return (
            <>
                <div className={`${showSearch ? 'inline-block' : 'hidden'} relative z-10`} aria-labelledby="modal-title" role="dialog" aria-modal="true">

                    <div className={`fixed inset-0 bg-gray-300 bg-opacity-75 transition-opacity flex flex-col items-center `}>

                        <ImCross className='absolute top-4 left-4 text-gray-700 text-2xl cursor-pointer' onClick={() => setShowSearch((prev) => !prev)} />

                        <input className='border-2 border-black py-2 px-4 outline-none my-12 h-fit sm:w-[550px] w-[90%] focus:border-blue-500 rounded-md' type="text" placeholder='Search User...' value={search} onChange={(e) => searchUser(e.target.value)}/>
                        <ul className="flex flex-col  bg-gray-500 px-1 py-2 sm:w-[550px] w-[90%]">
            {
              userDetails.length !==0 ? 
              [userDetails.map(item=>(
                <Link key={item._id} to={state._id == item._id ? '/profile' : `/profile/${item._id}`} onClick={()=>setShowSearch((prev)=>!prev)}><li className="text-white p-2 hover:bg-gray-600">{item.email}</li></Link>
              ))]
              : <h3 className={'text-white text-xl font-medium'}>Not found :)</h3>
            }
          </ul>
                    </div>


                </div>
            </>
        )
    }
    return (
        <>
            <nav className="bg-slate-100 shadow-[0px_1px_8px_2px_rgba(0,0,0,0.3)] sticky top-0 left-0 z-100">
                <div className='flex justify-between items-center py-3 md:px-3 px-2'>
                    <Link to={'/'} className='brand-logo text-3xl md:text-4xl'>Instagram</Link>
                    <ul className={`sm:flex sm:flex-row sm:py-0 sm:px-0 sm:gap-3 sm:bg-transparent sm:items-center text-lg absolute sm:static flex-col right-0  ${isActive ? `top-[60px] ` : `top-[-300px]`} duration-500 backdrop-filter backdrop-blur-md py-5 px-4 text-center gap-y-2 bg-[rgba(255,255,255,0.6)] z-[2]`}>
                        {renderList()}
                    </ul>
                    {
                        isActive ? <ImCross className='text-lg sm:hidden cursor-pointer duration-400' onClick={() => setIsActive((prev) => !prev)} /> : <GiHamburgerMenu className='text-3xl sm:hidden cursor-pointer duration-400' onClick={() => setIsActive((prev) => !prev)} />
                    }

                    <div className={`absolute left-0 top-0 w-full h-[100vh] ${showSearch ? `inline-block` : 'hidden'} `}>
                        {SearchDialog()}
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
