import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import { userContext } from '../../App';
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
const Signin = () => {
    const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [showPassword,setShowPassword] = useState(false);
  const {state,dispatch} = useContext(userContext)
const navigate = useNavigate();
    //postData function 
    const postData = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            toast.error("Invalid email")
          return
        }
        fetch('http://localhost:2048/signin',{
          method:'post',
          headers:{
            'Content-Type':'application/json',
          },
          body:JSON.stringify({
            email,
            password
          })
        }).then(res => res.json())
        .then(data => {
            if(data.err){
              toast.error(data.err)
            }else{
              localStorage.setItem("jwt",data.token);
              localStorage.setItem("user",JSON.stringify(data.user));
              dispatch({type:'USER',payload:data.user})
              toast.success("Login Successfully")
              navigate('/')
            }
        }).catch(err => toast.error(err))
      }

  return (
    <div className='w-full h-[100vh] flex justify-center items-center'>
        <div className='flex flex-col items-center gap-4 w-[80%] sm:w-[400px] '>
            <h2 className='text-4xl font-medium'>Instagram</h2>
            <input className='border-2 border-gray-300 py-2 px-4 outline-none w-full focus:border-blue-500 rounded-md' type="text" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} />

            <div className='relative w-full'>
            <input className='border-2 border-gray-300 py-2 pr-12 px-4 outline-none w-full focus:border-blue-500 rounded-md' type={showPassword ? `text` : 'password'} placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)} />

            {showPassword ? <BiSolidHide className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl cursor-pointer opacity-60 " title='Hide Password' onClick={()=>setShowPassword(prev=>!prev)}/> : <BiSolidShow className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl cursor-pointer opacity-60 " title='Show Password' onClick={()=>setShowPassword(prev=>!prev)}/>}
            </div>
            
            <button className='w-full bg-blue-400 py-2 text-md font-medium rounded-sm hover:bg-blue-500 duration-300 tracking-wide' onClick={() => postData()}>Login</button>
            <Link to={'/'} className='text-red-500'>Forgotten Password?</Link>
            <h5>Don't have an Account? <Link to={'/signup'} className='text-blue-500 hover:underline' >Sign up</Link></h5>
        </div>
    </div>
  )
}

export default Signin