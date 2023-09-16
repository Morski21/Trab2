import { useState } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiUser } from 'react-icons/fi'

import { db } from '../../services/firebaseConnection'
import { addDoc, collection } from 'firebase/firestore'

import { toast } from 'react-toastify'

export default function Customers(){
  const [nome, setNome] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [cidade, setCidade] = useState('')
  const [endereco, setEndereco] = useState('')

  async function handleRegister(e){
    e.preventDefault();

    if(nome !== '' && cnpj !== '' && endereco !== ''){
        await addDoc(collection(db, "customers"), {
          nomeFantasia: nome,
          cidade: cidade,
          cnpj: cnpj,
          endereco: endereco
        })
        .then(() => {
          setNome('')
          setCnpj('')
          setEndereco('')
          setCidade('')
          toast.success("Empresa registrada!")
        })
        .catch((error) => {
          console.log(error);
          toast.error("Erro ao fazer o cadastro.")
        })

    }else{
      toast.error("Preencha todos os campos!")
    }

  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Clientes">
          <FiUser size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
              <label>Nome fantasia</label>
              <input
                type="text"
                placeholder="Nome da empresa ou cliente"
                value={nome}
                onChange={(e) => setNome(e.target.value) }
              />

              <label>Cidade</label>
              <input
                type="text"
                placeholder="Cidade da empresa ou cliente"
                value={cidade}
                onChange={(e) => setCidade(e.target.value) }
              />

              <label>CNPJ</label>
              <input
                type="text"
                placeholder="Digite o CNPJ ou CPF"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value) }
              />

              <label>Endereço</label>
              <input
                type="text"
                placeholder="Endereço da empresa ou cliente"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value) }
              />

              <button type="submit">
                Salvar
              </button>
          </form>
        </div>

      </div>

    </div>
  )
}