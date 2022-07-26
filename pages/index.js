import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import A from '../components/a';

// const a = io('http://localhost:5000/a');
// a.connect()
// a.disconnect();

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

    // socketMessages = io('ws://localhost:5000/messages', {
    //   auth: {
    //     token,
    //   },
    // });
  }

  useEffect(() => {
    // socket.on('connect', () => {
    //   const engine = socket.io.engine;
    //   console.log('chatList');
    if (token != '' && socketChats) {
      socketChats.connect();
      // socketMessages.connect();
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

      // const successCreateMessage = (result) => {};
      // const successGetMessages = ({ messagesList }) => {
      //   console.log('2asd');
      //   console.log(messagesList);
      //   setMessages(messagesList);
      // };

      // const messagesConnect = () => {
      //   // const chatId = '62d962372bed8e381c03a254';
      //   const chatId = chats[0] ? chats[0]._id : '';

      //   socketMessages.emit('get-messages-from-chat', chatId);

      //   socketMessages.on('success-create-message', successCreateMessage);

      //   socketMessages.on('success-get-messages', successGetMessages);
      // };
      // if (chats[0]) {
      //   socketMessages.on('connect', messagesConnect);
      // }
      return () => {
        socketChats.disconnect();
        // socketMessages.disconnect();

        // socketChats.off('connect', chatsConnect);
        // socketChats.off('success-create-chat', successCreateChat);
        // socketChats.off('success-get-chats', successGetChats);

        // socketMessages.off('connect', messagesConnect);
        // socketMessages.off('success-create-message', successCreateMessage);
        // socketMessages.off('success-get-messages', successGetMessages);
      };
    }
    // });
  }, [token, socketChats, chats]);

  const renderChat = () => {
    return msg.map(({ id, content, userId }, i) => (
      <div key={i}>
        <h3>
          <span>{id}</span>
          <span>{content}</span>
          <span>{userId}</span>
        </h3>
      </div>
    ));
  };

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const createChat = async () => {
    const id = '62d956493c133f34eec5aa44';
    socketChats.emit('create-chat', id);
  };

  const getChats = async () => {
    socketChats.emit('get-chats-from-user');
  };
  console.log(chats)

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
            <div key={i}>{chat._id}</div>
          ))}
        </div>
      ) : (
        'Yok'
      )}

      {token != '' && chats[0] && socketChats && (
        <A token={token} chats={chats} socketMessages={socketChats} />
      )}

      {/* <form onSubmit={onMessageSubmit}>
        <input
          type="text"
          value={state.name}
          onChange={(e) => onTextChange(e)}
          name="name"
        />
        <input
          type="text"
          value={state.message}
          onChange={(e) => onTextChange(e)}
          name="message"
        />

      </form>
      {chat.map(({ id, msgList, users }, i) => (
        <div key={i}>
          <h3>
            {id}
            <span>
              {msgList.map((m, i) => (
                <div key={i}>{m}</div>
              ))}
            </span>
          </h3>
          <span>
            {users.map((m, i) => (
              <div key={i}>{m}</div>
            ))}
          </span>
        </div>
      ))}
      <h1>Chat Log</h1>
      {renderChat()} */}
    </div>
  );
}
