import './Slider.css'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import cafe from '../../assets/cafe.png'
import croassant from '../../assets/croassats.jpg'
import donnuts from '../../assets/donnuts.png'

const Slider = () => {

    const slides = [cafe, croassant, donnuts]

    return (
        <div className="slide-container">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
            >
                {slides.map((item, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={item}
                            alt={`Slide ${index + 1}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default Slider



{/* 
// Importa o arquivo CSS desse componente.
// Aqui ficam os estilos do nosso slider.
import './Slider.css'


// Importamos duas coisas do Swiper para usar no React:
//
// Swiper:
// É o "container" que controla o slider.
//
// SwiperSlide:
// É cada slide individual dentro do slider.
//
// Exemplo:
// <Swiper>
//     <SwiperSlide>Slide 1</SwiperSlide>
//     <SwiperSlide>Slide 2</SwiperSlide>
// </Swiper>
import { Swiper, SwiperSlide } from 'swiper/react'


// Aqui importamos funcionalidades extras do Swiper:
//
// Navigation:
// Permite colocar as setinhas ← →
//
// Pagination:
// Permite colocar as bolinhas de navegação ● ○ ○
//
// Autoplay:
// Faz o slider passar sozinho depois de determinado tempo.
import { Navigation, Pagination, Autoplay } from 'swiper/modules'


// O Swiper precisa desse CSS básico para funcionar visualmente.
// Sem ele, algumas coisas do Swiper podem ficar quebradas.
import 'swiper/css'


// CSS necessário para as setinhas de navegação.
import 'swiper/css/navigation'


// CSS necessário para as bolinhas de paginação.
import 'swiper/css/pagination'


// Aqui estamos importando as imagens que estão
// dentro da pasta "assets" do nosso projeto.
//
// O "cafe" não é a imagem em si.
// É uma variável que recebe o caminho da imagem.
import cafe from '../../assets/cafe.jpg'

import croassant from '../../assets/croassats.jpg'

import donnuts from '../../assets/donnuts.jpg'


// Criamos o nosso componente chamado Slider.
//
// Uma arrow function também pode ser usada para criar
// componentes React.
const Slider = () => {


    // Criamos um ARRAY contendo nossas imagens.
    //
    // Agora "slides" é:
    //
    // [
    //     cafe,
    //     croassant,
    //     donnuts
    // ]
    //
    // Isso facilita muito porque depois podemos percorrer
    // todas as imagens automaticamente usando .map().
    const slides = [cafe, croassant, donnuts]


    // Tudo que estiver dentro do return
    // será mostrado na tela.
    return (


        // Essa div é apenas um container nosso.
        //
        // "slide-container" é uma classe CSS que podemos
        // usar para estilizar o slider.
        <div className="slide-container">


            // Aqui começa o componente principal do Swiper.
            //
            // Tudo que estiver dentro dele será considerado
            // parte do nosso slider.
            <Swiper


                // Aqui informamos quais funcionalidades
                // extras queremos usar.
                //
                // Navigation = setinhas
                // Pagination = bolinhas
                // Autoplay = troca automática
                //
                // Os [] significam que estamos passando
                // um ARRAY para o Swiper.
                modules={[Navigation, Pagination, Autoplay]}


                // Ativa as setinhas ← →
                navigation


                // Ativa as bolinhas.
                //
                // clickable: true significa que o usuário
                // pode clicar nas bolinhas para mudar de slide.
                pagination={{ clickable: true }}


                // Configura a troca automática dos slides.
                autoplay={{


                    // delay significa "atraso".
                    //
                    // 2000 milissegundos = 2 segundos.
                    //
                    // Portanto:
                    //
                    // Slide 1
                    // espera 2 segundos
                    // Slide 2
                    // espera 2 segundos
                    // Slide 3
                    // espera 2 segundos
                    // ...
                    delay: 2000,


                    // Se o usuário clicar ou arrastar o slider,
                    // ele NÃO vai parar o autoplay.
                    //
                    // false = não desativar.
                    disableOnInteraction: false,
                }}
            >


                // Agora começa a parte mais importante.
                //
                // "slides" é nosso array:
                //
                // [cafe, croassant, donnuts]
                //
                // .map() serve para percorrer cada item
                // desse array.

                {slides.map((item, index) => (


                    // Para CADA imagem do array,
                    // vamos criar um SwiperSlide.
                    //
                    // Se temos 3 imagens:
                    //
                    // cafe       -> cria um SwiperSlide
                    // croassant  -> cria um SwiperSlide
                    // donnuts    -> cria um SwiperSlide
                    <SwiperSlide key={index}>


                        // Aqui mostramos a imagem.
                        //
                        // "src" significa:
                        // qual imagem será mostrada?
                        //
                        // "item" é a imagem atual que o map()
                        // está percorrendo.
                        //
                        // Na primeira volta:
                        // item = cafe
                        //
                        // Segunda:
                        // item = croassant
                        //
                        // Terceira:
                        // item = donnuts
                        <img
                            src={item}


                            // "alt" é uma descrição da imagem.
                            //
                            // index começa em 0.
                            //
                            // Então:
                            //
                            // index = 0 → Slide 1
                            // index = 1 → Slide 2
                            // index = 2 → Slide 3
                            //
                            // `${}` permite colocar uma variável
                            // dentro de um texto.
                            alt={`Slide ${index + 1}`}
                        />


                    // Fecha o SwiperSlide.
                    </SwiperSlide>


                // Fecha o map().
                ))}


            // Fecha o Swiper.
            </Swiper>


        // Fecha a div.
        </div>
    )
}


// Exportamos o componente.
//
// Isso permite que outro arquivo possa fazer:
//
// import Slider from './Slider'
//
// e depois:
//
// <Slider />
export default Slider
*/}