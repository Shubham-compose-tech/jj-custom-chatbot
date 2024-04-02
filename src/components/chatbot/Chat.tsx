import { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MessageInput } from '@chatscope/chat-ui-kit-react';
import Messages from './Messages';
import styless from './chat.module.css';
import axios from 'axios';

export const Chat = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'system',
      message: `Hello! How can I help you today?`,
      direction: 'incoming',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const fetchApi = async (queryTxt: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://oc8ogahd5j.execute-api.us-west-2.amazonaws.com/products/details',
        {
          query: queryTxt,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.data;
      // console.log('data',data)
      const messageText =
        data.data?.keys ??
        data.data?.names ??
        data.data?.products ??
        data.data ??
        data.data.error;
      let formattedMessage: any;
      if (typeof messageText === 'string') {
        formattedMessage = messageText;
      } else if (Array.isArray(messageText)) {
        formattedMessage = messageText.join('\n'); // join for arrays
      } else {
        // Handle other data types (optional)
        formattedMessage = 'Invalid response received from server. Try again';
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'system',
          message: formattedMessage,
          direction: 'incoming',
        },
      ]);
    } catch (error) {
      setIsError(true);
      setErrorMsg('Timeout try again later');
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSend = async () => {
    setMessages([
      ...messages,
      {
        sender: 'user',
        message: query,
        direction: 'outgoing',
      },
    ]);
    await fetchApi(query);
    setQuery('');
  };

  const handleInputChange = (val: string) => {
    setQuery(val);
  };

  return (
    <div className={styless.container}>
      <Messages
        messages={messages}
        errorMsg={errorMsg}
        isError={isError}
        loading={loading}
      />

      <div className={styless['input-box']}>
        <MessageInput
          autoFocus
          placeholder="Type your message…"
          attachButton={false}
          value={query}
          onChange={handleInputChange}
          onSend={handleMessageSend}
        />
      </div>
    </div>
  );
};
