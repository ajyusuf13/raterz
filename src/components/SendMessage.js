import React from 'react'
import styled from "styled-components"
import Attachment from './svg/Attachment.js'

const SendMessageForm = styled.form`
    position: absolute;
    bottom: 0;
    left: 20%;
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    margin-bottom: 15px;

`

const SendMessageInput = styled.input`
    width: 40vw;
    margin: 0px 10px 10px;
    padding: 10px;
    border-radius: 5px;
    outline: none;
    border: none;
`

const SendButton = styled.button`
    background-color: transparent;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    color: #5ac7f5;
    margin-bottom: 10px;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
    
`


function SendMessage({handleSubmit, text, setText, setImage}) {

  return (
    <div>
        <SendMessageForm onSubmit={handleSubmit}>
            <label htmlFor='img'>
                <Attachment/>
            </label>
            <input onChange={e => setImage(e.target.files[0])} type='file' id='img' style={{display: 'none'}}>
            </input>
            <SendMessageInput value={text} onChange={(e)=> setText(e.target.value)} placeholder="Message..."/>
            <SendButton type='submit'>SEND</SendButton>
        </SendMessageForm>

    </div>
  )
}

export default SendMessage