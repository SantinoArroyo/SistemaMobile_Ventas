import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';
import { useAppDispatch } from '../hooks/redux';
import { addProduct } from '../store/slices/productsSlice';
import { addCustomer } from '../store/slices/customersSlice';
import { sampleProducts, sampleCustomers } from '../utils/sampleData';
import { COLORS, SHADOWS } from '../theme/colors';
import EnhancedCard from './EnhancedCard';
import EnhancedButton from './EnhancedButton';

export default function SampleDataLoader() {
  const dispatch = useAppDispatch();

  const loadSampleData = () => {
    // Cargar productos de ejemplo
    sampleProducts.forEach(product => {
      dispatch(addProduct(product));
    });

    // Cargar clientes de ejemplo
    sampleCustomers.forEach(customer => {
      dispatch(addCustomer(customer));
    });
  };

  return (
    <EnhancedCard
      variant="glass"
      style={StyleSheet.flatten([styles.card, SHADOWS.medium])}
      icon="data-usage"
      iconColor={COLORS.celeste}
    >
      <Title style={styles.title}>Datos de Ejemplo</Title>
      <Paragraph style={styles.description}>
        Carga productos y clientes de ejemplo para probar la aplicación.
      </Paragraph>
      <View style={styles.actions}>
        <EnhancedButton
          title="Cargar Datos de Ejemplo"
          onPress={loadSampleData}
          variant="gradient"
          gradientType="primary"
          style={styles.button}
        />
      </View>
    </EnhancedCard>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  title: {
    color: COLORS.celesteDark,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: COLORS.gray,
    fontSize: 14,
    marginBottom: 16,
  },
  actions: {
    alignItems: 'flex-start',
  },
  button: {
    borderRadius: 12,
  },
}); 