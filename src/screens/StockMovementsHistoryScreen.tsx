import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Searchbar,
  Chip,
  Provider as PaperProvider,
  Surface,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchStockMovements } from '../store/slices/stockMovementsSlice';
import { StockMovement } from '../types';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../theme/colors';
import EnhancedCard from '../components/EnhancedCard';
import GradientBackground from '../components/GradientBackground';

export default function StockMovementsHistoryScreen() {
  const dispatch = useAppDispatch();
  const { stockMovements, loading } = useAppSelector((state: any) => state.stockMovements);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchStockMovements());
  }, [dispatch]);

  const filteredMovements = stockMovements.filter((movement: any) =>
    movement.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movement.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMovement = ({ item }: { item: StockMovement }) => {
    const isIn = item.type === 'IN';
    const typeColor = isIn ? COLORS.success : COLORS.error;
    const typeLabel = isIn ? 'Ingreso' : 'Egreso';
    const typeIcon = isIn ? 'arrow-downward' : 'arrow-upward';
    return (
      <EnhancedCard
        variant="glass"
        style={styles.movementCard}
        // icon y iconColor removidos
      >
        <View style={styles.movementContent}>
          {/* Ícono centrado arriba en un círculo */}
          <View style={styles.iconWrapper}>
            <View style={[styles.iconCircle, { backgroundColor: typeColor + '22' }]}>
              <MaterialIcons name={typeIcon} size={48} color={typeColor} />
            </View>
          </View>
          <Title style={styles.movementTitle}>{item.productName}</Title>
          <Paragraph style={styles.movementDate}><MaterialIcons name="event" size={15} color={COLORS.celeste} /> {new Date(item.date).toLocaleDateString()}</Paragraph>
          <View style={styles.movementInfoRow}>
            <Chip style={[styles.typeChip, { borderColor: typeColor, backgroundColor: typeColor + '22' }]} textStyle={[styles.chipText, { color: typeColor }]}
              icon={() => <MaterialIcons name={typeIcon} size={18} color={typeColor} />}>
              {typeLabel}
            </Chip>
            <Chip style={styles.qtyChip} textStyle={styles.chipText}
              icon={() => <MaterialIcons name="check-circle" size={18} color={COLORS.success} />}>
              {isIn ? '+' : '-'}{item.quantity}
            </Chip>
            <Chip style={styles.reasonChip} textStyle={styles.chipText}
              icon={() => <MaterialIcons name="info" size={18} color={COLORS.celeste} />}>
              {item.reason}
            </Chip>
          </View>
        </View>
      </EnhancedCard>
    );
  };

  return (
    <PaperProvider>
      <GradientBackground gradientType="ocean" style={{ flex: 1 }}>
        <View style={styles.container}>
          <Searchbar
            placeholder="Buscar movimientos..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchbar, SHADOWS.depth]}
            iconColor={COLORS.celeste}
            inputStyle={styles.searchInput}
          />
          <FlatList
            data={filteredMovements}
            renderItem={renderMovement}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshing={loading}
            onRefresh={() => dispatch(fetchStockMovements())}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </GradientBackground>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    margin: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    elevation: 3,
  },
  searchInput: {
    color: COLORS.darkGray,
  },
  list: {
    padding: 16,
  },
  movementCard: {
    marginBottom: 16,
    borderRadius: BORDER_RADIUS.xxl,
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
  },
  movementContent: {
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  movementTitle: {
    color: COLORS.celesteDark,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
    width: '100%',
  },
  movementDate: {
    color: COLORS.gray,
    fontSize: 13,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
  },
  movementInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
    width: '100%',
  },
  typeChip: {
    borderWidth: 2,
    borderRadius: 16,
    marginRight: 4,
    backgroundColor: COLORS.lightGray,
  },
  qtyChip: {
    borderWidth: 1,
    borderRadius: 16,
    marginRight: 4,
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.celeste,
  },
  reasonChip: {
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.naranja,
  },
  chipText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 4,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
}); 