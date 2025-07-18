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
import image from '../../assets/logoc24h.jpg'
import S from "./Login.module.css";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5108/api/login", {
        email,
        password,
      });
      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("Token salvo:", token);
        window.location.href = "/computadores";
      }
    } catch (err) {
      setError("E-mail e/ou senha incorreta");
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

  console.log("Enviando:", { email, senha: password });

  return (
    <div className={S.tudo}>
    <img src={image} alt="" className={S.image}/>
<form onSubmit={handleSubmit} className={S.flexContainer}>
        <div className={S.input}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <TextField
            id="outlined-basic"
            label="E-mail"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiInputLabel-root": { color: "#6184a4" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#647cb4" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#6184a4" },
                "&.Mui-focused fieldset": { borderColor: "#647cb4" },
              },
              margin: "1em",
              width: "100%",
            }}
          />
          <FormControl
            sx={{
              "& .MuiInputLabel-root": { color: "#6184a4" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#647cb4" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#6184a4" },
                "&.Mui-focused fieldset": { borderColor: "#647cb4" },
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
              label="Senh"
            />
          </FormControl>
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#f8b005",
              color: "white",
              "&:hover": { backgroundColor: "#f6e297" },
            }}
          >
            Entrar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Login;