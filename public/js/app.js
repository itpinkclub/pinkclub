import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuração do Firebase do It Pink Club
const firebaseConfig = {
    apiKey: "AIzaSyDummyKeyForItPinkClub",
    authDomain: "itpinkclub.firebaseapp.com",
    projectId: "itpinkclub",
    storageBucket: "itpinkclub.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123:web:abc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Estado global para filtros combinados (Busca + Categoria)
let termoBusca = "";
let categoriaAtiva = "todos";

document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
    configurarBusca();
    configurarFiltroCategorias();
});

async function carregarProdutos() {
    const container = document.getElementById("produtos-container");
    if (!container) return;

    try {
        const q = query(collection(db, "produtos"), orderBy("criadoEm", "desc"));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            renderizarFallbackProdutos(container);
            return;
        }

        let html = "";
        snapshot.forEach((doc) => {
            const p = doc.data();
            
            // Badge de Destaque Criativo em tom Pink chamativo
            const badgeDestaque = p.destaque 
                ? `<span style="position: absolute; top: 12px; left: 12px; background: #FF007F; color: white; padding: 4px 12px; font-size: 0.75rem; font-weight: 700; border-radius: 9999px; z-index: 10; box-shadow: 0 4px 10px rgba(255,0,127,0.3); text-transform: uppercase; letter-spacing: 0.5px;">✨ Você Merece Ter</span>` 
                : '';

            html += `
                <div class="produto-card" data-categoria="${(p.categoria || 'achadinho').toLowerCase()}">
                    ${badgeDestaque}
                    <div class="produto-img-container">
                        <img src="${p.imagem || p.url}" alt="${p.titulo || 'Produto'}" loading="lazy">
                    </div>
                    <div class="produto-conteudo">
                        <span class="produto-categoria-tag">${p.categoria || 'Achadinho'}</span>
                        <h3 class="produto-titulo">${p.titulo || 'Produto It Pink'}</h3>
                        <a href="${p.link || '#'}" target="_blank" rel="noopener noreferrer" class="btn-acao">Ver Achadinho 💖</a>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (error) {
        console.error("Erro ao carregar do Firebase, exibindo fallback:", error);
        renderizarFallbackProdutos(container);
    }
}

function renderizarFallbackProdutos(container) {
    container.innerHTML = `
        <div class="produto-card" data-categoria="beleza">
            <span style="position: absolute; top: 12px; left: 12px; background: #FF007F; color: white; padding: 4px 12px; font-size: 0.75rem; font-weight: 700; border-radius: 9999px; z-index: 10; box-shadow: 0 4px 10px rgba(255,0,127,0.3); text-transform: uppercase; letter-spacing: 0.5px;">✨ Você Merece Ter</span>
            <div class="produto-img-container">
                <img src="/assets/banner1.webp" alt="Exemplo Achadinho">
            </div>
            <div class="produto-conteudo">
                <span class="produto-categoria-tag">Beleza</span>
                <h3 class="produto-titulo">Kit Skincare Rosa Self-Care Completo</h3>
                <a href="#" class="btn-acao">Ver Achadinho 💖</a>
            </div>
        </div>
        <div class="produto-card" data-categoria="beleza">
            <span style="position: absolute; top: 12px; left: 12px; background: #FF007F; color: white; padding: 4px 12px; font-size: 0.75rem; font-weight: 700; border-radius: 9999px; z-index: 10; box-shadow: 0 4px 10px rgba(255,0,127,0.3); text-transform: uppercase; letter-spacing: 0.5px;">🔥 Queridinho Delas</span>
            <div class="produto-img-container">
                <img src="/assets/banner2.webp" alt="Exemplo Achadinho">
            </div>
            <div class="produto-conteudo">
                <span class="produto-categoria-tag">Beleza</span>
                <h3 class="produto-titulo">Paleta de Sombras Glow Pink Luxury</h3>
                <a href="#" class="btn-acao">Ver Achadinho 💖</a>
            </div>
        </div>
    `;
}

function configurarBusca() {
    // Atualizado para o ID 'pesquisa' que está no seu arquivo HTML
    const inputBusca = document.getElementById("pesquisa");
    if (!inputBusca) return;

    inputBusca.addEventListener("input", (e) => {
        termoBusca = e.target.value.toLowerCase();
        aplicarFiltros();
    });
}

function configurarFiltroCategorias() {
    const botoes = document.querySelectorAll("#categorias .categoria");
    
    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            // Remove a classe ativa de todos e adiciona no clicado
            botoes.forEach(btn => btn.classList.remove("ativa"));
            botao.classList.add("ativa");
            
            // Extrai o nome da categoria com base no texto do botão (ex: "Beleza", "Casa")
            const textoBotao = botao.textContent.trim().toLowerCase();
            categoriaAtiva = textoBotao.includes("todos") ? "todos" : textoBotao;
            
            aplicarFiltros();
        });
    });
}

function aplicarFiltros() {
    const cards = document.querySelectorAll(".produto-card");
    
    cards.forEach(card => {
        const titulo = card.querySelector(".produto-titulo").textContent.toLowerCase();
        const categoriaCard = card.getAttribute("data-categoria") || "";
        
        // Verifica se atende ao termo digitado
        const bateBusca = titulo.includes(termoBusca) || categoriaCard.includes(termoBusca);
        // Verifica se atende à categoria selecionada
        const bateCategoria = (categoriaAtiva === "todos" || categoriaCard.includes(categoriaAtiva));
        
        if (bateBusca && bateCategoria) {
            card.style.display = "flex"; // Mantém a estrutura flex do card
        } else {
            card.style.display = "none";
        }
    });
}