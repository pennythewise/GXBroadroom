import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];
type Tab = 'favourites' | 'recent';

const TRANSFER_TYPES: { id: string; icon: IoniconsName; label: string }[] = [
  { id: 'account', icon: 'business-outline',       label: 'Account\nnumber' },
  { id: 'mobile',  icon: 'phone-portrait-outline',  label: 'Mobile' },
  { id: 'mykad',   icon: 'person-circle-outline',   label: 'MyKad' },
  { id: 'others',  icon: 'apps-outline',            label: 'Others' },
];

function EmptyIllustration() {
  const c = Colors.textMuted;
  return (
    <Svg width={160} height={130} viewBox="0 0 160 130">
      {/* decorative + signs */}
      <SvgText x="38" y="28" fill={c} fontSize="18" fontWeight="300">+</SvgText>
      <SvgText x="22" y="62" fill={c} fontSize="18" fontWeight="300">+</SvgText>

      {/* head */}
      <Circle cx="88" cy="52" r="32" fill="none" stroke={c} strokeWidth="1.5" />
      {/* arc (crescent inside head) */}
      <Path d="M76 42 Q82 32 96 40" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />

      {/* eyes */}
      <Circle cx="80" cy="58" r="2.5" fill="#4CAF50" />
      <Circle cx="96" cy="58" r="2.5" fill="#4CAF50" />

      {/* neck + body lines */}
      <Path d="M68 84 Q55 100 48 116" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M88 84 Q88 100 88 116"  fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M108 84 Q118 100 124 116" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      {/* shoulder curve */}
      <Path d="M62 84 Q88 96 114 84" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

const EMPTY_COPY = {
  favourites: {
    title: 'No favourites found',
    sub: 'Favourites you add from your transactions and recent recipients will be shown here.',
  },
  recent: {
    title: 'No recent transfers',
    sub: 'Your recent transfer recipients will appear here once you send money.',
  },
};

export default function SendMoneyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('favourites');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerSide}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send money</Text>
        <TouchableOpacity style={styles.headerSide}>
          <Ionicons name="ellipsis-horizontal" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* ── Transfer type row ── */}
      <View style={styles.transferRow}>
        {TRANSFER_TYPES.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={styles.transferItem}
            activeOpacity={0.7}
            onPress={() => t.id === 'account' && router.push('/send-money-account')}
          >
            <View style={styles.transferCircle}>
              <Ionicons name={t.icon} size={26} color={Colors.textPrimary} />
            </View>
            <Text style={styles.transferLabel}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Tabs ── */}
      <View style={styles.tabRow}>
        {(['favourites', 'recent'] as Tab[]).map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, tab === key && styles.tabActive]}
            onPress={() => setTab(key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Empty state ── */}
      <View style={styles.emptyState}>
        <EmptyIllustration />
        <Text style={styles.emptyTitle}>{EMPTY_COPY[tab].title}</Text>
        <Text style={styles.emptySub}>{EMPTY_COPY[tab].sub}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  headerSide: {
    width: 40,
    alignItems: 'center',
    padding: Spacing.xs,
  },
  headerTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '700',
    textAlign: 'center',
  },

  // ── Transfer types ──
  transferRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  transferItem: {
    alignItems: 'center',
    gap: Spacing.sm,
    width: 72,
  },
  transferCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E1A32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transferLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    textAlign: 'center',
    lineHeight: 16,
  },

  // ── Tabs ──
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: 22,
  },
  tabActive: {
    backgroundColor: Colors.accent,
  },
  tabText: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.textPrimary,
  },

  // ── Empty state ──
  emptyState: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  emptySub: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
});
