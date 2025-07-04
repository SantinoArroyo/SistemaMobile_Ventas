import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Surface,
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Portal,
  Modal,
  TextInput,
  Provider as PaperProvider,
  Searchbar,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCustomers, addCustomer, updateCustomer, deleteCustomer } from '../store/slices/customersSlice';
import { Customer } from '../types';
import { COLORS, SHADOWS } from '../theme/colors';

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
    <Surface style={[styles.customerCard, SHADOWS.card]} elevation={3}>
      <Card.Content style={styles.cardContent}>
        <Title style={styles.customerTitle}>{item.name}</Title>
        <Paragraph style={styles.customerCuil}>CUIL: {item.cuil}</Paragraph>
        {item.phone && <Paragraph style={styles.customerInfo}>Teléfono: {item.phone}</Paragraph>}
        {item.email && <Paragraph style={styles.customerInfo}>Email: {item.email}</Paragraph>}
        {item.address && <Paragraph style={styles.customerInfo}>Dirección: {item.address}</Paragraph>}
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button mode="outlined" onPress={() => handleEditCustomer(item)} style={[styles.editButton, SHADOWS.button]} labelStyle={styles.editButtonLabel}>Editar</Button>
        <Button mode="contained" onPress={() => handleDeleteCustomer(item)} style={[styles.deleteButton, SHADOWS.button]} labelStyle={styles.buttonLabel}>Eliminar</Button>
      </Card.Actions>
    </Surface>
  );

  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
          <Searchbar
            placeholder="Buscar clientes..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchbar, SHADOWS.medium]}
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
              contentContainerStyle={styles.modal}
            >
              <Surface style={[styles.modalSurface, SHADOWS.modal]} elevation={4}>
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
                  <Button mode="outlined" onPress={() => setModalVisible(false)} style={[styles.cancelButton, SHADOWS.button]} labelStyle={styles.cancelButtonLabel}>Cancelar</Button>
                  <Button mode="contained" onPress={handleSaveCustomer} style={[styles.saveButton, SHADOWS.button]} labelStyle={styles.buttonLabel}>Guardar</Button>
                </View>
              </Surface>
            </Modal>
          </Portal>
          <FAB
            icon="plus"
            style={[styles.fab, SHADOWS.large]}
            onPress={handleAddCustomer}
            color={COLORS.white}
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
  customerCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  cardContent: {
    padding: 16,
  },
  customerTitle: {
    color: COLORS.celesteDark,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  customerCuil: {
    color: COLORS.gray,
    fontSize: 14,
    marginBottom: 4,
  },
  customerInfo: {
    color: COLORS.gray,
    fontSize: 13,
    marginBottom: 2,
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