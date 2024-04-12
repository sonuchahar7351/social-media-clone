import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined);
    const [showPassword,setShowPassword] = useState(false);

    useEffect(() => {
        if (url) {
            signupData();
        }
    }, [url])
    const uploadDp = () => {
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
                toast.error(err);
            });
    }
    const signupData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            toast.error("Invalid email")
            return
        }
        fetch('http://localhost:2048/signup', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password,
                dp: url,
            })
        }).then(res => res.json())
            .then(data => {
                if (data.err) {
                    toast.error(data.err)
                } else {
                    toast.success(data.msg)
                    navigate('/signin');

                }
            }).catch(err => console.log(err))
    }
    const postData = () => {
        if (image) {
            uploadDp();
        } else {
            signupData();
        }

    }
    return (
        <div className='w-full h-[100vh] flex justify-center items-center'>
            <div className="flex flex-col items-center gap-4 w-[80%] sm:w-[400px] ">
                <h2 className='text-4xl font-medium'>Instagram</h2>
                <input className='border-2 border-gray-300 py-2 px-4 outline-none w-full focus:border-blue-500 rounded-md' type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />

                <input className='border-2 border-gray-300 py-2 px-4 outline-none w-full focus:border-blue-500 rounded-md' type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <div className='relative w-full'>
                    <input className='border-2 border-gray-300 py-2 pr-12 px-4 outline-none w-full focus:border-blue-500 rounded-md' type={showPassword ? `text` : 'password'} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />

                    {showPassword ? <BiSolidHide className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl cursor-pointer opacity-60 " title='Hide Password' onClick={() => setShowPassword(prev => !prev)} /> : <BiSolidShow className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl cursor-pointer opacity-60 " title='Show Password' onClick={() => setShowPassword(prev => !prev)} />}
                </div>
                <label className="flex w-full gap-2 items-center px-1">
                    <span className="text-black font-medium">Upload Dp</span>
                    <input type="file" className="file:border file:border-solid block text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    " onChange={(e) => setImage(e.target.files[0])} />
                </label>
                <button className='w-full bg-blue-400 py-2 text-md font-medium rounded-sm hover:bg-blue-500 duration-300 tracking-wide' onClick={() => postData()}>Signup</button>

                <h5>Already have an account? <Link to={'/signin'} className='text-blue-500 hover:underline'>Sign In</Link></h5>
            </div>
        </div>
    )
}

export default Signup