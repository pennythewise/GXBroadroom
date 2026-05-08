import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '@/constants/theme';

const HOLD_SECONDS = 24 * 60 * 60; // 86 400

function formatHMS(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return {
    h: String(h).padStart(2, '0'),
    m: String(m).padStart(2, '0'),
    s: String(s).padStart(2, '0'),
  };
}

function formatReleaseDate(d: Date): string {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let hrs = d.getHours();
  const min = String(d.getMinutes()).padStart(2, '0');
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  hrs = hrs % 12 || 12;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${hrs}:${min} ${ampm}`;
}

export default function SendMoneyHeldScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { digits = '0' } = useLocalSearchParams<{ digits: string }>();

  const amountDisplay = `RM ${(parseInt(digits, 10) / 100).toFixed(2)}`;

  const [remaining, setRemaining] = useState(HOLD_SECONDS);
  const [releaseDate] = useState(() => {
    const d = new Date();
    d.setSeconds(d.getSeconds() + HOLD_SECONDS);
    return d;
  });

  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const { h, m, s } = formatHMS(remaining);
  const progress = remaining / HOLD_SECONDS; // 1.0 → full, drains to 0

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + Spacing.md }]}>
      {/* ── Scrollable content ── */}
      <View style={styles.content}>
        {/* Lock icon */}
        <View style={styles.lockOuter}>
          <View style={styles.lockInner}>
            <Ionicons name="lock-closed" size={34} color="#fff" />
          </View>
        </View>

        {/* Safe message */}
        <Text style={styles.safeTitle}>{amountDisplay} is safe.</Text>
        <Text style={styles.safeSub}>Moved to your 24hr Holding Pocket</Text>

        {/* ── Countdown card ── */}
        <View style={styles.countdownCard}>
          <View style={styles.countdownHeader}>
            <Text style={styles.releaseLabel}>RELEASE IN</Text>
            <Text style={styles.earningText}>Earning 3.55% p.a.</Text>
          </View>

          <View style={styles.timerRow}>
            <View style={styles.timerUnit}>
              <Text style={styles.timerDigit}>{h}</Text>
              <Text style={styles.timerLabel}>hrs</Text>
            </View>
            <Text style={styles.timerColon}>:</Text>
            <View style={styles.timerUnit}>
              <Text style={styles.timerDigit}>{m}</Text>
              <Text style={styles.timerLabel}>min</Text>
            </View>
            <Text style={styles.timerColon}>:</Text>
            <View style={styles.timerUnit}>
              <Text style={styles.timerDigit}>{s}</Text>
              <Text style={styles.timerLabel}>sec</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
          </View>
        </View>

        {/* ── Details card ── */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>To</Text>
            <Text style={styles.detailVal}>New DuitNow recipient</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Status</Text>
            <Text style={[styles.detailVal, styles.statusGreen]}>Held · earning interest</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Release</Text>
            <Text style={styles.detailVal}>{formatReleaseDate(releaseDate)}</Text>
          </View>
        </View>

        {/* ── Info banner ── */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color="#F97316" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            If this was a scam, tap{' '}
            <Text style={styles.infoHighlight}>Cancel transfer</Text>
            {' '}below. Money returns instantly.
          </Text>
        </View>
      </View>

      {/* ── Bottom buttons ── */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.cancelBtn}
          activeOpacity={0.8}
          onPress={() => router.navigate('/(tabs)/home')}
        >
          <Text style={styles.cancelBtnText}>Cancel{'\n'}transfer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          activeOpacity={0.85}
          onPress={() => router.navigate('/(tabs)/home')}
        >
          <Text style={styles.homeBtnText}>Back to home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },

  // ── Lock icon ──
  lockOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1A3A2A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  lockInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Safe message ──
  safeTitle: {
    color: '#4ADE80',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  safeSub: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    textAlign: 'center',
    marginTop: -4,
  },

  // ── Countdown card ──
  countdownCard: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  countdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  releaseLabel: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  earningText: {
    color: '#4ADE80',
    fontSize: Typography.caption,
    fontWeight: '600',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.xs,
  },
  timerUnit: { alignItems: 'center', minWidth: 64 },
  timerDigit: {
    color: Colors.textPrimary,
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 54,
  },
  timerLabel: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
    marginTop: 2,
  },
  timerColon: {
    color: Colors.textPrimary,
    fontSize: 44,
    fontWeight: '300',
    lineHeight: 54,
    marginTop: 2,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#2A2444',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },

  // ── Details card ──
  detailsCard: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailKey: {
    color: Colors.textMuted,
    fontSize: Typography.body,
    minWidth: 70,
  },
  detailVal: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    textAlign: 'right',
    flex: 1,
  },
  statusGreen: {
    color: '#4ADE80',
    fontWeight: '600',
  },

  // ── Info banner ──
  infoBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2A1A0A',
    borderRadius: 12,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  infoIcon: { marginTop: 1, flexShrink: 0 },
  infoText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: Typography.body,
    lineHeight: 22,
  },
  infoHighlight: {
    color: '#F97316',
    fontWeight: '700',
  },

  // ── Bottom buttons ──
  bottomRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 16,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A0A0A',
  },
  cancelBtnText: {
    color: '#EF4444',
    fontSize: Typography.body,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  homeBtn: {
    flex: 2,
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBtnText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '700',
  },
});
