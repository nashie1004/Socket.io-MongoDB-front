import React, {useContext} from 'react'
import {Data} from '../App';

export default function Users() {
  const {handleButton, loggedIn, allUsers} = useContext(Data)

  return (
    <div className='Users'>
      <p className='heading'>Connect with other users</p>
      {
        loggedIn ? (
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
        ) : (
          <>
            <p>Not Logged In -Users</p>
          </>
        )
      }
    </div>
  )
}
