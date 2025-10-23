import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [allData, setAllData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5108/api/cadastro/");
      const data = await response.json();
      setAllData(data.dados);
      // Exibir apenas os que estão com ativo: true na tela inicial
      setSearchResults(data.dados.filter(item => item.ativo));
    } catch (err) {
      setError("Erro ao buscar dados iniciais");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const searchByFilters = (filters) => {
  const results = allData.filter(item => {
  const setorOK =
    !filters.setor ||
    (item.setor && item.setor.toLowerCase().includes(filters.setor.toLowerCase()));

  const tipoOK =
    !filters.tipo ||
    (item.tipo && item.tipo.toLowerCase().includes(filters.tipo.toLowerCase()));

  const tagOK =
    !filters.tag ||
    (item.tag && item.tag.toLowerCase().includes(filters.tag.toLowerCase()));

  const usuarioOK =
    !filters.usuario ||
    (item.usuario && item.usuario.toLowerCase().includes(filters.usuario.toLowerCase()));

   const ativoOK =
  filters.ativo === "" || // se vazio, não filtra
  (filters.ativo === "Ativo" && item.ativo) ||
  (filters.ativo === "Inativo" && !item.ativo);


  // Lógica de datas
  const dataItem = item.dataDeEntrada ? new Date(item.dataDeEntrada) : null;
  const dataInicio = filters.periodo?.[0]?.toDate?.() || null; // dayjs -> Date
  const dataFim = filters.periodo?.[1]?.toDate?.() || null;

  let dataOK = true;
  if (dataInicio && dataFim && dataItem) {
    dataOK = dataItem >= dataInicio && dataItem <= dataFim;
  } else if (dataInicio && dataItem) {
    dataOK = dataItem >= dataInicio;
  } else if (dataFim && dataItem) {
    dataOK = dataItem <= dataFim;
  }

  return setorOK && tipoOK && tagOK && usuarioOK && dataOK && ativoOK;
});

  setSearchResults(results);
};

  return (
    <SearchContext.Provider
      value={{
        searchResults,
        loading,
        error,
        searchByFilters,
        fetchData: fetchInitialData,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);