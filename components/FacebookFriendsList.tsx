import React from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { LoginButton } from "react-native-fbsdk-next";
import { useFacebookFriends } from "../hooks/useFacebookFriends";
import type { FacebookFriend } from "@/types/types";
import { ThemedCard } from "./ThemedCard";

export const FacebookFriendsList: React.FC = () => {
  const {
    friends,
    loading,
    error,
    isLoggedIn,
    handleLogin,
    handleLogout,
    refreshFriends,
  } = useFacebookFriends();

  const renderFriend = ({ item }: { item: FacebookFriend }) => (
    <ThemedCard className="p-4 mb-2">
      <Text className="text-lg font-semibold">{item.name}</Text>
      <Text className="text-gray-600">
        {item.birthday.toLocaleDateString()}
      </Text>
    </ThemedCard>
  );

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>Errore: {error.message}</Text>}

      <LoginButton
        permissions={["public_profile", "user_friends", "user_birthday"]}
        onLoginFinished={(error, result) => {
          if (!error && !result.isCancelled) {
            handleLogin();
          }
        }}
        onLogoutFinished={handleLogout}
      />

      {loading && !friends.length && (
        <Text style={styles.loading}>Caricamento amici...</Text>
      )}

      {isLoggedIn && (
        <FlatList
          data={friends}
          renderItem={renderFriend}
          keyExtractor={(item) => item.id}
          style={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshFriends} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  error: {
    color: "red",
    marginBottom: 16,
  },
  loading: {
    textAlign: "center",
    marginVertical: 16,
  },
  list: {
    flex: 1,
    marginTop: 16,
  },
});

export default FacebookFriendsList;
