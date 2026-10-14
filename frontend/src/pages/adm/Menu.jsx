
import Header from "../../componets/Header/Header";
import MenuAba from "../../componets/MenuAba/MenuAba";
import ListaCategorias from "../../componets/ListaCategorias/ListaCategorias"

function Menu(){
    
    return(
        <div>
            <Header/>
            <MenuAba />
              <ListaCategorias />
            <h1>Gerenciamento do Menu</h1> 
        </div>
    )
}
export default Menu