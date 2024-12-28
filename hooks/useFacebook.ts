import * as Facebook from 'expo-auth-session/providers/facebook';
import { useState, useEffect } from 'react';

const useFacebookBirthdays = () => {
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: '590774426934850',
    scopes: ['user_friends', 'user_birthday']
  });

  const [facebookBirthdays, setFacebookBirthdays] = useState([]);
  const [error, setError] = useState(null);

  const getFacebookBirthdays = async (token) => {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/me/friends?fields=id,name,birthday&access_token=${token}`
      );
      const data = await response.json();

      const birthdays = data.data
        .filter(friend => friend.birthday)
        .map(friend => ({
          id: friend.id,
          name: friend.name,
          birthday: new Date(friend.birthday),
          source: 'facebook'
        }));

      setFacebookBirthdays(birthdays);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.authentication;
      getFacebookBirthdays(access_token);
    }
  }, [response]);

  return {
    facebookBirthdays,
    error,
    login: () => promptAsync(),
  };
};

export default useFacebookBirthdays;