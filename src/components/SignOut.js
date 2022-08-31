import React from 'react'
import { auth } from "../firebase.js"
import {Button} from "@mui/material" 


function SignOut() {
  return (
    <div> 
        <Button onClick={() => auth.signOut()}>Log Out</Button>
    </div>
  )
}

export default SignOut