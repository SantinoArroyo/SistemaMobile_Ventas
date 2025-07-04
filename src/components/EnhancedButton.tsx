import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS, EFFECTS } from '../theme/colors';

interface EnhancedButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: 'left' | 'right';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'gradient' | 'glass';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: any;
  gradientType?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'sunset' | 'ocean' | 'forest' | 'royal' | 'fire' | 'cool' | 'warm' | 'calm';
  glowEffect?: boolean;
  fullWidth?: boolean;
}

export default function EnhancedButton({
  title,
  onPress,
  icon,
  iconPosition = 'left',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  gradientType = 'primary',
  glowEffect = false,
  fullWidth = false,
}: EnhancedButtonProps) {
  // --- NUEVO: Forzar texto por defecto si title es vacío ---
  const buttonTitle = (typeof title === 'string' && title.trim().length > 0) ? title : 'Botón';

  const getButtonColors = () => {
    switch (variant) {
      case 'primary':
        return { background: COLORS.celeste, text: COLORS.white };
      case 'secondary':
        return { background: COLORS.naranja, text: COLORS.white };
      case 'success':
        return { background: COLORS.success, text: COLORS.white };
      case 'warning':
        return { background: COLORS.warning, text: COLORS.white };
      case 'error':
        return { background: COLORS.error, text: COLORS.white };
      case 'outline':
        return { background: COLORS.white, text: COLORS.celeste };
      default:
        return { background: COLORS.celeste, text: COLORS.white };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: Math.max(SPACING.sm, 8), paddingHorizontal: Math.max(SPACING.md, 16), fontSize: 15, minWidth: 80 };
      case 'large':
        return { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl, fontSize: 18, minWidth: 120 };
      default:
        return { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, fontSize: 16, minWidth: 100 };
    }
  };

  const colors = getButtonColors();
  const sizeStyles = getSizeStyles();

  const renderGradientButton = () => (
    <LinearGradient
      colors={EFFECTS.gradients[gradientType] as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.button,
        styles.gradientButton,
        sizeStyles,
        fullWidth && styles.fullWidth,
        glowEffect && SHADOWS.glow,
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View style={styles.buttonContent}>
          {icon && iconPosition === 'left' && (
            <MaterialIcons 
              name={icon} 
              size={sizeStyles.fontSize} 
              color={COLORS.white} 
              style={styles.leftIcon}
            />
          )}
          <Text style={[styles.buttonText, styles.gradientText, { color: COLORS.white }, textStyle]}>
            {buttonTitle}
          </Text>
          {icon && iconPosition === 'right' && (
            <MaterialIcons 
              name={icon} 
              size={sizeStyles.fontSize} 
              color={COLORS.white} 
              style={styles.rightIcon}
            />
          )}
        </View>
      </Pressable>
    </LinearGradient>
  );

  const renderGlassButton = () => (
    <View style={[
      styles.button,
      styles.glassButton,
      sizeStyles,
      fullWidth && styles.fullWidth,
      style,
    ]}>
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View style={styles.buttonContent}>
          {icon && iconPosition === 'left' && (
            <MaterialIcons 
              name={icon} 
              size={sizeStyles.fontSize} 
              color={COLORS.celesteDark} 
              style={styles.leftIcon}
            />
          )}
          <Text style={[styles.buttonText, styles.glassText, { color: COLORS.celesteDark }, textStyle]}>
            {buttonTitle}
          </Text>
          {icon && iconPosition === 'right' && (
            <MaterialIcons 
              name={icon} 
              size={sizeStyles.fontSize} 
              color={COLORS.celesteDark} 
              style={styles.rightIcon}
            />
          )}
        </View>
      </Pressable>
    </View>
  );

  const renderDefaultButton = () => (
    <View style={[
      styles.button,
      styles.defaultButton,
      { backgroundColor: colors.background },
      variant === 'outline' && styles.outlineButton,
      sizeStyles,
      fullWidth && styles.fullWidth,
      glowEffect && SHADOWS.glow,
      style,
    ]}>
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View style={styles.buttonContent}>
          {icon && iconPosition === 'left' && (
            <MaterialIcons 
              name={icon} 
              size={sizeStyles.fontSize} 
              color={variant === 'outline' ? COLORS.celeste : colors.text} 
              style={styles.leftIcon}
            />
          )}
          <Text style={[
            styles.buttonText,
            variant === 'outline' ? { color: COLORS.celeste, fontSize: sizeStyles.fontSize } : { color: colors.text, fontSize: sizeStyles.fontSize },
            textStyle
          ]}>
            {buttonTitle}
          </Text>
          {icon && iconPosition === 'right' && (
            <MaterialIcons 
              name={icon} 
              size={sizeStyles.fontSize} 
              color={variant === 'outline' ? COLORS.celeste : colors.text} 
              style={styles.rightIcon}
            />
          )}
        </View>
      </Pressable>
    </View>
  );

  if (variant === 'gradient') {
    return renderGradientButton();
  }

  if (variant === 'glass') {
    return renderGlassButton();
  }

  return renderDefaultButton();
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.button,
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  outlineText: {
    color: COLORS.celeste,
    fontWeight: 'bold',
    fontSize: 16,
  },
  pressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  pressed: {
    elevation: 4,
    shadowColor: COLORS.celeste,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  rightIcon: {
    marginLeft: SPACING.sm,
  },
  fullWidth: {
    width: '100%',
  },
  // Variantes de botón
  defaultButton: {
    borderWidth: 0,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: COLORS.celeste,
    backgroundColor: COLORS.white,
    shadowColor: 'transparent',
  },
  gradientButton: {
    ...SHADOWS.depth,
  },
  gradientText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  glassButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...SHADOWS.soft,
  },
  glassText: {
    color: COLORS.celesteDark,
    fontWeight: 'bold',
  },
}); 