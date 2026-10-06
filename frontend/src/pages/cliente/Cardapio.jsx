import { useNavigate } from "react-router-dom"
import Header from "../../componets/Header/Header";
import Slider from "../../componets/Slider/Slider";

function Cardapio(){

    const navigate = useNavigate();
    return(

        <div>
            <Header/>
            <Slider/>
            <h1>Cardapio app</h1>
            <button onClick={()=> navigate('/')}>ir para home</button>
        </div>
    )


}
export default Cardapio