import 'regenerator-runtime';
import { useEffect, useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MessageInput } from '@chatscope/chat-ui-kit-react';
import Messages from './Messages';
import styless from './chat.module.css';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { IconMicrophone } from '@tabler/icons-react';
import { fetchProductDetails } from '../../apis/fetchProductDetails';

export const Chat = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'system',
      message: `Hello! How can I help you today?
      <br></br>
      Please provide the query in the below format <br></br>
      {QUERYFOR} : your query <br></br>
      where QUERYFOR describes type of data you want to query for (customers, products, orders) <br></br> 
      Example Query: customers: give first customer name`,
      direction: 'incoming',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Speech recognition is not supported.</span>;
  }

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const toggleListening = () => {
    if (!listening) {
      requestMicrophonePermission().then(() => {
        resetTranscript();
        SpeechRecognition.startListening();
      });
    } else {
      SpeechRecognition.stopListening();
    }
  };

  useEffect(() => {
    if (transcript) {
      // Update chatbot state with the recognized speech (transcript)
      setQuery(transcript);
    }
  }, [transcript]);

  const handleMessageSend = async () => {
    setMessages([
      ...messages,
      {
        sender: 'user',
        message: query,
        direction: 'outgoing',
      },
    ]);
    try {
      setLoading(true);
      const formattedMessage = await fetchProductDetails(query);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'system',
          message: formattedMessage,
          direction: 'incoming',
        },
      ]);
    } catch (error) {
      console.log('err', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'system',
          message: 'Timeout :-/ try again later',
          direction: 'incoming',
        },
      ]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  const handlePaste = (e: any) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    setQuery(query + text);
  };

  return (
    <div className={styless.container}>
      <div className={styless['messages-wrapper']}>
        <Messages messages={messages} loading={loading} />
      </div>

      <div className={styless['input-box']}>
        <MessageInput
          autoFocus
          placeholder={listening ? 'Listening..' : 'Type your message…'}
          attachButton={false}
          value={query}
          onChange={(val: string) => setQuery(val)}
          onSend={handleMessageSend}
          onPaste={handlePaste}
          style={{ flexGrow: 1 }}
        />

        <button
          className={`${styless['mic-button']} ${
            listening ? styless['ripple'] : ''
          }`}
          onClick={toggleListening}
        >
          <IconMicrophone color="#9ba9be" stroke={2} />
        </button>
      </div>
    </div>
  );
};
