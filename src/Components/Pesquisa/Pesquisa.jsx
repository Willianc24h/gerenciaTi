import { useState, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CloseIcon from "@mui/icons-material/Close";
import ModalCadastro from "../ModalCadastro/ModalCadastro";
import ModalInformacoes from "../ModalInformacoes/ModalInformacoes";
import S from "./Pesquisa.module.css";

function PesquisaComLupa() {
  const [pesquisa, setPesquisa] = useState("");
  const [tipoPesquisa, setTipoPesquisa] = useState("");
  const [response, setResponse] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchDados = async () => {
    const url = `https://localhost:7001/api/cadastro`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
      const data = await res.json();
      setResponse(data.dados || []);
      setFilteredProducts(data.dados || []);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const handleSearchClick = () => {
    if (pesquisa.trim() === "") {
      alert(`Digite um ${tipoPesquisa.toLowerCase()} para pesquisar!`);
      return;
    }
    
    const pesquisaNormalizada = pesquisa.trim().toLowerCase();
    let resultados = [];

    if (tipoPesquisa === "Setor") {
      resultados = response.filter(item => item.setor?.trim().toLowerCase().includes(pesquisaNormalizada));
    } else if (tipoPesquisa === "Tag") {
      const resultado = response.find(item => item.tag?.trim().toLowerCase() === pesquisaNormalizada);
      if (resultado) {
        setSelectedItem(resultado);
        setOpenInfo(true);
        return;
      }
    } else if (tipoPesquisa === "Usuario") {
      resultados = response.filter(item => item.usuario?.trim().toLowerCase().includes(pesquisaNormalizada));
    }

    setFilteredProducts(resultados);
    setSearchPerformed(true);
    if (resultados.length === 0) alert(`Nenhum ${tipoPesquisa.toLowerCase()} encontrado!`);
  };

  const handleClearSearch = () => {
    setPesquisa("");
    setFilteredProducts(response);
    setSearchPerformed(false);
  };

  return (
    <main className={S.pesquisa}>
      <div className={S.label}>
        <FormControl sx={{ minWidth: 180, marginRight: 2 }}>
          <InputLabel>Filtro</InputLabel>
          <Select value={tipoPesquisa} onChange={(e) => setTipoPesquisa(e.target.value)}>
            <MenuItem value="Usuario">Usuário</MenuItem>
            <MenuItem value="Setor">Setor</MenuItem>
            <MenuItem value="Tag">Tag</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Pesquisar"
          variant="outlined"
          fullWidth
          required
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          sx={{ width: "40em" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {pesquisa && <IconButton onClick={handleClearSearch}><CloseIcon /></IconButton>}
                <IconButton onClick={handleSearchClick}><SearchIcon /></IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<CreateNewFolderIcon />}
            onClick={() => setOpenCadastro(true)}
            sx={{ height: "4em", background: 'linear-gradient(to bottom, #eab71b,rgb(234, 137, 27))', color: "#ffffff", border:"solid 1px #fff" }}
          >
            Adicionar Equipamento
          </Button>
        </Stack>
      </div>

      <div className={S.resultados}>
        {searchPerformed && filteredProducts.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Resultados encontrados:
            </Typography>
            <Grid container spacing={2}>
              {filteredProducts.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} lg={3} key={index}>
                  <Card sx={{ width: 300, height: 200, backgroundColor: "#203e77", color: "#ffffff" }}>
                    <CardContent>
                      <Typography variant="h6">{`Usuário: ${item.usuario}`}</Typography>
                      <Typography>{`Setor: ${item.setor}`}</Typography>
                      <Typography>{`Tag: ${item.tag}`}</Typography>
                      <Typography>{`Tipo: ${item.tipo}`}</Typography>
                      <Typography>{`Data de Entrada: ${item.dataDeEntrada}`}</Typography>
                      <Typography>{`Ativo: ${item.ativo ? "Sim" : "Não"}`}</Typography>
                      {item.dataDeSaida && <Typography>{`Data de Saída: ${item.dataDeSaida}`}</Typography>}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        {searchPerformed && filteredProducts.length === 0 && (
          <Typography variant="body1" color="error">Nenhum resultado encontrado.</Typography>
        )}
      </div>

      <ModalCadastro open={openCadastro} onClose={() => setOpenCadastro(false)} fetchDados={fetchDados} />
      <ModalInformacoes open={openInfo} onClose={() => setOpenInfo(false)} item={selectedItem} />
    </main>
  );
}

export default PesquisaComLupa;