import { ThemedCard } from "@/components/ThemedCard";
import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import * as Contacts from "expo-contacts";
import { formatDate } from "date-fns";
import { ThemedChip } from "@/components/ThemedChip";
import { ThemedView } from "@/components/ThemedView";
import { Collapsible } from "@/components/Collapsible";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { Settings } from "react-native-fbsdk-next";

// Ask for consent first if necessary
// Possibly only do this for iOS if no need to handle a GDPR-type flow
// Settings.setAppID("");
// import { AccessToken, LoginButton } from "react-native-fbsdk-next";

export const BirtdayFragment = () => {
  const [data, setData] = useState<Contacts.Contact[]>([]);
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      // console.log(status);
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          sort: Contacts.SortTypes.LastName,
          fields: [Contacts.Fields.Emails, Contacts.Fields.Birthday],
        });

        const birthdayContacts = data.filter((contact) => contact.birthday);
        if (data.length > 0) {
          setData(birthdayContacts);
        }
      }
    })();
  }, []);

  return (
    <ThemedCard style={styles.card}>
      {/* show all contact in flatlist */}
      <Collapsible title="Phone Birthday">
        <ThemedScrollView style={{ maxHeight: 200 }}>
          {data.map(({ id, name, birthday }) => (
            <ThemedView
              key={id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <ThemedText>{name}</ThemedText>
              <ThemedChip
                text={formatDate(
                  new Date(
                    birthday?.year ?? 0,
                    birthday?.month ?? 0,
                    birthday?.day
                  ),
                  "dd-MM-yyyy"
                )}
              />
            </ThemedView>
          ))}
        </ThemedScrollView>
      </Collapsible>
      <Collapsible title="Facebook Birthday">
        {/* <LoginButton
          onLoginFinished={(error, result) => {
            if (error) {
              console.log("login has error: " + result.error);
            } else if (result.isCancelled) {
              console.log("login is cancelled.");
            } else {
              AccessToken.getCurrentAccessToken().then((data) => {
                console.log(data.accessToken.toString());
              });
            }
          }}
          onLogoutFinished={() => console.log("logout.")}
        /> */}
      </Collapsible>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
  },
});
