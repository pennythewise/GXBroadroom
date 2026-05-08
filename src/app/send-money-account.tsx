import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';

// ── Bank list ──
interface Bank {
  id: string;
  name: string;
  abbr: string;
  color: string;
}

const BANKS: Bank[] = [
  { id: 'gx',   name: 'GXBank',               abbr: 'GX',  color: '#7C3AED' },
  { id: 'aeon', name: 'AEON Bank',             abbr: 'AE',  color: '#DB2777' },
  { id: 'afin', name: 'Affin Bank',            abbr: 'AF',  color: '#0EA5E9' },
  { id: 'agro', name: 'Agrobank',              abbr: 'AG',  color: '#16A34A' },
  { id: 'alrj', name: 'Al-Rajhi',              abbr: 'AR',  color: '#1D4ED8' },
  { id: 'alli', name: 'Alliance Bank',         abbr: 'AL',  color: '#475569' },
  { id: 'am',   name: 'AmBank',                abbr: 'AM',  color: '#EA580C' },
  { id: 'bism', name: 'Bank Islam',            abbr: 'BI',  color: '#166534' },
  { id: 'brak', name: 'Bank Rakyat',           abbr: 'BR',  color: '#C2410C' },
  { id: 'bsn',  name: 'Bank Simpanan Nasional',abbr: 'BSN', color: '#1D4ED8' },
  { id: 'cimb', name: 'CIMB Bank',             abbr: 'CI',  color: '#DC2626' },
  { id: 'hl',   name: 'Hong Leong Bank',       abbr: 'HL',  color: '#B91C1C' },
  { id: 'hsbc', name: 'HSBC Bank',             abbr: 'HS',  color: '#DC2626' },
  { id: 'mb',   name: 'Maybank',               abbr: 'MB',  color: '#CA8A04' },
  { id: 'ocbc', name: 'OCBC Bank',             abbr: 'OC',  color: '#DC2626' },
  { id: 'pb',   name: 'Public Bank',           abbr: 'PB',  color: '#1D4ED8' },
  { id: 'rhb',  name: 'RHB Bank',              abbr: 'RH',  color: '#DC2626' },
  { id: 'sc',   name: 'Standard Chartered',    abbr: 'SC',  color: '#0EA5E9' },
  { id: 'uob',  name: 'UOB Bank',              abbr: 'UO',  color: '#1D4ED8' },
];

function BankAvatar({ bank, size = 44 }: { bank: Bank; size?: number }) {
  return (
    <View style={[styles.bankAvatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: bank.color }]}>
      <Text style={[styles.bankAbbr, { fontSize: size < 36 ? 10 : 13 }]}>{bank.abbr}</Text>
    </View>
  );
}

export default function SendMoneyAccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filteredBanks = search.trim()
    ? BANKS.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))
    : BANKS;

  const canProceed = selectedBank !== null && accountNumber.length >= 6;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
      </TouchableOpacity>

      <Text style={styles.title}>Send money to</Text>

      {/* ── Form ── */}
      <View style={styles.form}>
        {/* Select recipient bank */}
        <TouchableOpacity style={styles.field} onPress={() => setBankModalVisible(true)}>
          {selectedBank ? (
            <View style={styles.selectedBankRow}>
              <BankAvatar bank={selectedBank} size={32} />
              <Text style={styles.fieldValueText}>{selectedBank.name}</Text>
            </View>
          ) : (
            <Text style={styles.fieldPlaceholder}>Select recipient bank</Text>
          )}
          <Ionicons name="chevron-down" size={20} color={Colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Enter account number */}
        <TextInput
          style={styles.accountInput}
          placeholder="Enter account number"
          placeholderTextColor={Colors.textMuted}
          keyboardType="numeric"
          value={accountNumber}
          onChangeText={setAccountNumber}
          returnKeyType="done"
          maxLength={20}
        />

        <View style={styles.divider} />

        {/* Transfer type */}
        <View style={styles.transferTypeBlock}>
          <Text style={styles.transferTypeLabel}>Transfer type</Text>
          <TouchableOpacity style={styles.field}>
            <Text style={styles.fieldValueText}>Fund transfer</Text>
            <Ionicons name="chevron-down" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Floating next button ── */}
      <TouchableOpacity
        style={[styles.nextBtn, { bottom: insets.bottom + 24 }, !canProceed && styles.nextBtnDisabled]}
        activeOpacity={canProceed ? 0.8 : 1}
        onPress={() => canProceed && router.push('/send-money-amount')}
      >
        <Ionicons name="chevron-forward" size={26} color={canProceed ? Colors.textPrimary : Colors.textMuted} />
      </TouchableOpacity>

      {/* ── Bank picker modal ── */}
      <Modal
        visible={bankModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setBankModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + Spacing.md }]}>
            {/* Modal header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a bank/eWallet</Text>
              <TouchableOpacity onPress={() => { setBankModalVisible(false); setSearch(''); }}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search bank/eWallet"
                placeholderTextColor={Colors.textMuted}
                value={search}
                onChangeText={setSearch}
                returnKeyType="search"
              />
            </View>

            {/* Bank list */}
            <FlatList
              data={filteredBanks}
              keyExtractor={(b) => b.id}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.bankRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedBank(item);
                    setBankModalVisible(false);
                    setSearch('');
                  }}
                >
                  <BankAvatar bank={item} size={44} />
                  <Text style={styles.bankName}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.bankSeparator} />}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  backBtn: {
    padding: Spacing.sm,
    alignSelf: 'flex-start',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.h1,
    fontWeight: '700',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },

  // ── Form ──
  form: {
    paddingHorizontal: Spacing.md,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  fieldPlaceholder: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: Typography.body,
  },
  fieldValueText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.body,
  },
  selectedBankRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  accountInput: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    paddingVertical: Spacing.sm,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.textMuted,
    opacity: 0.3,
    marginVertical: Spacing.xs,
  },
  transferTypeBlock: {
    paddingTop: Spacing.xs,
  },
  transferTypeLabel: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
    marginBottom: 4,
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

  // ── Bank avatar ──
  bankAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankAbbr: {
    color: '#fff',
    fontWeight: '700',
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    backgroundColor: '#1A1630',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2440',
    borderRadius: 22,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.body,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  bankName: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '500',
  },
  bankSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.textMuted,
    opacity: 0.15,
  },
});
