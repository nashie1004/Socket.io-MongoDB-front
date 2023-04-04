import React, {useContext} from 'react'
import {Data} from '../App';
import {Link} from 'react-router-dom'

export default function Chat() {
  const {handleButton, loggedIn, savedUsers} = useContext(Data)
  
  return (
    <div className='Chat'>
      <p className='heading'>Connected Users</p>
      {
        loggedIn ? (
          <>
            {
              savedUsers.length !== 0 ? (
                <div className="card-container">
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
                        <div className='user-card' key={i}>
                          <img src={item.profile} alt={item.name} />
                          <div style={{color: '#69F5FF', fontSize: '.8rem'}}>
                            Chat with 
                            <br/>
                            <Link to={`/chat/${socketID}`} key={i}
                            className='card-title'>
                              {item.name}
                            </Link>
                          </div>
                          <button 
                            onClick={() => handleButton(item.name, true, item.profile)}
                            className='danger-btn'>
                            Remove User
                          </button>
                        </div>
                      )
                    })
                  }
                </div>
              ) : (
                <>
                  <p>No Connected User yet</p>
                </>
              )
            }
          </>
        ) : (
          <>
            <p>Not Logged In -Chat</p>
          </>
        )
      }
    </div>
  )
}
