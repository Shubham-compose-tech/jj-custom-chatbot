import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MessageInput } from '@chatscope/chat-ui-kit-react';
import Messages from './Messages';
import styless from './chat.module.css';

const messages = [
  {
    sender: 'system',
    message: `Hello! How can I help you today?`,
    direction: 'incoming',
    sentTime: 'just now',
  },
  {
    sender: 'user',
    message: 'how are you doing?',
    direction: 'outgoing',
    sentTime: 'just now',
  },
];

export const Chat = () => {
  return (
    <div className={styless.container}>
      <Messages messages={messages} loading={false} />

      <MessageInput
        autoFocus
        placeholder="Type your message…"
        attachButton={false}
      />
    </div>
  );
};
