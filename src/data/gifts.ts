import { GiftItem } from '../types';

export const PERSIMMON_GIFTS: GiftItem[] = [
  {
    id: 'persimmon-1',
    name: '달빛 머금은 탐스러운 단감',
    category: 'persimmon',
    icon: '🍊',
    rarity: '일반',
    points: 100,
    description: '가을 햇살과 달빛을 가득 머금어 아삭하고 달콤한 단감입니다.',
  },
  {
    id: 'persimmon-2',
    name: '말랑말랑 달콤 홍시',
    category: 'persimmon',
    icon: '🧡',
    rarity: '일반',
    points: 120,
    description: '입안 가득 부드럽게 퍼지는 전통 가을의 대표 꿀맛 홍시입니다.',
  },
  {
    id: 'persimmon-3',
    name: '상주 특산 명품 곶감 세트',
    category: 'persimmon',
    icon: '🏮',
    rarity: '희귀',
    points: 160,
    description: '하얀 분이 뽀얗게 앉은 임금님 진상품 쫀득한 상주 곶감입니다.',
  },
  {
    id: 'persimmon-4',
    name: '주홍빛 황금 대봉감',
    category: 'persimmon',
    icon: '✨',
    rarity: '희귀',
    points: 180,
    description: '크고 탐스러워 보기만 해도 풍요로워지는 주홍빛 대봉감입니다.',
  },
  {
    id: 'persimmon-5',
    name: '달나라 전설의 황금 감',
    category: 'persimmon',
    icon: '🌟',
    rarity: '전설',
    points: 250,
    description: '달토끼가 천 년에 한 번 수확한다는 신비로운 전설의 황금 감입니다!',
  },
];

export const BOX_GIFTS: GiftItem[] = [
  {
    id: 'box-1',
    name: '달빛 솔향 꿀송편 꾸러미',
    category: 'box',
    icon: '🥟',
    rarity: '일반',
    points: 110,
    description: '솔잎 향기가 솔솔 배어있는 깨와 꿀이 가득 찬 알록달록 송편입니다.',
  },
  {
    id: 'box-2',
    name: '바삭바삭 궁중 찹쌀 유과',
    category: 'box',
    icon: '🌾',
    rarity: '일반',
    points: 130,
    description: '입안에 넣자마자 눈처럼 사르르 녹아내리는 전통 쌀 튀밥 유과입니다.',
  },
  {
    id: 'box-3',
    name: '오색 전통 한과 & 약과 세트',
    category: 'box',
    icon: '🎁',
    rarity: '희귀',
    points: 160,
    description: '달콤한 조청과 고소한 참기름 향이 가득한 정성 가득 궁중 약과 세트입니다.',
  },
  {
    id: 'box-4',
    name: '비단 자수 오색 복주머니',
    category: 'box',
    icon: '🧧',
    rarity: '희귀',
    points: 180,
    description: '새해와 한가위 복을 가득 담아 소원을 이루어주는 고급 비단 복주머니입니다.',
  },
  {
    id: 'box-5',
    name: '명품 1++ 횡성 한우 갈비 세트',
    category: 'box',
    icon: '🥩',
    rarity: '전설',
    points: 260,
    description: '온 가족이 함께 즐기는 한가위 최고 인기 선물! 최고급 명품 한우 세트입니다.',
  },
  {
    id: 'box-6',
    name: '고려 6년근 수제 홍삼 절편',
    category: 'box',
    icon: '🍯',
    rarity: '희귀',
    points: 190,
    description: '원기를 회복하고 건강을 지켜주는 정성 담긴 6년근 홍삼절편 선물입니다.',
  },
];

export function getRandomGift(category: 'persimmon' | 'box'): GiftItem {
  const pool = category === 'persimmon' ? PERSIMMON_GIFTS : BOX_GIFTS;
  const rand = Math.random();
  // 60% normal, 30% rare, 10% legendary
  let filtered = pool;
  if (rand < 0.15) {
    filtered = pool.filter((g) => g.rarity === '전설');
  } else if (rand < 0.5) {
    filtered = pool.filter((g) => g.rarity === '희귀');
  } else {
    filtered = pool.filter((g) => g.rarity === '일반');
  }
  if (filtered.length === 0) filtered = pool;
  return filtered[Math.floor(Math.random() * filtered.length)];
}
