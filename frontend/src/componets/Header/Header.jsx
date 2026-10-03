import './Header.css'
import logo from '../../assets/logo-redondinha.png'


 function Header(){
    return(
        <header className='Header-container'>
           <img className='logo' src={logo} alt="Logo da Empresa"/>
            <p>Cafe de vovó</p>
        </header>
    )

}

export default Header