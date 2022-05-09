// @ts-nocheck
import React, { useEffect, useState } from "react";

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  //listen if there are any changes in a socket.io
  useEffect(() => {
    // listen to an event called "receive_message"
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live chat</p>
      </div>
      <div
        className="chat-body"
      >
        {messageList.map((messageContent, index) => {
          return (
            <div
              key={index}
              className="message"
              id={username === messageContent.author ? "sender" : "receiver"}
            >
              <div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        {/* HTML arrow symbol */}
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
