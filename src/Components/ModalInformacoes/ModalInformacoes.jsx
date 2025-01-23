import { Box, Typography, Button, Modal } from "@mui/material";

function ModalInformacoes({ open, onClose, item }) {
  const style = {
    position: "absolute",
    textAlign: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "30em",
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
            <Typography><strong>Tag:</strong> {item.tag}</Typography>
            <Typography><strong>Setor:</strong> {item.setor}</Typography>
            <Typography><strong>Data de Entrada:</strong> {item.dataDeEntrada}</Typography>
            <Typography><strong>Data de Saída:</strong> {item.dataDeSaida}</Typography>
            <Typography><strong>Tipo:</strong> {item.tipo}</Typography>
            <Typography><strong>NFE:</strong> {item.nfe}</Typography>
            <Typography><strong>Ativo:</strong> {item.ativo ? "Sim" : "Não"}</Typography>
            <Button onClick={onClose}
            sx={{
                height: "3em",
                backgroundColor: "#522b5b",
                color: "#ffffff",
                marginTop:"1em",
                "&:hover": { backgroundColor: "#3f0047s" },
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
