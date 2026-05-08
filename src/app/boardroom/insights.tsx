import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { MOCK_S2S, MOCK_WINDFALL, MOCK_GOAL } from '@/mock/data';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface AgentCard {
  name: string;
  icon: IoniconsName;
  iconColor: string;
  status: string;
  statusColor: string;
  description: string;
}

const AGENTS: AgentCard[] = [
  {
    name: 'Sentinel',
    icon: 'flame-outline',
    iconColor: '#F97316',
    status: 'Warning',
    statusColor: '#F97316',
    description: `Burn rate ${MOCK_S2S.burn_velocity}× S₂S. Kepong spike detected.`,
  },
  {
    name: 'Scout',
    icon: 'trending-up-outline',
    iconColor: Colors.greenLt,
    status: 'Opportunity',
    statusColor: Colors.greenLt,
    description: `Windfall RM${MOCK_WINDFALL.amount} found in reimbursements.`,
  },
  {
    name: 'Architect',
    icon: 'time-outline',
    iconColor: Colors.amberLt,
    status: 'Delay',
    statusColor: Colors.amberLt,
    description: `Okinawa ETA +${MOCK_GOAL.days_delayed} days from V spike.`,
  },
  {
    name: 'Shield',
    icon: 'shield-outline',
    iconColor: Colors.accentLt,
    status: 'Protected',
    statusColor: Colors.accentLt,
    description: 'Travel Shield unlocked. Car risk rising.',
  },
];

const AGENT_ROUTES: Partial<Record<string, string>> = {
  Sentinel:  '/boardroom/agent/sentinel',
  Scout:     '/boardroom/agent/scout',
  Architect: '/boardroom/agent/architect',
  Shield:    '/boardroom/agent/shield',
};

function AgentCardTile({ agent }: { agent: AgentCard }) {
  const router = useRouter();
  const route = AGENT_ROUTES[agent.name];
  return (
    <TouchableOpacity
      style={styles.agentCard}
      activeOpacity={0.75}
      onPress={() => route && router.push(route as never)}
    >
      <Ionicons name={agent.icon} size={28} color={agent.iconColor} />
      <Text style={styles.agentName}>{agent.name}</Text>
      <View style={[styles.statusBadge, { backgroundColor: agent.statusColor + '28' }]}>
        <Text style={[styles.statusText, { color: agent.statusColor }]}>{agent.status}</Text>
      </View>
      <Text style={styles.agentDesc}>{agent.description}</Text>
    </TouchableOpacity>
  );
}

export default function AgentInsightsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agent insights</Text>
        <View style={styles.pageDots}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.pageDot, i === 1 && styles.pageDotActive]} />
          ))}
        </View>
      </View>

      {/* ── Sub-heading ── */}
      <Text style={styles.subHeading}>TAP ANY AGENT TO DRILL DOWN</Text>

      {/* ── 2×2 Agent Grid ── */}
      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <AgentCardTile agent={AGENTS[0]} />
          <AgentCardTile agent={AGENTS[1]} />
        </View>
        <View style={styles.gridRow}>
          <AgentCardTile agent={AGENTS[2]} />
          <AgentCardTile agent={AGENTS[3]} />
        </View>
      </View>

      {/* ── Bottom CTA ── */}
      <View style={styles.bottomArea}>
        <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85} onPress={() => router.push('/boardroom/action-plan')}>
          <Text style={styles.ctaBtnText}>Go to action plan →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '700',
    marginLeft: Spacing.xs,
  },
  pageDots: {
    flexDirection: 'row',
    gap: 6,
    paddingRight: Spacing.sm,
  },
  pageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
  pageDotActive: {
    backgroundColor: Colors.textPrimary,
  },

  // ── Sub-heading ──
  subHeading: {
    color: Colors.accent,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 1.2,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },

  // ── Grid ──
  grid: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  agentCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: 8,
  },
  agentName: {
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '700',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: Typography.caption,
    fontWeight: '700',
  },
  agentDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },

  // ── Bottom CTA ──
  bottomArea: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  ctaBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.card,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  ctaBtnText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '700',
  },
});
