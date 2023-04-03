import React, {useEffect, useContext} from 'react'
import {Link} from 'react-router-dom'
import { Data } from './App';

export default function Nav() {
  const {loggedIn, setLoggedIn, } = useContext(Data)

  function removeToken(){
    localStorage.removeItem('token')
    setLoggedIn(false)
  }

  useEffect(() => {
    const item = JSON.parse(localStorage.getItem('token'))
    if (item){
      setLoggedIn(true)
    }
  }, [])

  return (
    <div className='Nav'>
      {
        loggedIn ? (
          <>
            <img src={JSON.parse(localStorage.getItem('token')).profile} alt='pfp' width='50' height='50' style={{padding: '0'}} />
            <span>{JSON.parse(localStorage.getItem('token')).name}</span>
            <button onClick={removeToken}>Logout</button>
          </>
        ) : (
          <>
            <Link to='/register'>Register</Link>
            <Link to='/login'>Login</Link>
          </>
        )
      }
      <Link to='/chat'>Chat</Link>
      <Link to='/users'>Users</Link>
    </div>
  )
}
