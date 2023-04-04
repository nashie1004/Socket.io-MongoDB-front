import React, {useContext, useEffect, useState} from 'react'
import {Data} from '../App';

export default function Profile() {
  const {loggedIn, savedUsers} = useContext(Data)
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
                  <h2>CONNECTED USERS:</h2>
                  {
                    savedUsers.map((item, i) => {
                      return (
                        <div key={i} style={{border: "1px solid black", marginBottom: '1rem'}}>
                          <img src={item.profile} alt={item.name} />
                          <p>{item.name}</p>
                        </div>
                      )
                    })
                  }
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
