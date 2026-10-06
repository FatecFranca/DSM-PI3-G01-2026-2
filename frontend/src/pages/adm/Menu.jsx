import { useNavigate } from "react-router-dom"
import Header from "../../componets/Header/Header";
import MenuAba from "../../componets/MenuAba/MenuAba";

function Menu(){
    const navigate = useNavigate(); 
    return(
        <div>
            <Header/>
            <MenuAba />
            <h1>Gerenciamento do Menu</h1> {/* Ajustado o texto aqui */}
            <button onClick={()=> navigate('/preferencias')}>Voltar para a Preferencias</button>
        </div>
    )
}
export default Menu