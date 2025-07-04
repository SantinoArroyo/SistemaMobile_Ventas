import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Surface, Card, Title, Paragraph } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS, EFFECTS } from '../theme/colors';
import { BlurView } from 'expo-blur';

interface EnhancedCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  gradientType?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'sunset' | 'ocean' | 'forest' | 'royal' | 'fire' | 'cool' | 'warm' | 'calm';
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'gradient' | 'glass' | 'neumorphism';
  elevation?: number;
  borderGradient?: boolean;
  glowEffect?: boolean;
}

export default function EnhancedCard({
  title,
  subtitle,
  children,
  icon,
  iconColor = COLORS.celeste,
  gradientType = 'primary',
  style,
  onPress,
  variant = 'default',
  elevation = 3,
  borderGradient = false,
  glowEffect = false,
}: EnhancedCardProps) {
  const renderCardContent = () => (
    <View style={styles.content}>
      {(title || icon) && (
        <View style={styles.header}>
          {icon && (
            <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}> 
              <MaterialIcons name={icon} size={24} color={iconColor} />
            </View>
          )}
          <View style={styles.titleContainer}>
            {title && <Title style={styles.title}>{title}</Title>}
            {subtitle && <Paragraph style={styles.subtitle}>{subtitle}</Paragraph>}
          </View>
        </View>
      )}
      {children}
    </View>
  );

  const renderGradientCard = () => (
    <LinearGradient
      colors={(EFFECTS.gradients[gradientType] || EFFECTS.gradients.primary) as [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientCard, style]}
    >
      {renderCardContent()}
    </LinearGradient>
  );

  const renderGlassCard = () => (
    <View style={[styles.glassCard, style]}>
      <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={["rgba(255,255,255,0.85)", "rgba(255,255,255,0.65)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glassOverlay} />
      <View style={styles.glassContent}>
        {renderCardContent()}
      </View>
    </View>
  );

  const renderNeumorphismCard = () => (
    <View style={[styles.neumorphismCard, style]}>
      {renderCardContent()}
    </View>
  );

  const renderDefaultCard = () => (
    <Surface 
      style={[
        styles.defaultCard, 
        glowEffect && SHADOWS.glow,
        style
      ]} 
      elevation={elevation as any}
    >
      {borderGradient && (
        <LinearGradient
          colors={(EFFECTS.borderGradients[gradientType as keyof typeof EFFECTS.borderGradients] || EFFECTS.borderGradients.primary) as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.borderGradient}
        />
      )}
      {renderCardContent()}
    </Surface>
  );

  const renderCard = () => {
    switch (variant) {
      case 'gradient':
        return renderGradientCard();
      case 'glass':
        return renderGlassCard();
      case 'neumorphism':
        return renderNeumorphismCard();
      default:
        return renderDefaultCard();
    }
  };

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.pressable}>
        {renderCard()}
      </Pressable>
    );
  }

  return renderCard();
}

const styles = StyleSheet.create({
  pressable: {
    marginBottom: SPACING.md,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: COLORS.celesteDark,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.gray,
    fontSize: 14,
  },
  // Variantes de tarjeta
  defaultCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientCard: {
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.depth,
  },
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderRadius: BORDER_RADIUS.xxl,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 32,
    elevation: 24,
    overflow: 'hidden',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BORDER_RADIUS.xxl,
    borderWidth: 0,
  },
  glassContent: {
    padding: SPACING.xl,
  },
  neumorphismCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.soft,
  },
  borderGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
  },
}); 