import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MessageList,
  Message,
  TypingIndicator,
  Avatar,
} from '@chatscope/chat-ui-kit-react';
import styless from './chat.module.css';

const Messages = ({ messages, loading }: any) => {
  return (
    <div className={styless['messages-container']}>
      <MessageList
        typingIndicator={loading && <TypingIndicator content="typing" />}
      >
        {messages?.map((message: any, index: number) => (
          <Message key={index} model={message}>
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
      </MessageList>
    </div>
  );
};

export default Messages;
