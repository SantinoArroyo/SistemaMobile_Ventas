import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS } from '../theme/colors';
import { Product } from '../types';
import EnhancedCard from './EnhancedCard';
import EnhancedButton from './EnhancedButton';

interface ProductFiltersProps {
  products: Product[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onStockFilterChange: (filter: string) => void;
  selectedStockFilter: string;
}

export default function ProductFilters({
  products,
  selectedCategory,
  onCategoryChange,
  onStockFilterChange,
  selectedStockFilter,
}: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  // Obtener categorías únicas de los productos
  const categories = ['Todas', ...Array.from(new Set(products.map(p => p.category)))];

  // Obtener productos con stock bajo
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  const stockFilters = [
    { key: 'all', label: 'Todos', count: products.length },
    { key: 'low', label: 'Stock Bajo', count: lowStockProducts.length },
    { key: 'out', label: 'Sin Stock', count: outOfStockProducts.length },
  ];

  return (
    <EnhancedCard
      variant="glass"
      style={StyleSheet.flatten([styles.container, SHADOWS.small])}
      icon="filter-list"
      iconColor={COLORS.celeste}
    >
      {/* Botón para mostrar/ocultar filtros */}
      <EnhancedButton
        title={`Filtros ${showFilters ? 'Ocultar' : 'Mostrar'}`}
        icon={showFilters ? 'expand-less' : 'expand-more'}
        onPress={() => setShowFilters(!showFilters)}
        variant="outline"
        style={styles.toggleButton}
        textStyle={styles.toggleButtonLabel}
      />

      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* Filtro por categorías */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Categorías</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  selected={selectedCategory === category}
                  onPress={() => onCategoryChange(category)}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && styles.selectedChip,
                  ]}
                  textStyle={[
                    styles.chipText,
                    selectedCategory === category && styles.selectedChipText,
                  ]}
                >
                  {category}
                </Chip>
              ))}
            </ScrollView>
          </View>

          {/* Filtro por estado de stock */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Estado de Stock</Text>
            <View style={styles.stockFiltersContainer}>
              {stockFilters.map((filter) => (
                <Chip
                  key={filter.key}
                  selected={selectedStockFilter === filter.key}
                  onPress={() => onStockFilterChange(filter.key)}
                  style={[
                    styles.stockChip,
                    selectedStockFilter === filter.key && styles.selectedChip,
                    filter.key === 'low' && styles.lowStockChip,
                    filter.key === 'out' && styles.outStockChip,
                  ]}
                  textStyle={[
                    styles.chipText,
                    selectedStockFilter === filter.key && styles.selectedChipText,
                  ]}
                >
                  {filter.label} ({filter.count})
                </Chip>
              ))}
            </View>
          </View>

          {/* Resumen de filtros activos */}
          <View style={styles.activeFilters}>
            <Text style={styles.activeFiltersTitle}>Filtros Activos:</Text>
            <View style={styles.activeFiltersChips}>
              {selectedCategory !== 'Todas' && (
                <Chip
                  mode="outlined"
                  onPress={() => onCategoryChange('Todas')}
                  style={styles.activeFilterChip}
                  textStyle={styles.activeFilterChipText}
                >
                  {selectedCategory} ✕
                </Chip>
              )}
              {selectedStockFilter !== 'all' && (
                <Chip
                  mode="outlined"
                  onPress={() => onStockFilterChange('all')}
                  style={styles.activeFilterChip}
                  textStyle={styles.activeFilterChipText}
                >
                  {stockFilters.find(f => f.key === selectedStockFilter)?.label} ✕
                </Chip>
              )}
            </View>
          </View>
        </View>
      )}
    </EnhancedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: SPACING.md,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  toggleButton: {
    borderColor: COLORS.celeste,
    borderRadius: 12,
    margin: SPACING.md,
  },
  toggleButtonLabel: {
    color: COLORS.celeste,
    fontWeight: '600',
  },
  filtersContainer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  filterSection: {
    marginBottom: SPACING.lg,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: SPACING.sm,
  },
  chipContainer: {
    flexDirection: 'row',
  },
  categoryChip: {
    marginRight: SPACING.sm,
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.gray,
  },
  stockChip: {
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.gray,
  },
  lowStockChip: {
    backgroundColor: COLORS.warningLight,
    borderColor: COLORS.warning,
  },
  outStockChip: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error,
  },
  selectedChip: {
    backgroundColor: COLORS.celeste,
    borderColor: COLORS.celesteDark,
  },
  chipText: {
    color: COLORS.darkGray,
    fontSize: 12,
    fontWeight: '500',
  },
  selectedChipText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  stockFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activeFilters: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: SPACING.sm,
  },
  activeFiltersChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activeFilterChip: {
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.celesteLight,
    borderColor: COLORS.celeste,
  },
  activeFilterChipText: {
    color: COLORS.celesteDark,
    fontSize: 12,
    fontWeight: '500',
  },
}); 