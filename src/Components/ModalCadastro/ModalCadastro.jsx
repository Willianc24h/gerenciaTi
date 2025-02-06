import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  Stack,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import InputMask from "react-input-mask";

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
const usuarios = ["Operador", "Supervisor", "Backoffice", "Qualidade", "Outro"];

const convertToAPIFormat = (dateString) => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};

function ModalCadastro({ open, onClose, fetchDados }) {
  const [formData, setFormData] = useState({
    Setor: "",
    Tag: "",
    dataDeEntrada: "",
    dataDeSaida: "",
    Tipo: "",
    Usuario: "",
    OutroUsuario: "",
    NFE: "",
    Ativo: false,
  });

  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      Ativo: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se o usuário escolheu a opção "Outro" e preenche o campo Usuario com o valor de OutroUsuario
    const usuarioFinal =
      formData.Usuario === "Outro" ? formData.OutroUsuario : formData.Usuario;

    const url = "https://localhost:7001/api/cadastro";

    const dataDeEntradaFormatada = convertToAPIFormat(formData.dataDeEntrada);
    const dataDeSaidaFormatada = convertToAPIFormat(formData.dataDeSaida);

    const formDataToSend = {
      ...formData,
      Usuario: usuarioFinal, // Atualiza o campo Usuario
      dataDeEntrada: dataDeEntradaFormatada,
      dataDeSaida: dataDeSaidaFormatada,
    };

    try {
      // Envia os dados para a API
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });

      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

      // Dados salvos com sucesso, agora buscamos os dados atualizados
      fetchDados();

      // Fecha o modal e limpa os campos
      setSuccessModalOpen(true);
      setFormData({
        Setor: "",
        Tag: "",
        dataDeEntrada: "",
        dataDeSaida: "",
        Tipo: "",
        Usuario: "",
        OutroUsuario: "",
        NFE: "",
        Ativo: false,
      });
      onClose();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "20em",
            p: 4,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" mb={2} sx={{ color: "#f8b005" }}>
            Novo Equipamento
          </Typography>
          <TextField
            name="Tag"
            label="Tag"
            value={formData.Tag}
            onChange={handleInputChange}
            required
            sx={{ marginBottom: "1em", width: "100%" }}
          />

          <Select
            name="Setor"
            value={formData.Setor}
            onChange={handleInputChange}
            displayEmpty
            fullWidth
            sx={{ marginBottom: "1em" }}
          >
            <MenuItem value="" disabled>
              Selecione um setor
            </MenuItem>
            {setores.map((setor) => (
              <MenuItem key={setor} value={setor}>
                {setor}
              </MenuItem>
            ))}
          </Select>

          <InputMask
            mask="99/99/9999"
            value={formData.dataDeEntrada}
            onChange={handleInputChange}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                name="dataDeEntrada"
                label="Data de Entrada"
                required
                sx={{ marginBottom: "1em", width: "100%" }}
              />
            )}
          </InputMask>

          <InputMask
            mask="99/99/9999"
            value={formData.dataDeSaida}
            onChange={handleInputChange}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                name="dataDeSaida"
                label="Data de Saída"
                sx={{ marginBottom: "1em", width: "100%" }}
              />
            )}
          </InputMask>

          <Select
            name="Usuario"
            value={formData.Usuario}
            onChange={handleInputChange}
            displayEmpty
            fullWidth
            sx={{ marginBottom: "1em" }}
          >
            <MenuItem value="" disabled>
              Selecione um usuário
            </MenuItem>
            {usuarios.map((usuario) => (
              <MenuItem key={usuario} value={usuario}>
                {usuario}
              </MenuItem>
            ))}
          </Select>

          {formData.Usuario === "Outro" && (
            <TextField
              name="OutroUsuario"
              label="Especifique"
              value={formData.OutroUsuario}
              onChange={handleInputChange}
              sx={{ marginBottom: "1em", width: "100%" }}
            />
          )}

          <Select
            name="Tipo"
            value={formData.Tipo}
            onChange={handleInputChange}
            displayEmpty
            fullWidth
            sx={{ marginBottom: "1em" }}
          >
            <MenuItem value="" disabled>
              Selecione um tipo
            </MenuItem>
            {tipos.map((tipo) => (
              <MenuItem key={tipo} value={tipo}>
                {tipo}
              </MenuItem>
            ))}
          </Select>

          <TextField
            name="NFE"
            label="NFE"
            value={formData.NFE}
            onChange={handleInputChange}
            required
            sx={{ marginBottom: "1em", width: "100%" }}
          />

          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  color: "#192959",
                  "&.Mui-checked": {
                    color: "#192959",
                  },
                }}
                checked={formData.Ativo}
                onChange={handleCheckboxChange}
                name="Ativo"
              />
            }
            label="Ativo"
          />

          <Stack direction="row" spacing={2} justifyContent="space-around">
            <Button
              type="submit"
              variant="contained"
              sx={{ background: 'linear-gradient(to bottom,rgb(248, 179, 88),rgb(252, 203, 69))' }}
              onClick={handleSubmit}
            >
              Salvar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

export default ModalCadastro;
