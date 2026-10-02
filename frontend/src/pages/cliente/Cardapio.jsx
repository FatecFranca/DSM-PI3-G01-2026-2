import { useNavigate } from "react-router-dom"

function Cardapio(){

    const navigate = useNavigate();
    return(

        <div>
            <h1>Cardapio app</h1>
            <button onClick={()=> navigate('/')}>ir para home</button>
        </div>
    )


}
export default Cardapio