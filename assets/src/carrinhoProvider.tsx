import React, { createContext, useContext, useState } from 'react';

type Adicional = {
  id: number;
  nome: string;
  preco: number;
};

type ItemCarrinho = {
  itemId: number; // Identificador único do item no carrinho
  nome: string;
  precoBase: number;
  adicionais: Adicional[];
  observacoes: string;
  quantidade: number;
};

type CarrinhoContextType = {
  itens: ItemCarrinho[];
  adicionarAoCarrinho: (item: Omit<ItemCarrinho, 'itemId'>) => void;
  atualizarQuantidade: (itemId: number, quantidade: number) => void;
  removerDoCarrinho: (itemId: number) => void;
  limparCarrinho: () => void;
};

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export const CarrinhoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  const adicionarAoCarrinho = (item: Omit<ItemCarrinho, 'itemId'>) => {
    setItens((prevItens) => {
      const existente = prevItens.find(
        (i) =>
          i.nome === item.nome &&
          JSON.stringify(i.adicionais) === JSON.stringify(item.adicionais) &&
          i.observacoes === item.observacoes
      );

      if (existente) {
        // Se o item já está no carrinho, apenas incrementa a quantidade
        return prevItens.map((i) =>
          i.itemId === existente.itemId
            ? { ...i, quantidade: i.quantidade + item.quantidade }
            : i
        );
      }

      // Caso contrário, adiciona um novo item ao carrinho
      const novoItem: ItemCarrinho = {
        itemId: Math.random(), // ID único gerado dinamicamente
        ...item,
      };

      return [...prevItens, novoItem];
    });
  };

  const atualizarQuantidade = (itemId: number, quantidade: number) => {
    setItens((prevItens) =>
      prevItens.map((item) =>
        item.itemId === itemId ? { ...item, quantidade } : item
      )
    );
  };

  const removerDoCarrinho = (itemId: number) => {
    setItens((prevItens) => prevItens.filter((item) => item.itemId !== itemId));
  };

  const limparCarrinho = () => {
    setItens([]);
  };

  return (
    <CarrinhoContext.Provider
      value={{ itens, adicionarAoCarrinho, atualizarQuantidade, removerDoCarrinho, limparCarrinho }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
};
