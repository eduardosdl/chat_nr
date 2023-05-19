import io from "socket.io-client";
import { useState, useEffect } from "react";

import CodeHighlighter from "./CodeHighlighter";

let socket;

export default function Home() {
  const [username, setUsername] = useState("");
  const [chosenUsername, setChosenUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = () => {
    fetch("/api/socket").finally(() => {
      socket = io();
      console.log("connectou");

      socket.on("newIncomingMessage", (msg) => {
        setMessages((currentMsg) => [
          ...currentMsg,
          { author: msg.author, message: msg.message },
        ]);
      });
    });
  };

  const sendMessage = () => {
    socket.emit("createdMessage", { author: chosenUsername, message });
    setMessages((currentMsg) => [
      ...currentMsg,
      { author: chosenUsername, message },
    ]);
    setMessage("");
  };

  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      if (message) {
        sendMessage();
      }
    }
  };

  const renderMessage = (message, index) => {
    if (message.startsWith("/code")) {
      const code = message.substring(6);

      return (
        <div key={index} className="bg-gray-200 p-4 my-2 rounded-lg">
          <CodeHighlighter code={code} />
        </div>
      );
    }

    return (
      <div
        key={index}
        className="w-full py-1 px-2 border border-gray-400 rounded-bl-md"
      >
        {message}
      </div>
    );
  };

  return (
    <div className="flex items-center p-4 mx-auto min-h-screen justify-center bg-gray-500">
      <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
        {!chosenUsername ? (
          <>
            <h3 className="font-bold text-white text-xl">
              Como você se chama ?
            </h3>
            <input
              type="text"
              placeholder="Identity..."
              value={username}
              className="p-3 rounded-md outline-none"
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={() => {
                setChosenUsername(username);
              }}
              className="bg-white rounded-md px-4 py-2 text-xl"
            >
              ok
            </button>
          </>
        ) : (
          <>
            <p className="font-bold text-white text-xl">
              Seu username: {username}
            </p>
            <div className="flex flex-col justify-end bg-white h-[35rem] w-[60%] rounded-md shadow-md ">
              <div className="h-full last:border-b-0 overflow-y-scroll">
                {messages.map((msg, i) => {
                  return (
                    <div className="mb-5 ml-3" key={i}>
                      {msg.author}
                      {renderMessage(msg.message, i)}
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-300 w-full flex rounded-bl-md">
                <input
                  type="text"
                  placeholder="Nova menssagem..."
                  value={message}
                  className="outline-none py-2 px-2 rounded-bl-md flex-1"
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyUp={handleKeypress}
                />
                <div className="border-l border-gray-300 flex justify-center items-center  rounded-br-md group hover:bg-purple-500 transition-all">
                  <button
                    className="group-hover:text-white px-3 h-full"
                    onClick={() => {
                      sendMessage();
                    }}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
