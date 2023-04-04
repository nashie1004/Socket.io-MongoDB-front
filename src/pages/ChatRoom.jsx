import React, {useState, useContext, useEffect, useRef} from 'react'
import { Data } from '../App';
import { useParams, Link } from "react-router-dom";

const BASE = 'http://localhost:3001'

export default function ChatRoom() {
  const {loggedIn, socket, savedUsers} = useContext(Data)
  const [currentMessage, setCurrentMessage] = useState('');
  const [messagesArray, setMessagesArray] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
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
      setLoadingMessages(true)
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
          setLoadingMessages(false)
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
  }, [params])

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
          <>
            <div className="users-scrollbar">
              {
                savedUsers.map((item, i) => {
                  const LOCAL_STORAGE = JSON.parse(localStorage.getItem('token'))
                  const lower = LOCAL_STORAGE.name.localeCompare(item.name)
                  let socketID = ''

                  if (lower == -1){
                    socketID = `${LOCAL_STORAGE.name}-${item.name}` 
                  } else {
                    socketID = `${item.name}-${LOCAL_STORAGE.name}`
                  } 

                  return <div key={i} className='display-user'>
                    <img src={item.profile} alt={item.name} />
                    <Link to={`/chat/${socketID}`}>
                      {item.name}
                    </Link>
                  </div>
                })
              }               
            </div>
            <div className="chat-container">
              {/* 
              ADD THIS: 
              window.scrollTo(0, document.body.scrollHeight);
              */}
              <div className="messages-main-container">
                {
                  !loadingMessages ? (
                    messagesArray.map((item, i) => {
                      return <div key={i} className='L'>
                        {item.name}: {item.message} <span style={{fontSize: '.7rem'}}>{item.time}</span>
                      </div>
                    })
                  ) : (
                    <>
                      <p>Loading...</p>
                    </>
                  )
                }
              </div>
              <div className='controls'>
                <input 
                  onChange={e => setCurrentMessage(e.target.value)}
                  type="text" placeholder='Message' />
                <button onClick={handleMessage}>Send</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p>Not Logged In -ChatRoom</p>
          </>
        )
      }
    </div>
  )
}
