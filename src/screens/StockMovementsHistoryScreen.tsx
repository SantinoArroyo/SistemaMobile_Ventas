import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Title, Paragraph, Searchbar, Chip, Button, Provider as PaperProvider, List, Divider, Surface } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchStockMovements } from '../store/slices/stockMovementsSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import { StockMovement, Product } from '../types';
import { COLORS, SHADOWS } from '../theme/colors';

export default function StockMovementsHistoryScreen() {
  const dispatch = useAppDispatch();
  const { stockMovements, loading } = useAppSelector((state: any) => state.stockMovements);
  const { products } = useAppSelector((state: any) => state.products);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'IN' | 'OUT' | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // formato YYYY-MM-DD

  useEffect(() => {
    dispatch(fetchStockMovements());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filtros
  const filteredMovements = stockMovements.filter((movement: StockMovement) => {
    const matchesProduct = selectedProductId ? movement.productId === selectedProductId : true;
    const matchesType = selectedType ? movement.type === selectedType : true;
    const matchesSearch =
      movement.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movement.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = selectedDate ? movement.date.slice(0, 10) === selectedDate : true;
    return matchesProduct && matchesType && matchesSearch && matchesDate;
  });

  // Obtener lista de productos para el filtro
  const productOptions = products.map((p: Product) => ({ label: p.name, value: p.id }));

  // Obtener lista de fechas únicas para el filtro
  const dateOptions = Array.from(new Set(stockMovements.map((m: StockMovement) => m.date.slice(0, 10))));

  const renderMovement = ({ item }: { item: StockMovement }) => (
    <Surface style={[styles.movementCard, SHADOWS.card]} elevation={3}>
      <Card.Content>
        <Title style={styles.movementTitle}>{item.productName}</Title>
        <Paragraph style={styles.movementType}>
          {item.type === 'IN' ? 'Entrada' : 'Salida'}: {item.quantity} unidades
        </Paragraph>
        <Paragraph style={styles.movementReason}>Motivo: {item.reason}</Paragraph>
        <Paragraph style={styles.movementDate}>Fecha: {new Date(item.date).toLocaleDateString()}</Paragraph>
      </Card.Content>
    </Surface>
  );

  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
          <Searchbar
            placeholder="Buscar por producto o motivo..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchbar, SHADOWS.medium]}
            iconColor={COLORS.celeste}
            inputStyle={styles.searchInput}
          />
          <View style={styles.filtersRow}>
            <List.Section style={styles.filterSection}>
              <List.Subheader>Producto</List.Subheader>
              <FlatList
                data={[{ label: 'Todos', value: null }, ...productOptions]}
                horizontal
                keyExtractor={item => (item.value !== null ? String(item.value) : 'all')}
                renderItem={({ item }) => (
                  <Chip
                    selected={selectedProductId === item.value}
                    onPress={() => setSelectedProductId(item.value !== null ? String(item.value) : null)}
                    style={[styles.chip, SHADOWS.small, selectedProductId === item.value ? styles.chipSelected : null]}
                    textStyle={styles.chipText}
                  >
                    {String(item.label)}
                  </Chip>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </List.Section>
            <List.Section style={styles.filterSection}>
              <List.Subheader>Tipo</List.Subheader>
              <View style={{ flexDirection: 'row' }}>
                <Chip
                  selected={selectedType === null}
                  onPress={() => setSelectedType(null)}
                  style={[styles.chip, SHADOWS.small, selectedType === null ? styles.chipSelected : null]}
                  textStyle={styles.chipText}
                >
                  Todos
                </Chip>
                <Chip
                  selected={selectedType === 'IN'}
                  onPress={() => setSelectedType('IN')}
                  style={[styles.chip, SHADOWS.small, selectedType === 'IN' ? styles.chipSelectedIn : null]}
                  textStyle={styles.chipText}
                >
                  Entrada
                </Chip>
                <Chip
                  selected={selectedType === 'OUT'}
                  onPress={() => setSelectedType('OUT')}
                  style={[styles.chip, SHADOWS.small, selectedType === 'OUT' ? styles.chipSelectedOut : null]}
                  textStyle={styles.chipText}
                >
                  Salida
                </Chip>
              </View>
            </List.Section>
            <List.Section style={styles.filterSection}>
              <List.Subheader>Fecha</List.Subheader>
              <FlatList
                data={[{ label: 'Todas', value: null }, ...dateOptions.map(date => ({ label: date, value: date }))]}
                horizontal
                keyExtractor={item => (item.value !== null ? String(item.value) : 'all')}
                renderItem={({ item }) => (
                  <Chip
                    selected={selectedDate === item.value}
                    onPress={() => setSelectedDate(item.value !== null ? String(item.value) : null)}
                    style={[styles.chip, SHADOWS.small, selectedDate === item.value ? styles.chipSelected : null]}
                    textStyle={styles.chipText}
                  >
                    {String(item.label)}
                  </Chip>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </List.Section>
          </View>
          <Divider style={{ marginVertical: 8 }} />
          <FlatList
            data={filteredMovements}
            renderItem={renderMovement}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            refreshing={loading}
            onRefresh={() => dispatch(fetchStockMovements())}
            ListEmptyComponent={<Paragraph style={{ textAlign: 'center', marginTop: 32 }}>No hay movimientos para mostrar.</Paragraph>}
          />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  searchbar: {
    margin: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  searchInput: {
    color: COLORS.darkGray,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  filterSection: {
    minWidth: 120,
    marginRight: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.gray,
  },
  chipSelected: {
    backgroundColor: COLORS.celeste,
    borderColor: COLORS.celesteDark,
  },
  chipSelectedIn: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.celesteDark,
  },
  chipSelectedOut: {
    backgroundColor: COLORS.rojizo,
    borderColor: COLORS.rojizoDark,
  },
  chipText: {
    color: COLORS.darkGray,
    fontSize: 12,
    fontWeight: '500',
  },
  list: {
    padding: 16,
  },
  movementCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  movementTitle: {
    color: COLORS.celesteDark,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  movementType: {
    color: COLORS.naranjaDark,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  movementReason: {
    color: COLORS.gray,
    fontSize: 13,
    marginBottom: 2,
  },
  movementDate: {
    color: COLORS.gray,
    fontSize: 12,
    marginBottom: 2,
  },
}); 