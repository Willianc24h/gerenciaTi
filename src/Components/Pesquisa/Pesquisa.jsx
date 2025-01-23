import { useState, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Button,
  Box,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import EditIcon from "@mui/icons-material/Edit";
import ModalCadastro from "../ModalCadastro/ModalCadastro";
import ModalInformacoes from "../ModalInformacoes/ModalInformacoes";
import S from "./Pesquisa.module.css";

function PesquisaComLupa() {
  const [pesquisa, setPesquisa] = useState(""); // Campo único de pesquisa
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
      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }
      const data = await res.json();
      if (data.dados && Array.isArray(data.dados)) {
        setResponse(data.dados);
        setFilteredProducts(data.dados);
      } else {
        setResponse([]);
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const handleSearchClick = () => {
    if (pesquisa.trim() === "") {
      alert("Digite uma tag ou setor para pesquisar!");
      return;
    }

    const resultados = response.filter((item) => {
      const tag = item.tag ? item.tag.trim().toLowerCase() : "";
      const setor = item.Setor ? item.Setor.trim().toLowerCase() : "";
      const pesquisaNormalizada = pesquisa.trim().toLowerCase();

      const tagMatch = tag.includes(pesquisaNormalizada);
      const setorMatch = setor.includes(pesquisaNormalizada);

      return tagMatch || setorMatch; // Considera qualquer correspondência com Tag ou Setor
    });

    setFilteredProducts(resultados);
    setSearchPerformed(true);

    if (resultados.length === 1) {
      setSelectedItem(resultados[0]);
      setOpenInfo(true);
    } else if (resultados.length > 1) {
      alert("Mais de uma correspondência encontrada! Refine sua busca.");
    } else {
      alert("Nenhuma correspondência encontrada!");
    }
  };

  return (
    <main className={S.pesquisa}>
      <div className={S.label}>
        {/* Campo único de pesquisa */}
        <TextField
          label="Pesquisar"
          variant="outlined"
          fullWidth
          required
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
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
              backgroundColor: "#522b5b",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#3f0047" },
            }}
          >
            Novo Cadastro
          </Button>
        </Stack>
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
      >
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => {
              // Substitua esta lógica para abrir outro modal ou iniciar a edição
              console.log("Editar item:", selectedItem);
            }}
          >
            Editar
          </Button>
        </Box>
      </ModalInformacoes>
    </main>
  );
}

export default PesquisaComLupa;
