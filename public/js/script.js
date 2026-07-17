import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==============================
// VARIÁVEIS
// ==============================

let produtos = [];

const container = document.getElementById("listaProdutos");
const pesquisa = document.getElementById("pesquisa");

let categoriaAtual = "todos";


// ==============================
// CARREGAR PRODUTOS FIREBASE
// ==============================

async function carregarProdutos(){

    try {

        const snapshot = await getDocs(
            collection(db, "produtos")
        );


        produtos = [];


        snapshot.forEach((doc)=>{

            const produto = doc.data();

            console.log("Produto Firebase:", produto);

            produtos.push(produto);

        });


        console.log(
            "Produtos carregados:",
            produtos
        );


        mostrarProdutos();


    } catch(error){

        console.error(
            "Erro Firebase:",
            error
        );

    }

}




// ==============================
// MOSTRAR PRODUTOS
// ==============================

function mostrarProdutos(){


    if(!container){

        console.error(
            "Elemento listaProdutos não encontrado no HTML"
        );

        return;

    }



    container.innerHTML = "";



    const texto = pesquisa
        ? pesquisa.value.toLowerCase()
        : "";



    const filtrados = produtos.filter((produto)=>{


        const nome =
        (produto.nome || "")
        .toLowerCase();



        const categoria =
        (produto.categoria || "")
        .toLowerCase();



        const busca =
        nome.includes(texto);



        const cat =
        categoriaAtual === "todos" ||
        categoria === categoriaAtual.toLowerCase();



        return busca && cat;


    });



    filtrados.forEach((produto)=>{


        const card = document.createElement("div");

        card.className = "produto-card";



        card.innerHTML = `

            <img 
            src="${produto.imagem || ''}"
            alt="${produto.nome || ''}"
            >


            <h3>
            ${produto.nome || "Produto"}
            </h3>


            <p>
            ${produto.categoria || ""}
            </p>


            <strong>
            R$ ${Number(produto.preco || 0)
            .toFixed(2)
            .replace(".",",")}
            </strong>


            <br>


            <a 
            href="${produto.link || '#'}"
            target="_blank">

            Comprar

            </a>

        `;


        container.appendChild(card);



    });



    if(filtrados.length === 0){

        container.innerHTML = `
        <p>
        Nenhum produto encontrado 💖
        </p>
        `;

    }


}




// ==============================
// PESQUISA
// ==============================

if(pesquisa){

    pesquisa.addEventListener(
        "input",
        mostrarProdutos
    );

}



// ==============================
// CATEGORIAS
// ==============================


const botoes =
document.querySelectorAll(
    "[data-categoria]"
);



botoes.forEach((botao)=>{


    botao.addEventListener(
        "click",
        ()=>{


            categoriaAtual =
            botao.dataset.categoria;


            mostrarProdutos();


        }
    );


});




// ==============================
// INICIAR
// ==============================

carregarProdutos();
