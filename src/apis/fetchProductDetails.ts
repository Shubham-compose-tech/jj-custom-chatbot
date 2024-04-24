import axios from 'axios';

export const fetchProductDetails = async (queryTxt: string) => {
  try {
    const response = await axios.post(
      'https://oc8ogahd5j.execute-api.us-west-2.amazonaws.com/ai/query',
      { query: queryTxt },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.data.status === 400) {
      return response.data.message;
    }

    const data = response.data;
    const messageText = data.data ?? data.data.error;
    const formattedMessage =
      typeof messageText === 'string'
        ? messageText
        : 'Invalid response received from server. Try again';

    return formattedMessage;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};
