import React, {useContext} from 'react'
import styled from "styled-components";
import {NavLink} from 'react-router-dom';
import {auth} from "../firebase.js"
import { signOut } from 'firebase/auth';
import { AuthContext } from '../context/auth.js';
import Searchbar from './Searchbar.js';
import img from "../NoProfilePic.jpeg"
import tmdb from "../tmdbLogo.svg"


const Nav = styled.nav`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    padding: 0px 20px;
    background: rgb(95,10,135);
    background: linear-gradient(342deg, rgba(95,10,135,1) 31%, rgba(164,80,139,1) 69%);
    border-bottom: 2px solid #ffffff;
`

const Div = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
    
const StyledNavLink = styled(NavLink)`
  padding: 7px;
  font-size: 22px;
  color: #FFFFFF;
  text-decoration: none;
  font-family: 'Dosis', sans-serif;

  &:hover {
    text-decoration: underline;
  }
`

const ProfilePic = styled.img`
    border-radius: 50%;
    width: 45px;
    height: 45px;
    padding: 7px;
`

const LogOutButton = styled.button`
    border-radius: 5px;
    color: black;
    font-weight: bold;
    font-family: 'Dosis', sans-serif;
    font-size: 18px;
    margin-left: 10px;
    padding: 5px;
    background-color: #90EE90;
    /* background: rgb(180,58,141);
    background: linear-gradient(342deg, rgba(180,58,141,1) 18%, rgba(48,110,236,1) 52%, rgba(90,199,245,1) 79%); */
    border: none;
    cursor: pointer;
    transition: all 0.2 ease;

    &:hover {
        transform: scale(1.10);
    }



`


const Navbar = () => {
    const {user} = useContext(AuthContext);

    const handleSignOut = async () => {
        await signOut(auth);
    }


  return (
    <Nav>
        <Div>
            <h3>
                <StyledNavLink style={{fontFamily: "'Trade Winds', cursive", fontSize: '34px'}}to="/home">Raterz!</StyledNavLink>
            </h3>
            <img style={{marginLeft: '2em'}} width="150" height="100" src={tmdb} alt="no photo"/>
        </Div>
        
        <Searchbar/>
        <Div>
            {user ? 
            <>
                <StyledNavLink to="/messages">Messages</StyledNavLink>
                <StyledNavLink to="/myRatings">myRatings</StyledNavLink>
                <ProfilePic src={auth.currentUser.photoURL ? auth.currentUser.photoURL : img} alt="No Profile Pic"/>
                <LogOutButton onClick={handleSignOut}>logout</LogOutButton>            
            </>     :
            <>
                <StyledNavLink to="/login">Login</StyledNavLink>
            </>
            }
            
        </Div>
    </Nav>
  )
}

export default Navbar