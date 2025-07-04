import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
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
  Surface,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProducts, updateProduct } from '../store/slices/productsSlice';
import { fetchStockMovements, addStockMovement } from '../store/slices/stockMovementsSlice';
import { Product, StockMovement } from '../types';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SHADOWS } from '../theme/colors';

export default function StockScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { products, loading, error } = useAppSelector((state: any) => state.products);
  const { stockMovements } = useAppSelector((state: any) => state.stockMovements);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [movementData, setMovementData] = useState({
    type: 'IN' as 'IN' | 'OUT',
    quantity: '',
    reason: '',
  });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchStockMovements());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStockMovement = (product: Product) => {
    setSelectedProduct(product);
    setMovementData({
      type: 'IN',
      quantity: '',
      reason: '',
    });
    setModalVisible(true);
  };

  const handleSaveMovement = () => {
    if (!selectedProduct || !movementData.quantity || !movementData.reason) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const quantity = parseInt(movementData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      Alert.alert('Error', 'La cantidad debe ser un número positivo');
      return;
    }

    if (movementData.type === 'OUT' && quantity > selectedProduct.stock) {
      Alert.alert('Error', 'No hay suficiente stock disponible');
      return;
    }

    const newStock = movementData.type === 'IN' 
      ? selectedProduct.stock + quantity 
      : selectedProduct.stock - quantity;

    // Crear movimiento de stock
    const movement: Omit<StockMovement, 'id' | 'createdAt'> = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type: movementData.type,
      quantity,
      reason: movementData.reason,
      date: new Date().toISOString(),
    };

    dispatch(addStockMovement(movement));
    
    // Actualizar stock del producto
    dispatch(updateProduct({
      ...selectedProduct,
      stock: newStock,
    }));

    setModalVisible(false);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <Surface style={[styles.productCard, SHADOWS.card]} elevation={3}>
      <Card.Content style={styles.cardContent}>
        <Title style={styles.productTitle}>{item.name}</Title>
        {item.description && (
          <Paragraph style={styles.productDescription}>{item.description}</Paragraph>
        )}
        <View style={styles.productInfo}>
          <Chip 
            mode="outlined" 
            style={[
              styles.stockChip, 
              item.stock <= item.minStock ? styles.lowStockChip : styles.normalStockChip
            ]}
            textStyle={styles.chipText}
          >
            Stock: {item.stock}
          </Chip>
          <Chip 
            mode="outlined" 
            style={styles.minStockChip}
            textStyle={styles.chipText}
          >
            Mín: {item.minStock}
          </Chip>
          <Chip 
            mode="outlined" 
            style={styles.categoryChip}
            textStyle={styles.chipText}
          >
            {item.category}
          </Chip>
        </View>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button 
          mode="contained" 
          onPress={() => handleStockMovement(item)}
          style={[styles.movementButton, SHADOWS.button]}
          labelStyle={styles.buttonLabel}
        >
          Movimiento
        </Button>
      </Card.Actions>
    </Surface>
  );

  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
          {/* Header con botón de historial */}
          <View style={styles.header}>
            <Button
              mode="contained"
              icon="history"
              style={[styles.historyButton, SHADOWS.button]}
              labelStyle={styles.buttonLabel}
              onPress={() => (navigation as any).navigate('StockMovementsHistory')}
            >
              Historial
            </Button>
          </View>

          {/* Barra de búsqueda */}
          <Searchbar
            placeholder="Buscar productos..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchbar, SHADOWS.medium]}
            iconColor={COLORS.celeste}
            inputStyle={styles.searchInput}
          />
          
          {/* Lista de productos */}
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshing={loading}
            onRefresh={() => dispatch(fetchProducts())}
            showsVerticalScrollIndicator={false}
          />

          {/* Modal de movimiento de stock */}
          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={styles.modal}
            >
              <Surface style={[styles.modalSurface, SHADOWS.modal]} elevation={4}>
                <Title style={styles.modalTitle}>
                  Movimiento de Stock
                </Title>
                <Paragraph style={styles.modalSubtitle}>
                  {selectedProduct?.name}
                </Paragraph>
                
                <View style={styles.typeSelector}>
                  <Button
                    mode={movementData.type === 'IN' ? 'contained' : 'outlined'}
                    onPress={() => setMovementData({ ...movementData, type: 'IN' })}
                    style={[
                      styles.typeButton,
                      movementData.type === 'IN' ? styles.typeButtonActive : styles.typeButtonInactive,
                      SHADOWS.button
                    ]}
                    labelStyle={styles.buttonLabel}
                  >
                    Entrada
                  </Button>
                  <Button
                    mode={movementData.type === 'OUT' ? 'contained' : 'outlined'}
                    onPress={() => setMovementData({ ...movementData, type: 'OUT' })}
                    style={[
                      styles.typeButton,
                      movementData.type === 'OUT' ? styles.typeButtonActive : styles.typeButtonInactive,
                      SHADOWS.button
                    ]}
                    labelStyle={styles.buttonLabel}
                  >
                    Salida
                  </Button>
                </View>
                
                <TextInput
                  label="Cantidad"
                  value={movementData.quantity}
                  onChangeText={(text) => setMovementData({ ...movementData, quantity: text })}
                  style={[styles.input, SHADOWS.small]}
                  mode="outlined"
                  keyboardType="numeric"
                  outlineColor={COLORS.celeste}
                  activeOutlineColor={COLORS.celesteDark}
                />
                
                <TextInput
                  label="Motivo"
                  value={movementData.reason}
                  onChangeText={(text) => setMovementData({ ...movementData, reason: text })}
                  style={[styles.input, SHADOWS.small]}
                  mode="outlined"
                  multiline
                  outlineColor={COLORS.celeste}
                  activeOutlineColor={COLORS.celesteDark}
                />
                
                <View style={styles.modalActions}>
                  <Button 
                    mode="outlined" 
                    onPress={() => setModalVisible(false)}
                    style={[styles.cancelButton, SHADOWS.button]}
                    labelStyle={styles.cancelButtonLabel}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={handleSaveMovement}
                    style={[styles.saveButton, SHADOWS.button]}
                    labelStyle={styles.buttonLabel}
                  >
                    Guardar
                  </Button>
                </View>
              </Surface>
            </Modal>
          </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  historyButton: {
    backgroundColor: COLORS.naranja,
    borderRadius: 8,
  },
  searchbar: {
    margin: 16,
    marginTop: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  searchInput: {
    color: COLORS.darkGray,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  productCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  cardContent: {
    padding: 16,
  },
  productTitle: {
    color: COLORS.celesteDark,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDescription: {
    color: COLORS.gray,
    fontSize: 14,
    marginBottom: 12,
  },
  productInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stockChip: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.celeste,
  },
  normalStockChip: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.celeste,
  },
  lowStockChip: {
    backgroundColor: '#ffebee',
    borderColor: COLORS.rojizo,
  },
  minStockChip: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.naranja,
  },
  categoryChip: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.gray,
  },
  chipText: {
    color: COLORS.darkGray,
    fontSize: 12,
    fontWeight: '500',
  },
  cardActions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'flex-end',
  },
  movementButton: {
    backgroundColor: COLORS.celeste,
    borderRadius: 8,
  },
  buttonLabel: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
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
  modalTitle: {
    color: COLORS.celesteDark,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    borderRadius: 8,
  },
  typeButtonActive: {
    backgroundColor: COLORS.celeste,
  },
  typeButtonInactive: {
    borderColor: COLORS.celeste,
  },
  input: {
    marginBottom: 16,
    backgroundColor: COLORS.white,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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
}); 