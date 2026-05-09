import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { MOCK_POCKETS } from '@/mock/data';

const CARD_GAP = Spacing.sm;
const CARD_WIDTH = (Dimensions.get('window').width - Spacing.md * 2 - CARD_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.25;

// ── Illustrations ─────────────────────────────────────────────────────────────

function CoinsIllustration() {
  return (
    <Svg width={CARD_WIDTH - 16} height={90} viewBox="0 0 140 90">
      {/* back coins */}
      <Ellipse cx="100" cy="62" rx="22" ry="10" fill="#7C3AED" opacity={0.6} />
      <Rect x="78" y="28" width="44" height="34" rx="4" fill="#6D28D9" />
      <Ellipse cx="100" cy="28" rx="22" ry="10" fill="#A78BFA" />

      <Ellipse cx="60" cy="70" rx="22" ry="10" fill="#5B21B6" opacity={0.6} />
      <Rect x="38" y="36" width="44" height="34" rx="4" fill="#7C3AED" />
      <Ellipse cx="60" cy="36" rx="22" ry="10" fill="#C4B5FD" />

      {/* floating coins */}
      <Circle cx="118" cy="18" r="9" fill="#FBBF24" />
      <Ellipse cx="118" cy="18" rx="9" ry="4" fill="#F59E0B" />
      <Circle cx="118" cy="14" r="9" fill="#FCD34D" />

      <Circle cx="30" cy="24" r="7" fill="#FBBF24" />
      <Circle cx="30" cy="20" r="7" fill="#FCD34D" />

      <Circle cx="130" cy="44" r="5" fill="#FBBF24" />
      <Circle cx="130" cy="41" r="5" fill="#FCD34D" />

      {/* dollar signs */}
      <Path d="M100 24 v8 M97 26 h6 M97 30 h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity={0.8} />
      <Path d="M60 32 v8 M57 34 h6 M57 38 h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity={0.8} />
    </Svg>
  );
}

function HolidayIllustration() {
  return (
    <Svg width={CARD_WIDTH - 16} height={90} viewBox="0 0 140 90">
      {/* suitcase body */}
      <Rect x="28" y="38" width="72" height="50" rx="8" fill="#4C1D95" />
      <Rect x="28" y="38" width="72" height="50" rx="8" fill="#6D28D9" opacity={0.5} />
      {/* suitcase handle */}
      <Path d="M50 38 v-10 a14 14 0 0 1 28 0 v10" fill="none" stroke="#A78BFA" strokeWidth="4" strokeLinecap="round" />
      {/* suitcase stripe */}
      <Rect x="28" y="57" width="72" height="8" fill="#5B21B6" opacity={0.6} />
      {/* wheels */}
      <Circle cx="42" cy="86" r="5" fill="#3B0764" />
      <Circle cx="86" cy="86" r="5" fill="#3B0764" />
      {/* hat */}
      <Ellipse cx="80" cy="42" rx="30" ry="8" fill="#E5E7EB" opacity={0.9} />
      <Path d="M60 42 Q64 14 80 14 Q96 14 100 42" fill="#F3F4F6" opacity={0.9} />
      {/* hat band */}
      <Path d="M62 37 Q80 30 98 37" fill="none" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

// ── Pocket Cards ──────────────────────────────────────────────────────────────

function IconBadge({ name, bg }: { name: React.ComponentProps<typeof Ionicons>['name']; bg: string }) {
  return (
    <View style={[styles.iconBadge, { backgroundColor: bg }]}>
      <Ionicons name={name} size={20} color="#fff" />
    </View>
  );
}

function HoldingCard({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.card, styles.holdingCard]} activeOpacity={0.85} onPress={onPress}>
      <IconBadge name="lock-closed" bg="rgba(0,0,0,0.35)" />
      <Text style={styles.holdingWarningText}>
        You are able to cancel transfer within 24 hours
      </Text>
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.cardLabel}>Holding Pocket</Text>
          <Text style={styles.cardBalance}>
            RM {MOCK_POCKETS.items[0].balance.toFixed(2)}
          </Text>
        </View>
        <Ionicons name="warning" size={20} color="#FCA5A5" />
      </View>
    </TouchableOpacity>
  );
}

function InvestCard() {
  return (
    <View style={[styles.card, styles.investCard]}>
      <IconBadge name="trending-up" bg="rgba(0,0,0,0.35)" />
      <View style={styles.illustrationArea}>
        <CoinsIllustration />
      </View>
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.cardLabel}>Invest</Text>
          <View style={styles.investBadge}>
            <Text style={styles.investBadgeText}>
              RM {MOCK_POCKETS.items[1].balance.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function HolidayCard() {
  return (
    <View style={[styles.card, styles.holidayCard]}>
      <IconBadge name="wallet" bg="rgba(0,0,0,0.35)" />
      <View style={styles.illustrationArea}>
        <HolidayIllustration />
      </View>
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.cardLabel}>Holiday</Text>
          <Text style={styles.cardBalance}>
            RM {MOCK_POCKETS.items[2].balance.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function PocketsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const holdingDigits = Math.round(MOCK_POCKETS.items[0].balance * 100);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pockets</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Total balance */}
        <Text style={styles.balanceLabel}>Total Pocket balance</Text>
        <Text style={styles.balanceAmount}>
          RM {MOCK_POCKETS.totalBalance.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
        </Text>

        {/* Create pocket button */}
        <TouchableOpacity style={styles.createBtn} activeOpacity={0.8}>
          <Text style={styles.createBtnText}>Create pocket</Text>
        </TouchableOpacity>

        {/* Section label */}
        <Text style={styles.pocketCount}>3 POCKETS</Text>
        <Text style={styles.pocketSub}>
          Create up to 10 Savings Pockets and 4 Bonus Pockets.
        </Text>

        {/* Grid */}
        <View style={styles.grid}>
          {/* Row 1 */}
          <View style={styles.gridRow}>
            <HoldingCard onPress={() => router.push(`/send-money-held?digits=${holdingDigits}` as never)} />
            <InvestCard />
          </View>
          {/* Row 2 */}
          <View style={styles.gridRow}>
            <HolidayCard />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  backBtn: { padding: Spacing.sm },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '700',
  },
  headerSpacer: { width: 42 },

  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },

  balanceLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    marginBottom: 4,
    marginTop: Spacing.sm,
  },
  balanceAmount: {
    color: Colors.textPrimary,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },

  createBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: Colors.textPrimary,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  createBtnText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '600',
  },

  pocketCount: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  pocketSub: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    marginBottom: Spacing.md,
  },

  // ── Grid ──
  grid: { gap: CARD_GAP },
  gridRow: { flexDirection: 'row', gap: CARD_GAP },

  // ── Cards ──
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: Radius.card + 4,
    padding: Spacing.sm,
    overflow: 'hidden',
  },

  holdingCard: {
    backgroundColor: '#7B2A2A',
    justifyContent: 'space-between',
  },
  investCard: {
    backgroundColor: '#2D1B69',
    justifyContent: 'space-between',
  },
  holidayCard: {
    backgroundColor: '#2D1B69',
    justifyContent: 'space-between',
  },

  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },

  holdingWarningText: {
    color: '#FCA5A5',
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
    marginTop: Spacing.xs,
  },

  illustrationArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardBalance: {
    color: Colors.textPrimary,
    fontSize: Typography.caption,
    fontWeight: '500',
  },

  investBadge: {
    backgroundColor: '#D946EF',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  investBadgeText: {
    color: '#fff',
    fontSize: Typography.caption,
    fontWeight: '700',
  },
});
