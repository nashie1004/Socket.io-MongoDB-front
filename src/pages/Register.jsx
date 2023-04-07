import React, {useState, useContext, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import { Data } from '../App';
import { createAvatar } from '@dicebear/core';
import { croodles, notionistsNeutral, pixelArt, lorelei, adventurer, notionists, funEmoji, identicon, thumbs } from '@dicebear/collection';

export default function Register() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const {loggedIn, BASE} = useContext(Data)
  const redirect = useNavigate()
  const [seed, setSeed] = useState('an');
  const [bgColor, setBgColor] = useState('ffffff');
  const [avatarType, setAvatarType] = useState(null)
  const [avatar, setAvatar] = useState('')

  async function handleSubmit(){
    if (name !== '' && password !== '' && avatar !== ''){
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
          name, password, profile: avatar
        })
      })

      const data = await res.json();
      
      if (data.status === 'ok'){
        redirect('/login')
      } else {
        alert('Error: Check Name, Password or Avatar')
      }
    } else {
      alert('Error: Check Name, Password or Avatar')
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
    } else if (e.target.value === 'pixelArt') {
      setAvatarType(pixelArt)
    } else if (e.target.value === 'notionistsNeutral') {
      setAvatarType(notionistsNeutral)
    } else if (e.target.value === 'croodles') {
      setAvatarType(croodles)
    }
  }

  useEffect(() => {
    if (avatarType){
      const avatar = createAvatar(avatarType, {
        seed, backgroundColor: [bgColor]
      }).toDataUriSync()

      setAvatar(avatar)
    }
  }, [seed, avatarType, bgColor])
  
  useEffect(() => {
    setAvatarType(lorelei)
  }, [])

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
              type="password" placeholder='Password' />
            <br />
            <div className="profile-options">
              <input type="text" placeholder='Seed'
                onChange={e => setSeed(e.target.value)}
              />
              <select placeholder='Avatar Type' name='Avatar Type' onChange={handleAvatarType}>
                <option value="" selected disabled>Avatar Type</option>
                <option value="adventurer">Adventurer</option>
                <option value="lorelei">Lorelei</option> , 
                <option value="notionists">Notionists</option>
                <option value="funEmoji">FunEmoji</option>
                <option value="identicon">Identicon</option>
                <option value="thumbs">Thumbs</option>
                <option value="pixelArt">PixelArt</option>
                <option value="notionistsNeutral">Neutral</option>
                <option value="croodles">Croodles</option>
              </select>
              <input type="color" placeholder='Color'
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
