import React, {useContext} from 'react'
import {Data} from '../App';

export default function Users() {
  const {handleButton, loggedIn, allUsers} = useContext(Data)

  return (
    <div className='Users'>
      <h2>ALL USERS: </h2>
      {
        loggedIn ? (
          allUsers.map((item, i) => {
            return <div key={i} style={{border: "1px solid black", marginBottom: '1rem'}}>
              <img src={item.profile} alt={item.name} />
              <p>{item.name}</p>
              {
                item.added ? (
                  <button 
                    onClick={() => handleButton(item.name, item.added, item.profile)}
                    style={{background: 'red'}}>
                    Remove User
                  </button>
                ) : (
                  <button 
                    onClick={() => handleButton(item.name, item.added, item.profile)}
                    style={{background: 'lightblue'}}>
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
