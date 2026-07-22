export const CATEGORIAS = [
  "tendencias",
  "casa",
  "cozinha",
  "beleza",
  "skincare",
  "cabelo",
  "infantil",
  "modafem",
  "modamasc",
  "fitness",
  "eletronicos",
  "gamer",
  "pets",
  "papelaria",
  "automotivo"
];

export const catalogoInicial = [
  {
    nome: "Produto Exemplo",
    categoria: "tendencias",
    destaque: true,
    preco: 0,
    imagem: "",
    link: "#"
  }
];

const aliases = Object.freeze({

  // Tendências
  tendencias: "tendencias",
  tendência: "tendencias",
  tendencias: "tendencias",
  viral: "tendencias",
  novidades: "tendencias",

  // Casa
  casa: "casa",
  decoração: "casa",
  decoracao: "casa",
  organização: "casa",
  organizacao: "casa",
  jardim: "casa",

  // Cozinha
  cozinha: "cozinha",
  utensilios: "cozinha",
  utensílios: "cozinha",
  panelas: "cozinha",
  pratos: "cozinha",

  // Beleza
  beleza: "beleza",
  maquiagem: "beleza",
  perfume: "beleza",
  perfumes: "beleza",
  unhas: "beleza",

  // Skincare
  skincare: "skincare",
  sérum: "skincare",
  serum: "skincare",
  hidratante: "skincare",
  protetor: "skincare",

  // Cabelo
  cabelo: "cabelo",
  cabelos: "cabelo",
  shampoo: "cabelo",
  condicionador: "cabelo",
  chapinha: "cabelo",

  // Infantil
  infantil: "infantil",
  bebê: "infantil",
  bebe: "infantil",
  brinquedos: "infantil",
  brinquedo: "infantil",

  // Moda Feminina
  modafem: "modafem",
  feminina: "modafem",
  mulher: "modafem",
  vestido: "modafem",
  vestidos: "modafem",
  bolsa: "modafem",
  bolsas: "modafem",

  // Moda Masculina
  modamasc: "modamasc",
  masculino: "modamasc",
  homem: "modamasc",
  camiseta: "modamasc",

  // Fitness
  fitness: "fitness",
  academia: "fitness",
  yoga: "fitness",
  pilates: "fitness",

  // Eletrônicos
  eletronicos: "eletronicos",
  eletrônicos: "eletronicos",
  celular: "eletronicos",
  smartwatch: "eletronicos",
  fone: "eletronicos",
  fones: "eletronicos",

  // Gamer
  gamer: "gamer",
  rgb: "gamer",
  headset: "gamer",
  teclado: "gamer",
  mouse: "gamer",

  // Pets
  pet: "pets",
  pets: "pets",
  cachorro: "pets",
  cachorros: "pets",
  gato: "pets",
  gatos: "pets",

  // Papelaria
  papelaria: "papelaria",
  planner: "papelaria",
  caderno: "papelaria",
  cadernos: "papelaria",

  // Automotivo
  automotivo: "automotivo",
  carro: "automotivo",
  carros: "automotivo"

});

export function normalizarCategoria(valor) {

  const categoria = String(valor || "")
    .trim()
    .toLocaleLowerCase("pt-BR");

  return aliases[categoria] || categoria;

}

export function tituloCategoria(categoria) {

  const item = {
    tendencias: "Tendências",
    casa: "Casa & Decoração",
    cozinha: "Cozinha",
    beleza: "Beleza",
    skincare: "Skincare Coreano",
    cabelo: "Cabelos",
    infantil: "Infantil",
    modafem: "Moda Feminina",
    modamasc: "Moda Masculina",
    fitness: "Fitness",
    eletronicos: "Eletrônicos",
    gamer: "Gamer",
    pets: "Pets",
    papelaria: "Papelaria",
    automotivo: "Automotivo"
  };

  return item[categoria] || categoria;

}