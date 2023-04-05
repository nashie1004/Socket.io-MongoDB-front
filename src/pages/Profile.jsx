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
            <div className="left">
              <p className='username'>Change Information</p>
              <input type="text" 
              placeholder='Change Name...'
              />
              <input type="text" 
              placeholder='Change Password...'
              />
              <button>Change Info</button>
            </div>
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
