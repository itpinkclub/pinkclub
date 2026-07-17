// ===============================
// IT PINK CLUB - SCRIPT
// ===============================

const container = document.getElementById("produtos");
const pesquisa = document.getElementById("pesquisa");
const botoesCategoria = document.querySelectorAll(".categoria");

let categoriaAtual = "Todos";

// ===============================
// MOSTRAR PRODUTOS
// ===============================

function mostrarProdutos() {

    console.log("Produtos carregados:", produtos);

    container.innerHTML = "";

    const texto = pesquisa.value.toLowerCase();

    const filtrados = produtos.filter(produto => {

        const pesquisaOk =
            produto.nome.toLowerCase().includes(texto);

        const categoriaOk =
            categoriaAtual === "Todos" ||
            produto.categoria === categoriaAtual;

        return pesquisaOk && categoriaOk;

    });

    console.log("Produtos filtrados:", filtrados);

    if (filtrados.length === 0) {

        container.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:80px;">
                <h2 style="color:#ff4fa1;">💔 Nenhum produto encontrado</h2>
                <p>Tente outra pesquisa ou categoria.</p>
            </div>
        `;

        return;
    }

    filtrados.forEach((produto, index) => {

        const card = document.createElement("a");

        card.href = produto.link;
        card.target = "_blank";
        card.className = "card";

        card.style.opacity = "0";
        card.style.animation = "fadeUp .5s ease forwards";
        card.style.animationDelay = `${index * 0.08}s`;

        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">

            <div class="card-info">

                <span class="selo">💖 Escolha do Clube</span>

                <h2>${produto.nome}</h2>

                <p class="categoria-produto">
                    ${produto.categoria}
                </p>

                <span class="botao">
                    💖 Quero esse
                </span>

            </div>
        `;

        container.appendChild(card);

    });

}

// ===============================
// PESQUISA
// ===============================

pesquisa.addEventListener("input", mostrarProdutos);

// ===============================
// CATEGORIAS
// ===============================

botoesCategoria.forEach(botao => {

    botao.addEventListener("click", () => {

        botoesCategoria.forEach(btn =>
            btn.classList.remove("ativa")
        );

        botao.classList.add("ativa");

        categoriaAtual = botao.dataset.categoria;

        mostrarProdutos();

    });

});

// ===============================
// CARROSSEL
// ===============================

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

let slideAtual = 0;

function trocarSlide() {

    slides[slideAtual].classList.remove("ativo");
    dots[slideAtual].classList.remove("ativo");

    slideAtual++;

    if (slideAtual >= slides.length) {
        slideAtual = 0;
    }

    slides[slideAtual].classList.add("ativo");
    dots[slideAtual].classList.add("ativo");

}

setInterval(trocarSlide, 5000);

// ===============================
// VOLTAR AO TOPO
// ===============================

const topo = document.getElementById("topo");

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {
        topo.style.display = "block";
    } else {
        topo.style.display = "none";
    }

});

topo.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

// ===============================
// INICIAR
// ===============================

mostrarProdutos();