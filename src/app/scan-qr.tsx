import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';

const { width } = Dimensions.get('window');
const VIEWFINDER_SIZE = width * 0.72;

function CornerBracket({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const isTop = position === 'tl' || position === 'tr';
  const isLeft = position === 'tl' || position === 'bl';
  return (
    <View style={[
      styles.corner,
      isTop ? styles.cornerTop : styles.cornerBottom,
      isLeft ? styles.cornerLeft : styles.cornerRight,
    ]}>
      <View style={[styles.cornerH, isTop ? styles.cornerHTop : styles.cornerHBottom]} />
      <View style={[styles.cornerV, isLeft ? styles.cornerVLeft : styles.cornerVRight]} />
    </View>
  );
}

function BurnRateModal({ visible, onReduce, onProceed }: {
  visible: boolean;
  onReduce: () => void;
  onProceed: () => void;
}) {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Animated.View style={[styles.burnCard, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.burnHeader}>
            <Ionicons name="warning" size={16} color={Colors.amberLt} />
            <Text style={styles.burnTitle}>Burn Rate Sentinel!</Text>
          </View>
          <Text style={styles.burnHeading}>You've spent 2.1× your weekly pace this week.</Text>
          <Text style={styles.burnBody}>
            At this rate, you'd have RM89 left by next Wednesday before your next top-up. This transfer may leave you short.
          </Text>
          <View style={styles.burnActions}>
            <TouchableOpacity style={styles.reduceBtn} onPress={onReduce}>
              <Text style={styles.reduceBtnText}>Lock remaining amount until 24th May.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.proceedBtn} onPress={onProceed}>
              <Text style={styles.proceedBtnText}>Proceed{'\n'}anyway</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

export default function ScanQRScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'pay' | 'receive'>('pay');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="ellipsis-horizontal" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Pay / Receive tab */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pay' && styles.tabActive]}
          onPress={() => setActiveTab('pay')}
        >
          <Text style={[styles.tabText, activeTab === 'pay' && styles.tabTextActive]}>Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'receive' && styles.tabActive]}
          onPress={() => setActiveTab('receive')}
        >
          <Text style={[styles.tabText, activeTab === 'receive' && styles.tabTextActive]}>Receive</Text>
        </TouchableOpacity>
      </View>

      {/* DuitNow QR branding */}
      <View style={styles.brandRow}>
        <View style={styles.duitnowIcon}>
          <Text style={styles.duitnowIconText}>D</Text>
        </View>
        <View>
          <Text style={styles.duitnowLabel}>DuitNow</Text>
          <Text style={styles.duitnowSub}>QR</Text>
        </View>
      </View>

      {/* Viewfinder */}
      <View style={styles.viewfinderWrap}>
        <View style={styles.viewfinder}>
          <CornerBracket position="tl" />
          <CornerBracket position="tr" />
          <CornerBracket position="bl" />
          <CornerBracket position="br" />
        </View>
      </View>

      {/* Flash toggle */}
      <View style={styles.flashRow}>
        <View style={styles.flashCircle}>
          <Ionicons name="flash-off" size={22} color={Colors.textPrimary} />
          <View style={styles.flashSlash} />
        </View>
      </View>

      {/* Scan from gallery */}
      <View style={[styles.galleryWrap, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <TouchableOpacity style={styles.galleryBtn}>
          <Text style={styles.galleryBtnText}>Scan from gallery</Text>
        </TouchableOpacity>
      </View>

      <BurnRateModal
        visible={showModal}
        onReduce={() => { setShowModal(false); router.back(); }}
        onProceed={() => setShowModal(false)}
      />
    </View>
  );
}

const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;
const CORNER_RADIUS = 10;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  headerBtn: {
    padding: Spacing.sm,
    width: 44,
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '600',
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 30,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 26,
  },
  tabActive: {
    backgroundColor: Colors.accent,
  },
  tabText: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.textPrimary,
  },

  // DuitNow branding
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  duitnowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D42B2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  duitnowIconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  duitnowLabel: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  duitnowSub: {
    color: Colors.textPrimary,
    fontSize: 11,
    letterSpacing: 2,
    lineHeight: 14,
  },

  // Viewfinder
  viewfinderWrap: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  viewfinder: {
    width: VIEWFINDER_SIZE,
    height: VIEWFINDER_SIZE,
    borderRadius: 28,
    backgroundColor: 'rgba(180,160,140,0.25)',
    overflow: 'hidden',
  },

  // Corner brackets
  corner: {
    position: 'absolute',
    width: CORNER_SIZE + CORNER_THICKNESS,
    height: CORNER_SIZE + CORNER_THICKNESS,
  },
  cornerTop: { top: 0 },
  cornerBottom: { bottom: 0 },
  cornerLeft: { left: 0 },
  cornerRight: { right: 0 },
  cornerH: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_THICKNESS,
    backgroundColor: Colors.accentLt,
    borderRadius: 2,
  },
  cornerHTop: { top: 0, left: 0 },
  cornerHBottom: { bottom: 0, left: 0 },
  cornerV: {
    position: 'absolute',
    width: CORNER_THICKNESS,
    height: CORNER_SIZE,
    backgroundColor: Colors.accentLt,
    borderRadius: 2,
  },
  cornerVLeft: { left: 0, top: 0 },
  cornerVRight: { right: 0, top: 0 },

  // Flash
  flashRow: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  flashCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  flashSlash: {
    position: 'absolute',
    width: 30,
    height: 1.5,
    backgroundColor: Colors.textSecondary,
    transform: [{ rotate: '45deg' }],
  },

  // Gallery
  galleryWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  galleryBtn: {
    borderWidth: 1.5,
    borderColor: Colors.textPrimary,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  galleryBtnText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '500',
  },

  // Burn Rate Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    paddingBottom: 40,
    paddingHorizontal: Spacing.md,
  },
  burnCard: {
    backgroundColor: Colors.burnBg,
    borderWidth: 1,
    borderColor: Colors.burnBorder,
    borderRadius: Radius.card,
    padding: Spacing.md,
  },
  burnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  burnTitle: {
    color: Colors.amberLt,
    fontSize: Typography.body,
    fontWeight: '700',
  },
  burnHeading: {
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: Spacing.sm,
  },
  burnBody: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  burnActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  reduceBtn: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: Radius.button,
    paddingVertical: 14,
    alignItems: 'center',
  },
  reduceBtnText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '600',
  },
  proceedBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 14,
    alignItems: 'center',
  },
  proceedBtnText: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    textAlign: 'center',
    lineHeight: 18,
  },
});
