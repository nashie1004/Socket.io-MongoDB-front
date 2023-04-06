import React, {useContext} from 'react'
import {Data} from '../App';
import {Link} from 'react-router-dom'

export default function Chat() {
  const {handleButton, loggedIn, savedUsers} = useContext(Data)
  
  return (
    <div className='Chat'>
      {
        loggedIn ? (
          <>
            <p className='heading'>Connected Users</p>
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
                <Link to='/users' style={{color: '#69F5FF'}}>
                  No connected users yet, chat with others now.
                </Link>
              )
            }
          </>
        ) : (
          <div className='notFound'>
            <p className='heading'>Not Logged In</p>
            <div>
              <Link to='/register'>
                Register
              </Link> or <Link to='/login'>
                Login
              </Link>
            </div>
          </div>
        )
      }
    </div>
  )
}
