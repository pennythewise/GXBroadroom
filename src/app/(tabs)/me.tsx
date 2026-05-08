import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { MOCK_USER } from '@/mock/data';

export default function MeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.md }]}>
      <Text style={styles.heading}>{MOCK_USER.name}</Text>
      <Text style={styles.sub}>Profile coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.md,
  },
  heading: {
    color: Colors.textPrimary,
    fontSize: Typography.h1,
    fontWeight: '700',
  },
  sub: {
    color: Colors.textMuted,
    fontSize: Typography.body,
    marginTop: Spacing.sm,
  },
});
