import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';

const BADGE_PINK = '#E91E8C';
const ICON_BG = '#1E1B2E';
const ICON_SIZE = 62;

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface ServiceItem {
  id: string;
  icon: IoniconName;
  label: string;
  badge?: string;
}

const sections: { title: string; items: ServiceItem[] }[] = [
  {
    title: 'Service',
    items: [
      { id: 'broadroom', icon: 'apps-outline', label: 'GX Broadroom', badge: 'NEW' },
    ],
  },
  {
    title: 'Spend',
    items: [
      { id: 'card', icon: 'card-outline', label: 'GX Card' },
      { id: 'secure', icon: 'lock-closed-outline', label: 'GXsecure' },
    ],
  },
  {
    title: 'Save',
    items: [
      { id: 'bonus', icon: 'time-outline', label: 'Bonus Pocket', badge: '3.55%' },
      { id: 'savings', icon: 'wallet-outline', label: 'Savings\nPockets' },
    ],
  },
  {
    title: 'Insurance',
    items: [
      { id: 'car', icon: 'car-outline', label: 'Car insurance', badge: 'RM100' },
      { id: 'cyber', icon: 'globe-outline', label: 'Cyber Fraud\nProtect' },
      { id: 'travel', icon: 'airplane-outline', label: 'Travel\ninsurance', badge: 'NEW' },
    ],
  },
];

function ItemTile({ item }: { item: ServiceItem }) {
  return (
    <TouchableOpacity style={styles.tile} activeOpacity={0.7}>
      <View style={styles.iconWrapper}>
        <View style={styles.iconCircle}>
          <Ionicons name={item.icon} size={28} color={Colors.textPrimary} />
        </View>
        {item.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.tileLabel}>{item.label}</Text>
    </TouchableOpacity>
  );
}

export default function DiscoverScreen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Discover</Text>

      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.row}>
            {section.items.map((item) => (
              <ItemTile key={item.id} item={item} />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  heading: {
    color: Colors.textPrimary,
    fontSize: Typography.h2,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  tile: {
    alignItems: 'center',
    width: ICON_SIZE + Spacing.lg,
  },
  iconWrapper: {
    position: 'relative',
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: BADGE_PINK,
    borderRadius: Radius.small,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeText: {
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tileLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.caption,
    textAlign: 'center',
    lineHeight: 16,
  },
});
