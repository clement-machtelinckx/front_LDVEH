import { StyleSheet } from 'react-native';

const borderBlack = '#000'; // Border color for black
const border = '#ddd'; // Default border color
const backgroundColor = '#fff'; // Background color for cards
const appBackground = '#eee'; // General app background color


export const globalStyles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: appBackground,
    padding: 24,
    
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: backgroundColor,
    borderColor: border,
    borderWidth: 1,
    borderRadius: 8,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: backgroundColor,
  },
  card: {
    backgroundColor: backgroundColor,
    borderColor: border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  topCard: {
    backgroundColor: backgroundColor,
    padding: 16,
    margin: 16,
    borderColor: border,
    borderWidth: 1,
    borderRadius: 12,
    gap: 8,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: border,
    fontWeight: '600',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
    titleCenter: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
    label: {
    fontWeight: 'bold',
  },
});
