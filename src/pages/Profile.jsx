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
                <>
                    <h2>PROFILE</h2>
                    <img src={profile.image} alt={profile.name} />
                    <p>Username: {profile.name}</p>
                    <p>Password: {profile.password}</p>
                </>
            ) : (
                <>
                    <p>Not Logged In -Profile</p>
                </>
            )
        }
    </div>
  )
}
