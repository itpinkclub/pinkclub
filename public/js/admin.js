import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ELEMENTOS

const nomeInput = document.getElementById("nome");
const categoriaInput = document.getElementById("categoria");
const precoInput = document.getElementById("preco");
const imagemInput = document.getElementById("imagem");
const linkInput = document.getElementById("link");

const btnSalvar = document.getElementById("salvar");

const lista = document.getElementById("listaAdmin");



// IMAGEM PADRÃO

const imagemPadrao = 
"https://placehold.co/500x500/ffd6ea/ff3f9b?text=It+Pink";




// TESTAR IMAGEM

function imagemValida(url){

    if(!url) return false;

    return (
        url.startsWith("http://") ||
        url.startsWith("https://")
    );

}





// CADASTRAR PRODUTO

if(btnSalvar){


btnSalvar.addEventListener(
"click",
async ()=>{


    const produto = {


        nome:
        nomeInput.value.trim(),


        categoria:
        categoriaInput.value.trim(),


        preco:
        Number(precoInput.value),


        imagem:
        imagemValida(imagemInput.value.trim())

        ?

        imagemInput.value.trim()

        :

        imagemPadrao,


        link:
        linkInput.value.trim(),


        ativo:true,


        criadoEm:
        new Date()


    };



    if(!produto.nome){

        alert(
        "Digite o nome do produto"
        );

        return;

    }




    try{


        await addDoc(
            collection(db,"produtos"),
            produto
        );



        alert(
        "Produto cadastrado 💗"
        );



        limparFormulario();


        carregarProdutosAdmin();



    }catch(error){


        console.error(
            error
        );


        alert(
        "Erro ao salvar produto"
        );


    }



});


}




// LIMPAR

function limparFormulario(){

    nomeInput.value="";
    categoriaInput.value="";
    precoInput.value="";
    imagemInput.value="";
    linkInput.value="";

}




// LISTAR ADMIN

async function carregarProdutosAdmin(){


    if(!lista) return;


    lista.innerHTML="";


    const snapshot =
    await getDocs(
        collection(db,"produtos")
    );



    snapshot.forEach(
    (item)=>{


        const produto =
        item.data();



        lista.innerHTML += `


        <div class="admin-card">


            <img 
            src="${produto.imagem || imagemPadrao}"
            width="100"
            >


            <h3>
            ${produto.nome}
            </h3>


            <p>
            ${produto.categoria}
            </p>


            <button 
            onclick="removerProduto('${item.id}')"
            >

            Excluir

            </button>


        </div>


        `;


    });


}




// EXCLUIR

window.removerProduto = async function(id){


    if(
        !confirm(
        "Excluir produto?"
        )
    )
    return;



    await deleteDoc(
        doc(db,"produtos",id)
    );


    carregarProdutosAdmin();


}




carregarProdutosAdmin();