import React, {useRef, useEffect} from 'react'
import styled from "styled-components"
import Moment from "react-moment"

const MessageWrapper = styled.div`
    margin: 0;
    padding: 0 10px;

    &.own {
        text-align: right;
    }
`

const MessageP = styled.p`
    padding: 10px;
    display: inline-block;
    max-width: 50%;
    text-align: left;
    border-radius: 5px;


    &.me {
        background: #0084ff;
        color: white;
    }

    &.otherUser {
        background: #32cd32;
        color: white;
    }
`

const MessageSmall = styled.small`
    display: inline-block;
    margin-top: 15px;
    opacity: 0.8;
`

const Message = ({message, user1}) => {

    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"})
    }, [message])

  return (
    <MessageWrapper className={`${message.from === user1 ? 'own' : ""}`} ref={scrollRef}>
        <MessageP className={`${message.from === user1 ? 'me' : 'otherUser'}`}>
            {message.media ? <img width='350' height='350' src={message.media} alt={message.text}/> : null}
            {message.text}
            <br />
            <MessageSmall>
                <Moment fromNow>{message.createdAt?.toDate()}</Moment>
            </MessageSmall>
        </MessageP>
    </MessageWrapper>
  )
}

export default Message