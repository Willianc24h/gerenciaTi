import { useState, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Button,
  Box,
  Typography,
  Modal,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import S from "./Pesquisa.module.css";

function PesquisaComLupa() {
  const [pesquisa, setPesquisa] = useState("");
  const [formData, setFormData] = useState({
    Setor: "",
    Tag: "",
    DataDeEntrada: "",
    DataDeSaida: "",
    Tipo: "",
    NFE: "",
    Ativo: false,
  });
  const [response, setResponse] = useState([]); // Inicializando como array vazio
  const [filteredProducts, setFilteredProducts] = useState([]); // Produtos filtrados para exibição
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false); // Para controlar quando a pesquisa foi feita
  const [selectedItem, setSelectedItem] = useState(null); // Para armazenar o item encontrado

  // Função para buscar os dados atualizados
  const fetchDados = async () => {
    const url = `http://localhost:5000/api/cadastro/`;
  
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }
      const data = await res.json();
      console.log("Resposta da API:", data); // Logando a resposta da API
  
      // Verificando se a chave 'dados' existe e é um array
      if (data.dados && Array.isArray(data.dados)) {
        setResponse(data.dados); // Atualiza os dados obtidos da API
        setFilteredProducts(data.dados); // Define os dados iniciais para filtragem
      } else {
        console.error('A chave "dados" não contém um array ou não existe', data);
        setResponse([]); // Define como array vazio
        setFilteredProducts([]); // Limpa a lista de produtos filtrados
      }
    } catch (err) {
      setError(err.message);
      console.error("Erro ao buscar dados:", err);
    }
  };

  const handleSearchClick = () => {
    if (pesquisa.trim() === "") {
      alert("Digite uma tag para pesquisar!");
      return;
    }
  
    console.log("Buscando por:", pesquisa);
  
    const resultados = response.filter((item) => {
      // Certifique-se de que as strings estão sendo comparadas corretamente
      const tag = item.tag ? item.tag.trim().toLowerCase() : ""; // Converte a tag para minúsculas e remove espaços
      const pesquisaNormalizada = pesquisa.trim().toLowerCase(); // Remove espaços e converte a pesquisa
  
      return tag.includes(pesquisaNormalizada);
    });
  
    console.log("Resultados encontrados:", resultados);
  
    setFilteredProducts(resultados);
    setSearchPerformed(true);
  };
  

  // Atualiza os dados assim que o componente monta
  useEffect(() => {
    fetchDados(); // Chama fetchDados uma vez quando o componente monta
  }, []); // Passando um array vazio para garantir que a função só seja chamada uma vez

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const data = await res.json();
      alert("Cadastro realizado com sucesso!");

      fetchDados(); // Recarrega os dados após o envio
      handleClose();
      setFormData({
        Setor: "",
        Tag: "",
        DataDeEntrada: "",
        DataDeSaida: "",
        Tipo: "",
        NFE: "",
        Ativo: false,
      });
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "20em",
    height: "38em",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "1em",
    zIndex: 100,
    bgcolor: "background.paper",
    border: "2px solid #190019",
    boxShadow: 24,
    p: 4,
  };

  const clearSearchResults = () => {
    setPesquisa("");
    setFilteredProducts([]);
    setSearchPerformed(false);
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const handleEdit = (item) => {
  setFormData({
    Setor: item.setor,
    Tag: item.tag,
    DataDeEntrada: item.dataDeEntrada,
    DataDeSaida: item.dataDeSaida,
    Tipo: item.tipo,
    NFE: item.nfe,
    Ativo: item.ativo,
  });
  setSelectedItem(item.id); // Armazena o ID do item para edição
  setOpen(true); // Abre o modal
};

  return (
    <main className={S.pesquisa}>
      <div className={S.label}>
      <TextField
        label="Pesquisar Tag"
        variant="outlined"
        fullWidth
        value={pesquisa}
        onChange={(e) => {
          setPesquisa(e.target.value);
          console.log(e.target.value); // Monitorando o valor da pesquisa
        }}
        sx={{
          "& .MuiInputLabel-root": { color: "#190019" },
          "& .MuiInputLabel-root.Mui-focused": { color: "purple" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#190019" },
            "&.Mui-focused fieldset": { borderColor: "purple" },
          },
          width: "50em",
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearchClick} edge="end" style={{ cursor: "pointer" }}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          startIcon={<CreateNewFolderIcon />}
          sx={{
            height: "4em",
            backgroundColor: "#522b5b",
            color: "#ffffff",
            "&:hover": { backgroundColor: "#3f0047" },
          }}
          onClick={handleOpen}
        >
          Novo Cadastro
        </Button>
        <Button
            variant="outlined"
            onClick={clearSearchResults}
            sx={{
              height: "4em",
              backgroundColor: "#ff6f61",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#ff473a" },
            }}
          >
            Limpar Resultados
          </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            height: "100%",
            width: "100%",
            overflow: "auto",
            borderRadius: "4px",
          }}
        >
          <Box component="form" sx={style} onSubmit={handleSubmit}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Novo Cadastro
            </Typography>
            {["Tag", "Setor", "Data De Entrada", "Data De Saida", "NFE", "Tipo"].map((field) => (
              <TextField
                key={field}
                name={field}
                label={field}
                value={formData[field]}
                onChange={handleInputChange}
                required={field !== "DataDeSaida"}
                sx={{ marginBottom: "1em" }}
              />
            ))}
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.Ativo}
                    onChange={handleCheckboxChange}
                    name="Ativo"
                  />
                }
                label="Ativo"
              />
            </FormGroup>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                onClick={handleClose}
                sx={{
                  backgroundColor: "gray",
                  color: "white",
                  "&:hover": { backgroundColor: "darkgray" },
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                sx={{
                  backgroundColor: "purple",
                  color: "white",
                  "&:hover": { backgroundColor: "darkviolet" },
                }}
              >
                Salvar
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Stack>
      </div>
      

      <div>
          <Box sx={{ marginTop: "1em" }}>
  {searchPerformed && filteredProducts.length > 0 ? (
    filteredProducts.map((item, index) => (
      <Box
        key={index}
        sx={{
          padding: "1em",
          marginBottom: "1em",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          textAlign: "center"
        }}
        
      >
        <Typography variant="h6">Tag: {item.tag}</Typography>
        <Typography variant="body1">Setor: {item.setor}</Typography>
        <Typography variant="body1">
          Data de Entrada: {item.dataDeEntrada || "N/A"}
        </Typography>
        <Typography variant="body1">
          Data de Saída: {item.dataDeSaida || "N/A"}
        </Typography>
        <Typography variant="body1">Tipo: {item.tipo || "N/A"}</Typography>
        <Typography variant="body1">NFE: {item.nfe || "N/A"}</Typography>
        <Typography
          variant="body2"
          sx={{ color: item.ativo ? "green" : "red" }}
        >
          {item.ativo ? "Ativo" : "Inativo"}
        </Typography>
      </Box>
    ))
  ) : searchPerformed ? (
    <Typography variant="body1">Nenhuma tag encontrada.</Typography>
  ) : null}

</Box>
          </div>
      {/* Exibição de erros */}
      {error && <Typography variant="body1" color="error">{`Erro: ${error}`}</Typography>}
    </main>
  );
}

export default PesquisaComLupa;