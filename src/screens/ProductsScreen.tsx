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
  FAB,
  Surface,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../store/slices/productsSlice';
import { Product } from '../types';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../theme/colors';
import EnhancedCard from '../components/EnhancedCard';
import EnhancedButton from '../components/EnhancedButton';
import GradientBackground from '../components/GradientBackground';

export default function ProductsScreen() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state: any) => state.products);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    minStock: '',
    category: '',
  });

  useEffect(() => {
    dispatch(fetchProducts());
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

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductData({
      name: '',
      description: '',
      price: '',
      stock: '',
      minStock: '',
      category: '',
    });
    setModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      category: product.category,
    });
    setModalVisible(true);
  };

  const handleSaveProduct = () => {
    if (!productData.name || !productData.price || !productData.stock || !productData.minStock || !productData.category) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const price = parseFloat(productData.price);
    const stock = parseInt(productData.stock);
    const minStock = parseInt(productData.minStock);

    if (isNaN(price) || price <= 0) {
      Alert.alert('Error', 'El precio debe ser un número positivo');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      Alert.alert('Error', 'El stock debe ser un número no negativo');
      return;
    }

    if (isNaN(minStock) || minStock < 0) {
      Alert.alert('Error', 'El stock mínimo debe ser un número no negativo');
      return;
    }

    if (editingProduct) {
      dispatch(updateProduct({ ...editingProduct, ...productData, price, stock, minStock }));
    } else {
      dispatch(addProduct({ ...productData, price, stock, minStock }));
    }

    setModalVisible(false);
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const stockStatus = item.stock <= item.minStock ? 'low' : 'normal';
    const stockColor = item.stock <= item.minStock ? COLORS.warning : COLORS.success;
    
    return (
      <EnhancedCard
        variant="default"
        borderGradient={true}
        gradientType={stockStatus === 'low' ? 'warning' : 'success'}
        glowEffect={item.stock === 0}
        style={styles.productCard}
      >
        <View style={styles.productHeader}>
          <View style={styles.productTitleContainer}>
            <Title style={styles.productTitle}>{item.name}</Title>
            {item.description && (
              <Paragraph style={styles.productDescription}>{item.description}</Paragraph>
            )}
          </View>
          <View style={[styles.stockIndicator, { backgroundColor: stockColor + '20' }]}>
            <MaterialIcons 
              name={item.stock === 0 ? 'block' : item.stock <= item.minStock ? 'warning' : 'check-circle'} 
              size={20} 
              color={stockColor} 
            />
          </View>
        </View>
        
        <View style={styles.productInfo}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialIcons name="attach-money" size={16} color={COLORS.naranja} />
              <Paragraph style={styles.infoText}>${item.price}</Paragraph>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="inventory" size={16} color={stockColor} />
              <Paragraph style={[styles.infoText, { color: stockColor }]}>
                {item.stock} unidades
              </Paragraph>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
                              <MaterialIcons name="warning" size={16} color={COLORS.gray} />
              <Paragraph style={styles.infoText}>Mín: {item.minStock}</Paragraph>
            </View>
            <View style={styles.infoItem}>
                              <MaterialIcons name="label" size={16} color={COLORS.celeste} />
              <Paragraph style={styles.infoText}>{item.category}</Paragraph>
            </View>
          </View>
        </View>
        
        <View style={styles.productActions}>
          <EnhancedButton
            title="Editar"
            onPress={() => handleEditProduct(item)}
            variant="outline"
            size="small"
            icon="edit"
            style={styles.actionButton}
          />
          <EnhancedButton
            title="Eliminar"
            onPress={() => {
              Alert.alert(
                'Confirmar eliminación',
                `¿Estás seguro de que quieres eliminar "${item.name}"?`,
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Eliminar', onPress: () => dispatch(deleteProduct(item.id)), style: 'destructive' },
                ]
              );
            }}
            variant="error"
            size="small"
            icon="delete"
            style={styles.actionButton}
          />
        </View>
      </EnhancedCard>
    );
  };

  return (
    <PaperProvider>
      <GradientBackground gradientType="ocean" style={{ flex: 1 }}>
        <View style={styles.container}>
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
              contentContainerStyle={styles.modal}
            >
              <Surface style={[styles.modalSurface, SHADOWS.modal]} elevation={4}>
                <Title style={styles.modalTitle}>
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </Title>
                
                <TextInput
                  label="Nombre *"
                  value={productData.name}
                  onChangeText={(text) => setProductData({ ...productData, name: text })}
                  style={[styles.input, SHADOWS.small]}
                  mode="outlined"
                  outlineColor={COLORS.celeste}
                  activeOutlineColor={COLORS.celesteDark}
                />
                
                <TextInput
                  label="Descripción"
                  value={productData.description}
                  onChangeText={(text) => setProductData({ ...productData, description: text })}
                  style={[styles.input, SHADOWS.small]}
                  mode="outlined"
                  multiline
                  outlineColor={COLORS.celeste}
                  activeOutlineColor={COLORS.celesteDark}
                />
                
                <TextInput
                  label="Precio *"
                  value={productData.price}
                  onChangeText={(text) => setProductData({ ...productData, price: text })}
                  style={[styles.input, SHADOWS.small]}
                  mode="outlined"
                  keyboardType="numeric"
                  outlineColor={COLORS.celeste}
                  activeOutlineColor={COLORS.celesteDark}
                />
                
                <TextInput
                  label="Stock *"
                  value={productData.stock}
                  onChangeText={(text) => setProductData({ ...productData, stock: text })}
                  style={[styles.input, SHADOWS.small]}
                  mode="outlined"
                  keyboardType="numeric"
                  outlineColor={COLORS.celeste}
                  activeOutlineColor={COLORS.celesteDark}
                />
                
                <TextInput
                  label="Stock Mínimo *"
                  value={productData.minStock}
                  onChangeText={(text) => setProductData({ ...productData, minStock: text })}
                  style={[styles.input, SHADOWS.small]}
                  mode="outlined"
                  keyboardType="numeric"
                  outlineColor={COLORS.celeste}
                  activeOutlineColor={COLORS.celesteDark}
                />
                
                <TextInput
                  label="Categoría *"
                  value={productData.category}
                  onChangeText={(text) => setProductData({ ...productData, category: text })}
                  style={[styles.input, SHADOWS.small]}
                  mode="outlined"
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
                    onPress={handleSaveProduct}
                    style={[styles.saveButton, SHADOWS.button]}
                    labelStyle={styles.buttonLabel}
                  >
                    Guardar
                  </Button>
                </View>
              </Surface>
            </Modal>
          </Portal>

          <FAB
            icon="plus"
            style={[styles.fab, SHADOWS.large]}
            onPress={handleAddProduct}
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
    borderRadius: 12,
  },
  searchInput: {
    color: COLORS.darkGray,
  },
  list: {
    padding: 16,
  },
  productCard: {
    marginBottom: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  productTitleContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  stockIndicator: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    marginLeft: SPACING.xs,
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
  },
  priceChip: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.success,
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
    justifyContent: 'space-between',
  },
  editButton: {
    borderColor: COLORS.celeste,
    borderRadius: 8,
  },
  editButtonLabel: {
    color: COLORS.celeste,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: COLORS.rojizo,
    borderRadius: 8,
  },
  buttonLabel: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
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
  modalTitle: {
    color: COLORS.celesteDark,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
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