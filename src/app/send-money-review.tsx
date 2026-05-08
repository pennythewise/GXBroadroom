import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  Modal, TextInput, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';

// ── Data contract ──
const mockRecipient = {
  name:         'JOHN CENA CHEN HONG',
  accountNo:    '179334828463046',
  bank:         'Maybank',
  transferType: 'Fund transfer',
};

const COUNTDOWN_START = 100; // 01:40

function formatCountdown(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function Tag({ text }: { text: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

function YesNo({
  value, onChange,
}: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.yesNoRow}>
      <TouchableOpacity
        style={[styles.yesNoBtn, value === true && styles.yesNoBtnActive]}
        onPress={() => onChange(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.yesNoText, value === true && styles.yesNoTextActive]}>Yes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.yesNoBtn, value === false && styles.yesNoBtnActive]}
        onPress={() => onChange(false)}
        activeOpacity={0.7}
      >
        <Text style={[styles.yesNoText, value === false && styles.yesNoTextActive]}>No</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SendMoneyReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { digits = '0', reference = 'Transfer' } =
    useLocalSearchParams<{ digits: string; reference: string }>();

  const amountDisplay = `RM${(parseInt(digits, 10) / 100).toFixed(2)}`;

  // ── Countdown ──
  const [seconds, setSeconds] = useState(COUNTDOWN_START);
  const expired = seconds === 0;

  useEffect(() => {
    if (expired) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [expired]);

  // ── Shield modal state ──
  const [shieldVisible, setShieldVisible] = useState(false);
  const [reason, setReason]               = useState('');
  const [isRushing, setIsRushing]         = useState<boolean | null>(null);
  const [isInstructed, setIsInstructed]   = useState<boolean | null>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Back ── */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Review your transfer</Text>

        <View style={styles.recipientRow}>
          <View style={styles.duitNowBadge}>
            <Text style={styles.duitNowText}>DuitNow</Text>
          </View>
          <View style={styles.recipientTags}>
            <Tag text={mockRecipient.name} />
            <Tag text={mockRecipient.accountNo} />
          </View>
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>Amount</Text>
          <Text style={styles.amountText}>{amountDisplay}</Text>
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>Bank name</Text>
          <Tag text={mockRecipient.bank} />
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>Transfer type</Text>
          <Text style={styles.fieldValue}>{mockRecipient.transferType}</Text>
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>Recipient reference</Text>
          <Tag text={decodeURIComponent(reference)} />
        </View>
      </ScrollView>

      {/* ── Bottom actions ── */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity
          style={[styles.approveBtn, expired && styles.approveBtnExpired]}
          activeOpacity={expired ? 1 : 0.85}
          onPress={() => !expired && setShieldVisible(true)}
        >
          <Text style={styles.approveBtnText}>
            {expired
              ? 'Session expired — go back to retry'
              : `Approve via GXsecure (${formatCountdown(seconds)})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rejectBtn} onPress={() => router.back()}>
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>
      </View>

      {/* ── Agent Shield modal ── */}
      <Modal
        visible={shieldVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setShieldVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + Spacing.md }]}>
            {/* X close */}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShieldVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {/* Amount + recipient */}
              <Text style={styles.modalAmount}>{amountDisplay}</Text>
              <View style={styles.modalToRow}>
                <Text style={styles.modalToLabel}>to</Text>
                <Tag text={mockRecipient.name} />
              </View>

              {/* Context check card */}
              <View style={styles.checkCard}>
                <Text style={styles.checkTitle}>CONTEXT CHECK — AGENT SHIELD</Text>

                {/* Q1: free text */}
                <Text style={styles.questionText}>Why are you sending this amount?</Text>
                <TextInput
                  style={styles.reasonInput}
                  placeholder="Reason for transfer..."
                  placeholderTextColor={Colors.textMuted}
                  value={reason}
                  onChangeText={setReason}
                  returnKeyType="done"
                />

                {/* Q2: yes/no */}
                <View style={styles.questionBlock}>
                  <Text style={styles.questionText}>Is the recipient rushing you?</Text>
                  <YesNo value={isRushing} onChange={setIsRushing} />
                </View>

                {/* Q3: yes/no */}
                <View style={styles.questionBlock}>
                  <Text style={styles.questionText}>
                    Is there people instructing your action right now?
                  </Text>
                  <YesNo value={isInstructed} onChange={setIsInstructed} />
                </View>
              </View>

              {/* Take a breath */}
              <View style={styles.breathBlock}>
                <Text style={styles.breathTitle}>Take a breath. You're protected.</Text>
                <Text style={styles.breathSub}>
                  This is a first-time transfer of a large amount. Your money will sit safe in a
                  24hr holding pocket earning interest while you decide.
                </Text>
              </View>

              {/* Action buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.terminateBtn}
                  onPress={() => {
                    setShieldVisible(false);
                    router.navigate('/(tabs)/home');
                  }}
                >
                  <Text style={styles.terminateText}>terminate transfer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.holdBtn}
                  activeOpacity={0.85}
                  onPress={() => {
                    setShieldVisible(false);
                    router.push(`/send-money-held?digits=${digits}` as never);
                  }}
                >
                  <Text style={styles.holdBtnText}>Hold it safely (24hr)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShieldVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  backBtn: { padding: Spacing.sm, alignSelf: 'flex-start' },

  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },

  title: {
    color: Colors.textPrimary,
    fontSize: Typography.h1,
    fontWeight: '700',
    lineHeight: 40,
  },

  recipientRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  duitNowBadge: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#E91E8C',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  duitNowText: { color: '#fff', fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },
  recipientTags: { flex: 1, gap: Spacing.xs, paddingTop: 4 },

  tag: {
    backgroundColor: '#1E1A30', borderRadius: 8,
    paddingVertical: 7, paddingHorizontal: Spacing.sm, alignSelf: 'flex-start',
  },
  tagText: { color: Colors.textPrimary, fontSize: Typography.body, fontWeight: '500' },

  fieldBlock: { gap: 6 },
  fieldLabel: { color: Colors.textMuted, fontSize: Typography.caption },
  fieldValue: { color: Colors.textPrimary, fontSize: Typography.body },
  amountText: { color: Colors.textPrimary, fontSize: 40, fontWeight: '700', lineHeight: 48 },

  bottomActions: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, gap: Spacing.sm },
  approveBtn: {
    backgroundColor: Colors.accent, borderRadius: 30,
    paddingVertical: 18, alignItems: 'center',
  },
  approveBtnExpired: { backgroundColor: Colors.textMuted },
  approveBtnText: { color: Colors.textPrimary, fontSize: Typography.body, fontWeight: '700' },
  rejectBtn: { paddingVertical: Spacing.sm, alignItems: 'center' },
  rejectText: { color: Colors.textPrimary, fontSize: Typography.body, fontWeight: '500' },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  modalSheet: {
    backgroundColor: '#110E22',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    maxHeight: '92%',
  },
  modalClose: {
    alignSelf: 'flex-start',
    backgroundColor: '#2A2444',
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  modalCloseText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '600' },

  modalAmount: {
    color: Colors.accent,
    fontSize: 36, fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  modalToRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  modalToLabel: { color: Colors.textMuted, fontSize: Typography.body },

  // ── Check card ──
  checkCard: {
    backgroundColor: '#1A1630',
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  checkTitle: {
    color: Colors.accent,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  questionText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    lineHeight: 22,
  },
  reasonInput: {
    backgroundColor: Colors.accent + '33',
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: Typography.body,
    borderWidth: 1,
    borderColor: Colors.accent + '66',
  },
  questionBlock: { gap: 8, marginTop: 4 },

  // ── Yes/No ──
  yesNoRow: { flexDirection: 'row', gap: Spacing.sm },
  yesNoBtn: {
    paddingHorizontal: Spacing.md, paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1.5, borderColor: Colors.textMuted,
  },
  yesNoBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  yesNoText: { color: Colors.textMuted, fontSize: Typography.body, fontWeight: '600' },
  yesNoTextActive: { color: Colors.textPrimary },

  // ── Take a breath ──
  breathBlock: {
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  breathTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
  },
  breathSub: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── Modal action buttons ──
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  terminateBtn: {
    backgroundColor: '#2A2444',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
  },
  terminateText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  holdBtn: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  holdBtnText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
  },
  cancelText: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    fontWeight: '500',
  },
});
