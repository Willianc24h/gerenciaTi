import {
    Box,
    Typography,
    TextField,
    Button,
    Modal,
    Stack,
    Checkbox,
    FormControlLabel,
  } from "@mui/material";
  import { useState } from "react";
  import InputMask from 'react-input-mask'; // Importando a biblioteca para mascarar a entrada
  
  // Função para converter de DD/MM/YYYY para YYYY-MM-DD
  const convertToAPIFormat = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };
  
  function ModalCadastro({ open, onClose, fetchDados }) {
    const [formData, setFormData] = useState({
      Setor: "",
      Tag: "",
      dataDeEntrada: "",
      dataDeSaida: "",
      Tipo: "",
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
  
      const url = `https://localhost:7001/api/cadastro`;
  
      // Antes de enviar, converta as datas para o formato correto
      const dataDeEntradaFormatada = convertToAPIFormat(formData.dataDeEntrada);
      const dataDeSaidaFormatada = convertToAPIFormat(formData.dataDeSaida);
  
      const formDataToSend = {
        ...formData,
        dataDeEntrada: dataDeEntradaFormatada,
        dataDeSaida: dataDeSaidaFormatada,
      };
  
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataToSend),
        });
  
        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
  
        setSuccessModalOpen(true); // Abre o modal de sucesso
        setFormData({
          Setor: "",
          Tag: "",
          dataDeEntrada: "",
          dataDeSaida: "",
          Tipo: "",
          NFE: "",
          Ativo: false,
        });
        fetchDados();
        onClose();
      } catch (err) {
        console.error(err.message);
      }
    };
  
    const handleSuccessModalClose = () => {
      setSuccessModalOpen(false);
      window.location.reload(); // Recarrega a página
    };
  
    return (
      <>
        <Modal open={open} onClose={onClose}>
          <Box
            component="form"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "20em",
              p: 4,
              bgcolor: "background.paper",
              border: "2px solid #190019",
              boxShadow: 24,
              borderRadius: "10px",
            }}
            onSubmit={handleSubmit}
          >
            <Typography variant="h6" mb={2}>
              Novo Cadastro
            </Typography>
            {[
              "Tag",
              "Setor",
              "Data De Entrada",
              "Data De Saida",
              "NFE",
              "Tipo",
            ].map((field) => (
              <div key={field}>
                {field.includes("Data") ? (
                  <InputMask
                    mask="99/99/9999" // Definindo a máscara para DD/MM/YYYY
                    value={formData[field.replace(/\s+/g, "")]}
                    onChange={handleInputChange}
                  >
                    {(inputProps) => (
                      <TextField
                        {...inputProps}
                        name={field.replace(/\s+/g, "")}
                        label={field}
                        required={field !== "Data De Saida"}
                        sx={{ marginBottom: "1em", width: "100%" }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  </InputMask>
                ) : (
                  <TextField
                    name={field.replace(/\s+/g, "")} // Remove os espaços do nome
                    label={field}
                    value={formData[field.replace(/\s+/g, "")]} // Remove os espaços aqui também
                    onChange={handleInputChange}
                    required={field !== "Data De Saida"}
                    type="text" // Mantém o tipo como texto para os outros campos
                    sx={{ marginBottom: "1em", width: "100%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              </div>
            ))}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.Ativo}
                  onChange={handleCheckboxChange}
                  name="Ativo"
                  color="primary"
                />
              }
              label="Ativo"
              sx={{ marginBottom: "1em" }}
            />
            <Stack direction="row" spacing={2} justifyContent="space-around">
              <Button onClick={onClose} variant="outlined" color="secondary">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="secondary">
                Salvar
              </Button>
            </Stack>
          </Box>
        </Modal>
  
        {/* Modal de Sucesso */}
        <Modal open={successModalOpen} onClose={handleSuccessModalClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "20em",
              p: 4,
              bgcolor: "background.paper",
              border: "2px solid #190019",
              boxShadow: 24,
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" mb={2}>
              Cadastro realizado com sucesso!
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSuccessModalClose}
            >
              OK
            </Button>
          </Box>
        </Modal>
      </>
    );
  }
  
  export default ModalCadastro;
  