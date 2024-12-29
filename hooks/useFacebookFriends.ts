import { FacebookError, FacebookFriend, UseFacebookFriendsReturn } from '@/types/types';
import { useState, useEffect, useCallback } from 'react';
import { AccessToken, GraphRequest, GraphRequestManager, Settings } from 'react-native-fbsdk-next';


export const useFacebookFriends = (): UseFacebookFriendsReturn => {
  const [friends, setFriends] = useState<FacebookFriend[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<FacebookError | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    Settings.initializeSDK();
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async (): Promise<void> => {
    try {
      const token = await AccessToken.getCurrentAccessToken();
      setIsLoggedIn(!!token);
      if (token) {
        fetchFriends(token.accessToken);
      }
    } catch (e) {
      setError({ message: e instanceof Error ? e.message : 'Unknown error occurred' });
    }
  };

  const fetchFriends = useCallback(async (accessToken: string): Promise<void> => {
    setLoading(true);
    setError(null);

    const graphRequest = new GraphRequest(
      '/me/friends',
      {
        accessToken,
        parameters: {
          fields: {
            string: 'id,name,birthday'
          }
        }
      },
      (graphError, result) => {
        if (graphError) {
          setError({
            message: graphError.toString(),
            code: typeof graphError === 'object' && graphError !== null ? (graphError as { code?: string }).code : undefined
          });
          setLoading(false);
          return;
        }

        let friendsWithBirthdays = (result?.data || []) as FacebookFriend[];
        friendsWithBirthdays.filter((friend: FacebookFriend) =>
          friend && friend.birthday && typeof friend.birthday === 'string'
        )
          .map((friend: FacebookFriend) => ({
            id: friend.id,
            name: friend.name,
            birthday: new Date(friend.birthday),
          }))
          .sort((a: FacebookFriend, b: FacebookFriend) => a.birthday.getTime() - b.birthday.getTime());

        setFriends(friendsWithBirthdays);
        setLoading(false);
      }
    );

    new GraphRequestManager().addRequest(graphRequest).start();
  }, []);

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      const token = await AccessToken.getCurrentAccessToken();
      if (token) {
        setIsLoggedIn(true);
        await fetchFriends(token.accessToken);
      }
    } catch (e) {
      setError({ message: e instanceof Error ? e.message : 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (): void => {
    setFriends([]);
    setIsLoggedIn(false);
    setError(null);
  };

  const refreshFriends = async (): Promise<void> => {
    const token = await AccessToken.getCurrentAccessToken();
    if (token) {
      await fetchFriends(token.accessToken);
    }
  };

  return {
    friends,
    loading,
    error,
    isLoggedIn,
    handleLogin,
    handleLogout,
    refreshFriends
  };
};