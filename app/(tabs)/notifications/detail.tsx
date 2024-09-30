import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";

const DetailNotification: React.FC = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Detail</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DetailNotification;
