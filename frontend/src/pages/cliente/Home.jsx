import { useNavigate } from "react-router-dom"
import  Header from '../../componets/Header/Header'



// se a variável ou função mexe com o comportamento daquela tela (como mudar de página ou guardar dados), ela deve ficar DENTRO da função do componente. -> por exemplo const navgate(vai mudar a tela para)



function Home(){
    const navigate = useNavigate(); // muda para a tela de cardápios
    return(

        <div>
            <Header/>
            <h1>Home app</h1>
            <button onClick={()=> navigate('/cardapio')}>botão de navegação</button>
        </div>
    )


}
export default Home