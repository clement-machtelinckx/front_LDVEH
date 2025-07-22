import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '@/styles/global';


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
    <View style={globalStyles.topCard}>
      <Text style={styles.name}>{name}</Text>
      <Text>⚔️ Habileté : {ability} | ❤️ Endurance : {endurance}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 18, fontWeight: 'bold' },
  adventure: { marginTop: 8, fontStyle: 'italic' },
  noAdventure: { color: '#777' },
});