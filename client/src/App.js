// @ts-nocheck
import "./App.css";
import io from "socket.io-client";
import React, { useState } from "react";
import Chat from "./Chat";

//connect to back-end
// @ts-ignore
const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      // emit an event in socket.io from front-end:
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div>
          <h3>Join a chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => setUsername(event.target.value)}
          />
          {/* only people, joinde the room, can talk to each other */}
          <input
            type="text"
            placeholder="Room id..."
            onChange={(event) => setRoom(event.target.value)}
          />
          <button
            onClick={joinRoom}
            onKeyDown={(event) => {
              event.key === "Enter" && joinRoom();
            }}
          >
            Join a room
          </button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
