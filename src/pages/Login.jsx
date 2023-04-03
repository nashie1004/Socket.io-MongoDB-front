import React, {useState, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import { Data } from '../App';

const BASE = 'http://localhost:3001'

export default function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const {loggedIn, setLoggedIn} = useContext(Data)
  const redirect = useNavigate()
  
  async function handleSubmit(){
    if (name !== '' && password !== ''){
      const res = await fetch(BASE + '/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name, password, profile: `https://picsum.photos/id/${Math.floor(Math.random() * 300)}/70/70`
        })
      })

      const data = await res.json();
      if (data.status === 'ok'){
        const option = JSON.stringify({
          addedFriends: data.found.addedFriends,
          messages: data.found.messages,
          name: data.found.name,
          password: data.found.password,
          profile: data.found.profile,
          _id: data.found._id,
          access_token: data.token,
        })

        localStorage.setItem('token', option)
        setLoggedIn(true)
        redirect('/users')
      } else {
        console.log('Error: check name or password')
      }
    }
  }
  return (
    <div className='Login'>
    {
      loggedIn ? (
        <>
          <p>Already Logged In</p>
        </>
      ) : (
        <>
          <input 
            onChange={e => setName(e.target.value)}
            type="text" 
            placeholder='Name' /><br />
          <input 
            onChange={e => setPassword(e.target.value)}
            type="text" 
            placeholder='Password' /><br />
          <button onClick={handleSubmit}>Log In</button>
        </>
      )
    }
    </div>
  )
}
