import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
  Text,
} from 'react-native';
import {
  FAB,
  Card,
  Title,
  Paragraph,
  Button,
  Searchbar,
  Chip,
  Portal,
  Modal,
  TextInput,
  Provider as PaperProvider,
  List,
  Divider,
  Surface,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchSales, addSale } from '../store/slices/salesSlice';
import { fetchCustomers } from '../store/slices/customersSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import { addStockMovement } from '../store/slices/stockMovementsSlice';
import { database } from '../database/database';
import { Sale, Customer, Product, SaleItem } from '../types';
import { COLORS, SHADOWS } from '../theme/colors';

export default function SalesScreen() {
  const dispatch = useAppDispatch();
  const { sales, loading, error } = useAppSelector((state: any) => state.sales);
  const { customers } = useAppSelector((state: any) => state.customers);
  const { products } = useAppSelector((state: any) => state.products);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  const handleAddSale = () => {
    setSelectedCustomer(null);
    setSelectedItems([]);
    setCustomerSearchQuery('');
    setModalVisible(true);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchQuery(customer.name);
  };

  const handleAddItem = (product: Product, quantity: number) => {
    const existingItem = selectedItems.find(item => item.productId === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = currentQuantity + quantity;
    
    // Verificar que no exceda el stock disponible
    if (newTotalQuantity > product.stock) {
      Alert.alert('Error', `No hay suficiente stock. Disponible: ${product.stock} unidades`);
      return;
    }
    
    if (existingItem) {
      setSelectedItems(selectedItems.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: newTotalQuantity, total: newTotalQuantity * item.unitPrice }
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

  const handleSaveSale = async () => {
    if (!selectedCustomer || selectedItems.length === 0) {
      Alert.alert('Error', 'Por favor selecciona un cliente y al menos un producto');
      return;
    }
    setIsSaving(true);
    try {
      // Validar stock más reciente antes de guardar la venta
      for (const item of selectedItems) {
        const latestProduct = await database.getProductById(item.productId);
        if (!latestProduct || latestProduct.stock < item.quantity) {
          Alert.alert('Error', `No hay suficiente stock para el producto "${item.productName}". Stock actual: ${latestProduct ? latestProduct.stock : 0}`);
          setIsSaving(false);
          return;
        }
      }

      const total = selectedItems.reduce((sum, item) => sum + item.total, 0);
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

      // Guardar la venta
      await dispatch(addSale(saleData));

      // Registrar movimientos de stock por cada producto vendido
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

      // Refrescar productos para actualizar el stock en la UI
      dispatch(fetchProducts());
      setModalVisible(false);
      Alert.alert('Éxito', '¡Venta registrada con éxito!');
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al guardar la venta.');
    } finally {
      setIsSaving(false);
    }
  };

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
          <Searchbar
            placeholder="Buscar ventas..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchbar, SHADOWS.medium]}
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

          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={styles.modal}
            >
              <Surface style={[styles.modalSurface, SHADOWS.modal]} elevation={4}>
                <ScrollView contentContainerStyle={styles.modalScrollContent}>
                  <Title style={styles.modalTitle}>Nueva Venta</Title>
                  <TextInput
                    label="Buscar Cliente"
                    value={customerSearchQuery}
                    onChangeText={setCustomerSearchQuery}
                    style={[styles.input, SHADOWS.small]}
                    mode="outlined"
                    outlineColor={COLORS.celeste}
                    activeOutlineColor={COLORS.celesteDark}
                  />
                  {!selectedCustomer && customerSearchQuery && (
                    <View style={styles.customerList}>
                      {customers
                        .filter((customer: any) => 
                          customer.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                          customer.cuil.includes(customerSearchQuery)
                        )
                        .map((customer: any) => (
                          <List.Item
                            key={customer.id}
                            title={customer.name}
                            description={customer.cuil}
                            onPress={() => handleSelectCustomer(customer)}
                            left={props => <List.Icon {...props} icon="account" color={COLORS.celeste} />}
                            style={[styles.customerListItem, SHADOWS.small]}
                          />
                        ))}
                    </View>
                  )}
                  {selectedCustomer && (
                    <Surface style={[styles.selectedCustomer, SHADOWS.card]} elevation={2}>
                      <Card.Content>
                        <Title style={styles.selectedCustomerTitle}>Cliente Seleccionado</Title>
                        <Paragraph style={styles.selectedCustomerName}>{selectedCustomer.name}</Paragraph>
                        <Paragraph style={styles.selectedCustomerCuil}>CUIL: {selectedCustomer.cuil}</Paragraph>
                      </Card.Content>
                    </Surface>
                  )}
                  <Divider style={styles.divider} />
                  <Title style={styles.sectionTitle}>Productos</Title>
                  {products.map((product: any) => {
                    const selectedItem = selectedItems.find(item => item.productId === product.id);
                    const selectedQuantity = selectedItem ? selectedItem.quantity : 0;
                    const remainingStock = product.stock - selectedQuantity;
                    return (
                      <List.Item
                        key={product.id}
                        title={product.name}
                        description={`$${product.price} - Stock: ${product.stock} (Seleccionado: ${selectedQuantity})`}
                        right={props => (
                          <Button
                            mode="contained"
                            onPress={() => handleAddItem(product, 1)}
                            disabled={remainingStock <= 0}
                            style={[styles.addButton, SHADOWS.button]}
                            labelStyle={styles.buttonLabel}
                          >
                            Agregar
                          </Button>
                        )}
                        style={[styles.productListItem, SHADOWS.small]}
                      />
                    );
                  })}
                  <Divider style={styles.divider} />
                  <Title style={styles.sectionTitle}>Items Seleccionados</Title>
                  {selectedItems.map(item => (
                    <Surface key={item.id} style={[styles.itemCard, SHADOWS.card]} elevation={2}>
                      <Card.Content>
                        <Title style={styles.itemTitle}>{item.productName}</Title>
                        <Paragraph style={styles.itemInfo}>Cantidad: {item.quantity}</Paragraph>
                        <Paragraph style={styles.itemInfo}>Precio: ${item.unitPrice}</Paragraph>
                        <Paragraph style={styles.itemInfo}>Total: ${item.total}</Paragraph>
                      </Card.Content>
                      <Card.Actions>
                        <View style={styles.quantityContainer}>
                          <Text style={styles.quantityLabel}>Cantidad:</Text>
                          <TextInput
                            value={item.quantity.toString()}
                            onChangeText={(text) => handleQuantityChange(item.id, text)}
                            keyboardType="numeric"
                            style={[styles.quantityInput, SHADOWS.small]}
                            mode="outlined"
                            outlineColor={COLORS.celeste}
                            activeOutlineColor={COLORS.celesteDark}
                            dense
                          />
                        </View>
                        <Button onPress={() => handleRemoveItem(item.id)} style={[styles.deleteItemButton, SHADOWS.button]} labelStyle={styles.deleteItemButtonLabel}>
                          Eliminar
                        </Button>
                      </Card.Actions>
                    </Surface>
                  ))}
                  {selectedItems.length > 0 && (
                    <View style={styles.totalContainer}>
                      <Title style={styles.totalTitle}>
                        Total: ${selectedItems.reduce((sum, item) => sum + item.total, 0)}
                      </Title>
                    </View>
                  )}
                  <View style={styles.modalActions}>
                    <Button onPress={() => setModalVisible(false)} mode="outlined" style={[styles.cancelButton, SHADOWS.button]} labelStyle={styles.cancelButtonLabel}>Cancelar</Button>
                    <Button mode="contained" onPress={handleSaveSale} disabled={!selectedCustomer || selectedItems.length === 0 || isSaving} loading={isSaving} style={[styles.saveButton, SHADOWS.button]} labelStyle={styles.buttonLabel}>Guardar Venta</Button>
                  </View>
                </ScrollView>
              </Surface>
            </Modal>
          </Portal>

          <FAB
            icon="plus"
            style={[styles.fab, SHADOWS.large]}
            onPress={handleAddSale}
            color={COLORS.white}
            theme={{ colors: { accent: COLORS.celeste } }}
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
  list: {
    padding: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  saleSubtitle: {
    color: COLORS.gray,
    fontSize: 14,
    marginBottom: 4,
  },
  saleDate: {
    color: COLORS.gray,
    fontSize: 13,
    marginBottom: 4,
  },
  saleTotal: {
    color: COLORS.naranjaDark,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.celeste,
  },
  modal: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    margin: 20,
  },
  modalSurface: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
  },
  modalScrollContent: {
    flexGrow: 1,
  },
  modalTitle: {
    color: COLORS.celesteDark,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    ...SHADOWS.card,
  },
  customerList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  customerListItem: {
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: COLORS.lightGray,
  },
  selectedCustomer: {
    marginBottom: 16,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    ...SHADOWS.card,
  },
  selectedCustomerTitle: {
    color: COLORS.celesteDark,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  selectedCustomerName: {
    color: COLORS.darkGray,
    fontSize: 14,
    marginBottom: 2,
  },
  selectedCustomerCuil: {
    color: COLORS.gray,
    fontSize: 13,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: COLORS.gray,
  },
  sectionTitle: {
    color: COLORS.celesteDark,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  productListItem: {
    marginBottom: 8,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    ...SHADOWS.small,
  },
  itemCard: {
    marginBottom: 8,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    ...SHADOWS.card,
  },
  itemTitle: {
    color: COLORS.celesteDark,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemInfo: {
    color: COLORS.gray,
    fontSize: 13,
    marginBottom: 2,
  },
  addButton: {
    backgroundColor: COLORS.celeste,
    borderRadius: 8,
  },
  itemActionButton: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
  },
  deleteItemButton: {
    backgroundColor: COLORS.rojizo,
    borderRadius: 8,
  },
  deleteItemButtonLabel: {
    color: COLORS.white,
    fontWeight: '600',
  },
  totalContainer: {
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 10,
    ...SHADOWS.card,
  },
  totalTitle: {
    color: COLORS.naranjaDark,
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
  },
  cancelButtonLabel: {
    color: COLORS.gray,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.celeste,
    borderRadius: 8,
  },
  buttonLabel: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  quantityLabel: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  quantityInput: {
    width: 80,
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
}); 