import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';

const RADIUS = 46;
const STROKE = 7;
const RING_SIZE = (RADIUS + STROKE) * 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AGENTS = [
  {
    id: 'sentinel',
    label: 'Sentinel',
    color: '#E8697D',
    finalPct: 100,
    delay: 0,
    duration: 3200,
    statuses: ['Scanning...', 'Reviewing burn...', 'Flagging risks...'] as const,
  },
  {
    id: 'scout',
    label: 'Scout',
    color: '#0BB4A9',
    finalPct: 100,
    delay: 350,
    duration: 3100,
    statuses: ['Mapping flows...', 'Tracking income...', 'Confirming windfall...'] as const,
  },
  {
    id: 'architect',
    label: 'Architect',
    color: '#F59E0B',
    finalPct: 100,
    delay: 150,
    duration: 3700,
    statuses: ['Planning...', 'Modelling goals...', 'Optimising allocation...'] as const,
  },
  {
    id: 'shield',
    label: 'Shield',
    color: '#A78BFA',
    finalPct: 100,
    delay: 500,
    duration: 2600,
    statuses: ['Auditing...', 'Checking risks...', 'Reviewing coverage...'] as const,
  },
] as const;

type Agent = (typeof AGENTS)[number];

function AgentRing({ agent, onDone }: { agent: Agent; onDone: () => void }) {
  const progress = useRef(new Animated.Value(0)).current;
  const [pct, setPct] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let labelInterval: ReturnType<typeof setInterval>;
    let listenerId: string;

    const startTimer = setTimeout(() => {
      listenerId = progress.addListener(({ value }) => setPct(Math.round(value)));

      labelInterval = setInterval(() => {
        setStatusIdx((i) => Math.min(i + 1, agent.statuses.length - 1));
      }, Math.floor(agent.duration / agent.statuses.length));

      Animated.timing(progress, {
        toValue: agent.finalPct,
        duration: agent.duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(() => {
        clearInterval(labelInterval);
        progress.removeListener(listenerId);
        setDone(true);
        onDone();
      });
    }, agent.delay);

    return () => {
      clearTimeout(startTimer);
      if (labelInterval) clearInterval(labelInterval);
      if (listenerId) progress.removeListener(listenerId);
      progress.stopAnimation();
    };
  }, []);

  const dashOffset = progress.interpolate({
    inputRange: [0, agent.finalPct],
    outputRange: [CIRCUMFERENCE, CIRCUMFERENCE * (1 - agent.finalPct / 100)],
  });

  return (
    <View style={ringStyles.card}>
      <View style={ringStyles.svgWrap}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke="#2A2440"
            strokeWidth={STROKE}
            fill="none"
          />
          <AnimatedCircle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke={agent.color}
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={String(CIRCUMFERENCE)}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${RING_SIZE / 2},${RING_SIZE / 2}`}
          />
        </Svg>
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <View style={ringStyles.pctWrap}>
            <Text style={[ringStyles.pct, { color: agent.color }]}>{pct}%</Text>
          </View>
        </View>
      </View>
      <Text style={ringStyles.name}>{agent.label}</Text>
      <Text style={ringStyles.status}>{done ? 'Done' : agent.statuses[statusIdx]}</Text>
    </View>
  );
}

export default function BoardInSessionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ chips?: string; context?: string }>();
  const [doneCount, setDoneCount] = useState(0);
  const synthProgress = useRef(new Animated.Value(0)).current;

  const handleAgentDone = useCallback(() => {
    setDoneCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    Animated.timing(synthProgress, {
      toValue: doneCount * 25,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    if (doneCount === 4) {
      setTimeout(() => {
        router.replace({
          pathname: '/boardroom/focused-report',
          params: { chips: params.chips ?? '', context: params.context ?? '' },
        });
      }, 800);
    }
  }, [doneCount]);

  const synthBarWidth = synthProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const synthLabel =
    doneCount === 4
      ? 'Synthesising your brief...'
      : `${doneCount} of 4 agents complete`;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.heading}>BOARD IN SESSION</Text>
      <Text style={styles.sub}>Agents are reviewing your finances</Text>

      <View style={styles.grid}>
        <View style={styles.gridRow}>
          {(AGENTS.slice(0, 2) as Agent[]).map((agent) => (
            <AgentRing key={agent.id} agent={agent} onDone={handleAgentDone} />
          ))}
        </View>
        <View style={styles.gridRow}>
          {(AGENTS.slice(2, 4) as Agent[]).map((agent) => (
            <AgentRing key={agent.id} agent={agent} onDone={handleAgentDone} />
          ))}
        </View>
      </View>

      <View style={styles.synthCard}>
        <Text style={styles.synthLabel}>SYNTHESISING</Text>
        <View style={styles.synthTrack}>
          <Animated.View style={[styles.synthFill, { width: synthBarWidth }]} />
        </View>
        <Text style={styles.synthCount}>{synthLabel}</Text>
      </View>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#16112E',
    borderRadius: Radius.card,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 6,
  },
  svgWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
  },
  pctWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pct: {
    fontSize: Typography.h3,
    fontWeight: '700',
  },
  name: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: '700',
  },
  status: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.md,
  },
  heading: {
    color: Colors.accentLt,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  sub: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  grid: {
    gap: Spacing.sm,
  },
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  synthCard: {
    backgroundColor: '#16112E',
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  synthLabel: {
    color: Colors.textMuted,
    fontSize: Typography.caption,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  synthTrack: {
    height: 4,
    backgroundColor: '#2A2440',
    borderRadius: 2,
    overflow: 'hidden',
  },
  synthFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  synthCount: {
    color: Colors.textSecondary,
    fontSize: Typography.body,
  },
});
