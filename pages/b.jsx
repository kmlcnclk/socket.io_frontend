// http://localhost:5000/chat/getChatsFromUser

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [state, setState] = useState({ message: '', name: '' });
  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState([]);
  const [lastMsg, setLastMessage] = useState('');
  const [otherU, setOtherUser] = useState('');
  const [token, setToken] = useState('');

  // const token =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWhtZXQgw4dlbGlrIiwidXNlcm5hbWUiOiJhaG1ldGNlbGlrNjYwMTkzMzM5NSIsImZvbGxvd2VycyI6MCwiZm9sbG93aW5nIjowLCJlbWFpbCI6ImJAdGVieXkuY29tIiwiZW1haWxWZXJpZmllZCI6ZmFsc2UsInBob25lVmVyaWZpZWQiOmZhbHNlLCJwYXNzd29yZCI6IiQyYiQxMCRDYW91QXhndmtUZ0lEQXA0VlpGa2kuV0ozZ2FvRUU0ekM3QXFvLmxUdnFVUEwxZGNMTWxteSIsImJpcnRoRGF0ZSI6eyJkYXkiOjIzLCJtb250aCI6Ik1heSIsInllYXIiOjIwMDJ9LCJwaG9uZSI6IiIsImNoYXRzIjpbXSwic3RhdHVzIjpbXSwiX2lkIjoiNjJkOTU2NTMzYzEzM2YzNGVlYzVhYTQ5IiwiY3JlYXRlZEF0IjoiMjAyMi0wNy0yMVQxMzozNjoxOS4zODhaIiwidXBkYXRlZEF0IjoiMjAyMi0wNy0yMVQxMzozNjoxOS4zODhaIiwiX192IjowLCJzZXNzaW9uIjoiNjJkOTU2NTMzYzEzM2YzNGVlYzVhYTRiIiwiaWF0IjoxNjU4NDEwNTc5LCJleHAiOjE2NTk3MDY1Nzl9.82G0D-6VWx2EmWfflUPjUWeMEXuWH4hDe4gDess3-0w';

  useEffect(() => {
    if (token != '') {
      fetch('https://twitter-clone-backend-kc.herokuapp.com/chat/getChatsFromUser', {
        method: 'GET',

        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setChats(data.chatList);
        })
        .catch((err) => console.log(err));
    }
  }, [token, chats]);

  console.log('====================================');
  console.log(chats);
  console.log('====================================');
  return (
    <div>
      <input type="text" onChange={(e) => setToken(e.target.value)} />
      {/* <button onClick={createChat}>Create Chat</button> */}
      {/* <button onClick={getChats}>Get Chats</button> */}

      {chats[0] ? (
        <div>
          {chats?.map((chat, i) => (
            <Link
              key={i}
              href={{
                pathname: '/[chatId]',
                query: { chatId: chat._id, token: token },
              }}
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
    </div>
  );
}
