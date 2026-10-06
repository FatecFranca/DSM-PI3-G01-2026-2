import { useNavigate } from "react-router-dom"
import  Header from '../../componets/Header/Header'
import Slider from "../../componets/Slider/Slider"
import cafe from '../../assets/cafe.png'
import croassant from '../../assets/croassats.jpg'
import donnuts from '../../assets/donnuts.png'
import Button from "../../componets/Button/Button"






function Home(){
    const navigate = useNavigate();
    const imagensHome = [cafe, croassant, donnuts]
 
    return(
        <div>
            <Header/>
            <Slider slides={imagensHome} height='240px'/>
            <h1>Home app</h1>
            <Button 
                texto={'faça seu Pedido'} 
                cor="#610027"
                corTexto="#ffffff"
                largura="95%"
                altura="80px"
                onClick={()=> navigate('/cardapio')}
            />
            <p>Pague com</p>
        </div>
    )
}
export default Home