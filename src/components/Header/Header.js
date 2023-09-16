import { Link } from 'react-router-dom';

function Header(){
    return(
        <header>
            <h2>Bem-vindo {user}</h2> 

            <div>  
                <Link to='/'></Link>
                <Link to='/adicionar'>Adicionar</Link>
            </div>
        </header>
    );
}

export default Header;