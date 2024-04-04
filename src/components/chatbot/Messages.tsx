import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MessageList,
  Message,
  TypingIndicator,
  Avatar,
} from '@chatscope/chat-ui-kit-react';
import styless from './chat.module.css';

const Messages = ({ messages, loading }: any) => {
  const handleCopy = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const selectedText = window.getSelection()?.toString() ?? '';
    e.clipboardData?.setData('text/plain', selectedText);
  };

  return (
    <div className={styless['messages-container']}>
      <MessageList
        autoScrollToBottom={false}
        typingIndicator={
          loading && (
            <TypingIndicator
              content="generating response"
              className={styless['typing-indicator']}
            />
          )
        }
      >
        {messages?.map((message: any, index: number) => (
          <Message
            key={index}
            model={message}
            className={styless['message-box']}
            onCopy={(e: React.ClipboardEvent<HTMLDivElement>) => handleCopy(e)}
          >
            <Avatar
              name={message.sender}
              src={
                message.sender === 'system'
                  ? '/static/images/ai-bot.png'
                  : 'https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg'
              }
            />
          </Message>
        ))}
      </MessageList>
    </div>
  );
};

export default Messages;
