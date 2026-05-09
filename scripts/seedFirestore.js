import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  {
    name: 'Hyper Focus',
    description: 'Foco absoluto sem distrações. A energia que abastece o seu setup. Desenvolvido com precisão técnica para máxima performance.',
    price: 24.90,
    profile: 'Concentração Extrema',
    image_url: '/assets/hyper_focus.png',
    tag: 'Novo Drop'
  },
  {
    name: 'Pixel Power',
    description: 'A vantagem competitiva para o grind diário. Design cyberpunk, reflexos aprimorados e zero crash. O verdadeiro nectar dos deuses cibernéticos.',
    price: 22.90,
    profile: 'Gamer / Reflexos',
    image_url: '/assets/pixel_power.png',
    tag: 'Mais Vendido'
  },
  {
    name: 'Berserker Blood',
    description: 'Puro torque. Para aqueles treinos que exigem força bruta. Composto agressivo com vasodilatadores e estimulantes táticos.',
    price: 29.90,
    profile: 'Pré-Treino / Força',
    image_url: '/assets/berserker_blood.png',
    tag: 'Elite'
  },
  {
    name: 'Vórtex Cítrico',
    description: 'Explosão cítrica sem taquicardia. Foco puro e sustentável para longas sessões. Taste puro, precisão industrial na formulação.',
    price: 19.90,
    profile: 'Explosão Cítrica',
    image_url: '/assets/vortex_citrico.png',
    tag: 'Classic'
  },
  {
    name: 'Zero Crash',
    description: 'O doce da vitória, sem o crash da cafeína. Formulação avançada zero açúcar. Visão de cria para o grind diário.',
    price: 21.90,
    profile: 'Doce / Zero Açúcar',
    image_url: '/assets/zero_crash.png',
    tag: 'Classic'
  }
];

async function seed() {
  console.log('🚀 Iniciando popularização do Firestore...');
  
  for (const product of products) {
    try {
      const q = query(collection(db, 'products'), where('name', '==', product.name));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await addDoc(collection(db, 'products'), product);
        console.log(`✅ Produto adicionado: ${product.name}`);
      } else {
        console.log(`ℹ️ Produto já existe: ${product.name}`);
      }
    } catch (e) {
      console.error(`❌ Erro ao adicionar ${product.name}:`, e);
    }
  }
  
  console.log('✨ Processo concluído!');
  process.exit(0);
}

seed();
