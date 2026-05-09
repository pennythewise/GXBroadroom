import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';

const BADGE_PINK = '#E91E8C';
const ICON_BG = '#1E1B2E';
const ICON_SIZE = 62;
const MODAL_BG = '#0D0B1F';
const CHIP_BG = '#1C1830';
const CHIP_SELECTED_BG = '#3B2A6E';
const SECTION_LABEL = '#7C5FD4';

const QUICK_CONTEXTS = [
  'I just received money',
  'I have a new goal',
  'Planning a big purchase',
  'Feeling financially stressed',
  'My income just changed',
  'Just want a check-in',
];

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface ServiceItem {
  id: string;
  icon: IoniconName;
  label: string;
  badge?: string;
}

const sections: { title: string; items: ServiceItem[] }[] = [
  {
    title: 'Service',
    items: [
      { id: 'broadroom', icon: 'apps-outline', label: 'GX Broadroom', badge: 'On-demand' },
    ],
  },
  {
    title: 'Spend',
    items: [
      { id: 'card', icon: 'card-outline', label: 'GX Card' },
      { id: 'secure', icon: 'lock-closed-outline', label: 'GXsecure' },
    ],
  },
  {
    title: 'Save',
    items: [
      { id: 'bonus', icon: 'time-outline', label: 'Bonus Pocket', badge: '3.55%' },
      { id: 'savings', icon: 'wallet-outline', label: 'Savings\nPockets' },
    ],
  },
  {
    title: 'Insurance',
    items: [
      { id: 'car', icon: 'car-outline', label: 'Car insurance', badge: 'RM100' },
      { id: 'cyber', icon: 'globe-outline', label: 'Cyber Fraud\nProtect' },
      { id: 'travel', icon: 'airplane-outline', label: 'Travel\ninsurance', badge: 'NEW' },
    ],
  },
];

function ConveneModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState('');

  const canConvene = selected !== null;

  function handleChip(ctx: string) {
    setSelected((prev) => (prev === ctx ? null : ctx));
  }

  function handleConvene() {
    onClose();
    const chip = selected ?? '';
    const ctx = detail;
    setSelected(null);
    setDetail('');
    router.push({
      pathname: '/boardroom/board-in-session',
      params: { chips: chip, context: ctx },
    });
  }

  function handleCancel() {
    onClose();
    setSelected(null);
    setDetail('');
  }

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Convene your board</Text>
          <Text style={styles.modalSubtitle}>
            {"Tell your board what's on your mind. They'll analyse your finances through that lens and return a focused report."}
          </Text>

          <Text style={styles.sectionLabel}>QUICK CONTEXT</Text>
          {QUICK_CONTEXTS.map((ctx) => {
            const isSelected = selected === ctx;
            return (
              <TouchableOpacity
                key={ctx}
                style={[styles.chip, isSelected && styles.chipSelected]}
                activeOpacity={0.75}
                onPress={() => handleChip(ctx)}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {ctx}
                </Text>
              </TouchableOpacity>
            );
          })}

          <Text style={styles.sectionLabel}>
            ADD DETAIL{' '}
            <Text style={styles.sectionLabelOptional}>(optional)</Text>
          </Text>
          <TextInput
            style={styles.detailInput}
            placeholder={'e.g. "I got my internship allowance early\nand want to know if I can afford a trip..."'}
            placeholderTextColor={Colors.textMuted}
            multiline
            value={detail}
            onChangeText={setDetail}
          />

          <TouchableOpacity
            style={[styles.conveneBtn, canConvene && styles.conveenBtnActive]}
            activeOpacity={canConvene ? 0.8 : 1}
            onPress={canConvene ? handleConvene : undefined}
          >
            <Text style={[styles.conveenBtnText, canConvene && styles.conveenBtnTextActive]}>
              Convene board
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.7} onPress={handleCancel}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function ItemTile({ item, onPress }: { item: ServiceItem; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.tile} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <View style={styles.iconCircle}>
          <Ionicons name={item.icon} size={28} color={Colors.textPrimary} />
        </View>
        {item.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.tileLabel}>{item.label}</Text>
    </TouchableOpacity>
  );
}

export default function DiscoverScreen() {
  const [showConvene, setShowConvene] = useState(false);

  function handleTilePress(id: string) {
    if (id === 'broadroom') setShowConvene(true);
  }

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Discover</Text>

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.row}>
              {section.items.map((item) => (
                <ItemTile key={item.id} item={item} onPress={() => handleTilePress(item.id)} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <ConveneModal visible={showConvene} onClose={() => setShowConvene(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  heading: {
    color: Colors.textPrimary,
    fontSize: Typography.h2,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  tile: {
    alignItems: 'center',
    width: ICON_SIZE + Spacing.lg,
  },
  iconWrapper: {
    position: 'relative',
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: BADGE_PINK,
    borderRadius: Radius.small,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeText: {
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tileLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.caption,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalSheet: {
    backgroundColor: MODAL_BG,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 40,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.h2,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  modalSubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    color: SECTION_LABEL,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  sectionLabelOptional: {
    color: Colors.textMuted,
    fontWeight: '400',
    letterSpacing: 0,
  },
  chip: {
    backgroundColor: CHIP_BG,
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
  },
  chipSelected: {
    backgroundColor: CHIP_SELECTED_BG,
  },
  chipText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
  },
  chipTextSelected: {
    color: Colors.accentLt,
    fontWeight: '600',
  },
  detailInput: {
    backgroundColor: CHIP_BG,
    borderRadius: Radius.card,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: Typography.body,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: Spacing.lg,
  },
  conveneBtn: {
    backgroundColor: '#2D1F5E',
    borderRadius: Radius.button,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  conveenBtnActive: {
    backgroundColor: Colors.accent,
  },
  conveenBtnText: {
    color: Colors.textMuted,
    fontSize: Typography.body,
    fontWeight: '600',
  },
  conveenBtnTextActive: {
    color: Colors.textPrimary,
  },
  cancelBtn: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
  },
});
