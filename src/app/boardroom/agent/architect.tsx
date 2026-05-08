import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { MOCK_GOAL, MOCK_SPEND } from '@/mock/data';

// ── Data contract — swap this object for an API response when backend is ready ──
const architectData = {
  status: 'Delay' as 'Delay' | 'On Track' | 'Ahead',
  goal: {
    name:        MOCK_GOAL.name,                              // e.g. 'Okinawa'
    emoji:       MOCK_GOAL.emoji,                             // '✈️'
    target:      MOCK_GOAL.target,                            // RM 3,200
    saved:       MOCK_GOAL.saved,                             // RM 1,344
    toGo:        MOCK_GOAL.target - MOCK_GOAL.saved,          // RM 1,856
    progressPct: MOCK_GOAL.progress_pct,                      // 42
    etaOriginal: MOCK_GOAL.eta_original,                      // '2026-06-22'
    etaCurrent:  MOCK_GOAL.eta_current,                       // '2026-06-30'
  },
  delay: {
    velocityOverspend: MOCK_SPEND.over_budget,                // RM 410
    daysDelayed:       MOCK_GOAL.days_delayed,                // 8
    dailyRateNeeded:   MOCK_GOAL.daily_rate_needed,           // RM 5/day
    dailyRateCurrent:  MOCK_GOAL.daily_rate_current,          // RM 3.20/day
  },
  recommendation: {
    transferPerDay:  MOCK_GOAL.daily_rate_needed,             // RM 5
    daysToRecover:   14,                                      // days of auto-transfer
    goalPocket:      MOCK_GOAL.name,                          // pocket name
    fallbackBuffer:  'December',                              // buffer month
  },
};

// '2026-06-22' → '22 Jun 2026'
function fmtDate(iso: string): string {
  const [year, m, day] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(day)} ${months[parseInt(m) - 1]} ${year}`;
}

const fmt = (n: number) => n.toLocaleString('en-MY');

export default function ArchitectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { goal, delay, recommendation } = architectData;

  const recoText =
    `Lock RM${recommendation.transferPerDay}/day auto-transfer to ${recommendation.goalPocket} Pocket ` +
    `for ${recommendation.daysToRecover} days. This recovers the ${delay.daysDelayed}-day delay ` +
    `and keeps ${recommendation.fallbackBuffer} as your fallback buffer.`;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Top nav row ── */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>Agent insights</Text>
        <View style={styles.pageDots}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.pageDot, i === 1 && styles.pageDotActive]} />
          ))}
        </View>
      </View>

      {/* ── Architect sub-header ── */}
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.subBackBtn}>
          <Ionicons name="arrow-back" size={18} color={Colors.accentLt} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Architect — goals</Text>
        <View style={styles.delayBadge}>
          <Text style={styles.delayBadgeText}>{architectData.status}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Goal card ── */}
        <View style={styles.card}>
          <View style={styles.goalTopRow}>
            <Text style={styles.cardLabel}>{goal.name.toUpperCase()} TRIP</Text>
            <View style={styles.targetBlock}>
              <Text style={styles.targetLabel}>Target</Text>
              <Text style={styles.targetValue}>RM {fmt(goal.target)}</Text>
            </View>
          </View>

          <Text style={styles.fundedText}>{goal.progressPct}% funded</Text>

          <View style={styles.savedRow}>
            <Text style={styles.savedText}>RM {fmt(goal.saved)} saved</Text>
            <Text style={styles.toGoText}>RM {fmt(goal.toGo)} to go</Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${goal.progressPct}%` as `${number}%` }]} />
          </View>

          <View style={styles.divider} />

          {/* ETA row */}
          <View style={styles.etaRow}>
            <View style={styles.etaBlock}>
              <Text style={styles.etaLabel}>Original ETA</Text>
              <Text style={styles.etaOriginal}>{fmtDate(goal.etaOriginal)}</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={Colors.textMuted} />
            <View style={[styles.etaBlock, styles.etaRight]}>
              <Text style={styles.etaLabel}>Current ETA</Text>
              <Text style={styles.etaCurrent}>{fmtDate(goal.etaCurrent)}</Text>
            </View>
          </View>
        </View>

        {/* ── Goal Delay Analysis card ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>GOAL DELAY ANALYSIS</Text>
          {[
            { label: 'Velocity overspend',         value: `+RM${delay.velocityOverspend}`,        color: Colors.redLt },
            { label: 'Days delayed',                value: `${delay.daysDelayed} days`,             color: Colors.amberLt },
            { label: 'Daily savings rate needed',   value: `RM ${delay.dailyRateNeeded}/day`,       color: Colors.accentLt },
            { label: 'Current daily rate',          value: `RM ${delay.dailyRateCurrent}/day`,      color: Colors.textPrimary },
          ].map((row, idx, arr) => (
            <View key={row.label} style={[styles.analysisRow, idx < arr.length - 1 && styles.analysisRowBorder]}>
              <Text style={styles.analysisLabel}>{row.label}</Text>
              <Text style={[styles.analysisValue, { color: row.color }]}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* ── Architect recommendation ── */}
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>Architect recommendation</Text>
          <Text style={styles.recommendationBody}>{recoText}</Text>
        </View>

        {/* ── Back button ── */}
        <TouchableOpacity style={styles.backBtn2} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>← Back to Insights</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  // ── Top nav ──
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  backBtn: { padding: Spacing.xs },
  topNavTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '700',
    marginLeft: Spacing.xs,
  },
  pageDots: { flexDirection: 'row', gap: 6, paddingRight: Spacing.sm },
  pageDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.textMuted },
  pageDotActive: { backgroundColor: Colors.textPrimary },

  // ── Sub-header ──
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  subBackBtn: { padding: 2 },
  subHeaderTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '700',
  },
  delayBadge: {
    backgroundColor: Colors.amber,
    borderRadius: Radius.small,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  delayBadgeText: {
    color: Colors.textPrimary,
    fontSize: Typography.caption,
    fontWeight: '700',
  },

  // ── Content ──
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  cardLabel: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  // ── Goal card internals ──
  goalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  targetBlock: { alignItems: 'flex-end' },
  targetLabel: { color: Colors.textMuted, fontSize: Typography.caption },
  targetValue: { color: Colors.textPrimary, fontSize: Typography.body, fontWeight: '600' },
  fundedText: {
    color: Colors.amberLt,
    fontSize: 30,
    fontWeight: '800',
  },
  savedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  savedText: { color: Colors.textSecondary, fontSize: 13 },
  toGoText: { color: Colors.accentLt, fontSize: 13, fontWeight: '500' },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.bg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.amberLt,
    borderRadius: 3,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.textMuted,
    opacity: 0.3,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  etaBlock: { gap: 2 },
  etaRight: { alignItems: 'flex-end' },
  etaLabel: { color: Colors.textMuted, fontSize: Typography.caption },
  etaOriginal: { color: Colors.greenLt, fontSize: Typography.body, fontWeight: '700' },
  etaCurrent: { color: Colors.redLt, fontSize: Typography.body, fontWeight: '700' },

  // ── Delay analysis ──
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  analysisRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.bg,
  },
  analysisLabel: { color: Colors.textSecondary, fontSize: Typography.body },
  analysisValue: { fontSize: Typography.body, fontWeight: '700' },

  // ── Recommendation ──
  recommendationCard: {
    backgroundColor: Colors.card,
    borderLeftWidth: 3,
    borderLeftColor: Colors.amberLt,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: 8,
  },
  recommendationTitle: {
    color: Colors.amberLt,
    fontSize: Typography.body,
    fontWeight: '700',
  },
  recommendationBody: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    lineHeight: 22,
  },

  // ── Back button ──
  backBtn2: {
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  backBtnText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '600',
  },
});
