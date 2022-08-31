import React, { useEffect, useState} from 'react'
import styled from "styled-components"
import { getAuth, onAuthStateChanged } from "firebase/auth";



const ProfileDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`


const Profile = () => {

    const [user, setUser] = useState();
    useEffect(()=> {

        const authorize = getAuth();
        onAuthStateChanged(authorize, (user) => {
        if (user) {
            console.log(user);
            setUser(user);
        } else {
            // User is signed out
        }
        });
    }, [])


  return (
    <ProfileDiv>
        {user && 
            <React.Fragment>
                 <img style={{borderRadius: '50%'}} width='100' height='100' src={user.photoURL} alt="Profile Pic"/>
            </React.Fragment>
        }
    </ProfileDiv>
  )
}

export default Profile