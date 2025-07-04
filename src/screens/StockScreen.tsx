import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Pressable,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Title,
  Paragraph,
  Searchbar,
  Chip,
  Portal,
  Modal,
  TextInput,
  Provider as PaperProvider,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProducts, updateProduct } from '../store/slices/productsSlice';
import { fetchStockMovements, addStockMovement } from '../store/slices/stockMovementsSlice';
import { Product, StockMovement } from '../types';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../theme/colors';
import EnhancedCard from '../components/EnhancedCard';
import EnhancedButton from '../components/EnhancedButton';
import GradientBackground from '../components/GradientBackground';

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

  const renderProduct = ({ item }: { item: Product }) => {
    const stockStatus = item.stock === 0 ? 'out' : item.stock <= item.minStock ? 'low' : 'normal';
    const stockColor = stockStatus === 'out' ? COLORS.rojizo : stockStatus === 'low' ? COLORS.warning : COLORS.success;
    return (
      <EnhancedCard
        variant="glass"
        style={styles.productCard}
      >
        <View style={styles.productContent}>
          {/* Ícono centrado arriba */}
          <View style={styles.iconWrapper}>
            <MaterialIcons name="inventory" size={48} color={COLORS.celeste} />
          </View>
          <Title style={styles.productTitle}>{item.name}</Title>
          {item.description && <Paragraph style={styles.productDescription}>{item.description}</Paragraph>}
          {/* Categoría como chip centrado */}
          <View style={styles.categoryRow}>
            <Chip style={styles.categoryChip} textStyle={styles.chipText}
              icon={() => <MaterialIcons name="local-offer" size={18} color={COLORS.celeste} />}>
              {item.category}
            </Chip>
          </View>
          {/* Chips de stock y mínimo */}
          <View style={styles.productInfoRow}>
            <Chip style={[styles.stockChip, { borderColor: stockColor, backgroundColor: stockColor + '22' }]} textStyle={[styles.chipText, { color: stockColor }]}
              icon={() => <MaterialIcons name="check-circle" size={18} color={stockColor} />}>
              Stock: {item.stock}
            </Chip>
            <Chip style={styles.minStockChip} textStyle={styles.chipText}
              icon={() => <MaterialIcons name="error-outline" size={18} color={COLORS.rojizo} />}>
              Mín: {item.minStock}
            </Chip>
          </View>
          <View style={styles.productActions}>
            <EnhancedButton
              title="Movimiento"
              onPress={() => handleStockMovement(item)}
              variant="gradient"
              gradientType={stockStatus === 'out' ? 'error' : stockStatus === 'low' ? 'warning' : 'success'}
              icon="swap-vert"
              size="small"
              style={styles.actionButton}
            />
          </View>
        </View>
      </EnhancedCard>
    );
  };

  return (
    <PaperProvider>
      <GradientBackground gradientType="ocean" style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header mejorado */}
          <View style={styles.headerBar}>
            <Title style={styles.headerTitle}>Stock</Title>
            <EnhancedButton
              title="Historial"
              onPress={() => (navigation as any).navigate('StockMovementsHistory')}
              variant="outline"
              icon="history"
              size="small"
              style={styles.historyButton}
              textStyle={styles.historyButtonLabel}
            />
          </View>
          <Searchbar
            placeholder="Buscar productos..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchbar, SHADOWS.depth]}
            iconColor={COLORS.celeste}
            inputStyle={styles.searchInput}
          />
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshing={loading}
            onRefresh={() => dispatch(fetchProducts())}
            showsVerticalScrollIndicator={false}
          />
          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={[styles.modal, { minWidth: 320, minHeight: 320 }]}
            >
              <View style={[styles.modalSurface, SHADOWS.modal]}>
                <Title style={styles.modalTitle}>{movementData.type === 'IN' ? 'Ingreso de Stock' : 'Egreso de Stock'}</Title>
                <TextInput
                  label="Cantidad *"
                  value={movementData.quantity}
                  onChangeText={(text) => setMovementData({ ...movementData, quantity: text })}
                  style={[styles.input, SHADOWS.small]}
                  mode="outlined"
                  keyboardType="numeric"
                  outlineColor={COLORS.celeste}
                  activeOutlineColor={COLORS.celesteDark}
                />
                <TextInput
                  label="Motivo *"
                  value={movementData.reason}
                  onChangeText={(text) => setMovementData({ ...movementData, reason: text })}
                  style={[styles.input, SHADOWS.small]}
                  mode="outlined"
                  outlineColor={COLORS.celeste}
                  activeOutlineColor={COLORS.celesteDark}
                />
                <View style={styles.movementTypeRow}>
                  <Pressable
                    onPress={() => setMovementData({ ...movementData, type: 'IN' })}
                    style={{
                      backgroundColor: movementData.type === 'IN' ? COLORS.success : COLORS.white,
                      borderColor: COLORS.success,
                      borderWidth: 2,
                      borderRadius: 16,
                      paddingVertical: 12,
                      paddingHorizontal: 24,
                      marginRight: 12,
                      minWidth: 110,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: movementData.type === 'IN' ? COLORS.white : COLORS.success, fontWeight: 'bold', fontSize: 18 }}>Ingreso</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setMovementData({ ...movementData, type: 'OUT' })}
                    style={{
                      backgroundColor: movementData.type === 'OUT' ? COLORS.error : COLORS.white,
                      borderColor: COLORS.error,
                      borderWidth: 2,
                      borderRadius: 16,
                      paddingVertical: 12,
                      paddingHorizontal: 24,
                      minWidth: 110,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: movementData.type === 'OUT' ? COLORS.white : COLORS.error, fontWeight: 'bold', fontSize: 18 }}>Egreso</Text>
                  </Pressable>
                </View>
                <View style={styles.modalActions}>
                  <Pressable
                    onPress={() => setModalVisible(false)}
                    style={{
                      backgroundColor: COLORS.white,
                      borderColor: COLORS.celeste,
                      borderWidth: 2,
                      borderRadius: 12,
                      paddingVertical: 14,
                      paddingHorizontal: 32,
                      flex: 1,
                      marginRight: 8,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: COLORS.celesteDark, fontWeight: 'bold', fontSize: 18 }}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSaveMovement}
                    style={{
                      backgroundColor: COLORS.celeste,
                      borderRadius: 12,
                      paddingVertical: 14,
                      paddingHorizontal: 32,
                      flex: 1,
                      marginLeft: 8,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 18 }}>Guardar</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </Portal>
        </View>
      </GradientBackground>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    color: COLORS.celesteDark,
    fontSize: 22,
    fontWeight: 'bold',
  },
  historyButton: {
    minWidth: 110,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderColor: COLORS.celeste,
    borderWidth: 1.5,
    backgroundColor: COLORS.white,
    elevation: 2,
  },
  historyButtonLabel: {
    color: COLORS.celesteDark,
    fontWeight: 'bold',
    fontSize: 15,
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
  productCard: {
    marginBottom: 20,
    borderRadius: BORDER_RADIUS.xxl,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  productContent: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  productTitle: {
    color: COLORS.celesteDark,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
    marginTop: 2,
    textAlign: 'center',
    width: '100%',
  },
  productDescription: {
    color: COLORS.gray,
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    width: '100%',
  },
  productInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 14,
    width: '100%',
  },
  stockChip: {
    borderWidth: 2,
    borderRadius: 16,
    marginRight: 4,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  minStockChip: {
    borderWidth: 1,
    borderRadius: 16,
    marginRight: 4,
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.naranja,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.celeste,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 0,
    width: '100%',
  },
  actionButton: {
    minWidth: 90,
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  movementTypeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
    gap: SPACING.md,
  },
  typeButton: {
    minWidth: 110,
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
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
    backgroundColor: COLORS.white,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  cancelButton: {
    borderColor: COLORS.celeste,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    flex: 1,
    marginRight: 8,
  },
  cancelButtonLabel: {
    color: COLORS.celesteDark,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: COLORS.celeste,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  buttonLabel: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 4,
  },
  categoryRow: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 8,
  },
}); 