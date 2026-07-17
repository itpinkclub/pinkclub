import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



// ELEMENTOS

const nome = document.getElementById("nome");
const categoria = document.getElementById("categoria");
const preco = document.getElementById("preco");
const link = document.getElementById("link");
const imagem = document.getElementById("imagem");

const destaque = document.getElementById("destaque");
const ativo = document.getElementById("ativo");

const salvar = document.getElementById("salvar");

const lista = document.getElementById("lista");

const sair = document.getElementById("sair");




// SALVAR PRODUTO

salvar.onclick = async () => {


    const produto = {

        nome: nome.value.trim(),

        categoria: categoria.value.trim(),

        preco: Number(preco.value),

        link: link.value.trim(),

        imagem: imagem.value.trim(),

        destaque: destaque.checked,

        ativo: ativo.checked,

        criadoEm: new Date()

    };



    if(!produto.nome || !produto.preco){

        alert("Preencha nome e preço do produto");

        return;

    }



    try{


        await addDoc(
            collection(db,"produtos"),
            produto
        );



        alert("Produto salvo com sucesso!");



        limparFormulario();



        carregarProdutos();



    }catch(error){


        console.error(error);

        alert(
            "Erro ao salvar produto: "
            + error.message
        );


    }


};




// LIMPAR FORM

function limparFormulario(){


    nome.value="";
    categoria.value="";
    preco.value="";
    link.value="";
    imagem.value="";

    destaque.checked=false;
    ativo.checked=true;


}




// LISTAR PRODUTOS

async function carregarProdutos(){


    lista.innerHTML="";


    const dados = await getDocs(
        collection(db,"produtos")
    );



    dados.forEach((doc)=>{


        const p = doc.data();



        lista.innerHTML += `


        <div class="produto">


            ${
                p.imagem 
                ?
                `<img 
                src="${p.imagem}"
                width="200"
                onerror="this.style.display='none'"
                >`
                :
                ""
            }



            <h3>
                ${p.nome}
            </h3>


            <p>
                ${p.categoria}
            </p>


            <strong>
                R$ ${p.preco}
            </strong>


            <br>


            <a 
            href="${p.link}" 
            target="_blank">
            Comprar
            </a>



        </div>


        `;



    });


}






// SAIR

if(sair){

    sair.onclick = async ()=>{


        await signOut(auth);


        window.location.href="index.html";


    };


}






// INICIAR

carregarProdutos();
