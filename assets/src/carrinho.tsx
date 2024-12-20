import React from 'react';
import { Text, View, Button, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useCarrinho } from './carrinhoBase'; // Importe o hook do contexto
import { FinalizarPedido } from './finalizarPedido'; // Importe o hook do contexto
import { useNavigation } from '@react-navigation/native';

export const CarrinhoTela = () => {
  const navigation = useNavigation(); // Usando o hook
  const { carrinho, removerDoCarrinho } = useCarrinho();


  const totalCarrinho = carrinho.reduce((total, item) => total + (item.total || 0), 0);

  if (isNaN(totalCarrinho) || totalCarrinho === 0) {
    alert("Carrinho vazio!");
    return;
  }
  

  const finalizarCompra = () => {
    navigation.navigate('Finalizar Pedido', { total: totalCarrinho, itens: carrinho });
  };
  
  

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Carrinho de Compras</Text>
        {carrinho.length === 0 ? (
          <Text style={styles.emptyText}>O carrinho está vazio</Text>
        ) : (
          carrinho.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.itemContainer}>
              {item.imagem && <Image source={{ uri: item.imagem }} style={styles.itemImage} />}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemQuantity}>Quantidade: {item.quantidade}</Text>
              </View>
              {item.adicionais && item.adicionais.length > 0 && (
                <View style={styles.adicionaisContainer}>
                  <Text style={styles.adicionaisTitle}>Adicionais:</Text>
                  {item.adicionais.map((adicional, adicionalIndex) => (
                    <Text key={`${item.id}-${adicional.ID}-${adicionalIndex}`} style={styles.adicionalText}>
                      {adicional.Nome} - R$ {adicional.Preco.toFixed(2).replace('.', ',')}
                    </Text>
                  ))}
                </View>
              )}
              <Text style={styles.observacoes}>Observações: {item.observacoes}</Text>
              <Text style={styles.total}>Total: R$ {item.total.toFixed(2).replace('.', ',')}</Text>
              <Button title="Remover do Carrinho" onPress={() => removerDoCarrinho(item.id)} color="#e74c3c" />
            </View>
          ))
          
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.totalCarrinho}>
          Total: R$ {totalCarrinho.toFixed(2).replace('.', ',')}
        </Text>
        <TouchableOpacity style={styles.finalizarButton} onPress={finalizarCompra}>
          <Text style={styles.finalizarText}>Finalizar Compra</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
;


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingBottom: 80, // Espaço extra para o botão fixo
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  },
  itemContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#000000',
    borderWidth:2,
  },
  itemImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 15,
  },
  itemInfo: {
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#555',
  },
  adicionaisContainer: {
    marginBottom: 10,
  },
  adicionaisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  adicionalText: {
    fontSize: 14,
    color: '#555',
  },
  observacoes: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,
  },
  totalCarrinho: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  finalizarButton: {
    backgroundColor: '#4C544FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  finalizarText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
