import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { MOCK_INCOME, MOCK_WINDFALL } from '@/mock/data';

// ── Data contract — swap this object for an API response when backend is ready ──
const scoutData = {
  status:          'Opportunity'                      as 'Opportunity' | 'Clear' | 'Alert',
  totalIncome:     MOCK_INCOME.total,                 // RM total income this month
  prevMonthTotal:  MOCK_INCOME.prev_month_total,      // RM previous month total
  growthPct:       MOCK_INCOME.growth_pct,            // % MoM growth
  internship:      MOCK_INCOME.internship,            // RM internship salary
  windfall:        MOCK_INCOME.windfall,              // RM windfall / reimbursements
  brandDeals:      MOCK_INCOME.brand_deals,           // RM brand/creator income
  windfallPocket:  MOCK_WINDFALL.recommended_pocket,  // suggested allocation pocket
  projectedMonth:  3200,                              // RM projected monthly income
  projectedByMonth: 'August',                         // target month for projection
  breakdown: [
    {
      label: 'Internship salary',
      pct: Math.round((MOCK_INCOME.internship / MOCK_INCOME.total) * 1000) / 10,
      color: Colors.greenLt,
    },
    {
      label: 'Windfall / reimbursement',
      pct: Math.round((MOCK_INCOME.windfall / MOCK_INCOME.total) * 1000) / 10,
      color: Colors.amberLt,
    },
    {
      label: 'Brand / creator deals',
      pct: Math.round((MOCK_INCOME.brand_deals / MOCK_INCOME.total) * 1000) / 10,
      color: Colors.accentLt,
    },
  ],
};

const fmt = (n: number) => n.toLocaleString('en-MY');

export default function ScoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const recommendation =
    `Allocate RM${scoutData.windfall} windfall to Emergency Pocket. ` +
    `At current income growth rate, you're on track for a RM${fmt(scoutData.projectedMonth)} ` +
    `month by ${scoutData.projectedByMonth}.`;

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
            <View key={i} style={[styles.pageDot, i === 2 && styles.pageDotActive]} />
          ))}
        </View>
      </View>

      {/* ── Scout sub-header row ── */}
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.subBackBtn}>
          <Ionicons name="arrow-back" size={18} color={Colors.accentLt} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Scout — income</Text>
        <View style={styles.oppBadge}>
          <Text style={styles.oppBadgeText}>{scoutData.status}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Total Income card ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>TOTAL INCOME THIS MONTH</Text>
          <Text style={styles.totalIncomeValue}>RM {fmt(scoutData.totalIncome)}</Text>
          <Text style={styles.growthText}>
            +{scoutData.growthPct}% vs April (RM {fmt(scoutData.prevMonthTotal)})
          </Text>
        </View>

        {/* ── Internship + Windfall row ── */}
        <View style={styles.twoColRow}>
          <View style={styles.subCard}>
            <Text style={styles.cardLabel}>INTERNSHIP</Text>
            <Text style={styles.internshipValue}>RM {fmt(scoutData.internship)}</Text>
            <Text style={styles.subCardNote}>Recurring</Text>
          </View>
          <View style={styles.subCard}>
            <Text style={styles.cardLabel}>WINDFALL</Text>
            <Text style={styles.windfallValue}>RM {fmt(scoutData.windfall)}</Text>
            <Text style={styles.windfallNote}>Reimbursements</Text>
          </View>
        </View>

        {/* ── Other Inflows card ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>OTHER INFLOWS</Text>
          <Text style={styles.otherInflowValue}>RM {fmt(scoutData.brandDeals)}</Text>
          <Text style={styles.subCardNote}>Content brand deals · RM{fmt(scoutData.brandDeals)}</Text>
        </View>

        {/* ── Income Breakdown ── */}
        <Text style={styles.sectionLabel}>INCOME BREAKDOWN</Text>
        <View style={styles.breakdownList}>
          {scoutData.breakdown.map((item) => (
            <View key={item.label} style={styles.breakdownRow}>
              <View style={[styles.breakdownDot, { backgroundColor: item.color }]} />
              <Text style={styles.breakdownLabel}>{item.label}</Text>
              <Text style={styles.breakdownPct}>{item.pct}%</Text>
            </View>
          ))}
        </View>

        {/* ── Scout recommendation ── */}
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>Scout recommendation</Text>
          <Text style={styles.recommendationBody}>{recommendation}</Text>
        </View>

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
  oppBadge: {
    backgroundColor: Colors.cyan,
    borderRadius: Radius.small,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  oppBadgeText: {
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
  totalIncomeValue: {
    color: Colors.greenLt,
    fontSize: 36,
    fontWeight: '800',
  },
  growthText: {
    color: Colors.greenLt,
    fontSize: Typography.body,
    opacity: 0.8,
  },

  // ── Two-col row ──
  twoColRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  subCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: 4,
  },
  internshipValue: {
    color: Colors.greenLt,
    fontSize: Typography.h2,
    fontWeight: '700',
  },
  windfallValue: {
    color: Colors.amberLt,
    fontSize: Typography.h2,
    fontWeight: '700',
  },
  windfallNote: {
    color: Colors.amberLt,
    fontSize: Typography.caption,
    fontWeight: '500',
  },
  subCardNote: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
  },
  otherInflowValue: {
    color: Colors.textPrimary,
    fontSize: Typography.h2,
    fontWeight: '700',
  },

  // ── Breakdown ──
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: Spacing.xs,
  },
  breakdownList: {
    gap: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.card,
    gap: Spacing.sm,
  },
  breakdownDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  breakdownLabel: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.body,
  },
  breakdownPct: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '600',
  },

  // ── Recommendation ──
  recommendationCard: {
    backgroundColor: Colors.card,
    borderLeftWidth: 3,
    borderLeftColor: Colors.greenLt,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: 8,
    marginTop: Spacing.xs,
  },
  recommendationTitle: {
    color: Colors.greenLt,
    fontSize: Typography.body,
    fontWeight: '700',
  },
  recommendationBody: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    lineHeight: 22,
  },

  // ── Back button ──
  backToInsightsBtn: {
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  backToInsightsText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '600',
  },
});
