import Style from './Header.module.css'
function Header() {
  return (
    <header className={Style.header}>
        <h1 className={Style.titulo}>Gerenciamento de Computadores</h1>
    </header>
  )
}

export default Header