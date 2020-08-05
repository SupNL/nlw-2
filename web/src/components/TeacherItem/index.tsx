import React from "react";
import whatsappIcon from '../../assets/images/icons/whatsapp.svg';

import './styles.css';

const TeacherItem = () => {
  return (
    <article className="teacher-item">
      <header>
        <img
          src="https://avatars3.githubusercontent.com/u/44099109?s=460&u=0666901ac0fd47bd408d0d32b1d636c353946e78&v=4"
          alt="Gustavo Patara"
        />
        <div>
          <strong>Gustavo Patara</strong>
          <span>Tecnologia da Informação</span>
        </div>
      </header>
      <p>
        Wooow dou aula de ti quem diria
        <br />
        <br />
        nl o cara brabo tentando dar aula eaeaeaeae
      </p>
      <footer>
        <p>
          Preço/hora
          <strong>R$ 80,00</strong>
        </p>
        <button type="button">
          <img src={whatsappIcon} alt="Whatsapp" />
          Entrar em contato
        </button>
      </footer>
    </article>
  );
};

export default TeacherItem;