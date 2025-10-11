import React from 'react'
import S from './Footer.module.css';

function Footer() {
  return (
    <footer>
      <footer className={S.footer}>
        <p className={S.texto}>Empresa Brasileira de Soluções e Serviços em Teleatendimento LTDA</p>
        <p className={S.texto}>&copy; Todos os direitos reservados</p>
      </footer>
    </footer>
  );
}

export default Footer;
