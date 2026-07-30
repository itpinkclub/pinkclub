import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = (seletor) => document.querySelector(seletor);
const containerProdutos = $("#produtos-container");
const containerFiltros = $("#filtros-categorias");
const inputBusca = $("#busca-produto");
const bannerSlider = $("#bannerSlider") || $(".banner-slider");

let produtosCache = [];
let categoriaAtiva = "todos";
let termoBusca = "";

function carregarFiltrosCategorias() {
    if (!containerFiltros) return;

    const categorias = [
        { id: "todos", nome: "✨ Todos" },
        { id: "skincare", nome: "🌸 Skincare" },
        { id: "cabelo", nome: "💆‍♀️ Cabelos" },
        { id: "moda", nome: "👗 Moda" },
        { id: "casa", nome: "🏠 Casa & Decoração" },
        { id: "pets", nome: "🐾 Pets" },
        { id: "infantil", nome: "🧸 Infantil" },
        { id: "fitness", nome: "🧘‍♀️ Fitness" },
        { id: "outros", nome: "✨ Outros" }
    ];

    let html = "";
    categorias.forEach(cat => {
        const ativo = categoriaAtiva === cat.id ? 'ativo' : '';
        html += `<button class="filtro-btn ${ativo}" data-categoria="${cat.id}">${cat.nome}</button>`;
    });

    containerFiltros.innerHTML = html;

    containerFiltros.querySelectorAll("button").forEach(botao => {
        botao.addEventListener("click", () => {
            containerFiltros.querySelectorAll("button").forEach(b => b.classList.remove("ativo"));
            botao.classList.add("ativo");
            categoriaAtiva = botao.dataset.categoria;
            renderizarProdutos();
        });
    });
}

async function carregarBanners() {
    if (!bannerSlider) return;
    try {
        const snapshot = await getDocs(collection(db, "banners"));
        if (!snapshot.empty) {
            let bannersHtml = "";
            snapshot.docs.forEach((doc, index) => {
                const b = doc.data();
                const ativoClass = index === 0 ? "active slide" : "slide";
                bannersHtml += `<img src="${b.imagem || b.url}" class="${ativoClass}" alt="Banner">`;
            });
            bannerSlider.innerHTML = bannersHtml;
            
            // Ativa o carrosel se houver mais de um banner
            const slides = bannerSlider.querySelectorAll(".slide");
            if (slides.length > 1) {
                let atual = 0;
                setInterval(() => {
                    slides[atual].classList.remove("active");
                    atual = (atual + 1) % slides.length;
                    slides[atual].classList.add("active");
                }, 4000);
            }
        } else {
            bannerSlider.innerHTML = `<img src="https://placehold.co/1200x400/fff0f7/ff3f9b?text=It+Pink+Club" class="slide active" alt="Banner Default">`;
        }
    } catch (e) {
        console.log("Erro ao carregar banners (usando padrão):", e);
        bannerSlider.innerHTML = `<img src="https://placehold.co/1200x400/fff0f7/ff3f9b?text=It+Pink+Club" class="slide active" alt="Banner Default">`;
    }
}

async function carregarProdutos() {
    if (!containerProdutos) return;

    containerProdutos.innerHTML = `<p class="vazio">Carregando achadinhos...</p>`;

    try {
        const q = query(collection(db, "produtos"), orderBy("updatedAt", "desc"));
        const snapshot = await getDocs(q);

        produtosCache = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        renderizarProdutos();
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
        containerProdutos.innerHTML = `<p class="vazio">Não foi possível carregar os produtos no momento.</p>`;
    }
}

function renderizarProdutos() {
    if (!containerProdutos) return;

    const filtrados = produtosCache.filter(produto => {
        if (produto.ativo === false) return false;

        const catProduto = (produto.categoria || "").toLowerCase().trim();
        const matchCategoria = categoriaAtiva === "todos" || catProduto === categoriaAtiva;

        const nomeProduto = (produto.nome || "").toLowerCase();
        const matchBusca = nomeProduto.includes(termoBusca.toLowerCase());

        return matchCategoria && matchBusca;
    });

    if (filtrados.length === 0) {
        containerProdutos.innerHTML = `<p class="vazio">Nenhum produto encontrado.</p>`;
        return;
    }

    containerProdutos.innerHTML = filtrados.map(produto => `
        <article class="card-produto">
            <div class="card-imagem">
                <img src="${produto.imagem || 'https://placehold.co/300x300/fff0f7/ff3f9b?text=Pink'}" alt="${produto.nome || 'Produto'}">
                ${produto.destaque ? '<span class="badge-destaque">Destaque</span>' : ''}
            </div>
            <div class="card-conteudo">
                <span class="card-cat">${produto.categoria || 'Geral'}</span>
                <h3>${produto.nome || 'Produto'}</h3>
                <strong>${produto.preco ? 'R$ ' + produto.preco : ''}</strong>
                <a href="${produto.link || '#'}" target="_blank" rel="noopener noreferrer" class="btn-comprar">
                    Ver na Shopee 🛍️
                </a>
            </div>
        </article>
    `).join("");
}

if (inputBusca) {
    inputBusca.addEventListener("input", (e) => {
        termoBusca = e.target.value.trim();
        renderizarProdutos();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    carregarFiltrosCategorias();
    carregarBanners();
    carregarProdutos();
});