import React, {useState, useContext, useEffect, useRef} from 'react'
import { Data } from '../App';
import { useParams } from "react-router-dom";

const BASE = 'http://localhost:3001'

export default function ChatRoom() {
  const {loggedIn, socket} = useContext(Data)
  const [currentMessage, setCurrentMessage] = useState('');
  const [messagesArray, setMessagesArray] = useState([]);
  let params = useParams();
  let testRef = useRef(null)

  socket.off('sendMessageToClient').on('sendMessageToClient', (data) => {
    setMessagesArray(prev => [...prev, {
      name: data.name, 
      message: data.message,
      time: data.time
    }])
  })

  //GLITCHY: SAVE MESSAGES FOR USEFFECT CLEANUP
  useEffect(() => {
    testRef.current = messagesArray
  }, [socket, messagesArray])

  //PRELOADS AND SAVES CONVO
  useEffect(() => {
    if (loggedIn){
      socket.emit('joinRoom', params.roomID)
      
      const LOCAL_STORAGE = JSON.parse(localStorage.getItem('token'))
      const room = params.roomID.split('-')
      let to = LOCAL_STORAGE.name !== room[0] ? room[0] : room[1] 
      
      loadConversation() 
      async function loadConversation(){
        const response = await fetch(BASE + '/getInitialConversation', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token: LOCAL_STORAGE.access_token,
            ownerName: LOCAL_STORAGE.name,
            toUserName: to,
          })
        })
        const res = await response.json()

        if (res.status === 'ok'){
          setMessagesArray(res.data.messages[to])
        }
      }

      return () => {
        
        saveConversation()
        async function saveConversation(){
          const response = await fetch(BASE + '/saveConversation', {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              token: LOCAL_STORAGE.access_token,
              ownerName: LOCAL_STORAGE.name,
              toUserName: to, 
              messagesArray: testRef.current
            })
          })
          const res = await response.json()
          if (res.status !== 'ok'){
            alert('Error in saving conversation')
          }
        }
      }

    } else console.log('not log in')
  }, [])

  function handleMessage(){
    if (currentMessage !== ''){
      socket.emit('sendMessageToServer', {
        message: currentMessage, time: new Date().toLocaleTimeString(),
        room: params.roomID, name: JSON.parse(localStorage.getItem('token')).name
      })
    }
  }

  return (
    <div className='ChatRoom'>
      {
        loggedIn ? (
          messagesArray.length !== 0 ? (
            <>
              <h2>ROOM: {params.roomID}</h2>
              <input 
                onChange={e => setCurrentMessage(e.target.value)}
                type="text" placeholder='Message' />
              <button onClick={handleMessage}>Submit Message</button>
              <h2>MESSAGES: </h2>
                {/* 
                ADD THIS: 
                window.scrollTo(0, document.body.scrollHeight);
                */}
                {
                  messagesArray.map((item, i) => {
                    return <p key={i}>
                      {item.name}: {item.message} <span style={{fontSize: '.7rem'}}>{item.time}</span>
                    </p>
                  })
                }
            </>
          ) : (
            <>
              <p>Loading...</p>
            </>
          )
        ) : (
          <>
            <p>Not Logged In -ChatRoom</p>
          </>
        )
      }
    </div>
  )
}
