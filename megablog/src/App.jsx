import './App.css'
import React,{ useState,useEffecrt } from 'react'
import {useDispatch} from 'react-redux'
import authService from './appwrite/auth';

function App() {
 const[loading,setLoading]=useState(true)
 const dispatch = useDispatch();
 useEffect(()=>{
  authService.getCurrentUser().then((user)=>{
    dispatch(login(user));      
  })
 },[])

  return (
    <>

    </>
  )
}

export default App
