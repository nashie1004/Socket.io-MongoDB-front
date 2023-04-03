import React, {useState, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import { Data } from '../App';

const BASE = 'http://localhost:3001'

export default function Register() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const {loggedIn} = useContext(Data)
  const redirect = useNavigate()

  async function handleSubmit(){
    if (name !== '' && password !== ''){
      if ([...name].includes(" ")){
        name.replaceAll(" ", "_")
      }
      if ([...password].includes(" ")){
        password.replaceAll(" ", "_")
      }        

      const res = await fetch(BASE + '/register', {
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
        redirect('/login')
      } else {
        alert('Error: Check Name or Password')
      }
    }
  }

  return (
    <div className='Register'>
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
            <button onClick={handleSubmit}>Register</button>
          </>
        )
      }
    </div>
  )
}
