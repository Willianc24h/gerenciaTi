import React from "react";
import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import InputMask from "react-input-mask";
import { useSearch } from "../../services/SearchContext";
import S from "./Pesquisa.module.css";

const setores = [
  "Brava",
  "Comercial",
  "CRF",
  "DaVita",
  "Droom",
  "Financeiro",
  "Operações",
  "Newe Seguros",
  "Planejamento",
  "Qualidade",
  "RH",
  "TI",
];

const equipamentos = ["Desktop", "Notebook", "Monitor"];
function PesquisaComLupa() {
  const [periodo, setPeriodo] = useState([null, null]);
  const [erroCamposVazios, setErroCamposVazios] = useState(false);
  const [filtros, setFiltros] = useState({
    setor: "",
    usuario: "",
    tag: "",
    tipo: "",
    ativo: "Ativo",
    dataDeEntrada: "",
    dataDeSaida: "",
  });

  const status = ["Ativo", "Inativo"];

  const { searchByFilters } = useSearch();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchClick = () => {
    const todosVazios = Object.values(filtros).every(
      (valor) => valor.trim() === "" && !periodo[0] && !periodo[1]
    );

    if (todosVazios) {
      setErroCamposVazios(true);
      return;
    }

    setErroCamposVazios(false);
    searchByFilters({ ...filtros, periodo });
  };

  const handleClearSearch = () => {
    const filtrosVazios = {
    setor: "",
    usuario: "",
    tag: "",
    tipo: "",
    ativo: "Ativo",
    dataDeEntrada: "",
    dataDeSaida: "",
    };

    setFiltros(filtrosVazios);
    setPeriodo([null, null]);
    setErroCamposVazios(false);

    // Chama a MESMA função searchByFilters, não searchByFiltersAgain
    searchByFilters(filtrosVazios);
  };

  return (
    <main className={S.pesquisa}>
      <Box
        className={S.label}
        display="flex"
        gap={2}
        flexWrap="wrap"
        alignItems="center"
      >
        <Accordion>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            <Box display="flex" alignItems="center">
              <SearchIcon sx={{ marginRight: 1 }} />
              <Typography component="span">Filtros</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={2}
              >
                <InputMask
                  mask="999999"
                  value={filtros.tag}
                  onChange={handleInputChange}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      name="tag"
                      label="Tag"
                      sx={{ flex: 1, minWidth: "150px" }}
                      error={erroCamposVazios && filtros.tag.trim() === ""}
                      helperText={
                        erroCamposVazios && filtros.tag.trim() === ""
                          ? "Campo obrigatório"
                          : ""
                      }
                    />
                  )}
                </InputMask>

                <FormControl
                  sx={{ flex: 1, minWidth: "150px" }}
                  error={erroCamposVazios && filtros.setor === ""}
                >
                  <InputLabel id="label-setor">Setor</InputLabel>
                  <Select
                    labelId="label-setor"
                    name="setor"
                    value={filtros.setor}
                    onChange={handleInputChange}
                    label="Setor"
                  >
                    {setores.map((setor) => (
                      <MenuItem key={setor} value={setor}>
                        {setor}
                      </MenuItem>
                    ))}
                  </Select>
                  {erroCamposVazios && filtros.setor === "" && (
                    <Typography color="error">Campo obrigatório</Typography>
                  )}
                </FormControl>

                <FormControl
                  sx={{ flex: 1, minWidth: "150px" }}
                  error={erroCamposVazios && filtros.tipo === ""}
                >
                  <InputLabel id="label-tipo">Equipamento</InputLabel>
                  <Select
                    labelId="label-tipo"
                    name="tipo"
                    value={filtros.tipo || ""}
                    onChange={handleInputChange}
                    label="Equipamento"
                  >
                    {equipamentos.map((equipamento) => (
                      <MenuItem key={equipamento} value={equipamento}>
                        {equipamento}
                      </MenuItem>
                    ))}
                  </Select>
                  {erroCamposVazios && filtros.tipo === "" && (
                    <Typography color="error">Campo obrigatório</Typography>
                  )}
                </FormControl>

                <TextField
                  name="usuario"
                  label="Usuário"
                  value={filtros.usuario}
                  onChange={handleInputChange}
                  sx={{ flex: 1, minWidth: "150px" }}
                  error={erroCamposVazios && filtros.usuario.trim() === ""}
                  helperText={
                    erroCamposVazios && filtros.usuario.trim() === ""
                      ? "Campo obrigatório"
                      : ""
                  }
                />

                <FormControl
                  sx={{ flex: 1, minWidth: "150px" }}
                  error={erroCamposVazios && filtros.ativo === ""}
                >
                  <InputLabel id="label-ativo">Status</InputLabel>
                  <Select
                    labelId="label-ativo"
                    name="ativo"
                    value={filtros.ativo || ""}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    {status.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                  {erroCamposVazios && filtros.ativo === "" && (
                    <Typography color="error">Campo obrigatório</Typography>
                  )}
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <DatePicker
                      label="Data inicial"
                      value={periodo[0]}
                      format="DD/MM/YYYY"
                      onChange={(newValue) =>
                        setPeriodo([newValue, periodo[1]])
                      }
                    />
                    <DatePicker
                      label="Data final"
                      value={periodo[1]}
                      format="DD/MM/YYYY"
                      onChange={(newValue) =>
                        setPeriodo([periodo[0], newValue])
                      }
                    />
                  </Box>
                </LocalizationProvider>
              </Box>

              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearchClick}
                  sx={{
                    background:
                      "linear-gradient(to bottom, #eab71b, rgb(234, 137, 27))",
                    color: "#fff",
                    border: "solid 1px #fff",
                  }}
                >
                  Filtrar
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={handleClearSearch}
                  sx={{
                    background:
                      "linear-gradient(to bottom, #eab71b, rgb(234, 137, 27))",
                    color: "#fff",
                    border: "solid 1px #fff",
                  }}
                >
                  Limpar
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </main>
  );
}

export default PesquisaComLupa;
