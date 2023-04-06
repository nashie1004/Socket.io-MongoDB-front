import React, {useContext} from 'react'
import {Data} from '../App';
import {Link} from 'react-router-dom'

export default function Users() {
  const {handleButton, loggedIn, allUsers} = useContext(Data)

  return (
    <div className='Users'>
      {
        loggedIn ? (
          <>
            <p className='heading'>Connect with other users</p>
            <div className="card-container">
              {
                allUsers.map((item, i) => {
                  return <div key={i} className='user-card'>
                    <img src={item.profile} alt={item.name} />
                    <p className='card-title'>{item.name}</p>
                    {
                      item.added ? (
                        <button 
                          onClick={() => handleButton(item.name, item.added, item.profile)}
                          className='danger-btn'>
                          Remove User
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleButton(item.name, item.added, item.profile)}
                          className='add-btn'>
                          Add User
                        </button>
                      )
                    }
                  </div>
                })
              }
            </div>
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
