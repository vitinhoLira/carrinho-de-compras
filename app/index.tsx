import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

export default function App() {
  const [productName, setProductName] = useState('');
  const [productValue, setProductValue] = useState('');
  const [priority, setPriority] = useState('');
  const [productList, setProductList] = useState([]);
  const [total, setTotal] = useState(0);

  const formatCurrency = (value) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = (numericValue / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return formattedValue;
  };

  const handleValueChange = (text) => {
    setProductValue(formatCurrency(text));
  };

  const parseValue = (value) => {
    // Converte "R$ 1.234,56" para número
    return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
  };

  const addProduct = () => {
    if (!productName || !productValue || !priority) {
      Alert.alert('Erro', 'Preencha todos os campos, incluindo a prioridade.');
      return;
    }

    const value = parseValue(productValue);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Erro', 'Digite um valor válido para o produto.');
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name: productName,
      value,
      priority,
      quantity: 1, // Define a quantidade inicial como 1
    };

    setProductList([...productList, newProduct]);
    setTotal((prevTotal) => prevTotal + value);
    setProductName('');
    setProductValue('');
    setPriority('');
  };

  const updateQuantity = (id, delta) => {
    const updatedList = productList.map((product) => {
      if (product.id === id) {
        const newQuantity = Math.max(1, product.quantity + delta); // Garante que a quantidade não fique abaixo de 1
        setTotal((prevTotal) => prevTotal + (newQuantity - product.quantity) * product.value);
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    setProductList(updatedList);
  };

  const deleteProduct = (id, value, quantity) => {
    const updatedProductList = productList.filter((product) => product.id !== id);
    setProductList(updatedProductList);
    setTotal((prevTotal) => prevTotal - value * quantity);
  };

  const renderProduct = ({ item }) => (
    <View
      style={[
        styles.productItem,
        { borderLeftWidth: 6, borderColor: item.priority }, // Destaca com uma borda colorida
      ]}
    >
      <View style={styles.productDetails}>
        <Text style={styles.productText}>{item.name}</Text>
        <Text style={styles.productValue}>
          Unitário: R$ {item.value.toFixed(2)}
        </Text>
        <Text style={styles.productValue}>
          Total: R$ {(item.value * item.quantity).toFixed(2)}
        </Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, -1)}
        >
          <Text style={styles.quantityText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, 1)}
        >
          <Text style={styles.quantityText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => deleteProduct(item.id, item.value, item.quantity)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>X</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho de Compras</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor do Produto"
        keyboardType="numeric"
        value={productValue}
        onChangeText={handleValueChange}
      />
      <View style={styles.priorityContainer}>
        <TouchableOpacity
          style={[styles.priorityButton, priority === 'red' && styles.selectedPriority, { backgroundColor: 'red' }]}
          onPress={() => setPriority('red')}
        >
          <Text style={styles.priorityText}>Alta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.priorityButton, priority === 'yellow' && styles.selectedPriority, { backgroundColor: '#FFC107' }]}
          onPress={() => setPriority('yellow')}
        >
          <Text style={styles.priorityText}>Média</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.priorityButton, priority === 'green' && styles.selectedPriority, { backgroundColor: 'green' }]}
          onPress={() => setPriority('green')}
        >
          <Text style={styles.priorityText}>Baixa</Text>
        </TouchableOpacity>
      </View>

      <Button title="Adicionar Produto" onPress={addProduct} />
      <FlatList
        data={productList}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  priorityText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  selectedPriority: {
    borderWidth: 2,
    borderColor: '#000',
  },
  productItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productDetails: {
    flex: 1,
    marginRight: 10,
  },
  productText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  quantityButton: {
    width: 25, // Dimensão menor
    height: 25,
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 14, // Fonte menor
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  list: {
    marginTop: 20,
  },
  
});
