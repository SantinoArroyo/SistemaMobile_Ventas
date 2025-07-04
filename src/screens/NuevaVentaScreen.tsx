import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert as RNAlert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  TextInput,
  Provider as PaperProvider,
  Divider,
  Snackbar,
  Chip,
  Portal,
  Modal,
  Button,
  IconButton,
  Surface,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addSale } from '../store/slices/salesSlice';
import { addStockMovement, fetchStockMovements } from '../store/slices/stockMovementsSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import { SaleItem, Customer, Product } from '../types';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../theme/colors';
import { database } from '../database/database';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface DiscountConfig {
  type: 'percentage' | 'fixed';
  value: number;
}

export default function NuevaVentaScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { customers } = useAppSelector((state: any) => state.customers);
  const { products } = useAppSelector((state: any) => state.products);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', color: COLORS.success });
  const [discountModalVisible, setDiscountModalVisible] = useState(false);
  const [globalDiscount, setGlobalDiscount] = useState<DiscountConfig>({ type: 'percentage', value: 0 });
  const [quantityInputVisible, setQuantityInputVisible] = useState<string | null>(null);
  const [quantityInputValue, setQuantityInputValue] = useState('');

  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e: any) => {
        if (!selectedCustomer && selectedItems.length === 0) return;
        e.preventDefault();
        RNAlert.alert(
          '¿Descartar cambios?',
          'Tienes datos sin guardar. ¿Seguro que quieres salir?',
          [
            { text: 'Cancelar', style: 'cancel', onPress: () => {} },
            { text: 'Salir', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
          ]
        );
      };
      navigation.addListener('beforeRemove', onBeforeRemove);
      return () => navigation.removeListener('beforeRemove', onBeforeRemove);
    }, [navigation, selectedCustomer, selectedItems])
  );

  // --- Lógica de selección de cliente ---
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchQuery(customer.name);
  };

  // --- Lógica de productos y cantidades ---
  const handleAddItem = (product: Product, quantity: number) => {
    const existingItem = selectedItems.find(item => item.productId === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = currentQuantity + quantity;
    if (newTotalQuantity > product.stock) {
      setSnackbar({ visible: true, message: `Stock insuficiente. Disponible: ${product.stock} unidades`, color: COLORS.error });
      return;
    }
    if (newTotalQuantity < 0) return;
    if (existingItem) {
      if (newTotalQuantity === 0) {
        setSelectedItems(selectedItems.filter(item => item.productId !== product.id));
      } else {
        setSelectedItems(selectedItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: newTotalQuantity, total: newTotalQuantity * item.unitPrice }
            : item
        ));
      }
    } else if (quantity > 0) {
      const newItem: SaleItem = {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        total: quantity * product.price,
      };
      setSelectedItems([...selectedItems, newItem]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const handleQuantityChange = (itemId: string, newQuantity: string) => {
    const quantity = parseInt(newQuantity) || 0;
    const item = selectedItems.find(i => i.id === itemId);
    if (item) {
      const product = products.find((p: any) => p.id === item.productId);
      if (product && quantity >= 0 && quantity <= product.stock) {
        const updatedItems = selectedItems.map(i =>
          i.id === itemId
            ? { ...i, quantity: quantity, total: quantity * i.unitPrice }
            : i
        );
        setSelectedItems(updatedItems);
      }
    }
  };

  const handleQuantityInput = (product: Product) => {
    const existingItem = selectedItems.find(item => item.productId === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    setQuantityInputValue(currentQuantity.toString());
    setQuantityInputVisible(product.id);
  };

  const confirmQuantityInput = () => {
    if (!quantityInputVisible) return;
    
    const quantity = parseInt(quantityInputValue) || 0;
    const product = products.find((p: any) => p.id === quantityInputVisible);
    
    if (product && quantity >= 0 && quantity <= product.stock) {
      const existingItem = selectedItems.find(item => item.productId === product.id);
      
      if (quantity === 0) {
        setSelectedItems(selectedItems.filter(item => item.productId !== product.id));
      } else if (existingItem) {
        setSelectedItems(selectedItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: quantity, total: quantity * item.unitPrice }
            : item
        ));
      } else {
        const newItem: SaleItem = {
          id: Date.now().toString(),
          productId: product.id,
          productName: product.name,
          quantity,
          unitPrice: product.price,
          total: quantity * product.price,
        };
        setSelectedItems([...selectedItems, newItem]);
      }
    } else if (quantity > product.stock) {
      setSnackbar({ visible: true, message: `Stock insuficiente. Disponible: ${product.stock} unidades`, color: COLORS.error });
    }
    
    setQuantityInputVisible(null);
    setQuantityInputValue('');
  };

  // --- Cálculos de totales y descuentos ---
  const calculateSubtotal = () => selectedItems.reduce((sum, item) => sum + item.total, 0);
  const calculateGlobalDiscount = () => {
    if (globalDiscount.value === 0) return 0;
    const subtotal = calculateSubtotal();
    if (globalDiscount.type === 'percentage') {
      return (subtotal * globalDiscount.value) / 100;
    } else {
      return Math.min(globalDiscount.value, subtotal);
    }
  };
  const calculateTotal = () => Math.max(0, calculateSubtotal() - calculateGlobalDiscount());

  // --- Guardar venta ---
  const handleSaveSale = async () => {
    if (!selectedCustomer || selectedItems.length === 0) {
      setSnackbar({ visible: true, message: 'Por favor selecciona un cliente y al menos un producto', color: COLORS.error });
      return;
    }
    setIsSaving(true);
    try {
      for (const item of selectedItems) {
        const latestProduct = await database.getProductById(item.productId);
        if (!latestProduct || latestProduct.stock < item.quantity) {
          setSnackbar({ visible: true, message: `Stock insuficiente para "${item.productName}". Stock actual: ${latestProduct ? latestProduct.stock : 0}`, color: COLORS.error });
          setIsSaving(false);
          return;
        }
      }
      const total = calculateTotal();
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const saleData = {
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        customerCuil: selectedCustomer.cuil,
        items: selectedItems,
        total,
        date: now.toISOString(),
        month,
        year: now.getFullYear(),
      };
      await dispatch(addSale(saleData));
      for (const item of selectedItems) {
        await dispatch(addStockMovement({
          productId: item.productId,
          productName: item.productName,
          type: 'OUT',
          quantity: item.quantity,
          reason: 'Venta',
          date: now.toISOString(),
        }));
      }
      dispatch(fetchProducts());
      dispatch(fetchStockMovements());
      setSnackbar({ visible: true, message: '¡Venta registrada con éxito!', color: COLORS.success });
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      setSnackbar({ visible: true, message: 'Error al guardar la venta', color: COLORS.error });
    } finally {
      setIsSaving(false);
    }
  };

  // --- Renderizado ---
  return (
    <PaperProvider>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Nueva Venta</Text>
            <View style={styles.headerDecoration} />
          </View>

          {/* Cliente */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="person" size={24} color={COLORS.celeste} />
              <Text style={styles.sectionTitle}>Cliente</Text>
            </View>
            <TextInput
              label="Buscar cliente por nombre o CUIL"
              value={customerSearchQuery}
              onChangeText={text => {
                setCustomerSearchQuery(text);
                if (selectedCustomer) setSelectedCustomer(null);
              }}
              style={styles.searchInput}
              mode="outlined"
              outlineColor={COLORS.celeste}
              activeOutlineColor={COLORS.celesteDark}
              left={<TextInput.Icon icon="magnify" color={COLORS.celeste} />}
            />
            {!selectedCustomer && customerSearchQuery.length > 0 && (
              <View style={styles.customerList}>
                {customers
                  .filter((customer: any) =>
                    customer.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                    customer.cuil.includes(customerSearchQuery)
                  )
                  .slice(0, 5)
                  .map((customer: any) => (
                    <TouchableOpacity
                      key={customer.id}
                      style={styles.customerCard}
                      onPress={() => handleSelectCustomer(customer)}
                    >
                      <View style={styles.customerCardContent}>
                        <View style={styles.customerIconContainer}>
                          <MaterialIcons name="person" size={24} color={COLORS.white} />
                        </View>
                        <View style={styles.customerInfo}>
                          <Text style={styles.customerName}>{customer.name}</Text>
                          <Text style={styles.customerCuil}>CUIL: {customer.cuil}</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={COLORS.celeste} />
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            )}
            {selectedCustomer && (
              <Surface style={styles.selectedCustomerCard}>
                <View style={styles.selectedCustomerContent}>
                  <View style={styles.selectedCustomerInfo}>
                    <View style={styles.selectedCustomerIconContainer}>
                      <MaterialIcons name="check-circle" size={24} color={COLORS.white} />
                    </View>
                    <View>
                      <Text style={styles.selectedCustomerName}>{selectedCustomer.name}</Text>
                      <Text style={styles.selectedCustomerCuil}>CUIL: {selectedCustomer.cuil}</Text>
                    </View>
                  </View>
                  <IconButton
                    icon="close"
                    size={24}
                    onPress={() => {
                      setSelectedCustomer(null);
                      setCustomerSearchQuery('');
                    }}
                    style={styles.removeButton}
                    iconColor={COLORS.white}
                  />
                </View>
              </Surface>
            )}
          </View>

          <Divider style={styles.sectionDivider} />

          {/* Productos */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="inventory" size={24} color={COLORS.celeste} />
              <Text style={styles.sectionTitle}>Productos</Text>
            </View>
            <TextInput
              label="Buscar productos"
              value={productSearchQuery}
              onChangeText={setProductSearchQuery}
              style={styles.searchInput}
              mode="outlined"
              outlineColor={COLORS.celeste}
              activeOutlineColor={COLORS.celesteDark}
              left={<TextInput.Icon icon="magnify" color={COLORS.celeste} />}
            />
            <View style={styles.productsGrid}>
              {products
                .filter((product: any) =>
                  product.name.toLowerCase().includes(productSearchQuery.toLowerCase())
                )
                .sort((a: any, b: any) => a.name.localeCompare(b.name))
                .map((product: any) => {
                  const selectedItem = selectedItems.find(item => item.productId === product.id);
                  const selectedQuantity = selectedItem ? selectedItem.quantity : 0;
                  const remainingStock = product.stock - selectedQuantity;
                  const isOutOfStock = product.stock === 0;
                  const isSelected = selectedQuantity > 0;
                  const isQuantityInputVisible = quantityInputVisible === product.id;
                  
                  return (
                    <Surface
                      key={product.id}
                      style={[
                        styles.productCard,
                        isOutOfStock && styles.productCardDisabled,
                        isSelected && styles.productCardSelected,
                      ]}
                    >
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productPrice}>${product.price}</Text>
                      <Text style={styles.productStock}>Stock: {product.stock} unidades</Text>
                      
                      {isQuantityInputVisible ? (
                        <View style={styles.quantityInputContainer}>
                          <TextInput
                            value={quantityInputValue}
                            onChangeText={setQuantityInputValue}
                            keyboardType="numeric"
                            style={styles.quantityInput}
                            mode="outlined"
                            outlineColor={COLORS.celeste}
                            activeOutlineColor={COLORS.celesteDark}
                            dense
                          />
                          <View style={styles.quantityInputActions}>
                            <IconButton
                              icon="check"
                              size={20}
                              onPress={confirmQuantityInput}
                              style={styles.confirmButton}
                              iconColor={COLORS.white}
                            />
                            <IconButton
                              icon="close"
                              size={20}
                              onPress={() => {
                                setQuantityInputVisible(null);
                                setQuantityInputValue('');
                              }}
                              style={styles.cancelQuantityButton}
                              iconColor={COLORS.white}
                            />
                          </View>
                        </View>
                      ) : (
                        <View style={styles.productActions}>
                          <IconButton
                            icon="minus"
                            size={20}
                            onPress={() => handleAddItem(product, -1)}
                            disabled={selectedQuantity <= 0 || isOutOfStock}
                            style={[styles.quantityButton, styles.minusButton]}
                            iconColor={COLORS.white}
                          />
                          <TouchableOpacity
                            style={styles.quantityDisplay}
                            onPress={() => handleQuantityInput(product)}
                          >
                            <Text style={styles.quantityText}>{selectedQuantity}</Text>
                          </TouchableOpacity>
                          <IconButton
                            icon="plus"
                            size={20}
                            onPress={() => handleAddItem(product, 1)}
                            disabled={remainingStock <= 0 || isOutOfStock}
                            style={[styles.quantityButton, styles.plusButton]}
                            iconColor={COLORS.white}
                          />
                        </View>
                      )}
                    </Surface>
                  );
                })}
            </View>
          </View>

          <Divider style={styles.sectionDivider} />

          {/* Items seleccionados */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="shopping-cart" size={24} color={COLORS.celeste} />
              <Text style={styles.sectionTitle}>Items Seleccionados</Text>
            </View>
            {selectedItems.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyStateIconContainer}>
                  <MaterialIcons name="shopping-cart" size={48} color={COLORS.white} />
                </View>
                <Text style={styles.emptyStateText}>No hay productos seleccionados</Text>
                <Text style={styles.emptyStateSubtext}>Agrega productos desde la lista de arriba</Text>
              </View>
            ) : (
              <View style={styles.selectedItemsList}>
                {selectedItems.map(item => (
                  <Surface key={item.id} style={styles.selectedItemCard}>
                    <View style={styles.selectedItemContent}>
                      <View style={styles.selectedItemInfo}>
                        <Text style={styles.selectedItemName}>{item.productName}</Text>
                        <Text style={styles.selectedItemDetails}>{item.quantity} x ${item.unitPrice} = ${item.total}</Text>
                      </View>
                      <View style={styles.selectedItemActions}>
                        <IconButton
                          icon="minus"
                          size={18}
                          onPress={() => handleQuantityChange(item.id, String(item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          style={[styles.quantityButton, styles.minusButton]}
                          iconColor={COLORS.white}
                        />
                        <Text style={styles.selectedItemQuantity}>{item.quantity}</Text>
                        <IconButton
                          icon="plus"
                          size={18}
                          onPress={() => handleQuantityChange(item.id, String(item.quantity + 1))}
                          style={[styles.quantityButton, styles.plusButton]}
                          iconColor={COLORS.white}
                        />
                        <IconButton
                          icon="delete"
                          size={18}
                          onPress={() => handleRemoveItem(item.id)}
                          style={[styles.quantityButton, styles.deleteButton]}
                          iconColor={COLORS.white}
                        />
                      </View>
                    </View>
                  </Surface>
                ))}
              </View>
            )}
          </View>

          <Divider style={styles.sectionDivider} />

          {/* Resumen y descuento */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="receipt" size={24} color={COLORS.celeste} />
              <Text style={styles.sectionTitle}>Resumen</Text>
            </View>
            <Surface style={styles.summaryCard}>
              <View style={styles.summaryContent}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal:</Text>
                  <Text style={styles.summaryValue}>${calculateSubtotal().toFixed(2)}</Text>
                </View>
                {calculateGlobalDiscount() > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>
                      Descuento ({globalDiscount.type === 'percentage' ? `${globalDiscount.value}%` : `$${globalDiscount.value}`}):
                    </Text>
                    <Text style={[styles.summaryValue, styles.discountValue]}>-${calculateGlobalDiscount().toFixed(2)}</Text>
                  </View>
                )}
                <Divider style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryTotalLabel}>Total:</Text>
                  <Text style={styles.summaryTotalValue}>${calculateTotal().toFixed(2)}</Text>
                </View>
              </View>
              {selectedItems.length > 0 && (
                <Button
                  mode="contained"
                  icon="percent"
                  onPress={() => setDiscountModalVisible(true)}
                  style={styles.discountButton}
                  buttonColor={COLORS.naranja}
                  textColor={COLORS.white}
                >
                  Aplicar Descuento
                </Button>
              )}
            </Surface>
          </View>

          {/* Botones de acción */}
          <View style={styles.fixedActions}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              textColor={COLORS.celesteDark}
              buttonColor={COLORS.white}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveSale}
              disabled={!selectedCustomer || selectedItems.length === 0 || isSaving}
              loading={isSaving}
              style={styles.saveButton}
              buttonColor={COLORS.success}
              textColor={COLORS.white}
              icon="check"
            >
              Guardar Venta
            </Button>
          </View>
        </ScrollView>

        {/* Modal de descuento */}
        <Portal>
          <Modal
            visible={discountModalVisible}
            onDismiss={() => setDiscountModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <MaterialIcons name="percent" size={28} color={COLORS.celeste} />
                <Text style={styles.modalTitle}>Aplicar Descuento</Text>
              </View>
              <View style={styles.discountTypeSelector}>
                <Chip
                  selected={globalDiscount.type === 'percentage'}
                  onPress={() => setGlobalDiscount({ ...globalDiscount, type: 'percentage' })}
                  style={[
                    styles.discountTypeChip,
                    globalDiscount.type === 'percentage' && styles.discountTypeChipSelected
                  ]}
                  textStyle={globalDiscount.type === 'percentage' ? styles.discountTypeChipTextSelected : styles.discountTypeChipText}
                >
                  Porcentaje
                </Chip>
                <Chip
                  selected={globalDiscount.type === 'fixed'}
                  onPress={() => setGlobalDiscount({ ...globalDiscount, type: 'fixed' })}
                  style={[
                    styles.discountTypeChip,
                    globalDiscount.type === 'fixed' && styles.discountTypeChipSelected
                  ]}
                  textStyle={globalDiscount.type === 'fixed' ? styles.discountTypeChipTextSelected : styles.discountTypeChipText}
                >
                  Monto Fijo
                </Chip>
              </View>
              <TextInput
                label={globalDiscount.type === 'percentage' ? 'Porcentaje de descuento' : 'Monto de descuento'}
                value={globalDiscount.value.toString()}
                onChangeText={(text) => {
                  const value = parseFloat(text) || 0;
                  setGlobalDiscount({ ...globalDiscount, value });
                }}
                keyboardType="numeric"
                style={styles.discountInput}
                mode="outlined"
                outlineColor={COLORS.celeste}
                activeOutlineColor={COLORS.celesteDark}
              />
              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={() => setDiscountModalVisible(false)}
                  style={styles.modalButton}
                  textColor={COLORS.celesteDark}
                  buttonColor={COLORS.white}
                >
                  Cancelar
                </Button>
                <Button
                  mode="contained"
                  onPress={() => setDiscountModalVisible(false)}
                  style={styles.modalButton}
                  buttonColor={COLORS.success}
                  textColor={COLORS.white}
                >
                  Aplicar
                </Button>
              </View>
            </View>
          </Modal>
        </Portal>

        <Snackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
          style={{ backgroundColor: snackbar.color, marginBottom: 100 }}
          duration={3000}
        >
          {snackbar.message}
        </Snackbar>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    paddingBottom: 120,
    backgroundColor: COLORS.oceanGradient[0],
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.medium,
  },
  pageTitle: {
    color: COLORS.celesteDark,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerDecoration: {
    width: 60,
    height: 4,
    backgroundColor: COLORS.celeste,
    borderRadius: 2,
  },
  sectionContainer: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
  },
  sectionTitle: {
    color: COLORS.celesteDark,
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sectionDivider: {
    marginVertical: SPACING.lg,
    backgroundColor: COLORS.lightGray,
    height: 2,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  customerList: {
    marginBottom: SPACING.md,
  },
  customerCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  customerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.celeste,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    color: COLORS.celesteDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  customerCuil: {
    color: COLORS.gray,
    fontSize: 14,
  },
  selectedCustomerCard: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.success,
    backgroundColor: COLORS.success,
    marginBottom: SPACING.md,
    ...SHADOWS.large,
  },
  selectedCustomerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  selectedCustomerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedCustomerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  selectedCustomerName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedCustomerCuil: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.9,
  },
  removeButton: {
    borderRadius: BORDER_RADIUS.round,
    width: 40,
    height: 40,
    backgroundColor: COLORS.error,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  productCard: {
    width: (width - SPACING.lg * 3) / 2,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    minHeight: 160,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    ...SHADOWS.medium,
  },
  productCardDisabled: {
    opacity: 0.5,
  },
  productCardSelected: {
    borderColor: COLORS.celeste,
    borderWidth: 3,
    ...SHADOWS.large,
  },
  productName: {
    color: COLORS.celesteDark,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  productPrice: {
    color: COLORS.naranjaDark,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productStock: {
    color: COLORS.gray,
    fontSize: 13,
    marginTop: 2,
    textAlign: 'center',
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  quantityButton: {
    borderRadius: BORDER_RADIUS.round,
    width: 32,
    height: 32,
    marginHorizontal: 2,
  },
  minusButton: {
    backgroundColor: COLORS.error,
  },
  plusButton: {
    backgroundColor: COLORS.success,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  confirmButton: {
    backgroundColor: COLORS.success,
  },
  cancelQuantityButton: {
    backgroundColor: COLORS.error,
  },
  quantityDisplay: {
    backgroundColor: COLORS.celeste,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    minWidth: 36,
    alignItems: 'center',
    marginHorizontal: 4,
    ...SHADOWS.small,
  },
  quantityText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quantityInputContainer: {
    width: '100%',
    marginTop: SPACING.sm,
  },
  quantityInput: {
    backgroundColor: COLORS.white,
    marginBottom: SPACING.sm,
  },
  quantityInputActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyStateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  emptyStateText: {
    color: COLORS.gray,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  emptyStateSubtext: {
    color: COLORS.gray,
    fontSize: 14,
    textAlign: 'center',
  },
  selectedItemsList: {
    marginBottom: SPACING.md,
  },
  selectedItemCard: {
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  selectedItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  selectedItemInfo: {
    flex: 1,
  },
  selectedItemName: {
    color: COLORS.celesteDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedItemDetails: {
    color: COLORS.gray,
    fontSize: 14,
    marginTop: 2,
  },
  selectedItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedItemQuantity: {
    color: COLORS.celesteDark,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: SPACING.sm,
    minWidth: 30,
    textAlign: 'center',
  },
  summaryCard: {
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
    ...SHADOWS.large,
    padding: SPACING.lg,
  },
  summaryContent: {
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    color: COLORS.gray,
    fontSize: 16,
  },
  summaryValue: {
    color: COLORS.celesteDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  discountValue: {
    color: COLORS.success,
  },
  summaryDivider: {
    marginVertical: SPACING.md,
    backgroundColor: COLORS.lightGray,
  },
  summaryTotalLabel: {
    color: COLORS.naranjaDark,
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryTotalValue: {
    color: COLORS.naranjaDark,
    fontSize: 24,
    fontWeight: 'bold',
  },
  discountButton: {
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
  },
  fixedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  cancelButton: {
    flex: 1,
    marginRight: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.celesteDark,
  },
  saveButton: {
    flex: 1,
    marginLeft: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: 0,
    ...SHADOWS.large,
  },
  modalContent: {
    padding: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    color: COLORS.celesteDark,
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
    textAlign: 'center',
  },
  discountTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.lg,
  },
  discountTypeChip: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.celeste,
  },
  discountTypeChipSelected: {
    backgroundColor: COLORS.celeste,
  },
  discountTypeChipText: {
    color: COLORS.celesteDark,
  },
  discountTypeChipTextSelected: {
    color: COLORS.white,
  },
  discountInput: {
    backgroundColor: COLORS.white,
    marginBottom: SPACING.lg,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
}); 