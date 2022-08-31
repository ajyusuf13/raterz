import React, {useEffect, useState} from 'react'
import {db, auth, storage} from '../firebase'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styled from "styled-components"
import User from '../components/User';
import Message from '../components/Message';
import SendMessage from '../components/SendMessage';
import firebase from "firebase/compat/app"
import {ref, getDownloadURL, uploadBytes} from "firebase/storage"
import {query, onSnapshot, orderBy, collection, getDoc, updateDoc, doc} from "firebase/firestore"


const MessagesScreenContainer = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 1fr 3fr;
    overflow: hidden;
    height: calc(100vh - 70px);
    width: 100vw;
`

const UserContainer = styled.div`
    border-right: 2px solid #000000;
    overflow-y: auto;
`

const ChatContainter = styled.div`
    position: relative;
    width: 100%;
`

const MessagesUser = styled.div`
    padding:10px;
    text-align: center;
    border-left: 1px solid #ffffff;
    border-bottom: 1px solid #ffffff;
    background: rgb(17,187,44);
background: linear-gradient(90deg, rgba(17,187,44,1) 28%, rgba(43,21,230,1) 113%);
`

const AllMessagesDiv = styled.div`
    height: calc(100vh - 225px);
    overflow-y: auto;
    border-bottom: 1px solid #5ac7f5;
`

const StyledH3 = styled.h3`
    margin: 20px;
    padding: 20px;
    text-align: center;
    font-family: 'Dosis', sans-serif;

`

export const Messages = () => {

    const [users, setUsers] = useState([]);
    const [chat, setChat] = useState("");   // this will hold the user that is being chatted with
    const [text, setText] = useState("");
    const [image, setImage] = useState("");
    const [messages, setMessages] = useState([]);
    const user1 = auth.currentUser?.uid;

    useEffect(()=>{
        const authorize = getAuth();
        onAuthStateChanged(authorize, (user) => {
            if (user) {
                const usersRef = db.collection("users");
                // create query obj
                usersRef.where('uid', 'not-in', [auth.currentUser?.uid]).get().then((querySnapshot) => {
                    let users = []
                    querySnapshot.forEach(doc => {
                        users.push(doc.data())
                    });
                    setUsers(users);
                })
            } else {
                // User is signed out
            }
        });
    }, [])

    const selectUser = async (user) => {
        setChat(user);
        console.log(user);

        const user2 = user.uid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

        const messagesRef = collection(db, "messages", id, "chat");
        const q = query(messagesRef, orderBy("createdAt", "asc"));
        onSnapshot(q, querySnapshot => {
            let msgs = [];
            querySnapshot.forEach(doc => {
                msgs.push(doc.data());
            })
            setMessages(msgs);
        })

        // get last message between the loggen in user and the selected user
        const docSnap = await getDoc(doc(db, "lastMessage", id));
        // checking to see if the last message exists
        if (docSnap.data() && docSnap.data().from !== user1) {
            updateDoc(doc(db, "lastMessage", id), {
                unread : false
            })
        }
    }       

    console.log(messages);

    const handleSubmit = async e => {
        e.preventDefault();
        const user2 = chat.uid;
        // make document id
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

        let url;
        if (image) {
            const imageRef = ref(storage, `images/${new Date().getTime()} - ${image.name}`)
            const snap = await uploadBytes(imageRef, image);
            const downloadUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
            url = downloadUrl;
        }


        await db.collection("messages").doc(id).collection("chat").add({
            text,
            from: user1,
            to: user2,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            media: url || ""
        })
        setText("");

        await db.collection("lastMessage").doc(id).set({
            text,
            from: user1,
            to: user2,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            media: url || "",
            unread: true
        })
    }
    
  return (
    <MessagesScreenContainer>
        <UserContainer>
            {users.map(user => <User key={user.uid} user={user} selectUser={selectUser} chat={chat}/>
            )}
        </UserContainer>
        <ChatContainter>
            {chat ? (
                <>
                    <MessagesUser>
                    <h3>{chat.name}</h3>
                    </MessagesUser>
                    <AllMessagesDiv>
                        {messages.length ? messages.map((message, i) => <Message key={i} message={message} user1={user1}/>)
                            : null
                        }
                    </AllMessagesDiv>
                    <SendMessage 
                        handleSubmit={handleSubmit} 
                        text={text} 
                        setText={setText}
                        setImage={setImage}
                    />
                </>
                
            ) : (
                <StyledH3>Select a user to start chatting with !</StyledH3>
            )}
        </ChatContainter>
    </MessagesScreenContainer>
    
  )
}



export default Messages;