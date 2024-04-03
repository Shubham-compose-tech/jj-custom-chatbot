import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MessageList,
  Message,
  TypingIndicator,
  Avatar,
} from '@chatscope/chat-ui-kit-react';
import styless from './chat.module.css';

const Messages = ({ messages, loading, errorMsg, isError }: any) => {
  const handleCopy = (
    e: React.ClipboardEvent<HTMLDivElement>,
    message: string
  ) => {
    e.clipboardData.setData('text/plain', message);
    e.preventDefault();
  };

  return (
    <div className={styless['messages-container']}>
      <MessageList
        autoScrollToBottom={false}
        typingIndicator={
          loading && (
            <TypingIndicator
              content="typing"
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
            onCopy={(e: React.ClipboardEvent<HTMLDivElement>) =>
              handleCopy(e, message.message)
            }
          >
            <Avatar
              name={message.sender}
              src={
                message.sender === 'system'
                  ? 'https://chatscope.io/storybook/react/assets/joe-v8Vy3KOS.svg'
                  : 'https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg'
              }
            />
          </Message>
        ))}
        {isError && (
          <Message
            model={{
              message: errorMsg,
              sender: 'system',
              direction: 'incoming',
              position: 2,
            }}
            className={styless['message-box']}
          >
            <Avatar
              name={'system'}
              src={
                'https://chatscope.io/storybook/react/assets/joe-v8Vy3KOS.svg'
              }
            />
          </Message>
        )}
      </MessageList>
    </div>
  );
};

export default Messages;
