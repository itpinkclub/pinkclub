// ===============================
// IT PINK CLUB - SCRIPT FIREBASE
// ===============================

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



// ===============================
// CARREGAR PRODUTOS FIREBASE
// ===============================

async function carregarProdutos(){


    try{


        const snapshot = await getDocs(
            collection(db,"produtos")
        );


        produtos = [];


        snapshot.forEach(doc=>{


            const p = doc.data();


            console.log(
                "Produto Firebase:",
                p
            );


            if(p.nome){


                produtos.push({

                    nome: p.nome || "",
                    categoria: p.categoria || "",
                    preco: p.preco || 0,
                    link: p.link || "#",
                    imagem: p.imagem || "",
                    destaque: p.destaque || false

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




// ===============================
// MOSTRAR PRODUTOS
// ===============================

function mostrarProdutos(){


    container.innerHTML="";



    const texto =
    pesquisa.value
    .toLowerCase();



    const filtrados =
    produtos.filter(produto=>{


        const nomeOk =
        produto.nome
        .toLowerCase()
        .includes(texto);



        const categoriaOk =
        categoriaAtual === "Todos" ||
        produto.categoria === categoriaAtual;



        return nomeOk && categoriaOk;


    });



    if(filtrados.length === 0){


        container.innerHTML = `

        <div style="
        text-align:center;
        padding:60px;
        ">

        <h2>
        💔 Nenhum produto encontrado
        </h2>

        </div>

        `;


        return;


    }



    filtrados.forEach(produto=>{



        container.innerHTML += `


        <a 
        class="card"
        href="${produto.link}"
        target="_blank">


            ${
            produto.imagem
            ?

            `
            <img 
            src="${produto.imagem}"
            alt="${produto.nome}">
            `

            :

            ""

            }



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





// ===============================
// PESQUISA
// ===============================

if(pesquisa){

    pesquisa.addEventListener(
        "input",
        mostrarProdutos
    );

}



// ===============================
// CATEGORIAS
// ===============================

botoesCategoria.forEach(botao=>{


    botao.addEventListener(
        "click",
        ()=>{


            botoesCategoria.forEach(btn=>
                btn.classList.remove("ativa")
            );


            botao.classList.add("ativa");


            categoriaAtual =
            botao.dataset.categoria;



            mostrarProdutos();



        }
    );


});




// ===============================
// INICIAR
// ===============================

carregarProdutos();
