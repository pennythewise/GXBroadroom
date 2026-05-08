import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';

// ── Data contract — swap with API / navigation params when backend is ready ──
const mockRecipient = {
  name:         'JOHN CENA CHEN HONG',
  accountNo:    '179334828463046',
  bank:         'Maybank',
  transferType: 'DuitNow',
  balance:      133.50,
};

const QUICK_REFS = ['Lunch', 'Yamcha', 'Hutang'];

// ── Custom numpad layout ──
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
  const decimals = (n / 100).toFixed(2);
  const [intPart, decPart] = decimals.split('.');
  const withCommas = Number(intPart).toLocaleString();
  return `${withCommas}.${decPart}`;
}

export default function SendMoneyAmountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // register-style: digits string represents cents, e.g. "123" = RM 1.23
  const [digits, setDigits]     = useState('');
  const [reference, setReference] = useState('Transfer');

  const appendDigit = (d: string) => {
    if (digits.length >= 10) return;
    // ignore leading zeros
    if (digits === '' && d === '0') return;
    setDigits((prev) => prev + d);
  };

  const deleteLast = () => setDigits((prev) => prev.slice(0, -1));

  const amountText  = formatAmount(digits);
  const hasAmount   = digits.length > 0;
  const canProceed  = hasAmount;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>

        {/* Recipient info */}
        <View style={styles.recipientInfo}>
          <View style={styles.duitNowBadge}>
            <Text style={styles.duitNowLabel}>DuitNow</Text>
          </View>
          <View style={styles.recipientText}>
            <Text style={styles.recipientName}>{mockRecipient.name}</Text>
            <Text style={styles.recipientSub}>
              {mockRecipient.accountNo}
              {'  •  '}
              {mockRecipient.bank}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Scrollable form area ── */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formContent}
      >
        {/* Amount display */}
        <View style={styles.amountBlock}>
          <View style={styles.amountRow}>
            <Text style={styles.amountPrefix}>RM </Text>
            <Text style={[styles.amountValue, !hasAmount && styles.amountMuted]}>
              {amountText}
            </Text>
          </View>
          <Text style={styles.balanceText}>
            Balance: RM{mockRecipient.balance.toFixed(2)}
          </Text>
        </View>

        {/* Recipient reference */}
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>Recipient reference</Text>
          <TextInput
            style={styles.fieldInput}
            value={reference}
            onChangeText={setReference}
            placeholderTextColor={Colors.textMuted}
            returnKeyType="done"
          />
          <View style={styles.fieldLine} />
        </View>

        {/* Quick reference chips */}
        <View style={styles.chipsRow}>
          {QUICK_REFS.map((ref) => (
            <TouchableOpacity
              key={ref}
              style={styles.chip}
              activeOpacity={0.7}
              onPress={() => setReference(ref)}
            >
              <Text style={styles.chipText}>{ref}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Type of transfers */}
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>Type of transfers</Text>
          <TouchableOpacity style={styles.dropdownRow}>
            <Text style={styles.dropdownValue}>Transfer now</Text>
            <Ionicons name="chevron-down" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.fieldLine} />
        </View>

        {/* Payment details */}
        <View style={styles.fieldBlock}>
          <TextInput
            style={styles.fieldInput}
            placeholder="Payment details (optional)"
            placeholderTextColor={Colors.textMuted}
            returnKeyType="done"
          />
          <View style={styles.fieldLine} />
        </View>
      </ScrollView>

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
        onPress={() =>
          canProceed &&
          router.push(
            `/send-money-review?digits=${digits}&reference=${encodeURIComponent(reference)}` as never,
          )
        }
      >
        <Ionicons name="chevron-forward" size={26} color={canProceed ? Colors.textPrimary : Colors.textMuted} />
      </TouchableOpacity>
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
    gap: Spacing.sm,
  },
  backBtn: { padding: Spacing.xs },
  recipientInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  duitNowBadge: {
    backgroundColor: '#E91E8C',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  duitNowLabel: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  recipientText: { flex: 1 },
  recipientName: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '700',
    lineHeight: 20,
  },
  recipientSub: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    marginTop: 2,
  },

  // ── Form ──
  formContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  amountBlock: {
    marginBottom: Spacing.lg,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  amountPrefix: {
    color: Colors.textPrimary,
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 48,
  },
  amountValue: {
    color: Colors.textPrimary,
    fontSize: 44,
    fontWeight: '300',
    lineHeight: 52,
  },
  amountMuted: {
    color: '#4A4070',
  },
  balanceText: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    marginTop: 4,
  },

  // ── Fields ──
  fieldBlock: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
    marginBottom: 4,
  },
  fieldInput: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    paddingVertical: 6,
  },
  fieldLine: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.textMuted,
    opacity: 0.35,
    marginTop: 4,
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  dropdownValue: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.body,
  },

  // ── Chips ──
  chipsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#2A2244',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
  },
  chipText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '500',
  },

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
});
