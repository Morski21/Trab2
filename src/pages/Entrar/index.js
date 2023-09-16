import { useState, useContext } from 'react'

import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/Auth'; 

export default function Entrar(){

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const { Entrar, loadingAuth } = useContext(AuthContext)

  async function handleEntrar(e){
    e.preventDefault();

    if(email !== '' && senha !== ''){
      await Entrar(email, senha);
    }

  }

  return(
    <div>
        <div>
            <form onSubmit={handleEntrar}>

                <h1>Entrar</h1>

                <input 
                    type="text" 
                    placeholder="E-mail"
                    value={email}
                    onChange={ (e) => setEmail(e.target.value) }
                />

                <h1>Senha</h1>

                <input 
                    type="password" 
                    placeholder="********"
                    value={senha}
                    onChange={ (e) => setSenha(e.target.value) }
                />

                <button type="submit">
                    {loadingAuth ? "Carregando..." : "Acessar"}
                </button>

                <Link to="/registrar">Criar uma conta</Link>

            </form>
        </div>
    </div>
  );
}