import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Modal,
} from "@mui/material";

function Perifericos() {
  const [open, setOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);

  const produtos = [
    {
      item: "Headset",
      total: 200,
      operacao: {
        Brava: 42,
        Citta: 78,
        Comercial: 13,
        CRF: 95,
        DaVita: 61,
        Dinamicar: 24,
        Droom: 89,
        Endoview:12
      },
    },
    {
      item: "Protetor Auricular",
      total: 150,
      operacao: {
        Brava: 42,
        Citta: 78,
        Comercial: 13,
        CRF: 95,
        DaVita: 61,
        Dinamicar: 24,
        Droom: 89,
        Endoview:24
      },
    },
    {
      item: "Tubo de voz",
      total: 150,
      operacao: {
        Brava: 42,
        Citta: 78,
        Comercial: 13,
        CRF: 95,
        DaVita: 61,
        Dinamicar: 24,
        Droom: 89,
        Endoview:24
      },
    },
  ];

  const handleOpen = (produto) => {
    setSelectedProduto(produto);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduto(null);
  };

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-around"  gap={2} p={2}>
      {produtos.map((produto, index) => (
        <Card key={index} sx={{ minWidth: 300 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {produto.item}
            </Typography>
            <Typography color="text.secondary">Total: {produto.total}</Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => handleOpen(produto)}>
              Ver Mais
            </Button>
          </CardActions>
        </Card>
      ))}

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedProduto && (
            <>
              <Typography variant="h6" component="h2">
                {selectedProduto.item}
              </Typography>
              <Typography sx={{ mt: 2 }}>Total: {selectedProduto.total}</Typography>
              <Typography sx={{ mt: 2 }}>Distribuição por Operação:</Typography>
              {Object.entries(selectedProduto.operacao).map(([key, value]) => (
                <Typography key={key}>
                  {key}: {value}
                </Typography>
              ))}
              <Button sx={{ mt: 2 }} variant="contained" onClick={handleClose}>
                Fechar
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default Perifericos;
