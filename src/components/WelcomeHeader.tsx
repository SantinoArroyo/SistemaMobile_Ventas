import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Title, Paragraph, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS } from '../theme/colors';

interface WelcomeHeaderProps {
  title: string;
  subtitle?: string;
  stats?: {
    label: string;
    value: string | number;
    icon: keyof typeof MaterialIcons.glyphMap;
    color?: string;
  }[];
  showDate?: boolean;
}

export default function WelcomeHeader({
  title,
  subtitle,
  stats,
  showDate = true,
}: WelcomeHeaderProps) {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Surface style={[styles.container, SHADOWS.medium]} elevation={3}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Title style={styles.title}>{title}</Title>
          {subtitle && <Paragraph style={styles.subtitle}>{subtitle}</Paragraph>}
          {showDate && (
            <Chip
              mode="outlined"
              style={styles.dateChip}
              textStyle={styles.dateChipText}
              icon="calendar-today"
            >
              {currentDate}
            </Chip>
          )}
        </View>
        
        {stats && stats.length > 0 && (
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <MaterialIcons 
                  name={stat.icon} 
                  size={20} 
                  color={stat.color || COLORS.celeste} 
                />
                <View style={styles.statContent}>
                  <Paragraph style={styles.statValue}>{stat.value}</Paragraph>
                  <Paragraph style={styles.statLabel}>{stat.label}</Paragraph>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    margin: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  header: {
    padding: SPACING.lg,
  },
  titleContainer: {
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.celesteDark,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.gray,
    fontSize: 16,
    marginBottom: SPACING.sm,
  },
  dateChip: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.celesteLight,
    borderColor: COLORS.celeste,
  },
  dateChipText: {
    color: COLORS.celesteDark,
    fontSize: 12,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    marginHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
    minWidth: 80,
  },
  statContent: {
    marginLeft: SPACING.sm,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
}); 