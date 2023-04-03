import React, {useContext} from 'react'
import {Data} from '../App';
import {Link} from 'react-router-dom'

export default function Chat() {
  const {handleButton, loggedIn, savedUsers} = useContext(Data)
  
  return (
    <div className='Chat'>
      <h2>CONNECTED USERS: </h2>
      {
        loggedIn ? (
          <>
            {
              savedUsers.map((item, i) => {
                const LOCAL_STORAGE = JSON.parse(localStorage.getItem('token'))
                const lower = LOCAL_STORAGE.name.localeCompare(item.name)
                let socketID = ''

                if (lower == -1){
                  socketID = `${LOCAL_STORAGE.name}-${item.name}` 
                } else {
                  socketID = `${item.name}-${LOCAL_STORAGE.name}`
                } //

                return (
                  <div style={{border: '1px solid black', margin: '1rem'}} key={i}>
                    <img src={item.profile} alt={item.name} />
                    <p>UserName: {item.name}</p>
                    <Link to={`/chat/${socketID}`} key={i}>
                      SocketID: {socketID}
                    </Link>
                    <br/>
                    <button 
                      onClick={() => handleButton(item.name, true, item.profile)}
                      style={{background: 'red'}}>
                      Remove User
                    </button>
                  </div>
                )
              })
            }
          </>
        ) : (
          <>
            <p>Not Logged In Chat</p>
          </>
        )
      }
    </div>
  )
}
