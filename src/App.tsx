import "./styles/App.scss";
import { useEffect, useState } from "react";
import ChatMessage from "./components/ChatMessage";
import { chatgptlogo } from "./assets/images/chatgptlogo";

function App() {
  const [models, setModels] = useState([]);
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState<any>([
    {
      user: "gpt",
      message: "How can I help you today?",
    },
  ]);

  const [currentModel, setCurrentModel] = useState("text-davinci-003");

  const clearChats = () => {
    setChatLog([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.length <= 3) return;
    // update chat log to include latest prompt
    let newChatLog = [...chatLog, { user: "user", message: input }];
    setChatLog([...newChatLog]);
    setInput("");

    const messages = newChatLog
      .map((message: any) => message.message)
      .join("\n");

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
        currentModel,
      }),
    });

    const data = await response.json();

    // update chatlog to include chat-gpt response
    if (response.ok && data.message !== "") {
      setChatLog([...newChatLog, { user: "gpt", message: data.message }]);
    } else {
      setChatLog([
        ...newChatLog,
        { user: "gpt", message: "ChatGPT is not available right now" },
      ]);
    }
  };

  const getEngines = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/models`)
      .then((response) => response.json())
      .then((data) => setModels(data.models));
  };

  useEffect(() => {
    getEngines();
  }, []);

  return (
    <div className="App">
      <nav>
        <span></span>
        <span>{chatgptlogo}</span>
        <span className="btn-new-chat" onClick={clearChats}>
          <i className="fas fa-edit"></i>
        </span>
      </nav>
      <section className="chat-body-container">
        {chatLog.map((message: any, index: any) => (
          <ChatMessage message={message} key={index} />
        ))}
      </section>
      <div className="chat-input-container">
        <form onSubmit={(e) => handleSubmit(e)} className="form">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className={`btn-submit ${input.length >= 3 && "active"}`}
            disabled={input.length >= 3 ? false : true}
          >
            <i className="fas fa-arrow-up"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
