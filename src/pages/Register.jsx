import React, {useState, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import { Data } from '../App';
import { createAvatar } from '@dicebear/core';
import { lorelei, adventurer, notionists, funEmoji, identicon, thumbs } from '@dicebear/collection';

const BASE = 'http://localhost:3001'

export default function Register() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const {loggedIn} = useContext(Data)
  const redirect = useNavigate()
  const [seed, setSeed] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [avatarType, setAvatarType] = useState(lorelei)

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
    } else {
      alert('Error: Check Name or Password')
    }
  }

  //CREATE AVATAR
  function handleColor(e){
    const string = e.target.value.replace('#', '')
    setBgColor(string)
  }

  function handleAvatarType(e){
    if (e.target.value === 'lorelei'){
      setAvatarType(lorelei)
    } else if (e.target.value === 'adventurer') {
      setAvatarType(adventurer)
    } else if (e.target.value === 'notionists') {
      setAvatarType(notionists)
    } else if (e.target.value === 'funEmoji') {
      setAvatarType(funEmoji)
    } else if (e.target.value === 'identicon') {
      setAvatarType(identicon)
    } else if (e.target.value === 'thumbs') {
      setAvatarType(thumbs)
    }
  }

  const avatar = createAvatar(avatarType, {
    seed, backgroundColor: [bgColor]
  }).toDataUriSync()
  
  return (
    <div className='Register'>
      {
        loggedIn ? (
          <p>Already Registered and Logged In</p>
        ) : (
          <div className='form'>
            <p>Create an Account</p>
            <br />
            <div className="img">
              <img src={avatar} alt="pfp" />
            </div>
            <br />
            <input 
              onChange={e => setName(e.target.value)}
              type="text" placeholder='Name' />
            <br />
            <input 
              onChange={e => setPassword(e.target.value)}
              type="text" placeholder='Password' />
            <br />
            <div className="profile-options">
              <input type="text" placeholder='Seed'
                onChange={e => setSeed(e.target.value)}
              />
              <select name='Avatar Type' onChange={handleAvatarType}>
                <option value="lorelei">Lorelei</option> , 
                <option value="adventurer">Adventurer</option>
                <option value="notionists">Notionists</option>
                <option value="funEmoji">FunEmoji</option>
                <option value="identicon">Identicon</option>
                <option value="thumbs">Thumbs</option>
              </select>
              <input type="color"
                onChange={handleColor}
              />
            </div>
            <br />
            <button onClick={handleSubmit}>Register</button>
          </div>
        )
      }
    </div>
  )
}
