import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { MOCK_USER, MOCK_FOCUSED_BRIEF } from '@/mock/data';

type BadgeType = 'warning' | 'opportunity' | 'delay' | 'protected';

const BADGE_STYLES: Record<BadgeType, { bg: string; text: string }> = {
  warning:     { bg: 'rgba(186,117,23,0.25)',  text: Colors.amberLt },
  opportunity: { bg: 'rgba(29,158,117,0.25)',  text: Colors.greenLt },
  delay:       { bg: 'rgba(186,117,23,0.25)',  text: Colors.amberLt },
  protected:   { bg: 'rgba(124,58,237,0.25)', text: Colors.accentLt },
};

function AgentBadge({ type, label }: { type: BadgeType; label: string }) {
  const s = BADGE_STYLES[type];
  return (
    <View style={[cardStyles.badge, { backgroundColor: s.bg }]}>
      <Text style={[cardStyles.badgeText, { color: s.text }]}>{label}</Text>
    </View>
  );
}

function AgentSummaryCard({
  agent,
}: {
  agent: (typeof MOCK_FOCUSED_BRIEF.agents)[number];
}) {
  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.agentName}>{agent.label}</Text>
      <AgentBadge type={agent.badgeType} label={agent.badge} />
      <Text style={cardStyles.agentText}>{agent.text}</Text>
    </View>
  );
}

export default function FocusedReportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [approved, setApproved] = useState<Set<string>>(new Set());

  function toggleApprove(id: string) {
    setApproved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Board report · on-demand</Text>
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>Live</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Mascot focused brief */}
        <View style={styles.mascotCard}>
          <View style={styles.mascotRow}>
            <View style={styles.mascotAvatar} />
            <Text style={styles.mascotLabel}>
              Mascot{' '}
              <Text style={styles.mascotLabelAccent}>· focused brief</Text>
            </Text>
          </View>
          <Text style={styles.mascotQuote}>
            "{MOCK_FOCUSED_BRIEF.mascotQuote}"
          </Text>
        </View>

        {/* Agent 2×2 grid */}
        <View style={styles.agentGrid}>
          <View style={styles.agentRow}>
            <AgentSummaryCard agent={MOCK_FOCUSED_BRIEF.agents[0]} />
            <AgentSummaryCard agent={MOCK_FOCUSED_BRIEF.agents[1]} />
          </View>
          <View style={styles.agentRow}>
            <AgentSummaryCard agent={MOCK_FOCUSED_BRIEF.agents[2]} />
            <AgentSummaryCard agent={MOCK_FOCUSED_BRIEF.agents[3]} />
          </View>
        </View>

        {/* Board Recommendation */}
        <Text style={styles.recLabel}>BOARD RECOMMENDATION</Text>

        {MOCK_FOCUSED_BRIEF.recommendations.map((rec, idx) => (
          <View key={rec.id}>
            <View style={styles.recItem}>
              <View style={styles.recInfo}>
                <Text style={styles.recTitle}>{rec.title}</Text>
                <Text style={styles.recSub}>{rec.subtitle}</Text>
              </View>
              <TouchableOpacity
                style={[styles.approveBtn, approved.has(rec.id) && styles.approveBtnDone]}
                activeOpacity={0.8}
                onPress={() => toggleApprove(rec.id)}
              >
                <Text style={styles.approveBtnText}>
                  {approved.has(rec.id) ? 'Done ✓' : 'Approve'}
                </Text>
              </TouchableOpacity>
            </View>
            {idx < MOCK_FOCUSED_BRIEF.recommendations.length - 1 && (
              <View style={styles.divider} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: 6,
  },
  agentName: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '700',
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  agentText: {
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    lineHeight: 18,
  },
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.h3,
    fontWeight: '700',
  },
  liveBadge: {
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  liveBadgeText: {
    color: Colors.textPrimary,
    fontSize: Typography.caption,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  // Mascot card
  mascotCard: {
    backgroundColor: Colors.card,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  mascotAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
  },
  mascotLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '700',
  },
  mascotLabelAccent: {
    color: Colors.accentLt,
    fontWeight: '400',
  },
  mascotQuote: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    lineHeight: 22,
  },

  // Agent grid
  agentGrid: {
    gap: Spacing.sm,
  },
  agentRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  // Recommendations
  recLabel: {
    color: Colors.accent,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: Spacing.xs,
  },
  recItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  recInfo: {
    flex: 1,
    gap: 4,
  },
  recTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '700',
    lineHeight: 20,
  },
  recSub: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
  },
  approveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.button,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  approveBtnDone: {
    backgroundColor: Colors.green,
  },
  approveBtnText: {
    color: Colors.textPrimary,
    fontSize: Typography.caption,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2440',
  },
});
