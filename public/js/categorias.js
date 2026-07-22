async function carregarCategorias() {
    try {
        const response = await fetch('/data/categorias.json');
        const data = await response.json();

        const container = document.getElementById('categorias');

        if (!container) return;

        container.innerHTML = '';

        data.categorias.forEach(categoria => {
            const botao = document.createElement('button');

            botao.className = 'categoria-btn';
            botao.textContent = categoria.nome;

            botao.onclick = () => {
                console.log('Categoria:', categoria.id);
            };

            container.appendChild(botao);
        });

    } catch (erro) {
        console.error('Erro ao carregar categorias:', erro);
    }
}

document.addEventListener('DOMContentLoaded', carregarCategorias);