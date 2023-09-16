import { useState, useContext } from 'react'

import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/Auth'; 

export default function Registrar(){

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [contato, setContato] = useState('');

  const { Registrar, loadingAuth } = useContext(AuthContext)

  async function handleRegistrar(e){
    e.preventDefault();
    if(nome !== '' && email !== '' && senha !== '' && contato !== ''){
      await Registrar(nome, email, senha, contato);
    }
}

  return(
    <div>
        <div>
            <form onSubmit={handleRegistrar}>
                <input 
                    type="text" 
                    placeholder="Nome"
                    value={nome}
                    onChange={ (e) => setNome(e.target.value) }
                />
                
                <input 
                    type="text" 
                    placeholder="E-mail"
                    value={email}
                    onChange={ (e) => setEmail(e.target.value) }
                />

                <input 
                    type="password" 
                    placeholder="Senha"
                    value={senha}
                    onChange={ (e) => setSenha(e.target.value) }
                />

                <input 
                    type="text" 
                    placeholder="Contato"
                    value={contato}
                    onChange={ (e) => setContato(e.target.value) }
                />

                <button type="submit">
                    {loadingAuth ? "Carregando..." : "Cadastrar"}
                </button>

                <Link to="/">Já possui uma conta? Faça login</Link>

            </form>
        </div>
    </div>
  );
}