export const CATEGORIAS = [
  "skincare",
  "cabelo",
  "moda",
  "infantil",
  "fitness",
  "outros"
];

export const catalogoInicial = [
  {
    nome: "Produto Exemplo",
    categoria: "skincare",
    destaque: true,
    preco: 0,
    imagem: "",
    link: "#"
  }
];

const aliases = Object.freeze({
  // Skincare
  skincare: "skincare",
  sérum: "skincare",
  serum: "skincare",
  hidratante: "skincare",
  protetor: "skincare",
  beleza: "skincare",

  // Cabelo
  cabelo: "cabelo",
  cabelos: "cabelo",
  shampoo: "cabelo",
  condicionador: "cabelo",

  // Moda
  moda: "moda",
  modafem: "moda",
  modamasc: "moda",
  feminina: "moda",
  masculino: "moda",
  vestido: "moda",
  roupa: "moda",

  // Infantil
  infantil: "infantil",
  bebê: "infantil",
  bebe: "infantil",
  brinquedos: "infantil",

  // Fitness
  fitness: "fitness",
  academia: "fitness",
  yoga: "fitness",

  // Outros
  outros: "outros",
  casa: "outros",
  eletronicos: "outros"
});

export function normalizarCategoria(valor) {
  const categoria = String(valor || "")
    .trim()
    .toLocaleLowerCase("pt-BR");

  return aliases[categoria] || (CATEGORIAS.includes(categoria) ? categoria : "outros");
}

export function tituloCategoria(categoria) {
  const item = {
    skincare: "Skincare",
    cabelo: "Cabelos",
    moda: "Moda",
    infantil: "Infantil",
    fitness: "Fitness",
    outros: "Outros"
  };

  const normalizada = normalizarCategoria(categoria);
  return item[normalizada] || "Outros";
}