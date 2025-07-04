import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS } from '../theme/colors';
import EnhancedCard from './EnhancedCard';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onPress?: () => void;
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  color = COLORS.celeste,
  trend,
  onPress,
}: DashboardCardProps) {
  return (
    <EnhancedCard
      variant="glass"
      style={StyleSheet.flatten([styles.container, SHADOWS.medium])}
      icon={icon}
      iconColor={color}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <MaterialIcons name={icon} size={24} color={color} />
          </View>
          {trend && (
            <View style={[
              styles.trendContainer,
              { backgroundColor: trend.isPositive ? COLORS.successLight : COLORS.errorLight }
            ]}>
              <MaterialIcons 
                name={trend.isPositive ? 'trending-up' : 'trending-down'} 
                size={16} 
                color={trend.isPositive ? COLORS.success : COLORS.error} 
              />
              <Paragraph style={[
                styles.trendText,
                { color: trend.isPositive ? COLORS.success : COLORS.error }
              ]}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Paragraph>
            </View>
          )}
        </View>
        
        <Title style={styles.value}>{value}</Title>
        <Paragraph style={styles.title}>{title}</Paragraph>
        {subtitle && (
          <Paragraph style={styles.subtitle}>{subtitle}</Paragraph>
        )}
      </View>
    </EnhancedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: SPACING.xs,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
}); 