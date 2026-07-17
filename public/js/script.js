import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ELEMENTOS

const container = document.getElementById("listaProdutos");
const pesquisa = document.getElementById("pesquisa");

const botoesCategoria = document.querySelectorAll(".categoria");

let produtos = [];



// CARREGAR PRODUTOS

async function carregarProdutos(){

    try{

        const snapshot = await getDocs(
            collection(db,"produtos")
        );


        produtos = [];


        snapshot.forEach((doc)=>{

            const produto = doc.data();

            console.log("Produto Firebase:", produto);


            if(produto.ativo !== false){

                produtos.push(produto);

            }

        });


        console.log(
            "Produtos carregados:",
            produtos
        );


        mostrarProdutos();


    }catch(error){

        console.error(
            "Erro Firebase:",
            error
        );

    }

}




// MOSTRAR PRODUTOS

function mostrarProdutos(lista = produtos){


    if(!container){
        console.error(
            "Elemento listaProdutos não encontrado"
        );
        return;
    }


    container.innerHTML = "";



    if(lista.length === 0){

        container.innerHTML = `

        <h3>
        Nenhum produto encontrado 💗
        </h3>

        `;

        return;

    }




    lista.forEach((produto)=>{


        const imagem = 
        produto.imagem &&
        produto.imagem.startsWith("http")

        ?

        produto.imagem

        :

        "https://placehold.co/500x500/ffd6ea/ff3f9b?text=It+Pink";



        const preco = Number(
            produto.preco || 0
        )
        .toFixed(2)
        .replace(".",",");




        container.innerHTML += `


        <div class="produto-card">


            <img 
            src="${imagem}"
            alt="${produto.nome || "Produto"}"
            >


            <h3>
            ${produto.nome || "Produto sem nome"}
            </h3>


            <p>
            ${produto.categoria || "Sem categoria"}
            </p>


            <strong>
            R$ ${preco}
            </strong>


            <br>


            <a 
            href="${produto.link || "#"}"
            target="_blank"
            >

            Comprar

            </a>


        </div>


        `;


    });


}





// PESQUISA

if(pesquisa){


    pesquisa.addEventListener(
        "input",
        ()=>{


            const texto =
            pesquisa.value
            .toLowerCase()
            .trim();



            const filtrados =
            produtos.filter((produto)=>{


                return (

                    produto.nome
                    ?.toLowerCase()
                    .includes(texto)

                    ||

                    produto.categoria
                    ?.toLowerCase()
                    .includes(texto)

                );


            });



            mostrarProdutos(
                filtrados
            );


        }
    );


}





// FILTROS

botoesCategoria.forEach(
(botao)=>{


    botao.addEventListener(
        "click",
        ()=>{


            const categoria =
            botao.dataset.categoria;



            if(
                !categoria ||
                categoria === "todos"
            ){

                mostrarProdutos();

                return;

            }



            const filtrados =
            produtos.filter(
            (produto)=>{


                return (

                produto.categoria
                ?.toLowerCase()
                ===
                categoria
                .toLowerCase()

                );


            });



            mostrarProdutos(
                filtrados
            );


        }
    );


});





// INICIAR

carregarProdutos();