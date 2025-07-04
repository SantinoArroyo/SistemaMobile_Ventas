import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/colors';
import EnhancedButton from './EnhancedButton';

interface EmptyStateProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  showAction?: boolean;
}

export default function EmptyState({ 
  icon, 
  title, 
  message, 
  actionLabel = 'Agregar',
  onAction,
  showAction = true 
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <MaterialIcons name={icon} size={64} color={COLORS.gray} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {showAction && onAction && (
        <EnhancedButton
          title={actionLabel}
          onPress={onAction}
          variant="gradient"
          gradientType="primary"
          style={styles.button}
          textStyle={styles.buttonLabel}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: COLORS.darkGray,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  button: {
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
  },
  buttonLabel: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
}); 