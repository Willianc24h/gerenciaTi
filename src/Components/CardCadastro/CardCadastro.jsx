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

export default function BasicCard() {
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
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
    const url = `http://localhost:5000/api/cadastro/`;
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

  // Handle delete
  const handleDelete = async (id) => {
    const url = `http://localhost:5000/api/cadastro/${id}`;
    try {
      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao deletar item");
      alert("Item deletado com sucesso!");
      fetchData(); // Recarrega os dados após exclusão
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  // Handle edit (open modal)
  const handleEdit = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  // Save updated data
  const handleSave = async () => {
    if (!selectedItem) return;

    const url = `http://localhost:5000/api/cadastro/${selectedItem.Tag}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedItem),
      });
      if (!response.ok) throw new Error("Erro ao atualizar item");
      alert("Item atualizado com sucesso!");
      fetchData(); // Atualiza os dados após a edição
      setOpen(false); // Fecha o modal
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} justifyContent="space-around">
        {data.length > 0 ? (
          data.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ minWidth: 180, backgroundColor: '#FFD1DC' }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
                    {`Tag: ${item.tag}`}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {item.tag}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                    {`Setor: ${item.setor}`}
                  </Typography>
                  <Typography variant="body2">
                    {`Data de Entrada: ${new Date(item.dataDeEntrada).toLocaleDateString()}`}
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
                    onClick={() => handleDelete(item.id)}
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
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6">Nenhum dado encontrado.</Typography>
        )}
      </Grid>

      {/* Modal for editing */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Editar Item
          </Typography>
          {selectedItem && (
            <>
              {["tag", "setor", "Data de Saída", "tipo", "nfe"].map((field) => (
                <TextField
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  fullWidth
                  margin="normal"
                  value={selectedItem[field]}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, [field]: e.target.value })
                  }
                />
              ))}
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSave}
                sx={{ mt: 2 }}
              >
                Salvar
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
