import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { MOCK_GOAL, MOCK_GOAL_TX } from '@/mock/data';

const QUICK_AMOUNTS = [50, 100, 200];
const MIN_AMOUNT_CENTS = 1000; // RM10.00

type NumpadKey = { d: string; l: string } | 'del' | null;
const NUMPAD_ROWS: NumpadKey[][] = [
  [{ d: '1', l: '' },     { d: '2', l: 'ABC' },  { d: '3', l: 'DEF' }],
  [{ d: '4', l: 'GHI' },  { d: '5', l: 'JKL' },  { d: '6', l: 'MNO' }],
  [{ d: '7', l: 'PQRS' }, { d: '8', l: 'TUV' },  { d: '9', l: 'WXYZ' }],
  [null,                   { d: '0', l: '' },      'del'],
];

function formatAmount(digits: string): string {
  if (!digits) return '0.00';
  const n = parseInt(digits, 10);
  const cents = n / 100;
  const [intPart, decPart] = cents.toFixed(2).split('.');
  return `${Number(intPart).toLocaleString()}.${decPart}`;
}

function digitsFromAmount(rm: number): string {
  return String(Math.round(rm * 100));
}

export default function AddMoneyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [digits, setDigits] = useState('');
  const [showGoalSheet, setShowGoalSheet] = useState(false);
  // customize amount in goal sheet (separate from main digits)
  const [goalDigits, setGoalDigits] = useState('');

  const appendDigit = (d: string) => {
    if (digits.length >= 10) return;
    if (digits === '' && d === '0') return;
    setDigits((prev) => prev + d);
  };

  const deleteLast = () => setDigits((prev) => prev.slice(0, -1));

  const setQuick = (rm: number) => setDigits(digitsFromAmount(rm));

  const amountText = formatAmount(digits);
  const amountCents = digits ? parseInt(digits, 10) : 0;
  const canProceed = amountCents >= MIN_AMOUNT_CENTS;

  const goalAmountText = formatAmount(goalDigits);

  const appendGoalDigit = (d: string) => {
    if (goalDigits.length >= 10) return;
    if (goalDigits === '' && d === '0') return;
    setGoalDigits((prev) => prev + d);
  };
  const deleteGoalLast = () => setGoalDigits((prev) => prev.slice(0, -1));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.title}>Please enter amount</Text>

        {/* DuitNow badge */}
        <View style={styles.duitNowBadge}>
          <View style={styles.duitNowCircle}>
            <Text style={styles.duitNowD}>D</Text>
          </View>
          <Text style={styles.duitNowName}>DuitNow</Text>
          <Text style={styles.duitNowSub}>Online Banking/{'\n'}Wallets</Text>
        </View>
      </View>

      {/* ── Amount display ── */}
      <View style={styles.amountSection}>
        <View style={styles.amountRow}>
          <Text style={styles.rmLabel}>RM</Text>
          <Text style={[styles.amountValue, !digits && styles.amountMuted]}>
            {amountText}
          </Text>
        </View>
        <Text style={styles.minNote}>Minimum transfer amount is RM10.00</Text>

        {/* Quick amount chips */}
        <View style={styles.chipsRow}>
          {QUICK_AMOUNTS.map((rm) => (
            <TouchableOpacity
              key={rm}
              style={styles.chip}
              onPress={() => setQuick(rm)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipText}>RM{rm}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Spacer pushes numpad to bottom ── */}
      <View style={styles.spacer} />

      {/* ── Custom numpad ── */}
      <View style={[styles.numpad, { paddingBottom: insets.bottom + 8 }]}>
        {NUMPAD_ROWS.map((row, ri) => (
          <View key={ri} style={styles.numpadRow}>
            {row.map((key, ki) => {
              if (key === null) {
                return <View key={ki} style={styles.numpadKeyEmpty} />;
              }
              if (key === 'del') {
                return (
                  <TouchableOpacity
                    key={ki}
                    style={styles.numpadKey}
                    onPress={deleteLast}
                    activeOpacity={0.6}
                  >
                    <Ionicons name="backspace-outline" size={24} color={Colors.textPrimary} />
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity
                  key={ki}
                  style={styles.numpadKey}
                  onPress={() => appendDigit(key.d)}
                  activeOpacity={0.6}
                >
                  <Text style={styles.numpadDigit}>{key.d}</Text>
                  {key.l ? <Text style={styles.numpadLetters}>{key.l}</Text> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* ── Floating next button ── */}
      <TouchableOpacity
        style={[
          styles.nextBtn,
          { bottom: insets.bottom + 24 },
          !canProceed && styles.nextBtnDisabled,
        ]}
        activeOpacity={canProceed ? 0.8 : 1}
        onPress={() => canProceed && setShowGoalSheet(true)}
      >
        <Ionicons
          name="chevron-forward"
          size={26}
          color={canProceed ? Colors.textPrimary : Colors.textMuted}
        />
      </TouchableOpacity>

      {/* ── Goal Architect Modal ── */}
      <Modal
        visible={showGoalSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGoalSheet(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowGoalSheet(false)}
          />
          <View style={styles.sheet}>
            {/* Agent tag */}
            <View style={styles.agentTag}>
              <Ionicons name="flag" size={14} color={Colors.accentLt} />
              <Text style={styles.agentTagText}>Goal Architect</Text>
            </View>

            <Text style={styles.sheetTitle}>Remember your Okinawa Trip?</Text>
            <Text style={styles.sheetBody}>
              You're currently {MOCK_GOAL_TX.progress_pct}% there. Speed up your ETA
              from Jun 28 to Jun 1.
            </Text>

            {/* Customize amount row */}
            <View style={styles.customizeRow}>
              <Text style={styles.customizeLabel}>Customize amount: RM</Text>
              <TextInput
                style={styles.customizeInput}
                value={goalAmountText === '0.00' ? '' : goalAmountText}
                placeholder="0.00"
                placeholderTextColor={Colors.textMuted}
                keyboardType="decimal-pad"
                onChangeText={(t) => {
                  const cleaned = t.replace(/[^0-9]/g, '');
                  setGoalDigits(cleaned);
                }}
              />
            </View>

            {/* Progress bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressMeta}>
                <Text style={styles.progressLabel}>
                  {MOCK_GOAL.name} Trip · RM{MOCK_GOAL.target.toLocaleString()}
                </Text>
                <Text style={styles.progressMeta2}>
                  {MOCK_GOAL_TX.progress_pct}% · 37 days left
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${MOCK_GOAL_TX.progress_pct}%` },
                  ]}
                />
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtnSecondary}
                onPress={() => setShowGoalSheet(false)}
              >
                <Text style={styles.actionBtnSecondaryText}>Ignore</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtnPrimary}
                onPress={() => {
                  setShowGoalSheet(false);
                  router.push('/pockets' as never);
                }}
              >
                <Text style={styles.actionBtnPrimaryText}>Save to Pocket{'\n'}Instead</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtnSecondary}
                onPress={() => {
                  setShowGoalSheet(false);
                  router.back();
                }}
              >
                <Text style={styles.actionBtnSecondaryText}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  // ── Header ──
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backBtn: {
    padding: Spacing.xs,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  duitNowBadge: {
    position: 'absolute',
    top: Spacing.sm + 4,
    right: Spacing.md,
    alignItems: 'center',
  },
  duitNowCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E91E8C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  duitNowD: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  duitNowName: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  duitNowSub: {
    color: Colors.textSecondary,
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 13,
  },

  // ── Amount ──
  amountSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  rmLabel: {
    color: Colors.textPrimary,
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 52,
  },
  amountValue: {
    color: Colors.textPrimary,
    fontSize: 48,
    fontWeight: '300',
    lineHeight: 56,
  },
  amountMuted: {
    color: '#4A4070',
  },
  minNote: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    marginTop: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  chip: {
    backgroundColor: '#2A2244',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
  },
  chipText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '500',
  },

  spacer: { flex: 1 },

  // ── Numpad ──
  numpad: {
    backgroundColor: Colors.bg,
    paddingTop: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    gap: Spacing.xs,
  },
  numpadRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  numpadKey: {
    flex: 1,
    backgroundColor: '#2A2440',
    borderRadius: Radius.button,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  numpadKeyEmpty: {
    flex: 1,
    height: 58,
  },
  numpadDigit: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 26,
  },
  numpadLetters: {
    color: Colors.textMuted,
    fontSize: 9,
    letterSpacing: 0.8,
    lineHeight: 11,
  },

  // ── Next button ──
  nextBtn: {
    position: 'absolute',
    right: Spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E1A32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnDisabled: {
    opacity: 0.5,
  },

  // ── Goal Architect Modal ──
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: '#1A1030',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: '#3B2A6E',
  },
  agentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  agentTagText: {
    color: Colors.accentLt,
    fontSize: Typography.caption,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  sheetTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.h2,
    fontWeight: '800',
    marginBottom: Spacing.sm,
  },
  sheetBody: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },

  // Customize amount
  customizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  customizeLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
  },
  customizeInput: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '500',
    minWidth: 60,
    padding: 0,
  },

  // Progress
  progressSection: {
    marginBottom: Spacing.lg,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
  },
  progressMeta2: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#2D1F5E',
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },

  // Action buttons
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtnSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3B2A6E',
    borderRadius: Radius.button,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnSecondaryText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionBtnPrimary: {
    flex: 1.4,
    backgroundColor: Colors.accent,
    borderRadius: Radius.button,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPrimaryText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
});
