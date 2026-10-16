import { useNavigate } from "react-router-dom"
import  Header from '../../componets/Header/Header'
import Slider from "../../componets/Slider/Slider"
import cafe from '../../assets/cafe.png'
import croassant from '../../assets/croassats.jpg'
import donnuts from '../../assets/donnuts.png'
import Button from "../../componets/Button/Button"
import '../../styles/HomeCliente.css'
import IconesPagamento from "../../componets/IconesPagamento/IconesPagamento"
import { FaCreditCard, FaPix, FaMoneyBillWave } from 'react-icons/fa6';







function Home(){
    const navigate = useNavigate();
    const imagensHome = [cafe, croassant, donnuts]
 
    return(
        <div className="Home-container">
           
            <div className="header-slider-group">
                <Header/>
                <Slider slides={imagensHome} height='300px'/>
            </div>
        
            <div className="footer-content-group">
                <Button 
                    texto={'faça seu Pedido'} 
                    cor="#610027"
                    corTexto="#ffffff"
                    largura="95%"
                    altura="80px"
                    onClick={()=> navigate('/cardapio')}
                 className="button"/>
                <p className="texto">Pague com</p>
                <div className="icones-pagamento">
                    <IconesPagamento texto="Pix" icone={<FaPix />} />
                    <IconesPagamento texto="Crédito" icone={<FaCreditCard/>}/>
                    <IconesPagamento texto="Débito" icone={<FaCreditCard/>}/>
                    <IconesPagamento texto="Dinheiro" icone={<FaMoneyBillWave/>}/>
                </div>
                
        
            </div>
            <p className="nomeSistema">GimealSystem</p>
        </div>
    )
}
export default Home