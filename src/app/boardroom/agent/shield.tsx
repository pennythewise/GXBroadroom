import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { MOCK_RESILIENCE, MOCK_SHIELDS, MOCK_S2S } from '@/mock/data';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

// ── Data contract — swap this object for an API response when backend is ready ──
const shieldData = {
  status: 'Protected' as 'Protected' | 'At Risk' | 'Critical',

  // Resilience buffer
  bufferRm:           MOCK_RESILIENCE.buffer_rm,                            // RM 65
  emergencyRunway:    Math.round((MOCK_RESILIENCE.buffer_rm / MOCK_S2S.actual_daily) * 10) / 10, // days = buffer / actual daily spend

  // Shield catalog items
  shields: [
    {
      id:          'travel',
      label:       MOCK_SHIELDS.catalog.travel.label,                        // 'Auto-Travel Shield'
      description: 'Covers trip cancellation · Activated',
      status:      MOCK_SHIELDS.catalog.travel.status,                       // 'active'
      icon:        'airplane-outline' as IoniconsName,
      iconColor:   Colors.greenLt,
      priceMo:     MOCK_SHIELDS.catalog.travel.price_mo,                     // 0
    },
    {
      id:          'cyber_fraud',
      label:       MOCK_SHIELDS.catalog.cyber_fraud.label,                   // 'Cyber Fraud Protect'
      description: 'DuitNow scam coverage',
      status:      MOCK_SHIELDS.catalog.cyber_fraud.status,                  // 'active'
      icon:        null,
      iconColor:   null,
      priceMo:     MOCK_SHIELDS.catalog.cyber_fraud.price_mo,                // 0
    },
    {
      id:          'car_resilience',
      label:       MOCK_SHIELDS.catalog.car_resilience.label,                // 'Car-Resilience Shield'
      description: MOCK_SHIELDS.catalog.car_resilience.trigger_reason,       // 'Petrol transactions +38%'
      status:      MOCK_SHIELDS.catalog.car_resilience.status,               // 'recommended'
      icon:        'car-outline' as IoniconsName,
      iconColor:   Colors.amberLt,
      priceMo:     MOCK_SHIELDS.catalog.car_resilience.price_mo,             // 2.9
    },
  ],

  recommendation: {
    triggerReason: MOCK_SHIELDS.catalog.car_resilience.trigger_reason,       // 'Petrol transactions +38%'
    shieldLabel:   MOCK_SHIELDS.catalog.car_resilience.label,
    priceMo:       MOCK_SHIELDS.catalog.car_resilience.price_mo,             // 2.90
    petrolIncreasePct: 38,                                                    // %
  },
};

const STATUS_STYLE: Record<string, { label: string; color: string }> = {
  active:      { label: 'Active',      color: Colors.greenLt },
  recommended: { label: 'Recommended', color: Colors.amberLt },
  inactive:    { label: 'Inactive',    color: Colors.textMuted },
};

export default function ShieldScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { recommendation: rec } = shieldData;

  const recoText =
    `Petrol transactions increased ${rec.petrolIncreasePct}% vs last month. ` +
    `A ${rec.shieldLabel} would cover breakdowns and roadside assist ` +
    `from RM${rec.priceMo}/month.`;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Top nav row ── */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBackBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>Agent insights</Text>
        <View style={styles.pageDots}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.pageDot, i === 1 && styles.pageDotActive]} />
          ))}
        </View>
      </View>

      {/* ── Shield sub-header ── */}
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.subBackBtn}>
          <Ionicons name="arrow-back" size={18} color={Colors.accentLt} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Shield — protection</Text>
        <View style={styles.protectedBadge}>
          <Text style={styles.protectedBadgeText}>{shieldData.status}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Resilience Buffer card ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>RESILIENCE BUFFER</Text>
          <Text style={styles.bufferValue}>RM {shieldData.bufferRm}</Text>
          <Text style={styles.runwayText}>
            Emergency runway: {shieldData.emergencyRunway} days
          </Text>
        </View>

        {/* ── Shield Status list ── */}
        <Text style={styles.sectionLabel}>SHIELD STATUS</Text>
        <View style={styles.shieldList}>
          {shieldData.shields.map((shield, idx) => {
            const st = STATUS_STYLE[shield.status] ?? STATUS_STYLE.inactive;
            return (
              <View
                key={shield.id}
                style={[styles.shieldRow, idx < shieldData.shields.length - 1 && styles.shieldRowBorder]}
              >
                <View style={styles.shieldIcon}>
                  {shield.icon ? (
                    <Ionicons name={shield.icon} size={22} color={shield.iconColor ?? Colors.textMuted} />
                  ) : (
                    <View style={styles.iconPlaceholder} />
                  )}
                </View>
                <View style={styles.shieldInfo}>
                  <Text style={styles.shieldLabel}>{shield.label}</Text>
                  <Text style={styles.shieldDesc}>{shield.description}</Text>
                </View>
                <Text style={[styles.shieldStatus, { color: st.color }]}>{st.label}</Text>
              </View>
            );
          })}
        </View>

        {/* ── Shield recommendation ── */}
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>Shield recommendation</Text>
          <Text style={styles.recommendationBody}>{recoText}</Text>
        </View>

        {/* ── Back button ── */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
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
  navBackBtn: { padding: Spacing.xs },
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
  protectedBadge: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.small,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  protectedBadgeText: {
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
  bufferValue: {
    color: Colors.accentLt,
    fontSize: 36,
    fontWeight: '800',
  },
  runwayText: {
    color: Colors.accentLt,
    fontSize: Typography.body,
    opacity: 0.8,
  },

  // ── Shield status ──
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: Spacing.xs,
  },
  shieldList: {
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
  },
  shieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  shieldRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.bg,
  },
  shieldIcon: {
    width: 32,
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 22,
    height: 22,
  },
  shieldInfo: {
    flex: 1,
    gap: 2,
  },
  shieldLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '600',
  },
  shieldDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
  },
  shieldStatus: {
    fontSize: Typography.body,
    fontWeight: '700',
  },

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
  backBtn: {
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
