// components/common/BurgerMenu.tsx
import React, { useState } from 'react';
import { View, Modal, Pressable, TouchableOpacity, Text, StyleSheet, Platform, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

type Item = {
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress?: () => void;     // action directe
  href?: string;            // /route interne OU URL externe (http/https)
  destructive?: boolean;
  trailing?: React.ReactNode;
};

type Props = {
  items?: Item[];
  size?: number;
  color?: string;
  menuWidth?: number;
  placement?: 'top-right' | 'bottom-right';
  topOffset?: number;
  bottomOffset?: number;
  rightOffset?: number;
  onNavigate?: (path: string) => void; // ex: (p) => router.push(p)
};

async function openExternalTab(url: string) {
  try {
    await WebBrowser.openBrowserAsync(url, {
      showTitle: true,
      enableBarCollapsing: true,
      dismissButtonStyle: 'close', // iOS
      // toolbarColor: '#111827',   // Android (optionnel)
    });
  } catch {
    // fallback si Custom Tabs/SafariView indispo
    await Linking.openURL(url);
  }
}

export default function BurgerMenu({
  items = [],
  size = 26,
  color = '#111',
  menuWidth = 260,
  placement = 'bottom-right',
  topOffset = 64,
  bottomOffset = 64,
  rightOffset = 8,
  onNavigate,
}: Props) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(o => !o);
  const close = () => setOpen(false);

  const handleItemPress = async (item: Item) => {
    close();

    // 1) action directe si fournie
    if (item?.onPress) {
      item.onPress();
      return;
    }

    // 2) navigation via href
    if (item?.href) {
      const isExternal = /^https?:\/\//i.test(item.href);
      if (isExternal) {
        await openExternalTab(item.href);
      } else if (onNavigate) {
        onNavigate(item.href);
      } else {
        // dernier recours si pas de onNavigate fourni
        Linking.openURL(item.href).catch(() => {});
      }
    }
  };

  const positionStyle =
    placement === 'bottom-right'
      ? { bottom: bottomOffset, right: rightOffset }
      : { top: topOffset, right: rightOffset };

  return (
    <>
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel="Ouvrir le menu"
        hitSlop={8}
        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, paddingHorizontal: 6, paddingVertical: 6 }]}
      >
        <MaterialCommunityIcons name="menu" size={size} color={color} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close} />
        <View style={[styles.menuContainer, positionStyle, { width: menuWidth }]}>
          {items.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.item, item.destructive && styles.destructiveItem]}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.6}
            >
              <MaterialCommunityIcons
                name={item.icon || 'dots-horizontal'}
                size={22}
                color={item.destructive ? '#b42318' : '#1f2937'}
                style={{ marginRight: 12 }}
              />
              <Text style={[styles.itemText, item.destructive && styles.destructiveText]}>
                {item.label}
              </Text>
              {item.trailing ? <View style={{ marginLeft: 'auto' }}>{item.trailing}</View> : null}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position:'absolute', top:0, left:0, right:0, bottom:0,
    backgroundColor:'rgba(0,0,0,0.15)'
  },
  menuContainer: {
    position:'absolute',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  item: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginVertical: 2,
  },
  itemText: { fontSize: 16, color: '#111827' },
  destructiveItem: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(244,63,94,0.08)' : 'transparent'
  },
  destructiveText: { color: '#b42318' },
});
