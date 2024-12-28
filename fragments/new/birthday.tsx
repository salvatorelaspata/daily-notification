import { ThemedCard } from "@/components/ThemedCard";
import { ThemedText } from "@/components/ThemedText";

import { FlatList, StyleSheet } from "react-native";

import { formatDate } from "date-fns";
import { ThemedChip } from "@/components/ThemedChip";
import { ThemedView } from "@/components/ThemedView";
import { Collapsible } from "@/components/Collapsible";
import useContactBirthdays from "@/hooks/useContacts";
import { Contact } from "expo-contacts";

const BirthdayItem = ({
  name,
  birthday,
}: {
  name: Contact["name"];
  birthday: Contact["birthday"];
}) => (
  <ThemedView
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
    }}
  >
    <ThemedText>{name}</ThemedText>
    <ThemedChip
      text={formatDate(
        new Date(birthday?.year ?? 0, birthday?.month ?? 0, birthday?.day),
        "dd-MM-yyyy"
      )}
    />
  </ThemedView>
);

export const BirtdayFragment = () => {
  const { birthdays, error } = useContactBirthdays();

  return (
    <ThemedCard style={styles.card}>
      {/* show all contact in flatlist */}
      <Collapsible title="Phone Birthday">
        <ThemedView style={{ maxHeight: 140 }}>
          {error && <ThemedText>{error}</ThemedText>}
          {/* <FlatList
            data={birthdays}
            keyExtractor={(item) => item.id ?? item.name}
            renderItem={({ item }) => (
              <BirthdayItem name={item.name} birthday={item.birthday} />
            )}
            ListEmptyComponent={<ThemedText>No birthday contacts</ThemedText>}
          /> */}
          {birthdays.map((contact) => (
            <BirthdayItem
              key={contact.id ?? contact.name}
              name={contact.name}
              birthday={contact.birthday}
            />
          ))}
        </ThemedView>
      </Collapsible>
      <Collapsible title="Facebook Birthday"></Collapsible>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
  },
});
