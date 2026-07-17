import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const container = document.getElementById("produtos");
const pesquisa = document.getElementById("pesquisa");
const botoesCategoria = document.querySelectorAll(".categoria");


let produtos = [];
let categoriaAtual = "Todos";


// BUSCAR FIRESTORE

async function carregarProdutos(){

    const snapshot = await getDocs(
        collection(db,"produtos")
    );


    produtos = [];


    snapshot.forEach(doc=>{

        const p = doc.data();


        if(
            p.ativo &&
            p.nome &&
            p.imagem
        ){

            produtos.push(p);

        }


    });


    mostrarProdutos();

}



// MOSTRAR PRODUTOS

function mostrarProdutos(){

    container.innerHTML="";


    const texto =
    pesquisa.value.toLowerCase();



    const filtrados =
    produtos.filter(produto=>{


        const nome =
        produto.nome
        .toLowerCase()
        .includes(texto);



        const categoria =
        categoriaAtual==="Todos" ||
        produto.categoria===categoriaAtual;



        return nome && categoria;


    });



    filtrados.forEach(produto=>{


        container.innerHTML += `

        <a 
        href="${produto.link}"
        target="_blank"
        class="card">


            <img 
            src="${produto.imagem}"
            alt="${produto.nome}">


            <div class="card-info">


            <span class="selo">
            💖 Escolha do Clube
            </span>


            <h2>
            ${produto.nome}
            </h2>


            <p>
            ${produto.categoria}
            </p>


            <strong>
            R$ ${Number(produto.preco)
            .toFixed(2)
            .replace(".",",")}
            </strong>


            <span class="botao">
            💖 Quero esse
            </span>


            </div>


        </a>


        `;


    });


}



// PESQUISA

pesquisa.addEventListener(
"input",
mostrarProdutos
);



// CATEGORIAS

botoesCategoria.forEach(botao=>{


    botao.onclick=()=>{


        botoesCategoria.forEach(btn=>
            btn.classList.remove("ativa")
        );


        botao.classList.add("ativa");


        categoriaAtual =
        botao.dataset.categoria;


        mostrarProdutos();


    };


});



// INICIAR

carregarProdutos();
