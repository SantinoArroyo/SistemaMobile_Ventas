import React, { useEffect, useState } from 'react';
// Si no tienes instalado @react-native-picker/picker, instálalo con:
// npm install @react-native-picker/picker
import { Picker } from '@react-native-picker/picker';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Provider as PaperProvider,
  Chip,
  Divider,
  List,
  Surface,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchSales } from '../store/slices/salesSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import { Sale, Product } from '../types';
import { COLORS, SHADOWS } from '../theme/colors';

export default function ReportsScreen() {
  const dispatch = useAppDispatch();
  const { sales, loading, error } = useAppSelector((state: any) => state.sales);
  const { products } = useAppSelector((state: any) => state.products);
  
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Generar lista de meses disponibles a partir de las ventas
  const availableMonths = Array.from(new Set(sales.map((sale: any) => sale.month))).sort().reverse();

  useEffect(() => {
    dispatch(fetchSales());
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const monthlySales = sales.filter((sale: any) => sale.month === selectedMonth);
  const totalAmount = monthlySales.reduce((sum: number, sale: any) => sum + sale.total, 0);
  const totalSales = monthlySales.length;
  const uniqueCustomers = new Set(monthlySales.map((sale: any) => sale.customerId)).size;

  const topProducts = monthlySales
    .flatMap((sale: any) => sale.items)
    .reduce((acc: any[], item: any) => {
      const existing = acc.find((p: any) => p.productId === item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.total += item.total;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, [] as any[])
    .sort((a: any, b: any) => b.quantity - a.quantity)
    .slice(0, 5);

  const topCustomers = monthlySales
    .reduce((acc: any[], sale: any) => {
      const existing = acc.find((c: any) => c.customerId === sale.customerId);
      if (existing) {
        existing.total += sale.total;
        existing.sales += 1;
      } else {
        acc.push({
          customerId: sale.customerId,
          customerName: sale.customerName,
          customerCuil: sale.customerCuil,
          total: sale.total,
          sales: 1,
        });
      }
      return acc;
    }, [] as any[])
    .sort((a: any, b: any) => b.total - a.total)
    .slice(0, 5);

  const lowStockProducts = products.filter((product: any) => product.stock <= product.minStock);

  const renderSale = ({ item }: { item: Sale }) => (
    <Surface style={[styles.saleCard, SHADOWS.card]} elevation={3}>
      <Card.Content style={styles.cardContent}>
        <Title style={styles.saleTitle}>{item.customerName}</Title>
        <Paragraph style={styles.saleSubtitle}>CUIL: {item.customerCuil}</Paragraph>
        <Paragraph style={styles.saleDate}>Fecha: {new Date(item.date).toLocaleDateString()}</Paragraph>
        <Paragraph style={styles.saleTotal}>Total: ${item.total}</Paragraph>
        <View style={styles.itemsContainer}>
          {item.items.map((saleItem) => (
            <Chip key={saleItem.id} mode="outlined" style={styles.itemChip} textStyle={styles.chipText}>
              {saleItem.productName} x{saleItem.quantity}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Surface>
  );

  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }} showsVerticalScrollIndicator={true}>
          {/* Selector de mes */}
          <Surface style={[styles.card, SHADOWS.card, { marginBottom: 8 }]} elevation={2}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Seleccionar Mes</Title>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue: string) => setSelectedMonth(itemValue)}
                style={{ width: '100%' }}
                mode="dropdown"
              >
                {availableMonths.map((month) => (
                  <Picker.Item key={String(month)} label={String(month)} value={String(month)} />
                ))}
              </Picker>
            </Card.Content>
          </Surface>

          {/* Resumen del Mes */}
          <Surface style={[styles.summaryCard, SHADOWS.card]} elevation={3}>
            <Card.Content>
              <Title style={styles.summaryTitle}>Resumen del Mes</Title>
              <Paragraph style={styles.summaryMonth}>Mes: {selectedMonth}</Paragraph>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Title style={styles.summaryNumber}>{totalSales}</Title>
                  <Paragraph>Ventas</Paragraph>
                </View>
                <View style={styles.summaryItem}>
                  <Title style={styles.summaryNumber}>${totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</Title>
                  <Paragraph>Total</Paragraph>
                </View>
                <View style={styles.summaryItem}>
                  <Title style={styles.summaryNumber}>{uniqueCustomers}</Title>
                  <Paragraph>Clientes</Paragraph>
                </View>
              </View>
            </Card.Content>
          </Surface>

          {/* Productos Más Vendidos */}
          <Surface style={[styles.card, SHADOWS.card]} elevation={3}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Productos Más Vendidos</Title>
              {topProducts.length === 0 && <Paragraph>No hay ventas este mes.</Paragraph>}
              {topProducts.map((product: any, index: number) => (
                <List.Item
                  key={product.productId}
                  title={`${index + 1}. ${product.productName}`}
                  description={`${product.quantity} unidades - $${product.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`}
                  left={props => <List.Icon {...props} icon="package-variant" color={COLORS.celeste} />}
                />
              ))}
            </Card.Content>
          </Surface>

          {/* Mejores Clientes */}
          <Surface style={[styles.card, SHADOWS.card]} elevation={3}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Mejores Clientes</Title>
              {topCustomers.length === 0 && <Paragraph>No hay ventas este mes.</Paragraph>}
              {topCustomers.map((customer: any, index: number) => (
                <List.Item
                  key={customer.customerId}
                  title={`${index + 1}. ${customer.customerName}`}
                  description={`${customer.sales} compras - $${customer.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`}
                  left={props => <List.Icon {...props} icon="account" color={COLORS.naranja} />}
                />
              ))}
            </Card.Content>
          </Surface>

          {/* Productos con Stock Bajo */}
          {lowStockProducts.length > 0 && (
            <Surface style={[styles.card, SHADOWS.card]} elevation={3}>
              <Card.Content>
                <Title style={styles.sectionTitle}>Productos con Stock Bajo</Title>
                {lowStockProducts.map((product: any) => (
                  <List.Item
                    key={product.id}
                    title={product.name}
                    description={`Stock: ${product.stock} (Mínimo: ${product.minStock})`}
                    left={props => <List.Icon {...props} icon="alert" color={COLORS.rojizo} />}
                  />
                ))}
              </Card.Content>
            </Surface>
          )}

          {/* Ventas del Mes */}
          <Surface style={[styles.card, SHADOWS.card, { marginBottom: 16 }]} elevation={3}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Ventas del Mes</Title>
              {monthlySales.length === 0 && <Paragraph>No hay ventas este mes.</Paragraph>}
              {monthlySales.map((sale: any) => (
                <React.Fragment key={String(sale.id)}>
                  {renderSale({ item: sale })}
                </React.Fragment>
              ))}
            </Card.Content>
          </Surface>
        </ScrollView>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  summaryCard: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  summaryTitle: {
    color: COLORS.celesteDark,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryMonth: {
    color: COLORS.gray,
    fontSize: 14,
    marginBottom: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    marginBottom: 8,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    color: COLORS.naranjaDark,
    fontWeight: 'bold',
    fontSize: 18,
  },
  card: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  sectionTitle: {
    color: COLORS.celesteDark,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  saleCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  cardContent: {
    padding: 16,
  },
  saleTitle: {
    color: COLORS.celesteDark,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  saleSubtitle: {
    color: COLORS.gray,
    fontSize: 13,
    marginBottom: 2,
  },
  saleDate: {
    color: COLORS.gray,
    fontSize: 12,
    marginBottom: 2,
  },
  saleTotal: {
    color: COLORS.naranjaDark,
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  itemChip: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.gray,
  },
  chipText: {
    color: COLORS.darkGray,
    fontSize: 12,
    fontWeight: '500',
  },
}); 