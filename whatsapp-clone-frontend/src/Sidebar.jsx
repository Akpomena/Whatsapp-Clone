import React, { useEffect, useState } from 'react';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import Pusher from 'pusher-js';

import './Sidebar.css';
import { Avatar } from '@material-ui/core';
import SidebarChat from './SidebarChat';
import axios from './axios';

function Sidebar({detail}) {

    const [chat, setChat] = useState([]);

    useEffect(() => {
        axios.get("/api/v1/chat")
            .then(res => setChat(res.data))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        
        const pusher = new Pusher('595f471dd7971c381aa7', {
            cluster: 'mt1'
          })

          const channel = pusher.subscribe("chat");
          channel.bind("insertion", data => {
              setChat([...chat, data]);
          })

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }, [chat])

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={detail.photoURL}/>
                <div className="sidebar__header__buttons">
                    <IconButton>
                        <DonutLargeIcon fontSize="small"/>
                    </IconButton>
                    <IconButton>                      
                        <ChatIcon fontSize="small" />
                    </IconButton>
                    <IconButton>                       
                        <MoreVertIcon fontSize="small"/>
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
               <div className="sidebar__search_area">
                    <SearchOutlinedIcon fontSize="small"/>
                    <input type="text" placeholder="Search for chat"/>
               </div>
            </div>
            <div className="sidebar__chats">
                <SidebarChat addButton={true}/>
                {chat && chat.map(data => <SidebarChat key={data._id} id={data._id} name={data.name} lastMessage={data.lastMessage} />)}
            </div>
        </div>
    ) 
}

export default Sidebar
