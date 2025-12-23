import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Grid2,
  Modal,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import ModalCadastro from "../ModalCadastro/ModalCadastro";
import InputMask from "react-input-mask";
import ModalInformacoes from "../ModalInformacoes/ModalInformacoes"; // Importando o modal de informações
import { useSearch } from "../../services/SearchContext"; // Importando o contexto

export default function BasicCard() {
  const { searchResults, loading, error, fetchData } = useSearch(); // Usando o contexto
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false); // Estado para o modal de informações
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(12);
  const [openCadastro, setOpenCadastro] = useState(false);

  const setores = [
    "Brava",
    "Comercial",
    "CRF",
    "DaVita",
    "Financeiro",
    "Operacoes",
    "Planejamento",
    "Qualidade",
    "RH",
    "TI",
  ];

  const tipos = ["Desktop", "Monitor", "Notebook"];

  // Modal style
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
    fontFamily: "Helvetica",
    fontSize: "1rem",
  };

  // Contar máquinas ativas e inativas
  const countActiveAndInactive = (data) => {
    const active = data.filter((item) => item.ativo).length;
    const inactive = data.filter((item) => !item.ativo).length;
    setActiveCount(active);
    setInactiveCount(inactive);
  };

  useEffect(() => {
    if (searchResults.length > 0) {
      countActiveAndInactive(searchResults);
    }
  }, [searchResults]);

  const handleInative = async () => {
    if (!selectedItem.dataDeSaida) {
      alert(
        "É necessário preencher o campo Data de Saída para inativar o equipamento."
      );
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.5.32:5108/api/cadastro/inativa/${selectedItem.tag}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        console.log(`Item com tag: ${selectedItem.tag} inativado com sucesso.`);
        fetchData(); // Atualiza os dados após inativação
      } else {
        throw new Error("Erro ao inativar item");
      }
    } catch (error) {
      console.error("Erro ao inativar:", error);
    } finally {
      setDeleteModalOpen(false); // Fecha o modal após a tentativa
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleOpenDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleOpenInfoModal = (item) => {
    setSelectedItem(item);
    setInfoModalOpen(true); // Abre o modal de informações
  };

  const handleSave = async () => {
    if (!selectedItem) return;

    const updatedItem = { ...selectedItem };

    const url = `http://192.168.5.32:5108/api/cadastro/${updatedItem.tag}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) throw new Error("Erro ao atualizar item");

      fetchData(); // Atualiza os dados após edição
      setEditModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
    }
  };

  const handleLoadMore = () => {
    setItemsToShow((prev) => prev + 12);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "90%",
        margin: "0 auto",
        padding: "2em",
        border: "1px solid #D3D3D3",
        borderRadius: "10px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <ModalCadastro
        open={openCadastro}
        onClose={() => setOpenCadastro(false)}
        fetchDados={fetchData}
      />

      <ModalInformacoes
        open={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        item={selectedItem}
      />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Stack direction="row" spacing={1}>
          <Chip
            label={`${activeCount} Ativos`}
            variant="outlined"
            sx={{
              backgroundColor: "#63d663",
              fontFamily: "Roboto",
              fontSize: "1rem",
              fontWeight: "bold",
              color: "#fff",
              width: "7em",
              height: "2.25em",
            }}
          />
          <Chip
            label={`${inactiveCount} Inativos`}
            variant="outlined"
            sx={{
              backgroundColor: "#eb6a59",
              fontFamily: "Roboto",
              fontSize: "1rem",
              fontWeight: "bold",
              color: "#fff",
              width: "7em",
              height: "2.25em",
            }}
          />
        </Stack>

        <Button
          variant="outlined"
          startIcon={<CreateNewFolderIcon />}
          onClick={() => setOpenCadastro(true)}
          sx={{
            background:
              "linear-gradient(to bottom, #eab71b, rgb(234, 137, 27))",
            color: "#fff",
            border: "solid 1px #fff",
            margin: "1em 0",
            height: "2.25em",
          }}
        >
          Adicionar Equipamento
        </Button>
      </Box>

      <br />
      <br />
      <br />
      <Grid2 container spacing={2} justifyContent="space-between">
        {searchResults.length > 0 ? (
          searchResults.slice(0, itemsToShow).map((item, index) => (
            <Grid2 xs={12} sm={9} md={6} lg={3} key={index}>
              <Card sx={{ Width: 400 }}>
                <CardContent
                  sx={{
                    textAlign: "left",
                    padding: "1em",
                    width: "12em",
                    borderBottom: "1px solid #D3D3D3",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      fontFamily: "roboto",
                      color: "#6b6868",
                      margin: 0,
                      cursor: "pointer", // Adicionando o cursor pointer
                    }}
                    component="div"
                    onClick={() => handleOpenInfoModal(item)} // Adicionando o clique na tag
                  >
                    {item.tag}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#787878",
                      mb: 1.5,
                      margin: 0,
                      fontFamily: "roboto",
                    }}
                  >
                    {item.setor}
                  </Typography>
                  <Typography
                    variant="h7"
                    sx={{
                      fontFamily: "roboto",
                      color: "#A9A9A9",
                      mb: 1.5,
                      margin: 0,
                    }}
                  >
                    {item.tipo}
                    <br />
                    {item.usuario}
                  </Typography>
                </CardContent>
                <div>
                  <CardActions sx={{ justifyContent: "space-around" }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#203e77",
                      }}
                      onClick={() => handleOpenDeleteModal(item)}
                    >
                      <DeleteIcon />
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#616161 ",
                      }}
                      onClick={() => handleEdit(item)}
                    >
                      <EditIcon />
                    </Button>
                  </CardActions>
                </div>
              </Card>
            </Grid2>
          ))
        ) : (
          <Typography variant="h5">Nenhum dado encontrado.</Typography>
        )}
      </Grid2>
      <br />
      <br />
      {itemsToShow < searchResults.length && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              color: "#fff",
              backgroundColor: "#eab71b",
              mt: 3,
            }}
            onClick={handleLoadMore}
          >
            Carregar Mais
          </Button>
        </Box>
      )}

      {/* Modal for editing */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box sx={style}>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{
              fontFamily: "Roboto",
              color: "#203e77",
            }}
          >
            EDITAR
          </Typography>
          {selectedItem && (
            <>
              <TextField
                label="tag"
                fullWidth
                margin="normal"
                value={selectedItem.tag || ""}
                onChange={(e) => {
                  setSelectedItem({
                    ...selectedItem,
                    tag: e.target.value,
                  });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Setor</InputLabel>
                <Select
                  value={selectedItem.setor || ""}
                  label="Setor"
                  onChange={(e) => {
                    setSelectedItem({
                      ...selectedItem,
                      setor: e.target.value,
                    });
                  }}
                >
                  {setores.map((setor) => (
                    <MenuItem key={setor} value={setor}>
                      {setor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <InputMask
                mask="99/99/9999"
                value={selectedItem.dataDeSaidaOriginal || ""}
                onChange={(e) => {
                  const valor = e.target.value;
                  const [dia, mes, ano] = valor.split("/");

                  let dataISO = "";
                  if (
                    dia &&
                    mes &&
                    ano &&
                    dia.length === 2 &&
                    mes.length === 2 &&
                    ano.length === 4
                  ) {
                    dataISO = `${ano}-${mes}-${dia}`;
                  }

                  setSelectedItem({
                    ...selectedItem,
                    dataDeSaidaOriginal: valor, // dd/mm/yyyy (para visualização)
                    dataDeSaida: dataISO, // yyyy-mm-dd (para envio)
                  });
                }}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    label="Data de Saída"
                    fullWidth
                    margin="normal"
                    placeholder="dd/mm/aaaa"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              </InputMask>

              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={selectedItem.tipo || ""}
                  label="Tipo"
                  disabled
                  onChange={(e) => {
                    setSelectedItem({
                      ...selectedItem,
                      tipo: e.target.value,
                    });
                  }}
                >
                  {tipos.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="NFE"
                fullWidth
                margin="normal"
                value={selectedItem.nfe || ""}
                onChange={(e) => {
                  setSelectedItem({
                    ...selectedItem,
                    nfe: e.target.value,
                  });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Usuário"
                  value={selectedItem.usuario || ""}
                  onChange={(e) => {
                    setSelectedItem({
                      ...selectedItem,
                      usuario: e.target.value,
                    });
                  }}
                  fullWidth
                />
              </FormControl>

              <Button
                variant="contained"
                color="secondary"
                onClick={handleSave}
                sx={{
                  mt: 2,
                  fontFamily: "Roboto",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  height: "3em",
                  width: "10em",
                  background:
                    "linear-gradient(to bottom,rgb(10, 24, 151),rgb(9, 23, 61))",
                  cursor: "pointer",
                  borderRadius: "4px",
                  boxShadow: "0 3px 5px 2px #212c3c)",
                  transition: "background-color 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#6184a4",
                  },
                  "&:disabled": {
                    backgroundColor: "#6184a4",
                  },
                }}
              >
                Salvar
              </Button>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal for delete confirmation */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box sx={style}>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ fontFamily: "Roboto" }}
          >
            Confirmar Inativação
          </Typography>
          <Typography sx={{ fontFamily: "Roboto" }}>
            Deseja realmente inativar o item com tag:{" "}
            <strong>{selectedItem?.tag}</strong>?
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}>
            <Button
              variant="contained"
              onClick={handleInative}
              sx={{ backgroundColor: "#203e77" }}
            >
              Confirmar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
