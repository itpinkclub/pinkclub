export const CATEGORIAS = ["infantil", "ballet", "mochilas", "bolsas", "casa"];

export const catalogoInicial = [
  { nome: "Bota Menina", categoria: "infantil", destaque: true, preco: 0, imagem: "/assets/products/bota menina.png", link: "https://s.shopee.com.br/60Q3R0SVlX" },
  { nome: "Mochila Rosa", categoria: "mochilas", destaque: true, preco: 0, imagem: "/assets/products/mochila.png", link: "https://s.shopee.com.br/6VMK2KY6kM" },
  { nome: "Bolsa Feminina", categoria: "bolsas", destaque: true, preco: 0, imagem: "/assets/products/bolsas.png", link: "https://s.shopee.com.br/4VbFi2ixJv" },
  { nome: "Kit Ballet", categoria: "ballet", destaque: false, preco: 0, imagem: "/assets/products/kit ballet.png", link: "https://s.shopee.com.br/2qT1jDeqFX" },
  { nome: "Lençol Barbie", categoria: "casa", destaque: false, preco: 0, imagem: "/assets/products/lençol barbie solteiro.png", link: "https://s.shopee.com.br/9fJLljh2yO" },
  { nome: "Pantufa Infantil", categoria: "infantil", destaque: false, preco: 0, imagem: "/assets/products/pantufa infantil.png", link: "https://s.shopee.com.br/903ezhg9yQ" },
  { nome: "Vestido Infantil", categoria: "infantil", destaque: true, preco: 0, imagem: "/assets/products/vestido.png", link: "https://s.shopee.com.br/18qGpnIt1" }
];

const aliases = Object.freeze({
  "moda infantil": "infantil",
  infantil: "infantil",
  ballet: "ballet",
  mochilas: "mochilas",
  mochila: "mochilas",
  bolsas: "bolsas",
  bolsa: "bolsas",
  casa: "casa"
});

export function normalizarCategoria(valor) {
  const categoria = String(valor || "").trim().toLocaleLowerCase("pt-BR");
  const categoriaNormalizada = aliases[categoria];
  return CATEGORIAS.includes(categoriaNormalizada) ? categoriaNormalizada : "outros";
}

export function tituloCategoria(categoria) {
  return categoria === "infantil" ? "Moda Infantil" : categoria.charAt(0).toUpperCase() + categoria.slice(1);
}
