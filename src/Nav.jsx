import React, {useEffect, useContext, useRef} from 'react'
import {Link} from 'react-router-dom'
import {Data} from './App';
import {useNavigate} from 'react-router-dom'

export default function Nav() {
  const {loggedIn, setLoggedIn, } = useContext(Data)
  const redirect = useNavigate()
  const showNav = useRef(null);

  function removeToken(){
    localStorage.removeItem('token')
    setLoggedIn(false)
    redirect('/login')
  }

  useEffect(() => {
    const item = JSON.parse(localStorage.getItem('token'))
    if (item) setLoggedIn(true)
  }, [])

  function handleResponsiveNav(){
    showNav.current.classList.toggle('showLinks')
  }

  return (
    <div className='Nav'>
      <p>
        Socket.io 
        <span>Chat</span> 
        <div 
          className="hamburger" 
          onClick={handleResponsiveNav}>=
        </div> 
      </p>
      <span className='links' ref={showNav}>
        {
          loggedIn ? (
            <>
              <Link to='/'>Chat</Link>
              <Link to='/users'>Users</Link>
              <Link to='/profile'>Profile</Link>
              <button onClick={removeToken}>Logout</button>
              <img src={JSON.parse(localStorage.getItem('token')).profile} alt='pfp' width='50' height='50' style={{padding: '0'}} />
            </>
          ) : (
            <>
              <Link to='/register'>Register</Link>
              <Link to='/login'>Login</Link>
            </>
          )
        }
      </span>
    </div>
  )
}
