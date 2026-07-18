import { auth, db } from "./firebase.js";

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    normalizarCategoria,
    tituloCategoria
} from "./catalogo.js";


// =============================
// CONFIGURAÇÕES
// =============================

const CLOUDINARY = {
    cloudName: "emyi9k2e",
    uploadPreset: "itpinkclub"
};


// =============================
// ELEMENTOS
// =============================

const $ = (seletor) => document.querySelector(seletor);

const login = $("#login");
const painel = $("#painel");

const formLogin = $("#form-login");
const form = $("#form-produto");

const lista = $("#lista");

const inputImagem = $("#imagem");
const previewImagem = $("#preview-imagem");

let cancelarProdutos = null;


// =============================
// MENSAGENS
// =============================

function mostrarMensagem(seletor, texto, erro = false) {

    const elemento = $(seletor);

    if (!elemento) return;

    elemento.textContent = texto;

    elemento.classList.toggle(
        "erro",
        erro
    );

}


// =============================
// SEGURANÇA HTML
// =============================

function escapar(texto) {

    return String(texto ?? "")
        .replace(
            /[&<>'"]/g,
            (caractere) => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "'": "&#39;",
                '"': "&quot;"
            })[caractere]
        );

}


// =============================
// VALIDAR LINK
// =============================

function linkSeguro(valor) {

    try {

        const url = new URL(valor);

        return [
            "http:",
            "https:"
        ].includes(url.protocol)
            ? url.href
            : "";

    } catch {

        return "";

    }

}


// =============================
// UPLOAD CLOUDINARY
// =============================

async function enviarImagem(arquivo) {


    if (!arquivo) return "";


    if (arquivo.size > 8 * 1024 * 1024) {

        throw new Error(
            "A imagem deve ter no máximo 8 MB."
        );

    }


    const dados = new FormData();


    dados.append(
        "file",
        arquivo
    );


    dados.append(
        "upload_preset",
        CLOUDINARY.uploadPreset
    );


    dados.append(
        "folder",
        "it-pink-club"
    );


    const resposta = await fetch(

        `https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`,

        {
            method: "POST",
            body: dados
        }

    );


    const corpo = await resposta.json();


    if (!resposta.ok || !corpo.secure_url) {

        throw new Error(
            "Não foi possível enviar a imagem."
        );

    }


    return corpo.secure_url;

}


// =============================
// LIMPAR FORMULÁRIO
// =============================

function limparFormulario() {


    if (!form) return;


    form.reset();


    $("#id-produto").value = "";


    $("#ativo").checked = true;


    $("#form-titulo").textContent =
        "Novo produto";


    $("#imagem-atual").textContent =
        "";


    $("#cancelar").hidden = true;


    if (previewImagem) {

        previewImagem.src =
        "https://placehold.co/500x500/fff0f7/ff3f9b?text=Preview";

    }


    mostrarMensagem(
        "#mensagem-form",
        ""
    );


}// =============================
// LISTAR PRODUTOS
// =============================

function ouvirProdutos() {

    cancelarProdutos?.();


    cancelarProdutos = onSnapshot(

        collection(db, "produtos"),

        (snapshot) => {


            const produtos =
                snapshot.docs
                .map((registro) => ({
                    id: registro.id,
                    ...registro.data()
                }))
                .sort((a, b) =>
                    String(a.nome || "")
                    .localeCompare(
                        String(b.nome || ""),
                        "pt-BR"
                    )
                );


            if (!lista) return;


            lista.innerHTML =
                produtos.length

                ?

                produtos.map((produto) => `

                <article class="item-produto">

                    <img
                    src="${escapar(
                        produto.imagem ||
                        "https://placehold.co/120x120/fff0f7/ff3f9b?text=Pink"
                    )}"
                    alt=""
                    >

                    <div>

                        <h3>
                        ${escapar(
                            produto.nome || "Produto"
                        )}
                        </h3>


                        <p>

                        ${escapar(
                            tituloCategoria(
                                normalizarCategoria(
                                    produto.categoria
                                )
                            )
                        )}

                        ·

                        ${
                            produto.ativo === false
                            ? "Inativo"
                            : "Ativo"
                        }

                        ${
                            produto.destaque
                            ? " · Destaque"
                            : ""
                        }

                        </p>

                    </div>


                    <div class="item-acoes">

                        <button
                        type="button"
                        data-editar="${encodeURIComponent(produto.id)}"
                        >
                        Editar
                        </button>


                        <button
                        class="perigo"
                        type="button"
                        data-excluir="${encodeURIComponent(produto.id)}"
                        >
                        Excluir
                        </button>


                    </div>


                </article>


                `).join("")


                :

                `
                <p class="vazio">
                Ainda não há produtos cadastrados.
                </p>
                `;



            lista
            .querySelectorAll("[data-editar]")
            .forEach((botao) => {


                botao.addEventListener(
                    "click",
                    () => {


                        const produto =
                        produtos.find(
                            (item) =>
                            item.id ===
                            decodeURIComponent(
                                botao.dataset.editar
                            )
                        );


                        if (produto) {

                            editar(produto);

                        }


                    }
                );


            });



            lista
            .querySelectorAll("[data-excluir]")
            .forEach((botao) => {


                botao.addEventListener(
                    "click",
                    () => {


                        excluir(
                            decodeURIComponent(
                                botao.dataset.excluir
                            )
                        );


                    }
                );


            });



        },


        () => {

            if (lista) {

                lista.innerHTML =
                `
                <p class="mensagem erro">
                Não foi possível carregar os produtos.
                </p>
                `;

            }

        }


    );

}



// =============================
// EDITAR PRODUTO
// =============================

function editar(produto) {


    $("#id-produto").value =
        produto.id;


    $("#nome").value =
        produto.nome || "";


    $("#categoria").value =
        normalizarCategoria(
            produto.categoria
        );


    $("#preco").value =
        produto.preco || "";


    $("#link").value =
        produto.link || "";


    $("#destaque").checked =
        produto.destaque === true;


    $("#ativo").checked =
        produto.ativo !== false;



    $("#imagem-atual").textContent =
        produto.imagem

        ?

        "Mantenha o campo de imagem vazio para preservar a imagem atual."

        :

        "";



    if (previewImagem && produto.imagem) {

        previewImagem.src =
            produto.imagem;

    }



    $("#form-titulo").textContent =
        "Editar produto";


    $("#cancelar").hidden =
        false;


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


}



// =============================
// EXCLUIR PRODUTO
// =============================

async function excluir(id) {


    if (
        !window.confirm(
            "Excluir este produto permanentemente?"
        )
    ) {

        return;

    }


    try {


        await deleteDoc(
            doc(
                db,
                "produtos",
                id
            )
        );


    } catch {


        window.alert(
            "Não foi possível excluir o produto."
        );


    }


}// =============================
// LOGIN
// =============================

if (formLogin) {

    formLogin.addEventListener(
        "submit",
        async (evento) => {

            evento.preventDefault();


            mostrarMensagem(
                "#erro-login",
                ""
            );


            try {


                await signInWithEmailAndPassword(

                    auth,

                    $("#email")
                    .value
                    .trim(),

                    $("#senha")
                    .value

                );


            } catch {


                mostrarMensagem(

                    "#erro-login",

                    "E-mail ou senha inválidos.",

                    true

                );


            }


        }
    );

}



// =============================
// SALVAR PRODUTO
// =============================

if (form) {


    form.addEventListener(

        "submit",

        async (evento) => {


            evento.preventDefault();


            const botao =
                $("#salvar");


            if (botao) {

                botao.disabled = true;

            }


            mostrarMensagem(

                "#mensagem-form",

                "Salvando produto..."

            );



            try {


                const id =
                    $("#id-produto")
                    .value;



                const arquivo =
                    $("#imagem")
                    .files[0];



                const imagem =
                    await enviarImagem(
                        arquivo
                    );



                const link =
                    linkSeguro(
                        $("#link")
                        .value
                        .trim()
                    );



                if (!link) {


                    throw new Error(

                        "Informe um link válido que comece com http:// ou https://."

                    );


                }



                const dados = {


                    nome:
                        $("#nome")
                        .value
                        .trim(),



                    categoria:
                        normalizarCategoria(
                            $("#categoria")
                            .value
                        ),



                    preco:
                        Number(
                            $("#preco")
                            .value
                        ) || 0,



                    link,



                    destaque:
                        $("#destaque")
                        .checked,



                    ativo:
                        $("#ativo")
                        .checked,



                    updatedAt:
                        serverTimestamp()


                };



                if (imagem) {


                    dados.imagem =
                        imagem;


                }



                if (id) {


                    await updateDoc(

                        doc(
                            db,
                            "produtos",
                            id
                        ),

                        dados

                    );



                } else {



                    await addDoc(

                        collection(
                            db,
                            "produtos"
                        ),

                        {

                            ...dados,

                            imagem:
                                imagem || "",


                            createdAt:
                                serverTimestamp()

                        }

                    );


                }



                limparFormulario();



                mostrarMensagem(

                    "#mensagem-form",

                    "Produto salvo com sucesso."

                );



            } catch (erro) {


                mostrarMensagem(

                    "#mensagem-form",

                    erro.message ||
                    "Não foi possível salvar o produto.",

                    true

                );


            } finally {


                if (botao) {

                    botao.disabled =
                        false;

                }


            }


        }

    );


}



// =============================
// BOTÕES
// =============================

$("#cancelar")
?.addEventListener(

    "click",

    limparFormulario

);



$("#sair")
?.addEventListener(

    "click",

    () => signOut(auth)

);



// =============================
// PREVIEW DA IMAGEM
// =============================

if (inputImagem && previewImagem) {


    inputImagem.addEventListener(

        "change",

        () => {


            const arquivo =
                inputImagem.files[0];



            if (!arquivo) {


                previewImagem.src =

                "https://placehold.co/500x500/fff0f7/ff3f9b?text=Preview";


                return;


            }



            const leitor =
                new FileReader();



            leitor.onload =
                (evento) => {


                    previewImagem.src =
                        evento.target.result;


                };



            leitor.readAsDataURL(
                arquivo
            );


        }

    );


}



// =============================
// AUTENTICAÇÃO
// =============================

onAuthStateChanged(

    auth,

    (usuario) => {


        if (login) {

            login.hidden =
                Boolean(usuario);

        }



        if (painel) {

            painel.hidden =
                !usuario;

        }



        if (usuario) {


            ouvirProdutos();



        } else {



            cancelarProdutos?.();


            cancelarProdutos =
                null;


            limparFormulario();



        }


    }

);