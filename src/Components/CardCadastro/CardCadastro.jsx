import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import CancelIcon from "@mui/icons-material/Cancel";

export default function BasicCard() {
  const [data, setData] = React.useState([]);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [inactivateModalOpen, setInactivateModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);

  // Modal style
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // Fetch data from API
  const fetchData = async () => {
    const url = `https://localhost:7001/api/cadastro`;
    try {
      const response = await fetch(url);
      const result = await response.json();

      if (Array.isArray(result.dados)) {
        setData(result.dados);
      } else {
        throw new Error("Formato de dados inválido");
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://localhost:7001/api/cadastro/${selectedItem.tag}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        console.log(`Item com Tag: ${selectedItem.tag} excluído com sucesso.`);
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

    const url = `https://localhost:7001/api/cadastro/${updatedItem.tag}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });
      if (!response.ok) throw new Error("Erro ao atualizar item");

      fetchData(); // Atualiza os dados após a edição
      setEditModalOpen(false); // Fecha o modal
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
    }
  };

  const inativarCadastro = async () => {
    if (!selectedItem || !selectedItem.tag) {
      console.error("Erro: Tag não fornecida para inativar.");
      setInactivateModalOpen(false); // Fecha o modal caso haja erro
      return;
    }

    const url = `https://localhost:7001/api/cadastro/inativa/${selectedItem.tag}`;
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
        `Cadastro com Tag: ${selectedItem.tag} inativado com sucesso.`
      );
      fetchData(); // Atualiza os dados após inativar
    } catch (error) {
      console.error("Erro ao inativar cadastro:", error);
    } finally {
      setInactivateModalOpen(false); // Fecha o modal
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} justifyContent="space-around">
        {data.length > 0 ? (
          data.map((item, index) => (
            <Grid item xs={9} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ minWidth: 180, backgroundColor: "#FFD1DC" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    gutterBottom
                    sx={{ color: "text.secondary", fontSize: 14 }}
                  >
                    {`Tag: ${item.tag}`}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {item.tag}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                    {`Setor: ${item.setor}`}
                  </Typography>
                  <Typography variant="body2">
                    {`Data de Entrada: ${item.dataDeEntrada}`}
                    <br />
                    {`Data de Saída: ${
                      item.dataDeSaida
                        ? new Date(item.dataDeSaida).toLocaleDateString()
                        : "N/A"
                    }`}
                    <br />
                    {`Tipo: ${item.tipo}`}
                    <br />
                    {`NFE: ${item.nfe}`}
                    <br />
                    {`Ativo: ${item.ativo ? "Sim" : "Não"}`}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-around" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenDeleteModal(item)}
                  >
                    <DeleteIcon />
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleEdit(item)}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenInactivateModal(item)}
                  >
                    <CancelIcon />
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6">Nenhum dado encontrado.</Typography>
        )}
      </Grid>

      {/* Modal for editing */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Editar Item
          </Typography>
          {selectedItem && (
            <>
              {["tag", "setor", "dataDeSaida", "tipo", "nfe"].map((field) => (
                <TextField
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  fullWidth
                  margin="normal"
                  type={field.includes("data") ? "date" : "text"} // Verifique se é campo de data
                  value={selectedItem[field] || ""} // Se não houver valor, usar string vazia
                  onChange={(e) => {
                    let value = e.target.value;
                    if (field === "dataDeSaida" && value === "") {
                      value = null; // Se a data for vazia, coloca null (se necessário no backend)
                    }
                    setSelectedItem({
                      ...selectedItem,
                      [field]: value,
                    });
                  }}
                  InputLabelProps={{
                    shrink: true, // Mantém o label acima do campo
                  }}
                />
              ))}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  handleSave();
                }}
                sx={{ mt: 2 }}
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
          <Typography variant="h6" component="h2" gutterBottom>
            Confirmar exclusão
          </Typography>
          <Typography>
            Deseja realmente excluir o item com Tag:{" "}
            <strong>{selectedItem?.tag}</strong>?
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Confirmar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal for inactivation confirmation */}
      <Modal
        open={inactivateModalOpen}
        onClose={() => setInactivateModalOpen(false)}
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Confirmar inativação
          </Typography>
          <Typography>
            Deseja realmente inativar o item com Tag:{" "}
            <strong>{selectedItem?.tag}</strong>?
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}>
            <Button
              variant="contained"
              color="error"
              onClick={inativarCadastro}
            >
              Confirmar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setInactivateModalOpen(false)}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
