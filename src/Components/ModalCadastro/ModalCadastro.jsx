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
import React, { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";

const setores = [
  "Brava",
  "Comercial",
  "CRF",
  "DaVita",
  "Droom",
  "Financeiro",
  "Operações",
  "Planejamento",
  "Qualidade",
  "RH",
  "TI",
];
const tipos = ["Desktop", "Monitor", "Notebook"];
const usuarios = ["Operador", "Supervisor", "Backoffice", "Qualidade", "Outro"];
const SistemaOperacional = ["Não se aplica","Windows 10", "Windows 11", "Linux", "MacOS"];

// Componente máscara de data
const DateMask = React.forwardRef((props, ref) => {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask={Date}
      pattern="d`/`m`/`Y"
      blocks={{
        d: { mask: IMask.MaskedRange, from: 1, to: 31 },
        m: { mask: IMask.MaskedRange, from: 1, to: 12 },
        Y: { mask: IMask.MaskedRange, from: 1900, to: 21000 },
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});
DateMask.displayName = "DateMask";

// Componente máscara para o campo Tag
const TagMask = React.forwardRef((props, ref) => {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="000000" // Máscara para 6 dígitos
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});
TagMask.displayName = "TagMask";

const convertToAPIFormat = (dateString) => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};

// Componente genérico TextField
function TextInput({ name, label, value, onChange, required, sx, InputProps }) {
  return (
    <TextField
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      required={required}
      sx={{ marginBottom: "1em", width: "100%", ...sx }}
      InputProps={InputProps}
    />
  );
}

// Componente genérico SelectField
function SelectField({
  name,
  label,
  value,
  onChange,
  options,
  sx,
  displayEmpty = true,
}) {
  return (
    <Select
      name={name}
      value={value}
      onChange={onChange}
      displayEmpty={displayEmpty}
      fullWidth
      sx={{ marginBottom: "1em", ...sx }}
    >
      <MenuItem value="" disabled>
        {label}
      </MenuItem>
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
}

// Componente CheckboxField
function CheckboxField({ checked, onChange, name, label }) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          sx={{
            color: "#192959",
            "&.Mui-checked": {
              color: "#192959",
            },
          }}
          checked={checked}
          onChange={onChange}
          name={name}
        />
      }
      label={label}
    />
  );
}

// Componente principal do Modal com o formulário
function ModalCadastro({ open, onClose, fetchDados }) {
  const [formData, setFormData] = useState({
    Setor: "",
    Tag: "",
    dataDeEntrada: "",
    dataDeSaida: "",
    Tipo: "",
    Usuario: "",
    outroUsuario: "",
    NFE: "",
    Ativo: true,
    SistemaOperacional: "",
    Geracao: "",
  });

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    const url = "http://localhost:5108/api/cadastro/";

    const dataDeEntradaFormatada = convertToAPIFormat(formData.dataDeEntrada);
    const dataDeSaidaFormatada = convertToAPIFormat(formData.dataDeSaida);

    const formDataToSend = {
      Tag: formData.Tag,
      Setor: formData.Setor,
      dataDeEntrada: dataDeEntradaFormatada,
      dataDeSaida: dataDeSaidaFormatada,
      Tipo: formData.Tipo,
      Usuario: formData.Usuario,
      outroUsuario:
        formData.Usuario === "Outro" ? formData.outroUsuario : undefined,
      NFE: formData.NFE,
      Ativo: formData.Ativo,
      SistemaOperacional: formData.SistemaOperacional,
      Geracao: formData.Geracao,
    };
      // Validação do campo Tag
  if (formData.Tag.trim() === "") {
    setTagTouched(true); // Mostra o erro se estiver vazio
    return; // Impede o envio do formulário
  }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao cadastrar");
      }

      setSuccessModalOpen(true);
      setFormData({
        Setor: "",
        Tag: "",
        dataDeEntrada: "",
        dataDeSaida: "",
        Tipo: "",
        Usuario: "",
        outroUsuario: "",
        NFE: "",
        Ativo: true,
        SistemaOperacional: "",
        Geracao: "",
      });

      // Não chamamos fetchDados aqui, pois vamos recarregar a página após o modal
      // fetchDados();
      // onClose();
    } catch (err) {
      console.error("Erro completo:", err);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalOpen(false);
    fetchDados(); // Atualiza os dados após fechar o modal
    onClose(); // Fecha o modal de cadastro
    window.location.reload(); // Recarrega a página
  };

  const [tagTouched, setTagTouched] = useState(false);
  // Verifica se o campo Tag está vazio para mostrar o erro
  const tagError = tagTouched && formData.Tag.trim() === "";

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
            boxShadow: 24,
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" mb={2} sx={{ color: "#f8b005" }}>
            Novo Equipamento
          </Typography>

          <TextInput
            name="Tag"
            label="Tag"
            value={formData.Tag}
            onChange={handleInputChange}
            onBlur={() => setTagTouched(true)} // Marca como "tocado" quando o campo perde o foco
            required
            InputProps={{ inputComponent: TagMask }}
            error={tagError} // Destaca o campo em vermelho se estiver vazio
            helperText={tagError ? "Campo obrigatório" : ""} // Mensagem de erro
          />
          <SelectField
            name="Setor"
            label="Selecione um setor/produto"
            value={formData.Setor}
            onChange={handleInputChange}
            options={setores}
          />

          <TextInput
            name="dataDeEntrada"
            label="Data de Entrada"
            value={formData.dataDeEntrada}
            onChange={handleInputChange}
            required
            InputProps={{ inputComponent: DateMask }}
          />

          <TextInput
            name="Usuario"
            label="Usuário"
            value={formData.Usuario}
            onChange={handleInputChange}
            options={usuarios}
          />

          <SelectField
            name="Tipo"
            label="Selecione um tipo"
            value={formData.Tipo}
            onChange={handleInputChange}
            options={tipos}
          />

          <SelectField
            name="SistemaOperacional"
            label="Selecione um Sistema Operacional"
            value={formData.SistemaOperacional}
            onChange={handleInputChange}
            options={SistemaOperacional}
          />
          <TextInput
            name="Geracao"
            label="Geração"
            value={formData.Geracao}
            onChange={handleInputChange}
            required
          />

          <TextInput
            name="NFE"
            label="NFE"
            value={formData.NFE}
            onChange={handleInputChange}
            required
          />

          <CheckboxField
            checked={formData.Ativo}
            onChange={handleCheckboxChange}
            name="Ativo"
            label="Ativo"
          />

          <Stack direction="row" spacing={2} justifyContent="space-around">
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                background:
                  "linear-gradient(to bottom,rgb(248, 179, 88),rgb(252, 203, 69))",
              }}
              onClick={handleSubmit} // Chama a função de submit
            >
              Salvar
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Modal de sucesso */}
      <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <Box
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
            textAlign: "center",
          }}
        >
          <Typography variant="h6" mb={2}>
            Cadastro concluído com sucesso!
          </Typography>
          <Button
            variant="contained"
            onClick={handleSuccessModalClose}
            sx={{
              background:
                "linear-gradient(to bottom,rgb(248, 179, 88),rgb(252, 203, 69))",
            }}
          >
            OK
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default ModalCadastro;
