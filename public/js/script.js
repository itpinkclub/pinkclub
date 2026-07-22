import { db } from "./firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { catalogoInicial, normalizarCategoria, tituloCategoria } from "./catalogo.js";

const container = document.querySelector("#produtos");
const resultado = document.querySelector("#resultado");
const vitrine = document.querySelector(".vitrine");
const busca = document.querySelector("#pesquisa");
let produtos = [];
let categoriaAtiva = "todos";
let categorias = [];


const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const escapar = (texto) => String(texto ?? "").replace(/[&<>'"]/g, (caractere) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[caractere]);
const linkSeguro = (valor) => {
  try {
    const url = new URL(valor);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "#";
  } catch {
    return "#";
  }
};
async function carregarCategorias() {

    try {

        const resposta = await fetch("/data/categorias.json");
        const dados = await resposta.json();

        categorias = dados.categorias;

        renderizarCategorias();

    } catch (erro) {

        console.error("Erro ao carregar categorias:", erro);

    }

}

function renderizarCategorias() {

    const nav = document.getElementById("categorias");

    nav.innerHTML = "";

    // Botão Todos
    nav.innerHTML += `
        <button
            class="categoria ativa"
            data-categoria="todos"
            aria-pressed="true">
            ✨ Todos
        </button>
    `;

    categorias.forEach(cat => {

        nav.innerHTML += `
            <button
                class="categoria"
                data-categoria="${cat.id}"
                aria-pressed="false">
                ${cat.nome}
            </button>
        `;

    });

    adicionarEventosCategorias();

}

function adicionarEventosCategorias() {

    document.querySelectorAll("[data-categoria]").forEach(botao => {

        botao.addEventListener("click", () => {

            categoriaAtiva = botao.dataset.categoria;

            document.querySelectorAll("[data-categoria]").forEach(item => {

                const ativa = item === botao;

                item.classList.toggle("ativa", ativa);

                item.setAttribute("aria-pressed", ativa);

            });

            renderizar();

        });

    });

}

function produtoValido(dados, id) {
  return { id, nome: String(dados.nome || "Produto"), categoria: normalizarCategoria(dados.categoria), preco: Number(dados.preco) || 0, imagem: String(dados.imagem || ""), link: String(dados.link || "#"), destaque: dados.destaque === true, ativo: dados.ativo !== false };
}
function filtrar() {
  const termo = busca.value.trim().toLocaleLowerCase("pt-BR");
  return produtos.filter((produto) => produto.ativo && (categoriaAtiva === "todos" || produto.categoria === categoriaAtiva) && `${produto.nome} ${produto.categoria}`.toLocaleLowerCase("pt-BR").includes(termo)).sort((a, b) => Number(b.destaque) - Number(a.destaque) || a.nome.localeCompare(b.nome, "pt-BR"));
}
function renderizar() {

    const lista = filtrar();

    vitrine.setAttribute("aria-busy", "false");

    resultado.textContent = lista.length
        ? `${lista.length} ${lista.length === 1 ? "achadinho encontrado" : "achadinhos encontrados"}.`
        : "Nenhum achadinho encontrado com esses filtros.";

    container.replaceChildren();

    if (!lista.length) return;

    const fragmento = document.createDocumentFragment();

    lista.forEach(produto => {

        const card = document.createElement("article");

        card.className = "produto-card";

        const imagem =
            produto.imagem ||
            "https://placehold.co/600x600/fff0f7/ff3f9b?text=It+Pink+Club";

        const nomeCategoria =
            categorias.find(c => c.id === produto.categoria)?.nome ||
            produto.categoria;

        card.innerHTML = `
            ${produto.destaque ? '<span class="selo">Destaque</span>' : ""}

            <img
                class="imagem-produto"
                src="${escapar(imagem)}"
                alt="${escapar(produto.nome)}"
                loading="lazy">

            <div class="produto-conteudo">

                <p class="categoria-produto">
                    ${escapar(nomeCategoria)}
                </p>

                <h2>${escapar(produto.nome)}</h2>

                ${
                    produto.preco > 0
                        ? `<strong>${moeda.format(produto.preco)}</strong>`
                        : `<strong class="preco-consultar">Confira o preço</strong>`
                }

                <a
                    href="${escapar(linkSeguro(produto.link))}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="comprar">

                    Ver achadinho →
                </a>

            </div>
        `;

        card.querySelector("img").addEventListener(
            "error",
            e => {
                e.currentTarget.src =
                    "https://placehold.co/600x600/fff0f7/ff3f9b?text=Imagem+indisponivel";
            },
            { once: true }
        );

        fragmento.append(card);

    });

    container.append(fragmento);
}
function carregarCatalogo() {

    const produtosRef = collection(db, "produtos");

    onSnapshot(
        produtosRef,

        (snapshot) => {

            produtos = snapshot.docs.map(doc =>
                produtoValido(doc.data(), doc.id)
            );

            renderizar();

        },

        (erro) => {

            console.warn("Firebase indisponível.", erro);

            produtos = catalogoInicial.map((item, indice) =>
                produtoValido(item, `local-${indice}`)
            );

            renderizar();

        }

    );

}
busca.addEventListener("input", renderizar);
// ===== Banner Rotativo =====

document.addEventListener("DOMContentLoaded", () => {

    const slides = document.querySelectorAll(".banner-slider .slide");

    console.log("Banner iniciado", slides.length);

    let slideAtual = 0;

    if (slides.length > 1) {

        setInterval(() => {

            slides[slideAtual].classList.remove("active");

            slideAtual = (slideAtual + 1) % slides.length;

            slides[slideAtual].classList.add("active");

        }, 4000);

    }

});
async function iniciar() {

    await carregarCategorias();

    carregarCatalogo();

}

iniciar();