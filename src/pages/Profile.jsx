import React, {useContext, useEffect, useState} from 'react'
import {Data} from '../App';

export default function Profile() {
  const {loggedIn} = useContext(Data)
  const [profile, setProfile] = useState({
    image: '',
    name: '',
    password: ''
  })
  const LOCAL_STORAGE = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    if (loggedIn){
      setProfile({
        image: LOCAL_STORAGE.profile,
        name: LOCAL_STORAGE.name,
        password: LOCAL_STORAGE.password,
      })
    }
  }, [loggedIn])

  return (
    <div className='Profile'>
      {
        loggedIn ? (
          <div className='profile-container'>
            <div className="img">
              <img src={profile.image} alt={profile.name} />
            </div>
            change to tooltip + modal
            <p className='username'>{profile.name}</p>
            <p className='password'>{profile.password}</p>
          </div>
        ) : (
          <>
            <p>Not Logged In -Profile</p>
          </>
        )
      }
    </div>
  )
}
