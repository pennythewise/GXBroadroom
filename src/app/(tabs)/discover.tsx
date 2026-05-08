import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';

export default function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Discover</Text>

      {/* Boardroom subscription card — Sprint 3 UI */}
      <View style={styles.boardroomCard}>
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
        <Text style={styles.cardTitle}>GX Boardroom</Text>
        <Text style={styles.cardSubtitle}>Your AI financial co-pilot</Text>
        <Text style={styles.cardPrice}>RM4.90/mo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: Spacing.md,
  },
  heading: {
    color: Colors.textPrimary,
    fontSize: Typography.h1,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  boardroomCard: {
    backgroundColor: Colors.boardroomCard,
    borderWidth: 1,
    borderColor: Colors.boardroomBorder,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  newBadge: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.small,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    alignSelf: 'flex-start',
  },
  newBadgeText: {
    color: Colors.textPrimary,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.h2,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
  },
  cardPrice: {
    color: Colors.accentLt,
    fontSize: Typography.body,
    fontWeight: '600',
  },
});
