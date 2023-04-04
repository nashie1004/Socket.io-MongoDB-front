import React from 'react'
import {Link} from 'react-router-dom'

export default function NoMatch() {
  return (
    <div>
        <h2>Page not Found</h2>
        <Link to='/register'>Register</Link> or <Link to='/login'>Login</Link>
    </div>
  )
}
