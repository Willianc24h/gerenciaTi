import React, { useState } from "react";
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

export default function BasicCard() {
  const [data, setData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [inactivateModalOpen, setInactivateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(10);

  const setores = [
    "Brava",
    "Citta",
    "Comercial",
    "CRF",
    "DaVita",
    "Dinamicar",
    "Droom",
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

  // Fetch data from API
  const fetchData = async () => {
    const url = `http://192.168.45.83:8080/api/computador`;
    let response;

    try {
      response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (Array.isArray(result.dados)) {
        const mappedData = result.dados.map((item) => ({
          Tag: item.tag,
          setor: item.setor,
          dataDeEntrada: item.dataDeEntrada,
          dataDeSaida: item.dataDeSaida,
          usuario: item.usuario,
          tipo: item.tipo,
          nfe: item.nfe,
          ativo: item.ativo,
        }));

        setData(mappedData);
        countActiveAndInactive(mappedData);
      } else {
        throw new Error("Formato de dados inválido");
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error.message);

      if (response) {
        try {
          const text = await response.text();
          console.log("Texto da resposta bruta:", text);
        } catch {
          console.log("Não foi possível ler o conteúdo da resposta.");
        }
      } else {
        console.log(
          "A resposta não foi recebida. Verifique se a API está online."
        );
      }
    }
  };

  // Count active and inactive machines
  const countActiveAndInactive = (data) => {
    const active = data.filter((item) => item.ativo).length;
    const inactive = data.filter((item) => !item.ativo).length;
    setActiveCount(active);
    setInactiveCount(inactive);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5108/api/cadastro/${selectedItem.Tag}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        console.log(`Item com Tag: ${selectedItem.Tag} excluído com sucesso.`);
        fetchData(); // Atualiza os dados após exclusão
      } else {
        throw new Error("Erro ao excluir item");
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      setDeleteModalOpen(false); // Fecha o modal após a tentativa de exclusão
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
    console.log(item);
  };

  const handleOpenDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleOpenInactivateModal = (item) => {
    setSelectedItem(item);
    setInactivateModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedItem) return;

    const updatedItem = { ...selectedItem };

    const url = `http://localhost:5108/api/cadastro/${updatedItem.Tag}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) throw new Error("Erro ao atualizar item");

      setData((prevData) =>
        prevData.map((item) =>
          item.Tag === updatedItem.Tag ? updatedItem : item
        )
      );

      setRefresh((prev) => !prev); // Altera o estado para forçar re-renderização
      setEditModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
    }
  };

  const handleLoadMore = () => {
    setItemsToShow((prev) => prev + 10); // Incrementa 8 itens a cada clique
  };

  const inativarCadastro = async () => {
    if (!selectedItem || !selectedItem.Tag) {
      console.error("Erro: Tag não fornecida para inativar.");
      setInactivateModalOpen(false); // Fecha o modal caso haja erro
      return;
    }

    const url = `http://localhost:5108/api/cadastro/inativa/${selectedItem.Tag}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Ativo: false }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao inativar cadastro: ${response.status}`);
      }

      console.log(
        `Cadastro com Tag: ${selectedItem.Tag} inativado com sucesso.`
      );
      fetchData(); // Atualiza os dados após inativar
    } catch (error) {
      console.error("Erro ao inativar cadastro:", error);
    } finally {
      setInactivateModalOpen(false); // Fecha o modal
    }
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
            margin: "1em",
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
            margin: "1em",
          }}
        />
      </Stack>
      <br />
      <br />
      <br />
      <Grid2 container spacing={2} justifyContent="space-between">
        {data.length > 0 ? (
          data.slice(0, itemsToShow).map((item, index) => (
            <Grid2 item xs={12} sm={9} md={6} lg={3} key={index}>
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
                    }}
                    component="div"
                  >
                    {item.Tag}
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
          <Typography variant="h6">Nenhum dado encontrado.</Typography>
        )}
      </Grid2>
      <br />
      <br />
      {itemsToShow < data.length && (
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
                label="Tag"
                fullWidth
                margin="normal"
                value={selectedItem.Tag || ""}
                onChange={(e) => {
                  setSelectedItem({
                    ...selectedItem,
                    Tag: e.target.value,
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
              <TextField
                label="Data de Saída"
                fullWidth
                margin="normal"
                type="date"
                value={selectedItem.dataDeSaida || ""}
                onChange={(e) => {
                  setSelectedItem({
                    ...selectedItem,
                    dataDeSaida: e.target.value,
                  });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={selectedItem.tipo || ""}
                  label="Tipo"
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
                onClick={() => {
                  handleSave();
                }}
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
            Confirmar exclusão
          </Typography>
          <Typography sx={{ fontFamily: "Roboto" }}>
            Deseja realmente excluir o item com Tag:{" "}
            <strong>{selectedItem?.Tag}</strong>?
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}>
            <Button
              variant="contained"
              onClick={handleDelete}
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
