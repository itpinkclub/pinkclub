import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// CLOUDINARY
const cloudName = "emyj9k2e";
const uploadPreset = "itpinkclub";


// ELEMENTOS
const salvar = document.getElementById("salvar");
const lista = document.getElementById("lista");



// SALVAR PRODUTO
salvar.addEventListener("click", async () => {

    const nome = document.getElementById("nome").value;
    const categoria = document.getElementById("categoria").value;
    const preco = document.getElementById("preco").value;
    const link = document.getElementById("link").value;

    const imagemArquivo = document.getElementById("imagem").files[0];

    const destaque = document.getElementById("destaque").checked;
    const ativo = document.getElementById("ativo").checked;


    if(!nome || !categoria || !preco || !link || !imagemArquivo){

        alert("Preencha todos os campos!");
        return;

    }



    try {


        // ENVIA IMAGEM PARA CLOUDINARY

        const formData = new FormData();

        formData.append(
            "file",
            imagemArquivo
        );

        formData.append(
            "upload_preset",
            uploadPreset
        );



        const resposta = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method:"POST",
                body:formData
            }
        );


        const imagem = await resposta.json();


        const urlImagem = imagem.secure_url;



        // SALVA NO FIRESTORE

        await addDoc(
            collection(db,"produtos"),
            {

                nome,
                categoria,
                preco:Number(preco),
                link,
                imagem:urlImagem,
                destaque,
                ativo,
                criadoEm:new Date()

            }
        );



        alert("Produto salvo com sucesso!");



        limparCampos();

        carregarProdutos();



    } catch(error){

        console.error(error);

        alert(
            "Erro ao salvar produto"
        );

    }



});




// LISTAR PRODUTOS

async function carregarProdutos(){


    lista.innerHTML="";


    const produtos = await getDocs(
        collection(db,"produtos")
    );


    produtos.forEach((item)=>{


        const produto = item.data();


        lista.innerHTML += `

        <div class="produto">

            <img 
            src="${produto.imagem}"
            width="200"
            >

            <h3>${produto.nome}</h3>

            <p>${produto.categoria}</p>

            <p>
            R$ ${produto.preco}
            </p>


            <a href="${produto.link}" target="_blank">
            Comprar
            </a>


            <button 
            onclick="excluirProduto('${item.id}')">
            Excluir
            </button>


        </div>

        `;


    });


}



// EXCLUIR

window.excluirProduto = async function(id){


    await deleteDoc(
        doc(db,"produtos",id)
    );


    carregarProdutos();


};




// LIMPAR FORM

function limparCampos(){


    document.getElementById("nome").value="";
    document.getElementById("categoria").value="";
    document.getElementById("preco").value="";
    document.getElementById("link").value="";
    document.getElementById("imagem").value="";

}



// iniciar lista

carregarProdutos();
