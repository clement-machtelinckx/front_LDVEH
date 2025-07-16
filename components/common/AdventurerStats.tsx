import { View, Text, StyleSheet } from 'react-native';

type Props = {
    name: string;
    ability: number;
    endurance: number;
    bookTitle?: string;
    currentPage?: number;
};
export default function AdventurerStats({
  name,
  ability,
  endurance,
  bookTitle,
  currentPage,
}: Props) {
  return (
    <View style={styles.stats}>
      <Text style={styles.name}>{name}</Text>
      <Text>⚔️ Habileté : {ability} | ❤️ Endurance : {endurance}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stats: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    margin: 16,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 12,
    gap: 8,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  adventure: { marginTop: 8, fontStyle: 'italic' },
  noAdventure: { color: '#777' },
});