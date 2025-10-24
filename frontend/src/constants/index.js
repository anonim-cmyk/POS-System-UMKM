import ayamBakar from "../assets/images/ayam bakar.png";
import ayamGejrot from "../assets/images/ayam gejrot.png";
import ayamGoreng from "../assets/images/ayam goreng.png";
import esJeruk from "../assets/images/es jeruk.png";
import ikanGurameGoreng from "../assets/images/ikan gurameh goreng.png";
import ikanBawalBakar from "../assets/images/ikanBawalBakar.jpeg";
import ikanBawalGoreng from "../assets/images/ikanBawalGoreng.jpg";
import ikanGurameBakar from "../assets/images/ikanGuramehBakar.jpeg";
import ikanMujaerBakar from "../assets/images/ikanMujaerBakar.jpeg";
import ikanMujaerGoreng from "../assets/images/ikanMujairGoreng.png";
import nasiPutih from "../assets/images/NASI PUTIH.png";
import pepesAyam from "../assets/images/pepes ayam.jpg";
import pepesIkanJambal from "../assets/images/pepes ikan jambal.jpg";
import pepesIkanKembung from "../assets/images/pepes ikan kembung.jpg";
import pepesIkanMas from "../assets/images/pepes ikan mas.jpg";
import pepesIkanPeda from "../assets/images/pepes ikan peda.jpg";
import pepesIkanTeri from "../assets/images/pepes ikan teri.jpg";
import pepesJamurTahu from "../assets/images/pepes jamur tahu.webp";
import pepesOncom from "../assets/images/pepes oncom.jpg";
import pepesTahu from "../assets/images/pepes tahu.jpg";
import esTeh from "../assets/images/Resep Es Teh.png";
import sayurAsem from "../assets/images/sayurAsem.jpg";
import sayurSopDaging from "../assets/images/sayurSopDaging.jpg";
import tehPanas from "../assets/images/tehPanas.jpg";

const tables = [
  { id: 1, name: "Table 1", status: "Booked", initial: "AM", seats: 4 },
  { id: 2, name: "Table 2", status: "Available", initial: "MB", seats: 6 },
  { id: 3, name: "Table 3", status: "Booked", initial: "JS", seats: 2 },
  { id: 4, name: "Table 4", status: "Available", initial: "HR", seats: 4 },
  { id: 5, name: "Table 5", status: "Booked", initial: "PL", seats: 3 },
  { id: 6, name: "Table 6", status: "Available", initial: "RT", seats: 4 },
  { id: 7, name: "Table 7", status: "Booked", initial: "LC", seats: 5 },
  { id: 8, name: "Table 8", status: "Available", initial: "DP", seats: 5 },
  { id: 9, name: "Table 9", status: "Booked", initial: "NK", seats: 6 },
  { id: 10, name: "Table 10", status: "Available", initial: "SB", seats: 6 },
  { id: 11, name: "Table 11", status: "Booked", initial: "GT", seats: 4 },
  { id: 12, name: "Table 12", status: "Available", initial: "JS", seats: 6 },
  { id: 13, name: "Table 13", status: "Booked", initial: "EK", seats: 2 },
  { id: 14, name: "Table 14", status: "Available", initial: "QN", seats: 6 },
  { id: 15, name: "Table 15", status: "Booked", initial: "TW", seats: 3 },
];

export const pepesItems = [
  {
    id: 1,
    name: "Pepes Ayam",
    price: 16000,
    // category: "Vegetarian",
  },
  {
    id: 2,
    name: "Pepes Ikan Mas",
    price: 16000,
    // category: "Non-Vegetarian",
  },
  {
    id: 3,
    name: "Pepes Ikan Kembung",
    price: 16000,
    // category: "Non-Vegetarian",
  },
  {
    id: 4,
    name: "Pepes Ikan Peda",
    price: 11000,
    // category: "Vegetarian",
  },
  {
    id: 5,
    name: "Pepes Ikan Jambal",
    price: 11000,
    // category: "Vegetarian",
  },
  {
    id: 6,
    name: "Pepes Ikan Teri",
    price: 6000,
    // category: "Vegetarian",
  },
  {
    id: 7,
    name: "Pepes Tahu",
    price: 6000,
    // category: "Vegetarian",
  },
  {
    id: 8,
    name: "Pepes Jamur Tahu",
    price: 6000,
    // category: "Vegetarian",
  },
  {
    id: 9,
    name: "Pepes Oncom",
    price: 6000,
    category: "Vegetarian",
  },
];

export const ayam = [
  {
    id: 1,
    name: "Ayam Bakar",
    price: 16000,
    category: "Non-Vegetarian",
  },
  {
    id: 2,
    name: "Ayam Goreng",
    price: 16000,
    category: "Vegetarian",
  },
  {
    id: 3,
    name: "Ayam Gejrot",
    price: 16000,
    category: "Non-Vegetarian",
  },
];

export const ikan = [
  {
    id: 1,
    name: "Ikan Mujaer Goreng",
    price: 16000,
    category: "Hot",
  },
  {
    id: 2,
    name: "Ikan Mujaer Bakar",
    price: 16000,
    category: "Cold",
  },
  {
    id: 3,
    name: "Ikan Bawal Goreng",
    price: 16000,
    category: "Cold",
  },
  {
    id: 4,
    name: "Ikan Bawal Bakar",
    price: 16000,
    category: "Cold",
  },
  {
    id: 5,
    name: "Ikan Gurame Goreng",
    price: 45000,
    category: "Cold",
  },
  {
    id: 6,
    name: "Ikan Gurame Bakar",
    price: 45000,
    category: "Cold",
  },
];

export const sayur = [
  {
    id: 1,
    name: "Sayur Asem",
    price: 6000,
    category: "Vegetarian",
  },
  {
    id: 2,
    name: "Sayur Sop Daging",
    price: 25000,
    category: "Vegetarian",
  },
];

export const nasi = [
  {
    id: 1,
    name: "Nasi 1 Porsi",
    price: 6000,
    category: "Vegetarian",
  },
  {
    id: 2,
    name: "Nasi 1/2 Porsi",
    price: 3000,
    category: "Vegetarian",
  },
];

export const minuman = [
  {
    id: 1,
    name: "Es Jeruk",
    price: 8000,
    category: "",
  },
  {
    id: 2,
    name: "Teh Manis Panas",
    price: 5000,
    category: "",
  },
  {
    id: 3,
    name: "Es Teh Manis",
    price: 5000,
    category: "",
  },
  {
    id: 4,
    name: "Es Teh Tawar",
    price: 3000,
    category: "",
  },
];

export const menus = [
  {
    id: 1,
    name: "Pepes",
    bgColor: "#b73e3e",
    icon: "🍲",
    items: pepesItems,
  },
  {
    id: 2,
    name: "Ayam",
    bgColor: "#5b45b0",
    icon: "🍗",
    items: ayam,
  },
  {
    id: 3,
    name: "Ikan",
    bgColor: "#7f167f",
    icon: "🐟",
    items: ikan,
  },
  { id: 4, name: "Sayur", bgColor: "#735f32", icon: "🥒", items: sayur },
  { id: 5, name: "Nasi", bgColor: "#1d2569", icon: "🍙", items: nasi },
  { id: 6, name: "Minuman", bgColor: "#285430", icon: "🥂", items: minuman },
];

export const metricsData = [
  {
    title: "Revenue",
    value: "₹50,846.90",
    percentage: "12%",
    color: "#025cca",
    isIncrease: false,
  },
  {
    title: "Outbound Clicks",
    value: "10,342",
    percentage: "16%",
    color: "#02ca3a",
    isIncrease: true,
  },
  {
    title: "Total Customer",
    value: "19,720",
    percentage: "10%",
    color: "#f6b100",
    isIncrease: true,
  },
  {
    title: "Event Count",
    value: "20,000",
    percentage: "10%",
    color: "#be3e3f",
    isIncrease: false,
  },
];

export const itemsData = [
  {
    title: "Total Categories",
    value: "8",
    percentage: "12%",
    color: "#5b45b0",
    isIncrease: false,
  },
  {
    title: "Total Dishes",
    value: "50",
    percentage: "12%",
    color: "#285430",
    isIncrease: true,
  },
  {
    title: "Active Orders",
    value: "12",
    percentage: "12%",
    color: "#735f32",
    isIncrease: true,
  },
  { title: "Total Tables", value: "10", color: "#7f167f" },
];

export const orders = [
  {
    id: "101",
    customer: "Amrit Raj",
    status: "Ready",
    dateTime: "January 18, 2025 08:32 PM",
    items: 8,
    tableNo: 3,
    total: 250.0,
  },
  {
    id: "102",
    customer: "John Doe",
    status: "In Progress",
    dateTime: "January 18, 2025 08:45 PM",
    items: 5,
    tableNo: 4,
    total: 180.0,
  },
  {
    id: "103",
    customer: "Emma Smith",
    status: "Ready",
    dateTime: "January 18, 2025 09:00 PM",
    items: 3,
    tableNo: 5,
    total: 120.0,
  },
  {
    id: "104",
    customer: "Chris Brown",
    status: "In Progress",
    dateTime: "January 18, 2025 09:15 PM",
    items: 6,
    tableNo: 6,
    total: 220.0,
  },
];

export const popularDishes = [
  {
    id: 1,
    image: ayamBakar,
    name: "Ayam Bakar",
    numberOfOrders: 250,
  },
  {
    id: 2,
    image: ayamGejrot,
    name: "Ayam Gejrot",
    numberOfOrders: 250,
  },
  {
    id: 3,
    image: ayamGoreng,
    name: "Ayam Goreng",
    numberOfOrders: 250,
  },
  {
    id: 4,
    image: esJeruk,
    name: "Es Jeruk",
    numberOfOrders: 250,
  },
  {
    id: 5,
    image: ikanGurameGoreng,
    name: "Ikan Gurameh Goreng",
    numberOfOrders: 250,
  },
  {
    id: 6,
    image: ikanBawalBakar,
    name: "Ikan Bawal Bakar",
    numberOfOrders: 250,
  },
  {
    id: 7,
    image: ikanBawalGoreng,
    name: "Ikan Bawal Goreng",
    numberOfOrders: 250,
  },
  {
    id: 8,
    image: ikanGurameBakar,
    name: "Ikan Gurame Bakar",
    numberOfOrders: 250,
  },
  {
    id: 9,
    image: ikanMujaerBakar,
    name: "Ikan Mujaer Bakar",
    numberOfOrders: 250,
  },
  {
    id: 10,
    image: ikanMujaerGoreng,
    name: "Ikan Mujaer Goreng",
    numberOfOrders: 250,
  },
  {
    id: 11,
    image: nasiPutih,
    name: "Nasi Putih",
    numberOfOrders: 250,
  },
  {
    id: 12,
    image: pepesAyam,
    name: "Pepes Ayam",
    numberOfOrders: 250,
  },
  {
    id: 13,
    image: pepesIkanJambal,
    name: "Pepes Ikan Jambal",
    numberOfOrders: 250,
  },
  {
    id: 14,
    image: pepesIkanKembung,
    name: "Pepes Ikan Kembung",
    numberOfOrders: 250,
  },
  {
    id: 15,
    image: pepesIkanMas,
    name: "Pepes Ikan Mas",
    numberOfOrders: 250,
  },
  {
    id: 16,
    image: pepesIkanPeda,
    name: "Pepes Ikan Peda",
    numberOfOrders: 250,
  },
  {
    id: 17,
    image: pepesIkanTeri,
    name: "Pepes Ikan Teri",
    numberOfOrders: 250,
  },
  {
    id: 18,
    image: pepesJamurTahu,
    name: "Pepes Jamur Tahu",
    numberOfOrders: 250,
  },
  {
    id: 19,
    image: pepesOncom,
    name: "Pepes Oncom",
    numberOfOrders: 250,
  },
  {
    id: 20,
    image: pepesTahu,
    name: "Pepes Tahu",
    numberOfOrders: 250,
  },
  {
    id: 21,
    image: esTeh,
    name: "Pepes Ikan Mas",
    numberOfOrders: 250,
  },
  {
    id: 22,
    image: sayurAsem,
    name: "Pepes Ikan Mas",
    numberOfOrders: 250,
  },
  {
    id: 23,
    image: sayurSopDaging,
    name: "Sayur Sop Daging",
    numberOfOrders: 250,
  },
  {
    id: 24,
    image: tehPanas,
    name: "Teh Panas",
    numberOfOrders: 250,
  },
];

export { tables };
