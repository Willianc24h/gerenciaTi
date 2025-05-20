import { useLocation, useNavigate } from "react-router-dom";
import Style from "./Header.module.css";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  // Esconder o header na página de login
  if (currentPath === "/login") return null;

  // Definir os links de navegação com base na página atual
  const navMap = {
    "/computadores": ["tarefas"],
    "/tarefas": ["computadores"],
  };

  const links = navMap[currentPath] || [];

  const handleLogout = () => {
    // Limpar autenticação se necessário
    navigate("/");
  };

  return (
    <header className={Style.header}>
      <nav className={Style.nav}>
        {currentPath !== "/" && (
          <>
            {links.map((link) => (
              <button
                key={link}
                onClick={() => navigate(`/${link}`)}
                className={Style.navButton}
              >
                {link.charAt(0).toUpperCase() + link.slice(1)}
              </button>
            ))}
            <button onClick={handleLogout} className={Style.logoutButton}>
              Sair
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
