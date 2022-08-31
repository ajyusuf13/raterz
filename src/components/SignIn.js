import React from 'react'
import firebase from "firebase/compat/app"
import {auth, db} from "../firebase.js"
import { useNavigate } from 'react-router-dom'
import styled from "styled-components"


const SignInButton = styled.button`
    font-family: 'Fredoka One', cursive;
    font-size: 25px;
    border: none;
    background-image: linear-gradient(90deg, rgba(234,67,53,1) 17%, rgba(251,188,5,1) 50%, rgba(52,168,83,1) 75%, rgba(66,133,244,1) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    cursor: pointer;

    transition: all 0.2s ease;

    &:hover {
        transform: scale(1.1);

    }



`


function SignIn() {

    const navigate = useNavigate();
    function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(resp => {
              db.collection("users").doc(auth.currentUser.uid).set(
                {uid : auth.currentUser.uid,
                  name : auth.currentUser.displayName,
                  email : auth.currentUser.email,
                  photoURL : auth.currentUser.photoURL
                }, {merge: true});
              navigate("/home");

            });
    }


  return (
      <SignInButton onClick={signInWithGoogle}>Sign In With Google</SignInButton>
  )
}

export default SignIn