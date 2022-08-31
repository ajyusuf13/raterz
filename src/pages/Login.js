import React from 'react'
import SignIn from "../components/SignIn"
import styled from "styled-components"

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
`

const SignInDiv = styled.div`
  margin-top: 100px;
  display: block;
  font-family: 'Fredoka One', cursive;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #28282B	;
  height: 125px;
  width: 300px;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.99);

`

const SignInH3 = styled.h3`
  font-family: 'Cabin', sans-serif;
  color: white;
`


const Login = () => {
  return (
    <StyledDiv>
      <SignInDiv>
        <SignInH3>Sign In</SignInH3>
        <SignIn/>
      </SignInDiv>
        
    </StyledDiv>
  )
}

export default Login