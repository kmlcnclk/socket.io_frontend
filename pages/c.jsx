import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';



function C() {
  const [datas, setDatas] = useState([]);
  const [input, setInput] = useState([]);
const socket = io('https://socket-io-backend-kc.herokuapp.com');
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log("data");

        socket.on('sends', (data) => {
          console.log(data);
          setDatas(data);
        });
      });
    }
  }, [socket]);

  const submitFunc = (e) => {
    e.preventDefault();

    socket.emit('send', input);
  };

  return (
    <div>
      <form onSubmit={submitFunc}>
        <input type="text" onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
      {datas[0] && (
        <div>
          {datas.map((data, i) => (
            <div key={i}>{data}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default C;
