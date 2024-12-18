import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, FlatList, Image, StyleSheet, TouchableOpacity, ImageBackground, Modal, TextInput, Button } from 'react-native';
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

const adicionaisPorCategoria = {
  "Linha Prime": [{ nome: "Molho Extra", preco: 2 }, { nome: "Queijo", preco: 3 }, { nome: "Pimentas", preco: 1 }],
  "Linha Junior": [{ nome: "Bacon", preco: 3 }, { nome: "Queijo", preco: 2 }, { nome: "Alface", preco: 1 }, { nome: "Tomate", preco: 1 }],
  "Bebidas": [],
};

export const CardapioTela: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [selectedAdicionais, setSelectedAdicionais] = useState<{ nome: string; preco: number }[]>([]);

  useEffect(() => {
    axios
      .get<MenuItem[]>('http://192.168.100.137:3000/api/cardapio')
      .then((response) => setMenuItems(response.data))
      .catch((error) => console.error('Erro ao buscar os itens:', error));
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
    if (!selectedItem) return 0;  // Retorna 0 se não houver item selecionado
    
    const adicionaisTotal = selectedAdicionais.reduce((sum, item) => sum + item.preco, 0);
  
    const precoBase = typeof selectedItem.Preco === 'number'
      ? selectedItem.Preco
      : parseFloat(selectedItem.Preco.toString().replace(/[^\d.,-]/g, '').replace(',', '.'));
  
    if (isNaN(precoBase)) return 0;  // Retorna 0 caso o preço base seja inválido
    
    return precoBase + adicionaisTotal;  // Retorna o total como número
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
    setSelectedAdicionais([]);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
    setObservacoes('');
    setSelectedAdicionais([]);
  };

  const handleAdicionalToggle = (adicional: { nome: string; preco: number }) => {
    setSelectedAdicionais((prev) =>
      prev.some((item) => item.nome === adicional.nome)
        ? prev.filter((item) => item.nome !== adicional.nome)
        : [...prev, adicional]
    );
  };

  return (
    <ImageBackground source={require('../../assets/TELA.png')} style={styles.background} resizeMode="cover">
      <FlatList
        data={categorias}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.container}
      />
<Modal visible={isModalVisible} animationType="slide" onRequestClose={closeModal}>
  <View style={styles.modalContainer}>
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
          <TextInput
            style={styles.textInput}
            placeholder="Observações"
            value={observacoes}
            onChangeText={setObservacoes}
          />
          {adicionaisPorCategoria[selectedItem.Categoria] && adicionaisPorCategoria[selectedItem.Categoria].length > 0 && (
            <View style={styles.adicionaisContainer}>
              <Text style={styles.adicionaisTitle}>Adicionais:</Text>
              {adicionaisPorCategoria[selectedItem.Categoria].map((adicional) => (
                <View key={adicional.nome} style={styles.checkboxContainer}>
                  <CheckBox
                    checked={selectedAdicionais.some((item) => item.nome === adicional.nome)}
                    onPress={() => handleAdicionalToggle(adicional)}
                  />
                  <Text>{adicional.nome} - R$ {adicional.preco.toFixed(2).replace('.', ',')}</Text>
                </View>
              ))}
            </View>
          )}
        <Text style={styles.totalPrice}>
          Total: R$ {calculateTotalPrice().toFixed(2).replace('.', ',')}
        </Text>

          <TouchableOpacity style={ styles.botaoModal} onPress={closeModal} >
            <Text style={{ color: '#ffffff', fontSize: 17, textAlign: 'center'}}> ADICIONAR AO CARRINHO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ styles.botaoModal} onPress={closeModal} >
            <Text style={{ color: '#ffffff', fontSize: 17, textAlign: 'center'}}> Fechar</Text>
          </TouchableOpacity>

        </>
      )}
    </ScrollView>
  </View>
</Modal>

    </ImageBackground>
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
    marginBottom: 8,
    borderColor: '#000000',
    borderWidth: 2,
  },
  sectionTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrow: {
    width: 25,
    height: 20,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#FFFFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#3D3D3D',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalDescription: {
    fontSize: 16,
    marginVertical: 10,
  },
  modalPrice: {
    fontSize: 20,
    color: '#000',
    marginBottom: 10,
  },
  textInput: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  adicionaisContainer: {
    marginVertical: 15,
  },
  adicionaisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },


  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Alinha o conteúdo no topo
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  modalImage: {
    width: '100%',
    height: 250, // Define uma altura fixa para evitar que ultrapasse
    resizeMode: 'contain',
    marginBottom: 20,
  },
  modalScrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  

  botaoModal: {
    padding: 13,
    backgroundColor: '#3D3D3D',
    marginBottom: 20,
    textAlign: 'center',
    borderRadius: 10
  }

});

