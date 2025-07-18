import { createContext, useContext, useState, useEffect } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [allData, setAllData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Mover a função para fora do useEffect
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5108/api/cadastro");
      const data = await response.json();
      setAllData(data.dados);
      setSearchResults(data.dados);
    } catch (err) {
      setError("Erro ao buscar dados iniciais");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 👇 Agora o useEffect pode usar normalmente
  useEffect(() => {
    fetchInitialData();
  }, []);

  const searchByFilters = (filters) => {
    const results = allData.filter(item => {
      const setorOK = filters.setor === "" || item.setor.toLowerCase().includes(filters.setor.toLowerCase());
      const tagOK = filters.tag === "" || item.tag.toLowerCase().includes(filters.tag.toLowerCase());
      const usuarioOK = filters.usuario === "" || item.usuario.toLowerCase().includes(filters.usuario.toLowerCase());
      return setorOK && tagOK && usuarioOK;
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
        fetchData: fetchInitialData, // agora vai funcionar
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
