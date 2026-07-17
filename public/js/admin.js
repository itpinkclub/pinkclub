import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// =============================
// CLOUDINARY
// =============================

const CLOUD_NAME = "emyi9k2e";
const UPLOAD_PRESET = "itpinkclub";



// =============================
// ELEMENTOS
// =============================

const nomeInput = document.getElementById("nome");
const categoriaInput = document.getElementById("categoria");
const precoInput = document.getElementById("preco");
const imagemInput = document.getElementById("imagem");
const linkInput = document.getElementById("link");

const destaqueInput = document.getElementById("destaque");
const ativoInput = document.getElementById("ativo");

const btnSalvar = document.getElementById("salvar");

const lista =
document.getElementById("lista");



// =============================
// UPLOAD CLOUDINARY
// =============================

async function uploadImagem(arquivo){

    if(!arquivo) return "";

    const formData = new FormData();

    formData.append(
        "file",
        arquivo
    );

    formData.append(
        "upload_preset",
        UPLOAD_PRESET
    );

    const resposta = await fetch(

        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

        {

            method:"POST",

            body:formData

        }

    );

    const dados = await resposta.json();

    if(!dados.secure_url){

        throw new Error("Erro ao enviar imagem.");

    }

    return dados.secure_url;

}
