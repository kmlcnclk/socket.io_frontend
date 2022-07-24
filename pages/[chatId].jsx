import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/router';

function ChatId() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [token, setToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [rst, setRst] = useState('');

  let socketMessages;

  if (token != '') {
    socketMessages = io('https://twitter-clone-backend-kc.herokuapp.com', {
      auth: {
        token,
      },
    });
  }

  const getMessages = () => {
    // const chatId = '62d962372bed8e381c03a254';

    socketMessages.emit('get-messages-from-chat', chatId);
  };
  const createMessage = () => {
    if (chatId != '') {
      const content = input;
      console.log(chatId);
      socketMessages.emit('create-message', chatId, content);
    }
  };

  useEffect(() => {
    if (router.query?.token) {
      setChatId(router.query.chatId);
      setToken(router.query.token);
    }
    if ((socketMessages && token != '', chatId)) {
      socketMessages.connect();

      const successCreateMessage = (result) => {
        setRst(result);
      };
      const successGetMessages = ({ messagesList }) => {
        console.log('2asd');
        setMessages(messagesList);
      };

      const messagesConnect = () => {
        // const chatId = '62d962372bed8e381c03a254';
        // const chatId = chats[0] ? chats[0]._id : '';

        socketMessages.emit('get-messages-from-chat', chatId);

        socketMessages.on('create-message', successCreateMessage);

        socketMessages.on('get-messages-from-chat', successGetMessages);
      };
      socketMessages.on('connect', messagesConnect);
      return () => {
        socketMessages.disconnect();
      };
    }

    // });
  }, [token, socketMessages, chatId, router]);

  console.log(messages);
  return (
    <div>
      <input type="text" onChange={(e) => setInput(e.target.value)} />
      {rst != '' && <div>{rst}</div>}
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

export default ChatId;
