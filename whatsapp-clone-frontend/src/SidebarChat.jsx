import { Avatar } from '@material-ui/core';
import axios from './axios';
import React from 'react';

import './SidebarChat.css';
import { Link} from 'react-router-dom';

function SidebarChat({addButton, name, lastMessage, id}) {

  
    const addChat = () => {
        const chatName = prompt("Enter chat name");
        if(chatName)
        {
            axios.post("/api/v1/chat", {
                name: chatName
            }).then(res => console.log(res.status))
              .catch(err => console.log(err))
        }
    };

    return !addButton ? (
         <Link to={`/chat/${id}`}>
              <div className="sidebar__chat">
                 <Avatar src={`https://avatars.dicebear.com/api/avataaars/${id}.svg`} />
                    <div className="chat__message">
                    <h4>{name}</h4>
                    <p>{`${lastMessage.name}: ${lastMessage.message}`}</p>
                    </div>
            </div>
         </Link>
    ) : (
        <div onClick={addChat} className="sidebar__chat">
           <h2>Add new chat</h2>
        </div>
    )
}

export default SidebarChat
