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
    try {
      const res = await fetch("http://localhost:5108/api/cadastro");
      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
      const data = await res.json(); // data é um array direto
      setResponse(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const handleSearchClick = () => {
    if (!tipoPesquisa) {
      alert("Selecione um tipo de busca!");
      return;
    }

    if (pesquisa.trim() === "") {
      alert(`Digite um ${tipoPesquisa.toLowerCase()} para pesquisar!`);
      return;
    }

    const pesquisaNormalizada = pesquisa.trim().toLowerCase();
    let resultados = [];
    
    switch (tipoPesquisa) {
      case "Setor":
        resultados = response.filter((item) =>
          item.Setor && item.Setor.toLowerCase() === pesquisaNormalizada
        );
        break;
      case "Usuario":
        resultados = response.filter((item) =>
          item.Usuario && item.Usuario.toLowerCase().includes(pesquisaNormalizada)
        );
        break;
      case "Tag":
        const resultado = response.find(
          (item) => item.Tag && item.Tag.toLowerCase() === pesquisaNormalizada
        );
        if (resultado) {
          setSelectedItem(resultado);
          setOpenInfo(true);
          return;
        }
        break;
      default:
        break;
    }

    setFilteredProducts(resultados);
    setSearchPerformed(true);
  };

  const handleClearSearch = () => {
    setPesquisa("");
    setFilteredProducts(response);
    setSearchPerformed(false);
  };

  return (
    <main className={S.pesquisa}>
      <div className={S.label}>
        <FormControl sx={{ marginRight: 4, minWidth: 180 }}>
          <InputLabel id="select-tipo-label">Buscar por</InputLabel>
          <Select
            labelId="select-tipo-label"
            value={tipoPesquisa}
            onChange={(e) => setTipoPesquisa(e.target.value)}
            label="Buscar por"
          >
            <MenuItem value=""><em>Selecione</em></MenuItem>
            <MenuItem value="Setor">Setor</MenuItem>
            <MenuItem value="Tag">Tag</MenuItem>
            <MenuItem value="Usuario">Usuário</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Pesquisar"
          variant="outlined"
          fullWidth
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          sx={{ width: "40em" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {pesquisa && (
                  <IconButton onClick={handleClearSearch}>
                    <CloseIcon />
                  </IconButton>
                )}
                <IconButton onClick={handleSearchClick}>
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
            onClick={() => setOpenCadastro(true)}
            sx={{
              height: "4em",
              background:
                "linear-gradient(to bottom, #eab71b, rgb(234, 137, 27))",
              color: "#fff",
              border: "solid 1px #fff",
            }}
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
            <Grid container spacing={2} justifyContent="space-around" alignItems="center">
              {filteredProducts.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={item._id || index}>
                  <Card
                    sx={{
                      width: 300,
                      height: 200,
                      backgroundColor: "#203e77",
                      color: "#ffffff",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">{`Usuário: ${item.Usuario}`}</Typography>
                      <Typography>{`Setor: ${item.Setor}`}</Typography>
                      <Typography>{`Tag: ${item.Tag}`}</Typography>
                      <Typography>{`Tipo: ${item.Tipo}`}</Typography>
                      <Typography>{`Data de Entrada: ${new Date(item.dataDeEntrada).toLocaleDateString()}`}</Typography>
                      <Typography>{`Ativo: ${item.Ativo ? "Sim" : "Não"}`}</Typography>
                      {item.dataDeSaida && (
                        <Typography>{`Data de Saída: ${new Date(item.dataDeSaida).toLocaleDateString()}`}</Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {searchPerformed && filteredProducts.length === 0 && (
          <Typography variant="body1" color="error">
            Nenhum resultado encontrado.
          </Typography>
        )}
      </div>

      <ModalCadastro
        open={openCadastro}
        onClose={() => setOpenCadastro(false)}
        fetchDados={fetchDados}
      />
      <ModalInformacoes
        open={openInfo}
        onClose={() => setOpenInfo(false)}
        item={selectedItem}
      />
    </main>
  );
}

export default PesquisaComLupa;
