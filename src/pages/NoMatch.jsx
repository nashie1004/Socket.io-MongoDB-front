import React from 'react'
import {Link} from 'react-router-dom'

export default function NoMatch() {
  return (
    <div className='NoMatch'>
      <p className='heading'>Page not Found</p>
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
