// components/common/PrimaryButton.tsx
import { StyleSheet, View, Button, ViewStyle } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
};

export default function PrimaryButton({ title, onPress, style }: Props) {
  return (
    <View style={[styles.wrapper, style]}>
      <Button title={title} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
    width: '100%',
  },
});
