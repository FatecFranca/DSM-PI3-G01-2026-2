import './Header.css'
import logo from '../../assets/logo-redondinha.png'


 function Header(){
    const nomeRestaurante = 'Café de vovó'
    const imagemLogo = logo
    
    return(
        <header className='Header-container'>
           <img className='logo' src={imagemLogo} alt="Logo da Empresa"/>
            <p>{nomeRestaurante}</p>
        </header>
    )

}

export default Header