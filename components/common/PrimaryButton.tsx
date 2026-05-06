// components/common/PrimaryButton.tsx
import { StyleSheet, View, Button, ViewStyle } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
};

export default function PrimaryButton({ title, onPress, style, disabled }: Props) {
  return (
    <View style={[styles.wrapper, disabled && styles.disabled, style]}>
      <Button title={title} onPress={onPress} disabled={disabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
