import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { MOCK_WINDFALL, MOCK_GOAL, MOCK_SHIELDS } from '@/mock/data';

// ── Data contract — swap initialApproved + labels from API when backend is ready ──
interface ActionItem {
  id:              string;   // stable ID for backend sync
  title:           string;
  subtitle:        string;
  initialApproved: boolean;  // pre-approved state from backend
}

const ALLOCATION_DIRECTIVES: ActionItem[] = [
  {
    id:              'approve_windfall',
    title:           `Move windfall to Emergency Pocket`,
    subtitle:        `RM${MOCK_WINDFALL.amount} · Scout recommendation`,
    initialApproved: false,
  },
  {
    id:              'approve_goal_lock',
    title:           `Lock RM${MOCK_GOAL.daily_rate_needed}/day for ${MOCK_GOAL.name} goal`,
    subtitle:        `14-day auto-transfer · Architect fix`,
    initialApproved: true,
  },
];

const PROTECTIVE_SHIELDS: ActionItem[] = [
  {
    id:              'approve_shield',
    title:           MOCK_SHIELDS.catalog.car_resilience.label,
    subtitle:        `RM${MOCK_SHIELDS.catalog.car_resilience.price_mo}/mo · Sentinel detected petrol spike`,
    initialApproved: true,
  },
  {
    id:              'approve_allowance',
    title:           'Set Parent Allowance as priority',
    subtitle:        'Recurring transfer · RM300/month',
    initialApproved: false,
  },
];

function ActionRow({
  item,
  approved,
  onApprove,
}: {
  item: ActionItem;
  approved: boolean;
  onApprove: (id: string) => void;
}) {
  return (
    <View style={styles.actionRow}>
      <View style={styles.actionText}>
        <Text style={styles.actionTitle}>{item.title}</Text>
        <Text style={styles.actionSub}>{item.subtitle}</Text>
      </View>
      <TouchableOpacity
        style={[styles.actionBtn, approved && styles.actionBtnDone]}
        onPress={() => !approved && onApprove(item.id)}
        activeOpacity={approved ? 1 : 0.7}
      >
        <Text style={[styles.actionBtnText, approved && styles.actionBtnTextDone]}>
          {approved ? 'Done' : 'Approve'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ActionPlanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Local approval state — replace with store / API call when backend is ready
  const [approved, setApproved] = useState<Set<string>>(
    new Set([
      ...[...ALLOCATION_DIRECTIVES, ...PROTECTIVE_SHIELDS]
        .filter((i) => i.initialApproved)
        .map((i) => i.id),
    ]),
  );

  const approve = (id: string) => setApproved((prev) => new Set([...prev, id]));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Action plan</Text>
        <View style={styles.pageDots}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.pageDot, i === 2 && styles.pageDotActive]} />
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.topLabel}>ONE-TAP DECISIONS</Text>

        {/* ── A. Allocation Directives ── */}
        <Text style={styles.sectionLabel}>A. ALLOCATION DIRECTIVES</Text>
        <View style={styles.card}>
          {ALLOCATION_DIRECTIVES.map((item, idx) => (
            <View key={item.id}>
              <ActionRow item={item} approved={approved.has(item.id)} onApprove={approve} />
              {idx < ALLOCATION_DIRECTIVES.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* ── B. Protective Shields ── */}
        <Text style={styles.sectionLabel}>B. PROTECTIVE SHIELDS</Text>
        <View style={styles.card}>
          {PROTECTIVE_SHIELDS.map((item, idx) => (
            <View key={item.id}>
              <ActionRow item={item} approved={approved.has(item.id)} onApprove={approve} />
              {idx < PROTECTIVE_SHIELDS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* ── CTA ── */}
        <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85} onPress={() => router.push('/boardroom/future-self')}>
          <Text style={styles.ctaBtnText}>See your future self →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '700',
    marginLeft: Spacing.xs,
  },
  pageDots: { flexDirection: 'row', gap: 6, paddingRight: Spacing.sm },
  pageDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.textMuted },
  pageDotActive: { backgroundColor: Colors.textPrimary },

  // ── Content ──
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  topLabel: {
    color: Colors.accent,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: Spacing.xs,
  },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: Spacing.sm,
  },

  // ── Card ──
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.bg,
  },

  // ── Action row ──
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  actionText: { flex: 1, gap: 4 },
  actionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '600',
    lineHeight: 20,
  },
  actionSub: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    lineHeight: 17,
  },
  actionBtn: {
    borderWidth: 1.5,
    borderColor: Colors.textPrimary,
    borderRadius: Radius.button,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    minWidth: 88,
    alignItems: 'center',
  },
  actionBtnDone: {
    borderColor: Colors.textMuted,
  },
  actionBtnText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '700',
  },
  actionBtnTextDone: {
    color: Colors.textMuted,
  },

  // ── CTA ──
  ctaBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.card,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  ctaBtnText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '700',
  },
});
