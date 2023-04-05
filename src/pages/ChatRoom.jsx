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
            <div className='chat-left'>
              <span>Lorem, ipsum.</span><span>Explicabo, optio.</span><span>Ipsam, facilis?</span><span>Illo, iure!</span><span>Tenetur, dolorem?</span><span>Obcaecati, fuga?</span><span>Earum, consequatur.</span><span>Similique, asperiores?</span><span>Quia, et.</span><span>Beatae, quibusdam.</span>
            </div>
            <div className='chat-right'>
              <div className="msgs-box-main">
                <p>Lorem.</p>
                <p>Odio!</p>
                <p>At.</p>
                <p>A!</p>
                <p>Perspiciatis?</p>
                <p>Harum?</p>
                <p>Saepe?</p>
                <p>Odit?</p>
                <p>Assumenda!</p>
                <p>Repellat.</p>
                <p>Recusandae?</p>
                <p>Facilis.</p>
                <p>Numquam!</p>
                <p>Distinctio?</p>
                <p>Quo.</p>
                <p>Accusamus.</p>
                <p>Labore!</p>
                <p>Inventore.</p>
                <p>Sapiente.</p>
                <p>Alias.</p>
                <p>Blanditiis.</p>
                <p>Numquam.</p>
                <p>Tempore!</p>
                <p>Praesentium!</p>
                <p>Repellat.</p>
                <p>Quasi.</p>
                <p>Quod.</p>
                <p>Laboriosam?</p>
                <p>Odit.</p>
                <p>Non?</p>
              </div>
              <div className="msgs-controls">
                <input type="text" />
                <button>test</button>
              </div>
            </div>
            {/* <div className="users-scrollbar"> */}
              {/*
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
              */}               
            {/* </div>
            <div className="chat-container"> */}
              {/* <div className="messages-main-container">
                {
                  !loadingMessages ? (
                    messagesArray.map((item, i) => {
                      if (item.name === JSON.parse(localStorage.getItem('token')).name){
                        return <div key={i} className='L-right'>
                          <p className="message-right">
                            {item.name}: {item.message} <div style={{fontSize: '.7rem'}}>{item.time}</div>
                          </p>
                        </div>
                      } else {
                        return <div key={i} className='L-left'>
                          <p className="message-left">
                            {item.name}: {item.message} <div style={{fontSize: '.7rem'}}>{item.time}</div>
                          </p>
                        </div>
                      }
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
              </div> */}
            {/* </div> */}
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
