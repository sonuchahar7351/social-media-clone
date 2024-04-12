import React, { createContext, useContext, useEffect, useReducer } from 'react'
import Navbar from './components/Navbar'
import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Signin from './components/screens/Signin'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import Createpost from './components/screens/Createpost'
import Userprofile from './components/screens/Userprofle'
import Followingpost from './components/screens/Followingpost'
import Followinglist from './components/screens/Followinglist'
import Followerlist from './components/screens/Followerlist'

import { initialState, reducer } from './Reducers/userReducer'
import LikesList from './components/screens/LikesList'

export const userContext = createContext();
const Routing = ()=>{
  const navigate = useNavigate();
  const {state,dispatch} = useContext(userContext);

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({state:"USER", payload:user})
    }else{
      navigate('/signin')
    }
  },[])

  return(
    <Routes>
      <Route path={'/'} element={state? <Home/> : <Signin/>}  />
      <Route path={'/signin'} element={<Signin/>}  />
      <Route path='/signup' element={<Signup/>} />
      <Route exact path='/profile' element={<Profile/>} />
      <Route  path='/createpost' element={<Createpost/>} />
      <Route path="/profile/:userid" element={<Userprofile />} />
      <Route path="/followingpost" element={<Followingpost />} />
      <Route path="/followinglist/:id" element={<Followinglist />} />
      <Route path="/followerlist/:id" element={<Followerlist />} />
      <Route path="/likeslist/:postid" element={<LikesList />} />
    </Routes>
  )
}
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
    <userContext.Provider value={{ state, dispatch }}>
        <Navbar />       
        <Routing/>
      </userContext.Provider>
    </>
  )
}

export default App