import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS, EFFECTS } from '../theme/colors';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  gradientType?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'sunset' | 'ocean' | 'forest' | 'royal' | 'fire' | 'cool' | 'warm' | 'calm';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  style?: ViewStyle;
  variant?: 'default' | 'gradient' | 'glass';
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  iconColor = COLORS.celeste,
  gradientType = 'primary',
  trend,
  style,
  variant = 'default',
}: StatsCardProps) {
  const renderGradientCard = () => (
    <LinearGradient
      colors={EFFECTS.gradients[gradientType] as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, styles.gradientCard, style]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.18)' }]}> 
            <MaterialIcons name={icon} size={38} color={COLORS.white} />
          </View>
        </View>
        <Title style={styles.gradientValue}>{value}</Title>
        <Paragraph style={styles.gradientTitle}>{title}</Paragraph>
        {subtitle && (
          <Paragraph style={styles.gradientSubtitle}>{subtitle}</Paragraph>
        )}
      </View>
    </LinearGradient>
  );

  const renderGlassCard = () => (
    <View style={[styles.container, styles.glassCard, style]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}> 
            <MaterialIcons name={icon} size={38} color={iconColor} />
          </View>
        </View>
        <Title style={styles.value}>{value}</Title>
        <Paragraph style={styles.title}>{title}</Paragraph>
        {subtitle && (
          <Paragraph style={styles.subtitle}>{subtitle}</Paragraph>
        )}
      </View>
    </View>
  );

  const renderDefaultCard = () => (
    <View style={[styles.container, styles.defaultCard, style]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}> 
            <MaterialIcons name={icon} size={38} color={iconColor} />
          </View>
        </View>
        <Title style={styles.value}>{value}</Title>
        <Paragraph style={styles.title}>{title}</Paragraph>
        {subtitle && (
          <Paragraph style={styles.subtitle}>{subtitle}</Paragraph>
        )}
      </View>
    </View>
  );

  switch (variant) {
    case 'gradient':
      return renderGradientCard();
    case 'glass':
      return renderGlassCard();
    default:
      return renderDefaultCard();
  }
}

const styles = StyleSheet.create({
  container: {
    minWidth: 110,
    flex: 1,
    margin: SPACING.xs,
    borderRadius: BORDER_RADIUS.xxl,
    ...SHADOWS.large,
    elevation: 8,
    maxWidth: 180,
  },
  content: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  gradientCard: {
    ...SHADOWS.large,
  },
  gradientValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  gradientTitle: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: SPACING.xs,
    fontWeight: '500',
    textAlign: 'center',
  },
  gradientSubtitle: {
    fontSize: 13,
    color: COLORS.white + 'CC',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...SHADOWS.soft,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
    fontWeight: '500',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.gray,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  defaultCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
}); 