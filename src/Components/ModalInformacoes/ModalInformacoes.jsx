import { Box, Typography, Button, Modal } from "@mui/material";

function ModalInformacoes({ open, onClose, item }) {
  const style = {
    position: "absolute",
    textAlign: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "20em",
    fontFamily: " monospace",
    bgcolor: "background.paper",
    border: "2px solid #190019",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {item ? (
          <>
            <Typography variant="h6">Informações da Tag</Typography>
            <Typography variant="h6">{`Usuário: ${item.Usuario}`}</Typography>
                      <Typography>{`Setor: ${item.Setor}`}</Typography>
                      <Typography>{`Tag: ${item.Tag}`}</Typography>
                      <Typography>{`Tipo: ${item.Tipo}`}</Typography>
                      <Typography>{`Data de Entrada: ${new Date(item.dataDeEntrada).toLocaleDateString()}`}</Typography>
                      {item.dataDeSaida && (
                        <Typography>{`Data de Saída: ${new Date(item.dataDeSaida).toLocaleDateString()}`}</Typography>
                      )}
                      <Typography>{`Ativo: ${item.Ativo ? "Sim" : "Não"}`}</Typography>
            <Button onClick={onClose}
            sx={{
                height: "3em",
                backgroundColor: "#eab71b",
                color: "#ffffff",
                marginTop:"1em",
                "&:hover": { backgroundColor: "#f6e297" },
              }}
            >Fechar</Button>
          </>
        ) : (
          <Typography>Carregando...</Typography>
        )}
      </Box>
    </Modal>
  );
}

export default ModalInformacoes;
