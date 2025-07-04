import React from 'react';
import { View, StyleSheet, ViewStyle, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, EFFECTS } from '../theme/colors';

interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: ColorValue[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle;
  gradientType?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'sunset' | 'ocean' | 'forest' | 'royal' | 'fire' | 'cool' | 'warm' | 'calm';
}

export default function GradientBackground({
  children,
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  gradientType = 'primary',
}: GradientBackgroundProps) {
  // Asegurar que siempre tengamos colores válidos con al menos 2 elementos
  const gradientColors = (colors || EFFECTS.gradients[gradientType] || EFFECTS.gradients.primary || [COLORS.celeste, COLORS.celesteDark]) as [ColorValue, ColorValue, ...ColorValue[]];

  return (
    <LinearGradient
      colors={gradientColors}
      start={start}
      end={end}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 