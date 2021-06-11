import { Avatar, IconButton } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import {Offline} from 'react-detect-offline';
import React, { useEffect } from 'react';
import Pusher from 'pusher-js';

import "./Chat.css";
import { useState } from 'react';
import axios from './axios';
import { useParams } from 'react-router-dom';

function Chat({detail}) {

    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [mes, setMes] = useState([]);
    const {id} = useParams();

    const updateMessage = (event) => {
        setMessage(event.target.value)
    }

    useEffect(() => {
        axios.get(`/api/v1/message/${id}`)
            .then(res => {setChatMessages(res.data); setMes(res.data.messages)})
            .catch(err => console.log(err));

    }, [id])

    useEffect(() => {
        const pusher = new Pusher('595f471dd7971c381aa7', {
            cluster: 'mt1'
          });
      
          var channel = pusher.subscribe('chat');
          channel.bind('updated', data => {
            setMes([...mes, data]);
          });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }, [mes])

    const submitMessage = (event) => {
        event.preventDefault();
        
        axios.post(`/api/v1/message/${id}`, {
            name: detail.displayName,
            message: message,
            uid: detail.uid
        }).catch(err => console.log(err));

          setMessage("");
    }

    const date = chatMessages.messages ? chatMessages.lastMessage.createdAt : "";

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/avataaars/${id}.svg`}/>
                <div className="chat__header__center">
                    <h3>{chatMessages.messages && chatMessages.name}</h3>
                    <p>{chatMessages.messages && `last seen ${date.substr(0, 10)} at ${date.substr(11, 8)}`}</p>
                </div>
                <div className="chat__header__right">
                <IconButton>
                    <SearchOutlined fontSize="small"/>
                </IconButton>
                <IconButton>
                    <AttachFileIcon fontSize="small" />
                </IconButton> 
                <IconButton>
                    <MoreVertIcon  fontSize="small"/>
                </IconButton>
                </div>
            </div>
            <div className="chat__body">
            <Offline>
                <p className="offline__message">You are currently offline</p>
            </Offline>
              {mes && mes.map((data) => {
                  return(
                <div key={data._id} className={(data.uid !== detail.uid) ? "chat__body__message" : "chat__body__message active"}>
                    <p>
                    {(data.uid !== detail.uid) && <span className="chat__message__name">{data.name}</span>}
                    {data.message}
                    <span className="chat__message__time">{data.createdAt.substr(11, 8)}</span>
                    </p>
                </div>)
              })}
            </div>
            <div className="chat__footer">
                <IconButton>
                    <InsertEmoticonIcon fontSize="small"/>
                </IconButton>               
                <form onSubmit={submitMessage}>
                    <input type="text" placeholder="Type a message"  onChange={updateMessage}  value={message}/>
                    <button type="submit"></button>
                </form>
                <IconButton>
                    <KeyboardVoiceIcon fontSize="small"/>
                </IconButton>
            </div>
        </div>
    )
}

export default Chat
