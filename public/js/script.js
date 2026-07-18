import { db } from "./firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { catalogoInicial, normalizarCategoria, tituloCategoria } from "./catalogo.js";

const container = document.querySelector("#produtos");
const resultado = document.querySelector("#resultado");
const vitrine = document.querySelector(".vitrine");
const busca = document.querySelector("#pesquisa");
const botoes = [...document.querySelectorAll("[data-categoria]")];
let produtos = [];
let categoriaAtiva = "todos";

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
  resultado.textContent = lista.length ? `${lista.length} ${lista.length === 1 ? "achadinho encontrado" : "achadinhos encontrados"}.` : "Nenhum achadinho encontrado com esses filtros.";
  container.replaceChildren();
  if (!lista.length) return;
  const fragmento = document.createDocumentFragment();
  lista.forEach((produto) => {
    const card = document.createElement("article");
    card.className = "produto-card";
    const imagem = produto.imagem || "https://placehold.co/600x600/fff0f7/ff3f9b?text=It+Pink+Club";
    card.innerHTML = `${produto.destaque ? '<span class="selo">Destaque</span>' : ""}<img class="imagem-produto" src="${escapar(imagem)}" alt="${escapar(produto.nome)}" loading="lazy"><div class="produto-conteudo"><p class="categoria-produto">${escapar(tituloCategoria(produto.categoria))}</p><h2>${escapar(produto.nome)}</h2>${produto.preco > 0 ? `<strong>${moeda.format(produto.preco)}</strong>` : '<strong class="preco-consultar">Confira o preço</strong>'}<a href="${escapar(linkSeguro(produto.link))}" target="_blank" rel="noopener noreferrer" class="comprar">Ver achadinho <span aria-hidden="true">→</span></a></div>`;
    card.querySelector("img").addEventListener("error", (evento) => { evento.currentTarget.src = "https://placehold.co/600x600/fff0f7/ff3f9b?text=Imagem+indisponivel"; }, { once: true });
    fragmento.append(card);
  });
  container.append(fragmento);
}
function carregarCatalogo() {
  const produtosRef = collection(db, "produtos");
  onSnapshot(produtosRef, (snapshot) => { produtos = snapshot.docs.map((item) => produtoValido(item.data(), item.id)); renderizar(); }, (erro) => { console.warn("Não foi possível carregar a vitrine do Firebase.", erro); produtos = catalogoInicial.map((item, indice) => produtoValido(item, `local-${indice}`)); renderizar(); });
}
busca.addEventListener("input", renderizar);
botoes.forEach((botao) => botao.addEventListener("click", () => { categoriaAtiva = botao.dataset.categoria; botoes.forEach((item) => { const ativa = item === botao; item.classList.toggle("ativa", ativa); item.setAttribute("aria-pressed", String(ativa)); }); renderizar(); }));
carregarCatalogo();
