import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import A from '../components/a';

export default function Home() {
  const [state, setState] = useState({ message: '', name: '' });
  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState([]);
  const [lastMsg, setLastMessage] = useState('');
  const [otherU, setOtherUser] = useState('');
  const [token, setToken] = useState('');

  // const token =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWhtZXQgw4dlbGlrIiwidXNlcm5hbWUiOiJhaG1ldGNlbGlrNjYwMTkzMzM5NSIsImZvbGxvd2VycyI6MCwiZm9sbG93aW5nIjowLCJlbWFpbCI6ImJAdGVieXkuY29tIiwiZW1haWxWZXJpZmllZCI6ZmFsc2UsInBob25lVmVyaWZpZWQiOmZhbHNlLCJwYXNzd29yZCI6IiQyYiQxMCRDYW91QXhndmtUZ0lEQXA0VlpGa2kuV0ozZ2FvRUU0ekM3QXFvLmxUdnFVUEwxZGNMTWxteSIsImJpcnRoRGF0ZSI6eyJkYXkiOjIzLCJtb250aCI6Ik1heSIsInllYXIiOjIwMDJ9LCJwaG9uZSI6IiIsImNoYXRzIjpbXSwic3RhdHVzIjpbXSwiX2lkIjoiNjJkOTU2NTMzYzEzM2YzNGVlYzVhYTQ5IiwiY3JlYXRlZEF0IjoiMjAyMi0wNy0yMVQxMzozNjoxOS4zODhaIiwidXBkYXRlZEF0IjoiMjAyMi0wNy0yMVQxMzozNjoxOS4zODhaIiwiX192IjowLCJzZXNzaW9uIjoiNjJkOTU2NTMzYzEzM2YzNGVlYzVhYTRiIiwiaWF0IjoxNjU4NDEwNTc5LCJleHAiOjE2NTk3MDY1Nzl9.82G0D-6VWx2EmWfflUPjUWeMEXuWH4hDe4gDess3-0w';

  let socketChats;
  if (token != '') {
    socketChats = io('ws://localhost:5000/chats', {
      auth: {
        token,
      },
    });
  }

  useEffect(() => {
    if (token != '' && socketChats) {
      socketChats.connect();

      const successCreateChat = (result) => {
        console.log(result);
      };

      const successGetChats = ({ chatList, otherUser, lastMessage }) => {
        // console.log('chat', chatList);
        if (chatList) setChats(chatList);
        if (otherUser) setOtherUser(otherUser);
        if (lastMessage) setLastMessage(lastMessage);
      };

      const chatsConnect = () => {
        console.log('1asd');
        socketChats.emit('get-chats-from-user');
        socketChats.on('create-chat', successCreateChat);
        socketChats.on('get-chats-from-user', successGetChats);
      };
      socketChats.on('connect', chatsConnect);

      return () => {
        socketChats.disconnect();
      };
    }
    // });
  }, [token, socketChats, chats]);

  const createChat = async () => {
    const id = '62d956493c133f34eec5aa44';
    socketChats.emit('create-chat', id);
  };

  const getChats = async () => {
    socketChats.emit('get-chats-from-user');
  };

  return (
    <div>
      <input type="text" onChange={(e) => setToken(e.target.value)} />
      <button onClick={createChat}>Create Chat</button>
      <button onClick={getChats}>Get Chats</button>

      {/* {otherU != '' ? <div>{otherU.username}</div> : null} */}
      {/* {lastMsg != '' ? <div>{lastMsg.content}</div> : null} */}
      {chats[0] ? (
        <div>
          {chats?.map((chat, i) => (
            <Link
              key={i}
              href={{
                pathname: '/chats/[chatId]',
                query: { chatId: chat._id, token: token },
              }}

              // href={`/chats/${chat._id}`}
            >
              <a>
                <div>{chat._id}</div>
              </a>
            </Link>
          ))}
        </div>
      ) : (
        'Yok'
      )}

      {token != '' && chats[0] && socketChats && (
        <A token={token} chats={chats} socketMessages={socketChats} />
      )}
    </div>
  );
}
