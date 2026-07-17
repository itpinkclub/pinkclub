// =====================================
// IT PINK CLUB - SCRIPT PRINCIPAL
// =====================================

import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ================================
// ELEMENTOS
// ================================

const container = document.getElementById("produtos");
const pesquisa = document.getElementById("pesquisa");

const botoesCategoria = document.querySelectorAll(
    ".categoria, button[data-categoria]"
);

let produtos = [];


// ================================
// IMAGEM PADRÃO
// ================================

const imagemPadrao = "/imagens/sem-imagem.png";


// ================================
// CARREGAR PRODUTOS FIREBASE
// ================================

async function carregarProdutos(){

    try{

        const snapshot = await getDocs(
            collection(db,"produtos")
        );


        produtos = [];


        snapshot.forEach((doc)=>{


            const dados = doc.data();


            console.log("Produto Firebase:", dados);



            if(dados.ativo !== false){


                produtos.push({

                    id: doc.id,

                    nome:
                    dados.nome || "Produto",

                    categoria:
                    dados.categoria || "Outros",

                    preco:
                    dados.preco || 0,

                    imagem:
                    dados.imagem || "",

                    link:
                    dados.link || "#",

                    destaque:
                    dados.destaque || false

                });


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



// ================================
// MOSTRAR PRODUTOS
// ================================

function mostrarProdutos(lista = produtos){


    if(!container){

        console.error(
            "Elemento produtos não encontrado"
        );

        return;

    }



    container.innerHTML = "";



    lista.forEach(produto=>{


        const card = document.createElement("div");


        card.className =
        "produto-card";



        let imagem =
        produto.imagem;



        if(
            !imagem ||
            imagem.trim()===""
        ){

            imagem = imagemPadrao;

        }



        card.innerHTML = `


        <img
        src="${imagem}"
        alt="${produto.nome}"
        onerror="this.src='${imagemPadrao}'"
        >



        <h3>
        ${produto.nome}
        </h3>



        <p class="categoria-produto">
        ${produto.categoria}
        </p>



        <strong>
        R$ ${Number(produto.preco)
        .toFixed(2)
        .replace(".",",")}
        </strong>



        <a
        href="${produto.link}"
        target="_blank"
        class="comprar">

        Comprar

        </a>


        `;



        container.appendChild(card);



    });



}



// ================================
// PESQUISA
// ================================


if(pesquisa){


    pesquisa.addEventListener(
        "input",
        ()=>{


        const texto =
        pesquisa.value
        .toLowerCase()
        .trim();



        const filtrados =
        produtos.filter(produto=>{


            return (

                produto.nome
                .toLowerCase()
                .includes(texto)


                ||


                produto.categoria
                .toLowerCase()
                .includes(texto)

            );


        });



        mostrarProdutos(
            filtrados
        );


    });


}




// ================================
// CATEGORIAS
// ================================


botoesCategoria.forEach(botao=>{


    botao.addEventListener(
        "click",
        ()=>{


        const categoria =
        botao.dataset.categoria;



        if(
            !categoria ||
            categoria==="todos"
        ){

            mostrarProdutos();

            return;

        }



        const filtrados =
        produtos.filter(produto=>{


            return produto.categoria
            .toLowerCase()
            ===
            categoria.toLowerCase();


        });



        mostrarProdutos(
            filtrados
        );



    });


});




// ================================
// INICIAR
// ================================

carregarProdutos();
