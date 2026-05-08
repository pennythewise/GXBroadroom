import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import {
  MOCK_RESILIENCE,
  MOCK_GOAL,
  MOCK_SHIELDS,
  MOCK_INCOME,
} from '@/mock/data';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

// ── Data contract — swap this object for an API response when backend is ready ──
const futureData = {
  resilience: {
    score:      MOCK_RESILIENCE.score,        // 78
    max:        100,
    delta:      MOCK_RESILIENCE.delta,        // +5
    deltaMonth: 'Apr',
  },
  headline: 'You are more resilient than last month.',
  subtext:
    'Your shield activations and goal discipline are building a financial identity that can absorb shocks.',
  projections: [
    {
      icon:        'airplane-outline' as IoniconsName,
      iconColor:   Colors.accentLt,
      label:       'Okinawa readiness',
      description: 'Expected Dec 2026 (recovery buffer)',
      value:       `${MOCK_GOAL.progress_pct}%`,
      valueColor:  Colors.accentLt,
    },
    {
      icon:        'shield-outline' as IoniconsName,
      iconColor:   Colors.greenLt,
      label:       'Protection coverage',
      description: 'Travel shocks + Cyber fraud shielded',
      value:       `${MOCK_SHIELDS.active.length} active`,
      valueColor:  Colors.greenLt,
    },
    {
      icon:        'trending-up-outline' as IoniconsName,
      iconColor:   Colors.greenLt,
      label:       'Income trajectory',
      description: `On track for RM3,200/mo by August`,
      value:       `+${MOCK_INCOME.growth_pct}%`,
      valueColor:  Colors.greenLt,
    },
    {
      icon:        'warning-outline' as IoniconsName,
      iconColor:   Colors.amberLt,
      label:       'Burn risk (Week 4)',
      description: 'Guardrail active · Watch Kepong spend',
      value:       'Guarded',
      valueColor:  Colors.amberLt,
    },
  ],
  nextBoardDate: MOCK_RESILIENCE.next_board_date,   // '2026-06-01'
  nextBoardNote: 'Your agents will monitor and pre-draft the next report.',
};

// '2026-06-01' → '1 Jun 2026'
function fmtDate(iso: string): string {
  const [year, m, day] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(day)} ${months[parseInt(m) - 1]} ${year}`;
}

// ── Circular progress ring (SVG strokeDashoffset) ──
const RING = 160;
const STROKE = 12;
const TRACK_COLOR = '#1a1630';
const RADIUS = (RING - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ScoreRing({ score, max, delta, deltaMonth }: {
  score: number; max: number; delta: number; deltaMonth: string;
}) {
  const progress = score / max;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={styles.ringWrap}>
      <Svg width={RING} height={RING}>
        {/* Track */}
        <Circle
          cx={RING / 2} cy={RING / 2} r={RADIUS}
          fill="none" stroke={TRACK_COLOR} strokeWidth={STROKE}
        />
        {/* Progress arc — starts from top (rotate -90°) */}
        <Circle
          cx={RING / 2} cy={RING / 2} r={RADIUS}
          fill="none"
          stroke={Colors.accent}
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${RING / 2}, ${RING / 2}`}
        />
      </Svg>
      {/* Centre text overlay */}
      <View style={[StyleSheet.absoluteFill, styles.ringCenter]}>
        <Text style={styles.ringScore}>{score}</Text>
        <Text style={styles.ringMax}>/{max}</Text>
        <Text style={styles.ringDelta}>+{delta} from {deltaMonth}</Text>
      </View>
    </View>
  );
}

export default function FutureSelfScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resilience, projections } = futureData;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.navigate('/(tabs)/home')} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emotional impact</Text>
        <View style={styles.pageDots}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.pageDot, i === 3 && styles.pageDotActive]} />
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.topLabel}>YOUR FUTURE SELF</Text>

        {/* ── Score ring ── */}
        <ScoreRing
          score={resilience.score}
          max={resilience.max}
          delta={resilience.delta}
          deltaMonth={resilience.deltaMonth}
        />

        {/* ── Headline card ── */}
        <View style={styles.headlineCard}>
          <Text style={styles.headlineText}>{futureData.headline}</Text>
          <Text style={styles.subText}>{futureData.subtext}</Text>
        </View>

        {/* ── Impact Projections ── */}
        <Text style={styles.sectionLabel}>IMPACT PROJECTIONS</Text>
        <View style={styles.projectionList}>
          {projections.map((p, idx) => (
            <View key={p.label} style={[styles.projRow, idx < projections.length - 1 && styles.projRowBorder]}>
              <View style={styles.projIcon}>
                <Ionicons name={p.icon} size={22} color={p.iconColor} />
              </View>
              <View style={styles.projInfo}>
                <Text style={styles.projLabel}>{p.label}</Text>
                <Text style={styles.projDesc}>{p.description}</Text>
              </View>
              <Text style={[styles.projValue, { color: p.valueColor }]}>{p.value}</Text>
            </View>
          ))}
        </View>

        {/* ── Next board meeting ── */}
        <View style={styles.nextBoardCard}>
          <Text style={styles.nextBoardTitle}>Next board meeting</Text>
          <Text style={styles.nextBoardDate}>{fmtDate(futureData.nextBoardDate)}</Text>
          <Text style={styles.nextBoardNote}>{futureData.nextBoardNote}</Text>
        </View>

        {/* ── Back button ── */}
        <TouchableOpacity style={styles.backSummaryBtn} onPress={() => router.navigate('/boardroom/report')}>
          <Text style={styles.backSummaryText}>Back to summary</Text>
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
    gap: Spacing.md,
    alignItems: 'stretch',
  },
  topLabel: {
    color: Colors.accent,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 1.2,
  },

  // ── Ring ──
  ringWrap: {
    width: RING,
    height: RING,
    alignSelf: 'center',
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringScore: {
    color: Colors.textPrimary,
    fontSize: 44,
    fontWeight: '800',
    lineHeight: 48,
  },
  ringMax: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  ringDelta: {
    color: Colors.greenLt,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },

  // ── Headline card ──
  headlineCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headlineText: {
    color: Colors.greenLt,
    fontSize: Typography.h3,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
  },
  subText: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    textAlign: 'center',
    lineHeight: 21,
  },

  // ── Projections ──
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  projectionList: {
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
  },
  projRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  projRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.bg,
  },
  projIcon: { width: 30, alignItems: 'center' },
  projInfo: { flex: 1, gap: 2 },
  projLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '600',
  },
  projDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    lineHeight: 17,
  },
  projValue: {
    fontSize: Typography.body,
    fontWeight: '700',
  },

  // ── Next board meeting ──
  nextBoardCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 6,
  },
  nextBoardTitle: {
    color: Colors.accentLt,
    fontSize: Typography.body,
    fontWeight: '600',
  },
  nextBoardDate: {
    color: Colors.textPrimary,
    fontSize: Typography.h1,
    fontWeight: '800',
  },
  nextBoardNote: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    textAlign: 'center',
    lineHeight: 17,
  },

  // ── Back button ──
  backSummaryBtn: {
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  backSummaryText: {
    color: Colors.textMuted,
    fontSize: Typography.body,
    fontWeight: '600',
  },
});
