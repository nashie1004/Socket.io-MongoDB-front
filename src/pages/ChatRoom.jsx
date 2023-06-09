import React, {useState, useContext, useEffect, useRef} from 'react'
import { Data } from '../App';
import { useParams, Link } from "react-router-dom";

export default function ChatRoom() {
  const {loggedIn, socket, savedUsers, BASE} = useContext(Data)
  const [currentMessage, setCurrentMessage] = useState('');
  const [messagesArray, setMessagesArray] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  let params = useParams();
  let testRef = useRef(null)

  socket.off('sendMessageToClient').on('sendMessageToClient', (data) => {
    setMessagesArray(prev => [...prev, {
      name: data.name, 
      message: data.message,
      time: data.time,
      profile: data.profile
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
            console.log('Error in saving conversation')
          }
        }
      }

    } else console.log('not log in')
  }, [params])

  function handleMessage(){
    if (currentMessage !== ''){
      socket.emit('sendMessageToServer', {
        message: currentMessage, time: new Date().toLocaleTimeString(),
        profile: JSON.parse(localStorage.getItem('token')).profile,
        room: params.roomID, name: JSON.parse(localStorage.getItem('token')).name
      })
      setCurrentMessage('')
    }
  }

  return (
    <div className='ChatRoom'>
      {
        loggedIn ? (
          <>
            <div className='chat-left'>
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

                  return <div key={i} className='display-user' 
                    style={{background: params.roomID === socketID ? 'rgb(46, 92, 130, 0.35)' : 'none'}}
                  >
                    <img src={item.profile} alt={item.name} />
                    <Link to={`/chat/${socketID}`}>
                      {item.name}
                    </Link>
                  </div>
                })
              }
            </div>
            <div className='chat-right'>
              <div className="msgs-box-main">
              {
                  !loadingMessages ? (
                    messagesArray.map((item, i) => {
                      if (item.name === JSON.parse(localStorage.getItem('token')).name){
                        return <div key={i} className='L-right'>
                          <div className="msg-content">
                            {item.message}
                            <span className='msg-time'>
                              {item.time}
                            </span>
                          </div>
                          <div className="img">
                            <img src={item.profile} alt={item.name} />
                          </div>
                        </div>
                      } else {
                        return <div key={i} className='L-left'>
                          <div className="img">
                            <img src={item.profile} alt={item.name} />
                          </div>
                          <div className="msg-content">
                            {item.message}
                            <span className='msg-time'>
                              {item.time}
                            </span>
                          </div>
                        </div>
                      }
                    })
                  ) : (
                    <p className='loading'>Loading...</p>
                  )
                }
              </div>
              <div className="msgs-controls">
                <input 
                  value={currentMessage}
                  onChange={e => setCurrentMessage(e.target.value)}
                  type="text" placeholder='Message' />
                <button onClick={handleMessage}>Send</button>
              </div>
            </div>
          </>
        ) : (
          <p>Not Logged In</p>
        )
      }
    </div>
  )
}
