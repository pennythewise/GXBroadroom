import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import {
  MOCK_USER,
  MOCK_MASCOT_COPY,
  MOCK_INCOME,
  MOCK_SPEND,
  MOCK_S2S,
  MOCK_RESILIENCE,
  MOCK_WINDFALL,
} from '@/mock/data';

const MOOD_BARS = [
  { label: 'Income win', color: Colors.green },
  { label: 'Recovery',   color: Colors.accent },
  { label: 'Overspend',  color: Colors.red },
  { label: 'Guard',      color: Colors.accentLt },
] as const;

const fmt = (n: number) => n.toLocaleString('en-MY');

export default function BoardReportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const netSaved = MOCK_INCOME.total - MOCK_SPEND.total;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Board report · {MOCK_USER.monthShort}</Text>
        <View style={styles.pageDots}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.pageDot, i === 0 && styles.pageDotActive]} />
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Executive Synthesis ── */}
        <Text style={styles.sectionLabel}>EXECUTIVE SYNTHESIS</Text>

        <View style={styles.mascotCard}>
          <View style={styles.mascotRow}>
            <View style={styles.mascotAvatar}>
              <Ionicons name="hardware-chip-outline" size={26} color={Colors.textPrimary} />
            </View>
            <View>
              <Text style={styles.mascotName}>The Mascot</Text>
              <Text style={styles.mascotRole}>Executive summary</Text>
            </View>
          </View>
          <Text style={styles.mascotQuote}>"{MOCK_MASCOT_COPY}"</Text>
        </View>

        {/* ── Month Mood ── */}
        <View style={styles.moodCard}>
          <Text style={styles.moodTitle}>MONTH MOOD</Text>
          <View style={styles.moodBarsRow}>
            {MOOD_BARS.map(({ label, color }) => (
              <View key={label} style={styles.moodBarCol}>
                <View style={[styles.moodBar, { backgroundColor: color }]} />
                <Text style={[styles.moodBarLabel, { color }]}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Stats 2×2 ── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL INCOME</Text>
            <Text style={[styles.statValue, { color: Colors.accentLt }]}>RM {fmt(MOCK_INCOME.total)}</Text>
            <Text style={[styles.statSub, { color: Colors.greenLt }]}>+RM{MOCK_WINDFALL.amount} windfall</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL SPEND</Text>
            <Text style={[styles.statValue, { color: Colors.redLt }]}>RM {fmt(MOCK_SPEND.total)}</Text>
            <Text style={[styles.statSub, { color: Colors.redLt }]}>{MOCK_S2S.burn_velocity}× pace</Text>
          </View>
        </View>

        <View style={[styles.statsRow, styles.statsRowGap]}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>NET SAVED</Text>
            <Text style={[styles.statValue, { color: Colors.accentLt }]}>RM {fmt(netSaved)}</Text>
            <Text style={styles.statSub}>vs RM780 target</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>RESILIENCE</Text>
            <Text style={[styles.statValue, { color: Colors.greenLt }]}>{MOCK_RESILIENCE.score}/100</Text>
            <Text style={[styles.statSub, { color: Colors.greenLt }]}>+{MOCK_RESILIENCE.delta} from Apr</Text>
          </View>
        </View>

        {/* ── Bottom Actions ── */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/boardroom/insights')}>
            <Text style={styles.primaryBtnText}>View agent insights →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '700',
    marginLeft: Spacing.xs,
  },
  pageDots: {
    flexDirection: 'row',
    gap: 6,
    paddingRight: Spacing.sm,
  },
  pageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
  pageDotActive: {
    backgroundColor: Colors.textPrimary,
  },

  // ── Scroll content ──
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  sectionLabel: {
    color: Colors.accent,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: Spacing.xs,
  },

  // ── Mascot card ──
  mascotCard: {
    backgroundColor: Colors.card,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  mascotAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotName: {
    color: Colors.accentLt,
    fontSize: Typography.body,
    fontWeight: '700',
  },
  mascotRole: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
  },
  mascotQuote: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    lineHeight: 22,
  },

  // ── Month Mood ──
  moodCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  moodTitle: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 1,
  },
  moodBarsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  moodBarCol: {
    flex: 1,
    gap: 6,
  },
  moodBar: {
    height: 6,
    borderRadius: 3,
  },
  moodBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },

  // ── Stats grid ──
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statsRowGap: {
    marginTop: 0,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: 4,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: Typography.h2,
    fontWeight: '700',
  },
  statSub: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
  },

  // ── Bottom actions ──
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  primaryBtn: {
    flex: 2,
    backgroundColor: Colors.accent,
    borderRadius: Radius.button,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: Typography.body,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.button,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: Typography.body,
  },
});
