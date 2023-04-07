import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Chat from './pages/Chat'
import ChatRoom from './pages/ChatRoom'
import Login from './pages/Login'
import Register from './pages/Register'
import Users from './pages/Users'
import Profile from './pages/Profile';
import './App.scss'
import { useState, createContext, useEffect } from 'react';
import Nav from './Nav';
import io from 'socket.io-client'
import NoMatch from './pages/NoMatch';

const BASE = 'https://socketiochatappexpress.onrender.com/' //'http://localhost:3001'
const socket = io.connect(BASE)
export const Data = createContext();

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [savedUsers, setSavedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // PRELOAD EVERYTHING AND FILTERS EVERY USER
  useEffect(() => {
    if (loggedIn){
      callAllUsers();
      callSavedUsers();
    }
  }, [loggedIn])

  async function callAllUsers(){
    const LOCAL_STORAGE = JSON.parse(localStorage.getItem('token'))
    const result = await fetch(BASE + `/getAllUsers/${LOCAL_STORAGE.access_token}`)
    const res = await result.json();

    if (res.status === 'ok' ){ 
      const all = []
      const saved = []
      const filteredUsers = []

      res.data.forEach(item => item.name !== LOCAL_STORAGE.name ? all.push(item) :saved.push(item))
      
      all.map((allItem, j) => {
        filteredUsers.push({
          name: allItem.name,
          profile: allItem.profile,
          added: saved[0].addedFriends.includes(allItem.name) ? true : false
        })
      })
        
      setAllUsers(filteredUsers)
      // console.log('FILTERED ALL USERS: ', filteredUsers)
    }
  }

  async function callSavedUsers(){
    const LOCAL_STORAGE = JSON.parse(localStorage.getItem('token'))
    const newResults = await fetch(BASE + `/getUserAddedUsers/${LOCAL_STORAGE.name}/${LOCAL_STORAGE.access_token}`)
    const result = await fetch(BASE + `/getAllUsers/${LOCAL_STORAGE.access_token}`)
    
    const res = await result.json();
    const savedUsers = await newResults.json();

    const addedUsersArray = []

    if (res.status === 'ok'){
      savedUsers.data.addedFriends.map((savedItem, i) => {
        res.data.map((allItems, j) => {
          if (savedItem == allItems.name) {
            addedUsersArray.push({
              name: allItems.name,
              profile: allItems.profile,
              added: !allItems.added
            })
          }
        })
      })

      setSavedUsers(addedUsersArray)
      // console.log('FILTERED SAVED USERS: ', addedUsersArray)
    }
  }
  
  //ADDS, REMOVES A USER FROM SAVED USERS
  async function handleButton(name, added, profile){

    setAllUsers(prev => {
      return prev.map((item, i) => {
        if (item.name === name){
          return {...item, added: !added};
        } else return item
      })
    })
    setSavedUsers(prev => {
      if (added){
        return prev.filter((item, i) => {
          if (item.name !== name){
            return item;
          } 
        })
      } else {
        return [...prev, {name, profile, added}]
      }
    })

    const LOCAL_STORAGE = JSON.parse(localStorage.getItem('token'))
    const URL = added ? '/deleteUser': '/addUser';

    const result = await fetch(BASE + URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify({
        token: LOCAL_STORAGE.access_token,
        ownerName: LOCAL_STORAGE.name,
        toUserName: name
      })
    })
    const response = await result.json();
    
    if (response.status === 'ok'){

      const option = JSON.stringify({
        addedFriends: response.owner.addedFriends,
        messages: response.owner.messages,
        name: response.owner.name,
        password: response.owner.password,
        profile: response.owner.profile,
        _id: response.owner._id,
        access_token: JSON.parse(localStorage.getItem('token')).access_token
      })
      
      localStorage.setItem('token', option)
    } else {
      alert('Error in adding')
    }

  }

  return (
    <div className="App">
      <BrowserRouter>
        <Data.Provider value={{
          handleButton, socket, BASE,
          loggedIn, setLoggedIn, 
          savedUsers, setSavedUsers, 
          allUsers, setAllUsers,
          callAllUsers, callSavedUsers
        }}>
          <Nav />
          <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Chat />} />
            <Route path='/chat/:roomID' element={<ChatRoom />} />
            <Route path='/users' element={<Users />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='*' element={<NoMatch />} />
          </Routes>
        </Data.Provider>
      </BrowserRouter>
    </div>
  )
}

export default App
