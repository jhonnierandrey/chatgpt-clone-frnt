import React from "react";

type ChatMessageProps = {
  message: any;
};

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <>
      <p className={`${message.user === "user" ? "send" : "receive"}`}>
        {message.message}
      </p>
    </>
  );
};

export default ChatMessage;
