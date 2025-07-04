import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Chip, Surface, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../theme/colors';
import { SaleItem, Customer } from '../types';

interface SaleSummaryProps {
  customer: Customer | null;
  items: SaleItem[];
  total: number;
  onRemoveItem: (itemId: string) => void;
  onQuantityChange: (itemId: string, quantity: string) => void;
}

export default function SaleSummary({
  customer,
  items,
  total,
  onRemoveItem,
  onQuantityChange,
}: SaleSummaryProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Surface style={[styles.container, SHADOWS.medium]} elevation={4}>
      {/* Header del resumen */}
      <View style={styles.header}>
        <MaterialIcons name="shopping-cart" size={24} color={COLORS.celeste} />
        <Title style={styles.headerTitle}>Resumen de Venta</Title>
      </View>

      {/* Información del cliente */}
      {customer && (
        <Card style={styles.customerCard}>
          <Card.Content>
            <Title style={styles.customerName}>{customer.name}</Title>
            <Paragraph style={styles.customerCuil}>CUIL: {customer.cuil}</Paragraph>
            {customer.phone && (
              <Paragraph style={styles.customerInfo}>📞 {customer.phone}</Paragraph>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Lista de productos */}
      <View style={styles.itemsSection}>
        <Title style={styles.sectionTitle}>Productos ({itemCount})</Title>
        <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
          {items.length === 0 ? (
            <View style={styles.emptyItems}>
              <MaterialIcons name="inventory" size={48} color={COLORS.gray} />
              <Paragraph style={styles.emptyText}>
                No hay productos agregados
              </Paragraph>
            </View>
          ) : (
            items.map((item) => (
              <Card key={item.id} style={styles.itemCard}>
                <Card.Content>
                  <View style={styles.itemHeader}>
                    <Title style={styles.itemName}>{item.productName}</Title>
                    <MaterialIcons
                      name="delete"
                      size={20}
                      color={COLORS.error}
                      onPress={() => onRemoveItem(item.id)}
                      style={styles.deleteIcon}
                    />
                  </View>
                  <View style={styles.itemDetails}>
                    <View style={styles.itemInfo}>
                      <Paragraph style={styles.itemPrice}>
                        ${item.unitPrice} c/u
                      </Paragraph>
                      <Paragraph style={styles.itemTotal}>
                        Total: ${item.total}
                      </Paragraph>
                    </View>
                    <View style={styles.quantityContainer}>
                      <Chip
                        mode="outlined"
                        style={styles.quantityChip}
                        textStyle={styles.quantityText}
                      >
                        Cantidad: {item.quantity}
                      </Chip>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </ScrollView>
      </View>

      {/* Total */}
      {items.length > 0 && (
        <>
          <Divider style={styles.divider} />
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Title style={styles.totalLabel}>Total:</Title>
              <Title style={styles.totalAmount}>${total.toFixed(2)}</Title>
            </View>
            <View style={styles.totalRow}>
              <Paragraph style={styles.subtotalLabel}>Subtotal:</Paragraph>
              <Paragraph style={styles.subtotalAmount}>${total.toFixed(2)}</Paragraph>
            </View>
            <View style={styles.totalRow}>
              <Paragraph style={styles.ivaLabel}>IVA (21%):</Paragraph>
              <Paragraph style={styles.ivaAmount}>${(total * 0.21).toFixed(2)}</Paragraph>
            </View>
          </View>
        </>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    margin: SPACING.md,
    maxHeight: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    marginLeft: SPACING.sm,
    color: COLORS.celesteDark,
    fontSize: 18,
    fontWeight: 'bold',
  },
  customerCard: {
    margin: SPACING.md,
    backgroundColor: COLORS.celesteLight,
    borderColor: COLORS.celeste,
    borderWidth: 1,
  },
  customerName: {
    color: COLORS.celesteDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  customerCuil: {
    color: COLORS.darkGray,
    fontSize: 14,
  },
  customerInfo: {
    color: COLORS.gray,
    fontSize: 14,
    marginTop: SPACING.xs,
  },
  itemsSection: {
    flex: 1,
    padding: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.darkGray,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  itemsList: {
    maxHeight: 200,
  },
  emptyItems: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emptyText: {
    color: COLORS.gray,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  itemCard: {
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  deleteIcon: {
    padding: SPACING.xs,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  itemInfo: {
    flex: 1,
  },
  itemPrice: {
    color: COLORS.gray,
    fontSize: 12,
  },
  itemTotal: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: '600',
  },
  quantityContainer: {
    alignItems: 'flex-end',
  },
  quantityChip: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.celeste,
  },
  quantityText: {
    color: COLORS.celesteDark,
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.lightGray,
  },
  totalSection: {
    padding: SPACING.md,
    backgroundColor: COLORS.lightGray,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  totalLabel: {
    color: COLORS.darkGray,
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    color: COLORS.success,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtotalLabel: {
    color: COLORS.gray,
    fontSize: 14,
  },
  subtotalAmount: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontWeight: '500',
  },
  ivaLabel: {
    color: COLORS.gray,
    fontSize: 14,
  },
  ivaAmount: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontWeight: '500',
  },
}); 