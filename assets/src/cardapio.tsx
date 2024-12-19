import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, FlatList, Image, StyleSheet, TouchableOpacity, ImageBackground, Modal, TextInput } from 'react-native';
import { CheckBox } from 'react-native-elements';
import axios from 'axios';

interface MenuItem {
  ID: number;
  Nome: string;
  Descricao: string;
  Preco: number | string;
  Imagem: string;
  Categoria: string;
}

interface Adicional {
  ID: number;
  Nome: string;
  Preco: number;
  Categoria: string;
}

export const CardapioTela: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [adicionais, setAdicionais] = useState<Adicional[]>([]);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [selectedAdicionais, setSelectedAdicionais] = useState<Adicional[]>([]);
  const [itemQuantity, setItemQuantity] = useState(1); // Estado inicial para a quantidade



  useEffect(() => {
    axios
      .get<MenuItem[]>('http://192.168.100.137:3000/api/cardapio')
      .then((response) => setMenuItems(response.data))
      .catch((error) => console.error('Erro ao buscar os itens:', error));
  
    axios
      .get('http://192.168.100.137:3000/api/adicionais-por-categoria')
      .then((response) => {
        setAdicionais(response.data); // Salvar no estado
      })
      .catch((error) => console.error('Erro ao buscar adicionais:', error));
  }, []);

  const categorias = [...new Set(menuItems.map((item) => item.Categoria))];

  const toggleSection = (categoria: string) => {
    setExpandedSections((prev) => ({ ...prev, [categoria]: !prev[categoria] }));
  };

  const formatPrice = (price: number | string) => {
    if (typeof price === 'number') {
      return price.toFixed(2).replace('.', ',');
    } else if (typeof price === 'string') {
      const parsedPrice = parseFloat(price.replace(/[^\d.,-]/g, '').replace(',', '.'));
      if (!isNaN(parsedPrice)) {
        return parsedPrice.toFixed(2).replace('.', ',');
      }
    }
    return '0,00'; // Valor padrão caso o preço seja inválido
  };

  const calculateTotalPrice = () => {
    if (!selectedItem || selectedItem.Preco === undefined) return 0;
  
    // Converte o preço base para número, garantindo que esteja definido
    const precoBase = typeof selectedItem.Preco === 'number'
      ? selectedItem.Preco
      : parseFloat(selectedItem.Preco?.toString().replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;
  
    if (isNaN(precoBase)) return 0;
  
    const adicionaisTotal = selectedAdicionais.reduce((sum, item) => {
      // Garantir que o preço do adicional seja válido
      const precoAdicional = typeof item.Preco === 'number'
        ? item.Preco
        : parseFloat(item.Preco?.toString().replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;
  
      return sum + precoAdicional;
    }, 0);
  
    return precoBase + adicionaisTotal;
  };
  
  const renderCategory = ({ item: categoria }: { item: string }) => (
    <View key={categoria}>
      <TouchableOpacity onPress={() => toggleSection(categoria)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{categoria}</Text>
        <Image
          style={styles.arrow}
          source={expandedSections[categoria] ? require('../../assets/flecha-lado.png') : require('../../assets/flecha.png')}
        />
      </TouchableOpacity>
      {expandedSections[categoria] && (
        <FlatList
          data={menuItems.filter((item) => item.Categoria === categoria)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={item.Imagem ? { uri: item.Imagem } : require('../../assets/download.jpg')}
                style={styles.image}
              />
              <View style={styles.cardContent}>
                <Text style={styles.itemName}>{item.Nome}</Text>
                <Text style={styles.itemDescription}>{item.Descricao}</Text>
                <Text style={styles.itemPrice}>R$ {formatPrice(item.Preco)}</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => openModal(item)}>
                  <Text style={styles.addButtonText}>Ver Detalhes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.ID.toString()}
        />
      )}
    </View>
  );

  const openModal = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalVisible(true);
    setSelectedAdicionais([]); // Limpa os adicionais selecionados ao abrir o modal
    setItemQuantity(1); // Reseta a quantidade ao abrir o modal
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
    setObservacoes('');
    setSelectedAdicionais([]); // Limpa os adicionais ao fechar o modal
  };

  const handleAdicionalToggle = (adicional: Adicional) => {
    setSelectedAdicionais((prev) =>
      prev.some((item) => item.ID === adicional.ID)
        ? prev.filter((item) => item.ID !== adicional.ID) // Remove o adicional se já estiver selecionado
        : [...prev, adicional] // Adiciona o adicional se não estiver selecionado
    );
  };
    
  

  const renderAdicionais = () => {
    if (!selectedItem) return null;
  
    // Encontrar a categoria de adicionais correspondente ao item selecionado
    const categoriaAdicionais = adicionais.find(
      (categoria) => categoria.nome === selectedItem.Categoria
    );
  
    // Verificar se há adicionais disponíveis para a categoria
    if (!categoriaAdicionais || categoriaAdicionais.adicionais.length === 0) {
      return <Text>Nenhum adicional disponível.</Text>;
    }
  
    // Renderizar os adicionais disponíveis
    return (
      <View style={styles.adicionaisContainer}>
        <Text style={styles.adicionaisTitle}>Adicionais:</Text>
        {categoriaAdicionais.adicionais.map((adicional) => {
          const preco = typeof adicional.preco === 'number' ? adicional.preco : parseFloat(adicional.preco);
  
          return (
            <View key={adicional.id} style={styles.checkboxContainer}>
              <CheckBox
                checked={selectedAdicionais.some((item) => item.ID === adicional.id)} // Verifica se o adicional está selecionado
                onPress={() => handleAdicionalToggle({
                  ID: adicional.id,
                  Nome: adicional.nome,
                  Preco: preco,
                })}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o" 
                size={20}
              />
              <Text style={{ fontSize: 15, fontWeight: 'bold'}}>{adicional.nome} - R$ {preco.toFixed(2).replace('.', ',')}</Text>
            </View>
          );
        })}
      </View>
    );
  };
  
  
  
  
  

  return (
    <View  style={styles.background} >
      <FlatList
        data={categorias}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.container}
      />

<Modal visible={isModalVisible} animationType="slide" transparent onRequestClose={closeModal}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
    <ScrollView contentContainerStyle={styles.modalScrollContainer}>
  {selectedItem && (
    <>
      <Image
        source={selectedItem.Imagem ? { uri: selectedItem.Imagem } : require('../../assets/download.jpg')}
        style={styles.modalImage}
      />
      <Text style={styles.modalTitle}>{selectedItem.Nome}</Text>
      <Text style={styles.modalDescription}>{selectedItem.Descricao}</Text>
      <Text style={styles.modalPrice}>
        R$ {selectedItem && formatPrice(selectedItem.Preco)}
      </Text>

      {/* Contador de quantidade */}
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setItemQuantity((prev) => Math.max(1, prev - 1))} // Não permite valores menores que 1
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{itemQuantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setItemQuantity((prev) => prev + 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {renderAdicionais()}
      <TextInput
        style={styles.textInput}
        placeholder="Observações"
        value={observacoes}
        onChangeText={setObservacoes}
      />
      <Text style={styles.totalPrice}>
        Total: R$ {(calculateTotalPrice() * itemQuantity).toFixed(2).replace('.', ',')}
      </Text>
      <TouchableOpacity style={styles.botaoModal} onPress={closeModal}>
        <Text style={{ color: '#ffffff', fontSize: 17, textAlign: 'center' }}>ADICIONAR AO CARRINHO</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botaoModal} onPress={closeModal}>
        <Text style={{ color: '#ffffff', fontSize: 17, textAlign: 'center' }}>Fechar</Text>
      </TouchableOpacity>
    </>
  )}
</ScrollView>

    </View>
  </View>
</Modal>

    </View>
  );
};



const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#000000',
    borderWidth: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrow: {
    width: 24,
    height: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderColor: '#000000',
    borderWidth: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#4C544FFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalScrollContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    borderColor: '#000000',
    borderWidth: 3
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 12,

  },
  adicionaisContainer: {
    marginBottom: 12,
  },
  adicionaisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  botaoModal: {
    backgroundColor: '#4C544FFF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    borderColor: '#000000',
    borderWidth: 3,
  },
  modalScrollContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 5,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  quantityButton: {
    backgroundColor: '#4C544FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginHorizontal: 10,
  },
  

});


