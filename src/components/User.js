import React, {useEffect, useState} from 'react'
import styled from "styled-components"
import {onSnapshot, doc} from "firebase/firestore"
import {db, auth} from "../firebase"


const UserWrapper = styled.div`
    border-bottom: 2px solid #000000;
    padding: 10px;
    cursor: pointer;

    &:hover {
        background-color: #778899;
    }

    &.selected {
        background-color: #778899;
    }
`

const UserInfo = styled.div`
    display: flex;
    align-items: center;
`

const LastMessageP = styled.p`
  font-size: 14px;
  white-space: nowrap;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
`

const LastMessageStrong = styled.strong`
    margin-right: 7px;
    margin-left: 10px;

`

const UnreadMessage = styled.small`
    margin-left: 10px;
    background: #0084ff;
    color: white;
    padding: 2px 4px;
    border-radius: 10px;
`



const User = ({user, selectUser, chat}) => {
    const user2 = user?.uid;
    const user1 = auth.currentUser?.uid;
    const [data, setData] = useState(''); // this will hold the last msg

    useEffect(() => {
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        let unsub = onSnapshot(doc(db, "lastMessage", id), (doc) => {
            setData(doc.data());
        })

        return () => unsub();
    }, [])


  return (
    <UserWrapper className={`${user.name === chat.name ? 'selected' : ""}`} onClick={() => selectUser(user)}>
        <UserInfo>
            <img width='50' height='50' style={{borderRadius: '50%'}} src={user.photoURL} alt="Profile pic"/>
            <p style={{marginLeft: '10px'}}>{user.name}</p>
            {data?.from !== user1 && data?.unread && (
                <UnreadMessage>~New~</UnreadMessage>
            )}

        </UserInfo>
        {data && (
            <LastMessageP className='truncate'>
                <LastMessageStrong>{data.from === user1 ? "Me: " : null}</LastMessageStrong>
                {data.text}
            </LastMessageP>
        )}
    </UserWrapper>
  )
}

export default User