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
  FAB,
  Portal,
  Modal,
  TextInput,
  Provider as PaperProvider,
  Searchbar,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCustomers, addCustomer, updateCustomer, deleteCustomer } from '../store/slices/customersSlice';
import { Customer } from '../types';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../theme/colors';
import EnhancedCard from '../components/EnhancedCard';
import EnhancedButton from '../components/EnhancedButton';
import GradientBackground from '../components/GradientBackground';

export default function CustomersScreen() {
  const dispatch = useAppDispatch();
  const { customers, loading, error } = useAppSelector((state: any) => state.customers);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    cuil: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const filteredCustomers = customers.filter((customer: any) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.cuil.includes(searchQuery)
  );

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      cuil: '',
      phone: '',
      email: '',
      address: '',
    });
    setModalVisible(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      cuil: customer.cuil,
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || '',
    });
    setModalVisible(true);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar "${customer.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => dispatch(deleteCustomer(customer.id)),
        },
      ]
    );
  };

  const handleSaveCustomer = () => {
    if (!formData.name || !formData.cuil) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    const customerData = {
      name: formData.name,
      cuil: formData.cuil,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
    };

    if (editingCustomer) {
      dispatch(updateCustomer({ ...editingCustomer, ...customerData }));
    } else {
      dispatch(addCustomer(customerData));
    }

    setModalVisible(false);
  };

  const renderCustomer = ({ item }: { item: Customer }) => (
    <EnhancedCard
      variant="glass"
      style={styles.customerCard}
      icon="person"
      iconColor={COLORS.celeste}
    >
      <View style={styles.customerContent}>
        <Title style={styles.customerTitle}>{item.name}</Title>
        <Paragraph style={styles.customerCuil}>CUIL: {item.cuil}</Paragraph>
        {item.phone && <Paragraph style={styles.customerInfo}><MaterialIcons name="phone" size={16} color={COLORS.celeste} /> {item.phone}</Paragraph>}
        {item.email && <Paragraph style={styles.customerInfo}><MaterialIcons name="email" size={16} color={COLORS.celeste} /> {item.email}</Paragraph>}
        {item.address && <Paragraph style={styles.customerInfo}><MaterialIcons name="location-on" size={16} color={COLORS.celeste} /> {item.address}</Paragraph>}
        <View style={styles.customerActions}>
          <EnhancedButton title="Editar" onPress={() => handleEditCustomer(item)} variant="outline" size="small" icon="edit" style={styles.actionButton} />
          <EnhancedButton title="Eliminar" onPress={() => handleDeleteCustomer(item)} variant="error" size="small" icon="delete" style={styles.actionButton} />
        </View>
      </View>
    </EnhancedCard>
  );

  return (
    <PaperProvider>
      <GradientBackground gradientType="ocean" style={{ flex: 1 }}>
        <View style={styles.container}>
          <Searchbar
            placeholder="Buscar clientes..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchbar, SHADOWS.depth]}
            iconColor={COLORS.celeste}
            inputStyle={styles.searchInput}
          />
          <FlatList
            data={filteredCustomers}
            renderItem={renderCustomer}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshing={loading}
            onRefresh={() => dispatch(fetchCustomers())}
            showsVerticalScrollIndicator={false}
          />
          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={[styles.modal, { minWidth: 320, minHeight: 320 }]}
            >
              <View style={[styles.modalSurface, SHADOWS.modal]}>
                <Title style={styles.modalTitle}>{editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}</Title>
                <TextInput
                  label="Nombre *"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  style={[styles.input, SHADOWS.small]}
                  mode="outlined"
                  outlineColor={COLORS.celeste}
                  activeOutlineColor={COLORS.celesteDark}
                />
                <TextInput
                  label="CUIL *"
                  value={formData.cuil}
                  onChangeText={(text) => setFormData({ ...formData, cuil: text })}
                  style={[styles.input, SHADOWS.small]}
                  mode="outlined"
                  keyboardType="numeric"
                  outlineColor={COLORS.celeste}
                  activeOutlineColor={COLORS.celesteDark}
                />
                <TextInput
                  label="Teléfono"
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  style={[styles.input, SHADOWS.small]}
                  mode="outlined"
                  keyboardType="phone-pad"
                  outlineColor={COLORS.celeste}
                  activeOutlineColor={COLORS.celesteDark}
                />
                <TextInput
                  label="Email"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  style={[styles.input, SHADOWS.small]}
                  mode="outlined"
                  keyboardType="email-address"
                  outlineColor={COLORS.celeste}
                  activeOutlineColor={COLORS.celesteDark}
                />
                <TextInput
                  label="Dirección"
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  style={[styles.input, SHADOWS.small]}
                  mode="outlined"
                  outlineColor={COLORS.celeste}
                  activeOutlineColor={COLORS.celesteDark}
                />
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
                    onPress={handleSaveCustomer}
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
          <FAB
            icon="plus"
            style={[styles.fab, SHADOWS.large]}
            onPress={handleAddCustomer}
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
  customerCard: {
    marginBottom: 16,
    borderRadius: BORDER_RADIUS.xxl,
  },
  customerContent: {
    paddingHorizontal: 4,
  },
  customerTitle: {
    color: COLORS.celesteDark,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  customerCuil: {
    color: COLORS.gray,
    fontSize: 14,
    marginBottom: 2,
  },
  customerInfo: {
    color: COLORS.darkGray,
    fontSize: 14,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
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
}); 