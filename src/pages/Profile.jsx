import React, {useContext, useEffect, useState} from 'react'
import {Data} from '../App';
import { createAvatar } from '@dicebear/core';
import { croodles, notionistsNeutral, pixelArt, lorelei, adventurer, notionists, funEmoji, identicon, thumbs } from '@dicebear/collection';

const BASE = 'http://localhost:3001'

export default function Profile() {
  const LOCAL_STORAGE = JSON.parse(localStorage.getItem('token'))
  
  const {setLoggedIn, loggedIn, callAllUsers, callSavedUsers} = useContext(Data)
  const [changeName, setChangeName] = useState('')
  const [changePassword, setChangePassword] = useState('')
  const [changeSeed, setChangeSeed] = useState('')
  const [changeAvatarType, setChangeAvatarType] = useState(lorelei)
  const [changeBGColor, setChangeBGColor] = useState('ffffff')
  const [changeAvatar, setChangeAvatar] = useState(lorelei)

  useEffect(() => {
    const avatar = createAvatar(changeAvatarType, {
      seed: changeSeed, backgroundColor: [changeBGColor]
    }).toDataUriSync()
    setChangeAvatar(avatar)
  }, [changeSeed, changeAvatarType, changeBGColor])

  useEffect(() => {
    if (loggedIn){
      setChangeAvatar(LOCAL_STORAGE.profile)
    }
  }, [loggedIn])

  //CHANGE AVATAR
  function handleAvatarType(e){
    if (e.target.value === 'lorelei'){
      setChangeAvatarType(lorelei)
    } else if (e.target.value === 'adventurer') {
      setChangeAvatarType(adventurer)
    } else if (e.target.value === 'notionists') {
      setChangeAvatarType(notionists)
    } else if (e.target.value === 'funEmoji') {
      setChangeAvatarType(funEmoji)
    } else if (e.target.value === 'identicon') {
      setChangeAvatarType(identicon)
    } else if (e.target.value === 'thumbs') {
      setChangeAvatarType(thumbs)
    } else if (e.target.value === 'pixelArt') {
      setChangeAvatarType(pixelArt)
    } else if (e.target.value === 'notionistsNeutral') {
      setChangeAvatarType(notionistsNeutral)
    } else if (e.target.value === 'croodles') {
      setChangeAvatarType(croodles)
    }
  }

  function handleColor(e){
    const string = e.target.value.replace('#', '')
    setChangeBGColor(string)
  }

  async function handleSubmitChange(){
    let newName = ''
    let newPassword = ''
    let newAvatar = ''

    if (changeName !== ''){
      newName = changeName;
    }
    if (changePassword !== ''){
      newPassword = changePassword
    }
    if (changeAvatar === LOCAL_STORAGE.profile){
      newAvatar = '';
    } else {
      newAvatar = changeAvatar;
    }
    console.log(`NAME: ${newName}, PASS: ${newPassword}, AVATAR: ${newAvatar}`)
    const res = await fetch(BASE + '/changeInfo', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: LOCAL_STORAGE.access_token,
        owner: LOCAL_STORAGE.name,
        newName, newPassword, newAvatar
      })
    })

    const data = await res.json();
    if (data.status === 'error'){
      alert("Error in changing")
    } else {
      //CHANGE LOCAL STORAGE THEN CALL
      const res = await fetch(BASE + `/getAllUsers/${LOCAL_STORAGE.access_token}`)
      const data = await res.json();
      
      data.data.map((item) => {
        if (item.name === data.newName){
          const option = JSON.stringify({
            addedFriends: item.addedFriends,
            messages: item.messages,
            name: item.name,
            password: item.password,
            profile: item.profile,
            _id: item._id,
            access_token: LOCAL_STORAGE.access_token,
          })

          localStorage.setItem('token', option)
        }
      })
      callAllUsers()
      callSavedUsers()
      setLoggedIn(true)
      console.log('ok change')
    }
  }

  return (
    <div className='Profile'>
      {
        loggedIn ? (
          <div className='profile-container'>
            <div className="img">
              <img src={changeAvatar} alt={changeName} />
            </div>
            <div className="left">
              <p className='username'>Change Information</p>
              <input type="text" 
                placeholder='Change Name'
                onChange={e => setChangeName(e.target.value)}
              />
              <input type="text" 
                placeholder='Change Password'
                onChange={e => setChangePassword(e.target.value)}
              />
              <div className='change-pfp'>
                <input type="text" placeholder='Seed'
                onChange={e => setChangeSeed(e.target.value)}
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
                <input type="color"
                onChange={handleColor}
                />
              </div>
              <button onClick={handleSubmitChange}>Change Info</button>
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
