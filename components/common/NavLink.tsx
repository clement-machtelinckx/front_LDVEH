// components/base/NavLink.tsx
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';

type Props = {
  title: string;
  href: string;
  style?: ViewStyle;
};

export default function NavLink({ title, href, style }: Props) {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push(href)} style={style}>
      <Text style={styles.link}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 12,
  },
});
