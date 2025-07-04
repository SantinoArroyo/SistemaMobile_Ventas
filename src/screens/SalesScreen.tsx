import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Text,
} from 'react-native';
import {
  FAB,
  Title,
  Paragraph,
  Searchbar,
  Chip,
  Provider as PaperProvider,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchSales } from '../store/slices/salesSlice';
import { fetchCustomers } from '../store/slices/customersSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import { Sale } from '../types';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../theme/colors';
import EnhancedCard from '../components/EnhancedCard';
import GradientBackground from '../components/GradientBackground';

export default function SalesScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { sales, loading, error } = useAppSelector((state: any) => state.sales);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchSales());
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const filteredSales = sales.filter((sale: any) =>
    sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.customerCuil.includes(searchQuery)
  );

  const renderSale = ({ item }: { item: Sale }) => (
    <EnhancedCard
      variant="glass"
      style={styles.saleCard}
      icon="point-of-sale"
      iconColor={COLORS.celeste}
    >
      <View style={styles.saleContent}>
        <Title style={styles.saleTitle}>{item.customerName}</Title>
        <Paragraph style={styles.saleSubtitle}>CUIL: {item.customerCuil}</Paragraph>
        <Paragraph style={styles.saleDate}><MaterialIcons name="event" size={15} color={COLORS.celeste} /> {new Date(item.date).toLocaleDateString()}</Paragraph>
        <Paragraph style={styles.saleTotal}><MaterialIcons name="attach-money" size={15} color={COLORS.naranjaDark} /> Total: ${item.total}</Paragraph>
        <View style={styles.itemsContainer}>
          {item.items.map((saleItem) => (
            <Chip key={saleItem.id} mode="outlined" style={styles.itemChip} textStyle={styles.chipText} icon="check-circle">
              {saleItem.productName} x{saleItem.quantity}
            </Chip>
          ))}
        </View>
      </View>
    </EnhancedCard>
  );

  return (
    <PaperProvider>
      <GradientBackground gradientType="ocean" style={{ flex: 1 }}>
        <View style={styles.container}>
          <Searchbar
            placeholder="Buscar ventas..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchbar, SHADOWS.depth]}
            iconColor={COLORS.celeste}
            inputStyle={styles.searchInput}
          />
          <FlatList
            data={filteredSales}
            renderItem={renderSale}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshing={loading}
            onRefresh={() => dispatch(fetchSales())}
            showsVerticalScrollIndicator={false}
          />
          <FAB
            icon="plus"
            style={[styles.fab, SHADOWS.large]}
            onPress={() => navigation.navigate('NuevaVenta')}
            color={COLORS.white}
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
  saleCard: {
    marginBottom: 16,
    borderRadius: BORDER_RADIUS.xxl,
  },
  saleContent: {
    paddingHorizontal: 4,
  },
  saleTitle: {
    color: COLORS.celesteDark,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  saleSubtitle: {
    color: COLORS.gray,
    fontSize: 14,
    marginBottom: 2,
  },
  saleDate: {
    color: COLORS.gray,
    fontSize: 13,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saleTotal: {
    color: COLORS.naranjaDark,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  itemChip: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.celeste,
    borderRadius: 16,
    elevation: 0,
  },
  chipText: {
    color: COLORS.celesteDark,
    fontSize: 13,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.celeste,
  },
}); 