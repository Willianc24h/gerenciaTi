import axios from "axios";

export const api = axios.create({
    baseURL:"http://localhost:5000/api/cadastro/"
})

// api.js

export const fetchDados = async () => {
    const url = `http://localhost:5000/api/lista-cadastros/`;
  
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data.dados)) {
        return data.dados; // Retorna os dados se forem válidos
      } else {
        throw new Error("Dados não encontrados ou formato incorreto.");
      }
    } catch (err) {
      throw new Error(err.message); // Lança o erro para ser tratado no componente
    }
  };
  
  export const cadastrarDados = async (formData) => {
    const url = `http://localhost:5000/api/cadastro/`;
  
    const preparedData = {
      ...formData,
      DataDeSaida: formData.DataDeSaida || null,
    };
  
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preparedData),
      });
  
      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }
  
      return await res.json(); // Retorna a resposta após o cadastro
    } catch (err) {
      throw new Error(err.message); // Lança o erro para ser tratado no componente
    }
  };
  

export const getCadastroPorTag = async (Tag) => {
    const response = await api.get(`/${Tag}`)
    return response.data;
}

export const deleteCadastro = async (Tag)=>{
    const response = await api.delete(`/${Tag}`)
    return response.data;
}


export const updateCadastro = async (Tag, dados) => {
    const response = await api.put(`/${Tag}`, dados)
    return response.data;
}
