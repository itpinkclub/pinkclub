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

document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
    configurarBusca();
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
            html += `
                <div class="card-produto">
                    ${p.destaque ? '<span class="badge-destaque">Destaque</span>' : ''}
                    <div class="card-imagem">
                        <img src="${p.imagem || p.url}" alt="${p.titulo || 'Produto'}">
                    </div>
                    <div class="card-conteudo">
                        <p class="card-cat">${p.categoria || 'Achadinho'}</p>
                        <h3>${p.titulo || 'Produto It Pink'}</h3>
                        <a href="${p.link || '#'}" target="_blank" rel="noopener noreferrer" class="btn-comprar">Ver Achadinho 💖</a>
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
        <div class="card-produto">
            <span class="badge-destaque">Favorito</span>
            <div class="card-imagem">
                <img src="/assets/banner1.webp" alt="Exemplo Achadinho">
            </div>
            <div class="card-conteudo">
                <p class="card-cat">Boutique</p>
                <h3>Kit Skincare Rosa Self-Care</h3>
                <a href="#" class="btn-comprar">Ver Achadinho 💖</a>
            </div>
        </div>
        <div class="card-produto">
            <span class="badge-destaque">Tendência</span>
            <div class="card-imagem">
                <img src="/assets/banner2.webp" alt="Exemplo Achadinho">
            </div>
            <div class="card-conteudo">
                <p class="card-cat">Make</p>
                <h3>Paleta de Sombras Glow Pink</h3>
                <a href="#" class="btn-comprar">Ver Achadinho 💖</a>
            </div>
        </div>
    `;
}

function configurarBusca() {
    const inputBusca = document.getElementById("busca-produto");
    if (!inputBusca) return;

    inputBusca.addEventListener("input", (e) => {
        const termo = e.target.value.toLowerCase();
        const cards = document.querySelectorAll(".card-produto");
        cards.forEach(card => {
            const titulo = card.querySelector("h3").textContent.toLowerCase();
            const categoria = card.querySelector(".card-cat").textContent.toLowerCase();
            if (titulo.includes(termo) || categoria.includes(termo)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
}