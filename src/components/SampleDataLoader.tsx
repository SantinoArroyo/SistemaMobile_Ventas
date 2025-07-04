import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { useAppDispatch } from '../hooks/redux';
import { addProduct } from '../store/slices/productsSlice';
import { addCustomer } from '../store/slices/customersSlice';
import { sampleProducts, sampleCustomers } from '../utils/sampleData';

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
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <Title>Datos de Ejemplo</Title>
        <Paragraph>
          Carga productos y clientes de ejemplo para probar la aplicación.
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={loadSampleData}>
          Cargar Datos de Ejemplo
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 2,
  },
}); 