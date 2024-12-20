import React, { createContext, useState, useContext, ReactNode } from 'react';

interface CarrinhoItem {
  id: number;
  nome: string;
  quantidade: number;
  adicionais: any[]; // Você pode detalhar melhor conforme os dados
  total: number;
}

interface CarrinhoContextType {
  carrinho: CarrinhoItem[];
  adicionarAoCarrinho: (item: CarrinhoItem) => void;
  removerDoCarrinho: (id: number) => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

interface CarrinhoProviderProps {
  children: ReactNode;
}

export const CarrinhoProvider: React.FC<CarrinhoProviderProps> = ({ children }) => {
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);

  const adicionarAoCarrinho = (item: CarrinhoItem) => {
    setCarrinho((prev) => [...prev, item]);
  };

  const removerDoCarrinho = (id: number) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CarrinhoContext.Provider value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho }}>
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
