import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function A({ token, chats, socketMessages }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // let socketMessages = io('ws://localhost:5000/messages', {
  //   auth: {
  //     token,
  //   },
  // });

  const getMessages = async () => {
    // const chatId = '62d962372bed8e381c03a254';
    const chatId = chats[0] ? chats[0]._id : '';

    socketMessages.emit('get-messages-from-chat', chatId);
  };
  const createMessage = async () => {
    const chatId = chats[0] ? chats[0]._id : '';
    const content = input;

    console.log(input);

    await socketMessages.emit('create-message', chatId, content);
    // socketMessages.off('create');
  };

  useEffect(() => {
    if (socketMessages) {
      socketMessages.connect();

      const successCreateMessage = (result) => {};
      const successGetMessages = ({ messagesList }) => {
        console.log('2asd');
        console.log(messagesList);
        setMessages(messagesList);
      };

      const messagesConnect = () => {
        // const chatId = '62d962372bed8e381c03a254';
        const chatId = chats[0] ? chats[0]._id : '';

        socketMessages.emit('get-messages-from-chat', chatId);

        socketMessages.on('create-message', successCreateMessage);

        socketMessages.on('get-messages-from-chat', successGetMessages);
      };
      if (chats[0]) {
        socketMessages.on('connect', messagesConnect);
      }
    }
    return () => {
      socketMessages.disconnect();
    };
    // });
  }, [token, socketMessages, chats]);

  return (
    <div>
      <input type="text" onChange={(e) => setInput(e.target.value)} />

      <button onClick={createMessage}>Create Message</button>
      <button onClick={getMessages}>Get Messages</button>
      {messages[0] ? (
        <div>
          {messages?.map((chat, i) => (
            <div key={i}>
              <div>{chat.content}</div>
            </div>
          ))}
        </div>
      ) : (
        'Yok'
      )}
    </div>
  );
}

export default A;
