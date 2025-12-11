import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';

const CadastroUsuario = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [openModal, setOpenModal] = useState(false); // Controle do modal

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setErroSenha('As senhas não coincidem');
      return;
    }

    setErroSenha('');

    const novoUsuario = {
      nomeCompleto: nome,
      email,
      senha,
    };

    try {
      const response = await axios.post('http://192.168.5.32:5108/api/auth/register', novoUsuario);
      console.log('Usuário cadastrado com sucesso:', response.data);

      // Limpa os campos
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');

      // Abre o modal de sucesso
      setOpenModal(true);
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      alert('Erro ao cadastrar. Verifique os dados.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: '#f9f9f9',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Cadastro de Usuário
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome Completo"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <TextField
            label="E-mail"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <TextField
            label="Confirmar Senha"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            error={!!erroSenha}
            helperText={erroSenha}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: '#eab71b' }}
          >
            Cadastrar
          </Button>
        </form>
      </Box>

      {/* Modal de sucesso */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Cadastro realizado!</DialogTitle>
        <DialogContent>
          <Typography>Seu usuário foi cadastrado com sucesso.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CadastroUsuario;