import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { MOCK_S2S, MOCK_SPEND } from '@/mock/data';

// ── Data contract — swap this object for an API response when backend is ready ──
const sentinelData = {
  status:       'Warning'                    as 'Warning' | 'Critical' | 'Clear',
  burnVelocity: MOCK_S2S.burn_velocity,      // e.g. 1.4
  s2sDaily:     MOCK_S2S.daily,              // RM/day safe-to-spend
  actualDaily:  MOCK_S2S.actual_daily,       // RM/day actual spend
  totalSpend:   MOCK_SPEND.total,            // RM total this month
  overBudget:   MOCK_SPEND.over_budget,      // RM over S₂S budget
  week4Cap:     MOCK_S2S.week4_cap,          // RM/day guardrail cap
  categories: [
    { label: 'Food & drink (Kepong)', amount: MOCK_SPEND.categories.food_drink, color: '#F08080' },
    { label: 'Transport / petrol',    amount: MOCK_SPEND.categories.transport,   color: Colors.amberLt },
    { label: 'Shopping',              amount: MOCK_SPEND.categories.shopping,    color: Colors.accentLt },
    { label: 'Utilities & bills',     amount: MOCK_SPEND.categories.utilities,   color: Colors.greenLt },
    { label: 'Others',                amount: MOCK_SPEND.categories.others,      color: Colors.textMuted },
  ],
  weekly: MOCK_SPEND.weekly,  // [{ week, amount, status }]
};

// Maps weekly status → bar fill color
const WEEK_BAR_COLOR: Record<string, string> = {
  green:      Colors.greenLt,
  amber:      Colors.amberLt,
  red:        '#F08080',
  guardrail:  Colors.accent,
};

const BAR_MAX_H = 80;
const maxWeeklyAmount = Math.max(...sentinelData.weekly.map((w) => w.amount));

const fmt = (n: number) => n.toLocaleString('en-MY');

export default function SentinelScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Top nav row (same as insights page) ── */}
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

      {/* ── Sentinel sub-header row ── */}
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.subBackBtn}>
          <Ionicons name="arrow-back" size={18} color={Colors.accentLt} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Sentinel — burn rate</Text>
        <View style={styles.warningBadge}>
          <Text style={styles.warningBadgeText}>{sentinelData.status}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Burn Velocity card ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>BURN VELOCITY (V)</Text>
          <Text style={styles.burnValue}>{sentinelData.burnVelocity}×</Text>
          <Text style={styles.burnSub}>
            Safe-to-Spend (S₂S): RM{sentinelData.s2sDaily}/day · Actual: RM{sentinelData.actualDaily}/day
          </Text>
        </View>

        {/* ── Total Spend card ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>TOTAL SPEND THIS MONTH</Text>
          <Text style={styles.spendValue}>RM {fmt(sentinelData.totalSpend)}</Text>
          <Text style={styles.spendOver}>+RM{sentinelData.overBudget} over S₂S budget</Text>
        </View>

        {/* ── Spend by Category ── */}
        <Text style={styles.sectionLabel}>SPEND BY CATEGORY</Text>
        <View style={styles.categoryList}>
          {sentinelData.categories.map((cat) => (
            <View key={cat.label} style={styles.categoryRow}>
              <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
              <Text style={styles.categoryLabel}>{cat.label}</Text>
              <Text style={styles.categoryAmount}>RM {fmt(cat.amount)}</Text>
            </View>
          ))}
        </View>

        {/* ── Weekly Spend Pattern ── */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>WEEKLY SPEND PATTERN</Text>
        <View style={styles.barChart}>
          {sentinelData.weekly.map((w) => {
            const barH = Math.round((w.amount / maxWeeklyAmount) * BAR_MAX_H);
            const isGuardrail = w.status === 'guardrail';
            return (
              <View key={w.week} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      { height: barH, backgroundColor: WEEK_BAR_COLOR[w.status] },
                      isGuardrail && styles.barGuardrail,
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{w.week}</Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.guardrailNote}>
          Week 4 guardrail active: RM{sentinelData.week4Cap}/day cap
        </Text>

        {/* ── Back button ── */}
        <TouchableOpacity style={styles.backToInsightsBtn} onPress={() => router.back()}>
          <Text style={styles.backToInsightsText}>← Back to Insights</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

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
  warningBadge: {
    backgroundColor: Colors.red,
    borderRadius: Radius.small,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  warningBadgeText: {
    color: Colors.textPrimary,
    fontSize: Typography.caption,
    fontWeight: '700',
  },

  // ── Scroll content ──
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },

  // ── Cards ──
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: 6,
  },
  cardLabel: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  burnValue: {
    color: '#F08080',
    fontSize: 40,
    fontWeight: '800',
  },
  burnSub: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  spendValue: {
    color: Colors.textPrimary,
    fontSize: Typography.h1,
    fontWeight: '700',
  },
  spendOver: {
    color: Colors.greenLt,
    fontSize: Typography.body,
    fontWeight: '500',
  },

  // ── Categories ──
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: Spacing.sm,
  },
  categoryList: {
    gap: 2,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.card,
    gap: Spacing.sm,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryLabel: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.body,
  },
  categoryAmount: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '500',
  },

  // ── Bar chart ──
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: BAR_MAX_H + 24,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  barTrack: {
    width: '100%',
    height: BAR_MAX_H,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  barGuardrail: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  barLabel: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  guardrailNote: {
    color: Colors.accentLt,
    fontSize: 13,
    marginTop: Spacing.xs,
  },

  // ── Back button ──
  backToInsightsBtn: {
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  backToInsightsText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '600',
  },
});
