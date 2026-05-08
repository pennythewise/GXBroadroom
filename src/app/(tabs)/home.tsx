import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { MOCK_USER } from '@/mock/data';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function ActionButton({ icon, label }: { icon: IoniconsName; label: string }) {
  return (
    <TouchableOpacity style={styles.actionItem}>
      <View style={styles.actionCircle}>
        <Ionicons name={icon} size={26} color={Colors.textPrimary} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const AVATAR_COLORS = [Colors.accent, Colors.accentLt, Colors.green];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <View style={styles.headerTop}>
          <View style={styles.personalBadge}>
            <Text style={styles.personalText}>Personal</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="help-circle-outline" size={26} color={Colors.textSecondary} />
            </TouchableOpacity>
            <View>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="notifications-outline" size={26} color={Colors.textSecondary} />
              </TouchableOpacity>
              <View style={styles.notifDot} />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.nameRow}>
          <Text style={styles.userName}>{MOCK_USER.name}</Text>
          <Ionicons name="chevron-down" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>

        {/* ── Board Ready Banner ── */}
        <TouchableOpacity style={styles.boardBanner} activeOpacity={0.8} onPress={() => router.push('/boardroom/report')}>
          <View style={styles.boardBannerLeft}>
            <Text style={styles.boardBannerTitle}>Your Board is ready</Text>
            <View style={styles.boardBannerSubRow}>
              <View style={styles.boardBannerDot} />
              <Text style={styles.boardBannerSub}>May monthly report · 3 decisions waiting</Text>
            </View>
          </View>
          <View style={styles.boardViewBtn}>
            <Text style={styles.boardViewBtnText}>View →</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.balanceBlock}>
          <View style={styles.balanceLabelRow}>
            <Text style={styles.balanceLabel}>Total balance</Text>
            <Ionicons name="shield-checkmark" size={15} color={Colors.accentLt} />
          </View>
          <View style={styles.balanceAmountRow}>
            <Text style={styles.balanceAmount}>RM*****</Text>
            <TouchableOpacity style={styles.eyeBtn}>
              <Ionicons name="eye-off-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.balanceInfoRow}>
            <Text style={styles.balanceInfoText}>Balance info</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.accentLt} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Quick Actions ── */}
      <View style={styles.actionsCard}>
        <ActionButton icon="add" label="Add money" />
        <ActionButton icon="scan-outline" label="Scan QR" />
        <ActionButton icon="arrow-forward" label="Send money" />
      </View>

      {/* ── Everyday Account ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your everyday account</Text>
          <TouchableOpacity style={styles.toggleBtn}>
            <View style={styles.toggleDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.accountRow}>
          {/* Main account */}
          <View style={[styles.accountCard, styles.accountLeft]}>
            <Text style={styles.accountLabel}>Main account</Text>
            <Text style={styles.accountBalance}>RM*****</Text>
            <View style={styles.cardSpacer} />
            <TouchableOpacity>
              <Text style={styles.viewTxText}>View transactions</Text>
            </TouchableOpacity>
          </View>

          {/* Pockets */}
          <View style={[styles.accountCard, styles.accountRight]}>
            <Text style={styles.accountLabel}>Pockets</Text>
            <Text style={styles.accountBalance}>RM*****</Text>
            <View style={styles.interestBadge}>
              <Text style={styles.interestText}>Up to 3.55% p.a.</Text>
            </View>
            <View style={styles.avatarRow}>
              {AVATAR_COLORS.map((color, i) => (
                <View key={i} style={[styles.avatar, { backgroundColor: color }, i > 0 && styles.avatarShift]} />
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* ── For You Today ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>For you today</Text>
        <View style={styles.promoCard}>
          <View style={styles.promoIconArea}>
            <Ionicons name="wallet" size={44} color={Colors.accentLt} />
            <View style={styles.promoIconAccent}>
              <Ionicons name="arrow-forward-circle" size={22} color={Colors.cyan} />
            </View>
          </View>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Bonus Pockets</Text>
            <Text style={styles.promoBody}>
              Earn up to 3.55% p.a. interest. No penalty.
            </Text>
            <TouchableOpacity style={styles.exploreBtn}>
              <Text style={styles.exploreBtnText}>Explore</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  // ── Header ──
  header: {
    backgroundColor: Colors.headerBg,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  personalBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  personalText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  iconBtn: {
    padding: 4,
  },
  notifDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.red,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.md,
  },
  userName: {
    color: Colors.textPrimary,
    fontSize: 30,
    fontWeight: '700',
  },
  balanceBlock: {
    marginTop: Spacing.lg,
  },
  balanceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
  },
  balanceAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 4,
  },
  balanceAmount: {
    color: Colors.textPrimary,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 1,
  },
  eyeBtn: {
    padding: 4,
  },
  balanceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 6,
  },
  balanceInfoText: {
    color: Colors.accentLt,
    fontSize: Typography.body,
  },

  // ── Quick Actions ──
  actionsCard: {
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: Radius.card,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionItem: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.caption,
    fontWeight: '500',
  },

  // ── Sections ──
  section: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '600',
  },
  toggleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2D1A4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.amber,
  },

  // ── Account Cards ──
  accountRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  accountCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    padding: Spacing.md,
    minHeight: 150,
  },
  accountLeft: {},
  accountRight: {},
  accountLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    marginBottom: 4,
  },
  accountBalance: {
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '700',
  },
  cardSpacer: {
    flex: 1,
  },
  viewTxText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  interestBadge: {
    backgroundColor: Colors.cyan,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  interestText: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  avatarRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.card,
  },
  avatarShift: {
    marginLeft: -10,
  },

  // ── Promo Card ──
  promoCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  promoIconArea: {
    width: 80,
    height: 80,
    backgroundColor: Colors.headerBg,
    borderRadius: Radius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoIconAccent: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '700',
  },
  promoBody: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  exploreBtn: {
    borderWidth: 1.5,
    borderColor: Colors.textPrimary,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  exploreBtnText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '500',
  },

  bottomPad: {
    height: Spacing.xl,
  },

  // ── Board Ready Banner ──
  boardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.boardroomCard,
    borderWidth: 1.5,
    borderColor: Colors.boardroomBorder,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  boardBannerLeft: {
    flex: 1,
    gap: 6,
  },
  boardBannerTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '700',
  },
  boardBannerSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  boardBannerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
  boardBannerSub: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    flex: 1,
  },
  boardViewBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.button,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
  },
  boardViewBtnText: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: Typography.body,
  },
});
