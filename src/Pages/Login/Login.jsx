import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import S from "./Login.module.css";
import img from "../../assets/Login-amico.svg";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    try {
      const response = await axios.post("https://localhost:7194/api/Login", {
        email,
        password,
      });

      // Armazena o token no localStorage
      localStorage.setItem("token", response.data.token);
      window.location.href = "/gerenciamento"; // Redireciona para a página de gerenciamento
    } catch (err) {
      setError("Credenciais inválidas");
      console.error(err);
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className={S.tudo}>
      <h2 className={S.login}>Login</h2>
      <form onSubmit={handleSubmit} className={S.flexContainer}>
        <img src={img} alt="Login illustration" className={S.img} />
        <div className={S.input}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <TextField
            id="outlined-basic"
            label="E-mail"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              "& .MuiInputLabel-root": { color: "#190019" },
              "& .MuiInputLabel-root.Mui-focused": { color: "purple" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#190019" },
                "&.Mui-focused fieldset": { borderColor: "purple" },
              },
              margin: "1em",
              width: "100%",
            }}
          />
          <FormControl
            sx={{
              "& .MuiInputLabel-root": { color: "#190019" },
              "& .MuiInputLabel-root.Mui-focused": { color: "purple" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#190019" },
                "&.Mui-focused fieldset": { borderColor: "purple" },
              },
              margin: "1em",
              width: "100%",
            }}
          >
            <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "purple",
              color: "white",
              "&:hover": { backgroundColor: "darkviolet" },
            }}
          >
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Login;
