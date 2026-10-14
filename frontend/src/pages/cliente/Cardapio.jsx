import { useNavigate } from "react-router-dom"
import Header from "../../componets/Header/Header";
import Slider from "../../componets/Slider/Slider";
import cafe from '../../assets/cafe.png'
import croassant from '../../assets/croassats.jpg'
import donnuts from '../../assets/donnuts.png'


function Cardapio(){
    const imagensCardapio =[cafe, croassant, donnuts]
    return(

        <div>
            <Header/>
            <Slider slides={imagensCardapio}/>
            <h1>Cardapio app</h1>
            
        </div>
    )


}
export default Cardapio