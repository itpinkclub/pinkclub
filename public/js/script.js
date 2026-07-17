// =====================================
// IT PINK CLUB - SCRIPT PRINCIPAL
// =====================================

import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ELEMENTOS

const container = document.getElementById("produtos");
const pesquisa = document.getElementById("pesquisa");

const botoesCategoria = document.querySelectorAll("[data-categoria]");

let produtos = [];


// =====================================
// CARREGAR PRODUTOS FIREBASE
// =====================================

async function carregarProdutos(){

    try{

        const snapshot = await getDocs(collection(db,"produtos"));

        produtos = [];


        snapshot.forEach((doc)=>{

            const dados = doc.data();

            console.log("Produto Firebase:", dados);


            if(dados.ativo !== false){

                produtos.push({

                    id: doc.id,

                    nome: dados.nome || "Produto",

                    categoria: dados.categoria || "Outros",

                    preco: Number(dados.preco) || 0,

                    imagem: dados.imagem || "",

                    link: dados.link || "#",

                    destaque: dados.destaque || false

                });

            }


        });



        console.log("Produtos carregados:", produtos);


        mostrarProdutos();


    }catch(error){

        console.error("Erro Firebase:", error);

    }


}




// =====================================
// MOSTRAR PRODUTOS
// =====================================

function mostrarProdutos(lista = produtos){


    if(!container){

        console.error("Container produtos não encontrado");

        return;

    }



    container.innerHTML = "";



    lista.forEach(produto=>{


        const card = document.createElement("div");


        card.className = "produto-card";



        const imagemFinal = produto.imagem && produto.imagem.trim() !== ""

        ? produto.imagem

        : "https://placehold.co/600x600/f8c8dc/ffffff?text=It+Pink+Club";




        card.innerHTML = `


        <img

        src="${imagemFinal}"

        alt="${produto.nome}"

        >



        <h3>

        ${produto.nome}

        </h3>



        <p class="categoria-produto">

        ${produto.categoria}

        </p>



        <strong>

        R$ ${produto.preco.toFixed(2).replace(".",",")}

        </strong>



        <a

        href="${produto.link}"

        target="_blank"

        class="comprar"

        >

        Comprar

        </a>


        `;



        container.appendChild(card);



    });



}




// =====================================
// PESQUISA
// =====================================


if(pesquisa){


pesquisa.addEventListener("input",()=>{


    const texto = pesquisa.value
    .toLowerCase()
    .trim();



    const filtrados = produtos.filter(produto=>{


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



    mostrarProdutos(filtrados);



});



}




// =====================================
// CATEGORIAS
// =====================================


botoesCategoria.forEach(botao=>{


    botao.addEventListener("click",()=>{


        const categoria = botao.dataset.categoria;



        if(categoria === "todos"){


            mostrarProdutos();


            return;


        }



        const filtrados = produtos.filter(produto=>


            produto.categoria
            .toLowerCase()
            ===
            categoria.toLowerCase()


        );



        mostrarProdutos(filtrados);



    });



});





// =====================================
// START
// =====================================

carregarProdutos();