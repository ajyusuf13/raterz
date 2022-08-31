import React, {useState, useEffect} from 'react'
import SignOut from './SignOut'
import SendMessage from "./SendMessage"
import {db} from "../firebase.js"

function Chat() {

    const [messages, setMessages] = useState([])

    useEffect(() => {
        db.collection("messages").orderBy("createdAt").limit(50)
        .onSnapshot(snapshot => {
            setMessages(snapshot.docs.map(doc => doc.data()))
        })
    }, [])
  return (
    <div>
        <SignOut/>
        {messages.map(({id, text, photoURL, uid}) => (
            <div key={id}>
                <img src={photoURL} alt="profile pic"/>
                <p>{text}</p>
            </div>
        ))}
        <SendMessage/>
    </div>
  )
}

export default Chat