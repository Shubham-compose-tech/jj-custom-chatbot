import { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
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
    {
      sender: 'user',
      message: 'give me details for my query',
      direction: 'outgoing',
    },
  ]);
  const[loading,setLoading] = useState(false)
  

  const checkAndFormatData = (data: any): string => {
    // Handle strings directly
    if (typeof data === 'string') {
      return data;
    }
  
    // Handle arrays of strings
    if (Array.isArray(data) && data.every(item => typeof item === 'string')) {
      return data.join('\n'); // Join with newline for clear separation
    }
  
    // Handle arrays of objects (assuming objects have 'name' property)
    if (Array.isArray(data) && data.every(item => typeof item === 'object')) {
      const messageText = [];
      for (const product of data) {
        const { name, color = 'Not available' } = product || {}; // Destructure with default value
        messageText.push(`${name} (color: ${color})`);
      }
      return messageText.join('\n');
    }
  
    // Handle objects with dynamic keys (nested properties can be handled here)
    if (typeof data === 'object' && !Array.isArray(data)) {
      const messageText = [];
      for (const key in data) {
        // Customize message formatting based on key and value type (optional)
        messageText.push(`${key}: ${data[key]}`);
      }
      return messageText.join('\n\n'); // Use double newline for better separation between entries
    }
  
    // Handle other data types or unexpected structures (optional)
    return 'Data type not recognized.';
  };
  


  const fetchApi = async (queryTxt:string) => {
    setLoading(true)
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
      

      const [key] = Object.keys(data.data)
      console.log('key',key)
      const messageText = data.data?.keys ?? data.data?.names ?? data.data?.products ?? data.data ?? data.data.error;
      let formattedMessage:any;
      if (typeof messageText === 'string') {
        formattedMessage = messageText;
      } else if (Array.isArray(messageText)) {
        formattedMessage = messageText.join('\n'); // join for arrays
      } else {
        // Handle other data types (optional)
        formattedMessage = 'Invalid response received from server. Try again';
      }
      console.log('foramt',formattedMessage)

      setMessages((prevMessages)=>[
        ...prevMessages, 
        {
          sender: 'system',
          message: formattedMessage,
          direction: 'incoming',
        },
      ]);
      
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }finally {
      setLoading(false);
    }
  };
  // console.log('outer-msgs',messages)

  const handleMessageSend = async() => {
      setMessages([
        ...messages,
        {
          sender: 'user',
          message: query,
          direction: 'outgoing',
        },
      ]);
      // console.log('messagesss',messages)
      await fetchApi(query)
      setQuery('');
  };

  const handleInputChange = (val:string) => {
    // console.log('query',val)
    setQuery(val);
  };


  return (
    <div className={styless.container}>
      <Messages messages={messages} loading={false} />

      {loading? (
        <TypingIndicator content="generating response" />
      ) :(<MessageInput
        autoFocus
        placeholder="Type your message…"
        attachButton={false}
        value={query}
        onChange={handleInputChange}
        onSend={ handleMessageSend}
      />)}
    </div>
  );
};
