import { useNavigate } from "react-router-dom"
import Header from "../../componets/Header/Header";
import MenuAba from "../../componets/MenuAba/MenuAba";

function Preferencias(){
    const navigate = useNavigate(); // muda para a tela de cardápios
    return(

        <div>
            <Header/>
            <MenuAba />
            <h1>Preferencias app</h1>
            
        </div>
    )


}
export default Preferencias