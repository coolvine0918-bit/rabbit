import { ConstitutionalCase, QuizQuestion } from '../types';

export const CONSTITUTIONAL_CASES: ConstitutionalCase[] = [
  {
    id: 1,
    title: '스쿨존 속도 제한',
    story: '초등학교 앞 도로(스쿨존)에서 자동차 운전자는 반드시 시속 30km 이하로 천천히 달려야 한다.',
    restrictedRight: '행동의 자유',
    limitationReason: '질서유지(어린이들의 생명과 안전을 보호하기 위함)',
  },
  {
    id: 2,
    title: '전염병 환자 격리',
    story: '코로나19와 같은 강한 전염병에 걸린 사람은 일정 기간 마음대로 밖에 나가지 못하고 병원이나 집에 머물러야 한다.',
    restrictedRight: '신체의 자유, 거주·이전의 자유',
    limitationReason: '공공복리(다른 사람들에게 병이 퍼지는 것을 막고 국민 건강을 보호하기 위함)',
  },
  {
    id: 3,
    title: '공항 보안 검색',
    story: '비행기를 타기 전, 모든 승객은 공항 검색대에서 엑스레이로 가방 검사를 받고 금속 탐지기를 통과해야 한다.',
    restrictedRight: '사생활의 비밀과 자유',
    limitationReason: '국가안전보장(비행기 테러를 막고 승객들의 안전을 보장하기 위함)',
  },
  {
    id: 4,
    title: '군사기지 출입 통제',
    story: '휴전선 근처나 중요한 군사 기지 주변에는 허락받지 않은 일반인이 함부로 들어가거나 사진을 찍을 수 없다.',
    restrictedRight: '거주·이전의 자유',
    limitationReason: '국가안전보장(국가의 중요한 군사 기밀을 보호하고 국방력을 유지하기 위함)',
  },
  {
    id: 5,
    title: '심야 주택가 시위 제한',
    story: '밤 12시가 넘은 늦은 시간, 사람들이 잠을 자는 아파트 단지 앞에서 큰 스피커를 틀어놓고 시위하는 것을 경찰이 막는다.',
    restrictedRight: '집회 및 결사의 자유',
    limitationReason: '질서유지(주민들이 조용히 잠을 자고 쉴 수 있는 평온한 생활을 보호하기 위함)',
  },
  {
    id: 6,
    title: '공공사업을 위한 토지 수용',
    story: '새로운 고속도로나 철도를 만들기 위해, 국가가 개인의 땅을 강제로 사들이고 보상금을 지급한다.',
    restrictedRight: '재산권',
    limitationReason: '공공복리(도로 건설을 통해 다수 국민이 편리하게 이동할 수 있도록 하기 위함)',
  },
  {
    id: 7,
    title: '공공장소 금연',
    story: '식당, PC방, 버스 정류장 등 사람들이 많이 모이는 곳에서는 담배를 피울 수 없으며, 위반 시 벌금을 낸다.',
    restrictedRight: '행동의 자유 (흡연권)',
    limitationReason: '공공복리(간접흡연으로부터 다른 사람들의 건강을 지키기 위함)',
  },
  {
    id: 8,
    title: '청소년 대상 술·담배 판매 금지',
    story: '편의점이나 식당 주인이 중·고등학생에게 술이나 담배를 팔면 영업 정지를 당하거나 벌금을 낸다.',
    restrictedRight: '직업의 자유 (영업의 자유)',
    limitationReason: '공공복리(성장기 청소년의 몸과 마음을 건강하게 보호하기 위함)',
  },
  {
    id: 9,
    title: '범죄 용의자 체포',
    story: '물건을 훔치거나 사람을 때린 것으로 강하게 의심되는 사람을 경찰이 판사의 영장을 받아 체포해 경찰서에 가둔다.',
    restrictedRight: '신체의 자유',
    limitationReason: '질서유지(범죄를 수사하고 사회의 불안과 혼란을 막기 위함)',
  },
  {
    id: 10,
    title: '영화 관람 연령 제한',
    story: "지나치게 잔인하거나 야한 장면이 많이 나오는 영화는 '청소년 관람 불가'로 지정되어 중학생은 극장에서 볼 수 없다.",
    restrictedRight: '문화 향유의 권리',
    limitationReason: '공공복리(청소년에게 유해한 매체를 차단하여 건전한 정서를 보호하기 위함)',
  },
  {
    id: 11,
    title: '공장 매연 배출 규제',
    story: '물건을 만드는 공장에서는 오염 물질을 마음대로 버릴 수 없으며, 반드시 비싼 돈을 들여 정화 시설을 설치해야 한다.',
    restrictedRight: '재산권, 영업의 자유',
    limitationReason: '공공복리(깨끗한 자연환경을 유지하여 국민 모두가 쾌적하게 살기 위함)',
  },
  {
    id: 12,
    title: '불법 사이트 접속 차단',
    story: '불법 스포츠 도박 사이트나 남의 개인정보를 빼내는 해킹 사이트는 방송통신위원회가 아예 접속하지 못하도록 막아버린다.',
    restrictedRight: '표현의 자유',
    limitationReason: '질서유지(불법 행위로 인한 범죄를 예방하고 사회적 피해를 막기 위함)',
  },
  {
    id: 13,
    title: '세금 납부의 의무',
    story: '직장에 다니며 돈을 벌거나 집을 산 사람은 국가에 의무적으로 수입의 일정 비율을 세금으로 내야 한다.',
    restrictedRight: '재산권',
    limitationReason: '공공복리(국가를 운영하고 어려운 사람을 돕는 복지 예산을 확보하기 위함)',
  },
  {
    id: 14,
    title: '안전벨트 착용 의무화',
    story: '자동차를 탈 때는 앞좌석뿐만 아니라 뒷좌석에 앉은 사람도 반드시 안전벨트를 매야 하며, 안 매면 과태료를 낸다.',
    restrictedRight: '행동의 자유',
    limitationReason: '질서유지(교통사고 발생 시 개인의 생명을 지키고 피해를 줄이기 위함)',
  },
  {
    id: 15,
    title: '의무 군 복무 (징병제)',
    story: '대한민국 국적을 가진 건장한 남성들은 자신이 원하지 않더라도 일정 기간 군대에 가서 나라를 지키는 훈련을 받아야 한다.',
    restrictedRight: '신체의 자유, 직업 선택의 자유',
    limitationReason: '국가안전보장(적의 침략으로부터 나라를 지킬 수 있는 튼튼한 국방력을 유지하기 위함)',
  },
];

// Helper to shuffle options deterministically or randomly
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate the complete set of questions (15 Type A + 15 Type B = 30 questions)
export function generateAllQuestions(): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  // Candidate pool of constitutional rights distractors
  const allRightsDistractors = [
    '평등권',
    '참정권 (선거권)',
    '청구권 (재판을 받을 권리)',
    '사회권 (교육을 받을 권리)',
    '양심 및 종교의 자유',
    '근로의 권리',
    '사생활의 비밀과 자유',
    '거주·이전의 자유',
    '신체의 자유',
    '재산권',
    '행동의 자유',
    '직업의 자유 (영업의 자유)',
    '표현의 자유',
    '집회 및 결사의 자유',
    '문화 향유의 권리',
  ];

  CONSTITUTIONAL_CASES.forEach((c) => {
    // ----------------------------------------------------
    // TYPE 1: 침해(제한)된 기본권 찾는 문제
    // ----------------------------------------------------
    const rightCorrect = c.restrictedRight;
    // Pick 3 distractors not equal to correct
    const rightDistractors = allRightsDistractors
      .filter((r) => !rightCorrect.includes(r) && !r.includes(rightCorrect))
      .slice(0, 10);
    const shuffledRights = shuffleArray(rightDistractors).slice(0, 3);
    const rightOptions = shuffleArray([rightCorrect, ...shuffledRights]);
    const rightCorrectIndex = rightOptions.indexOf(rightCorrect);

    questions.push({
      id: `q-right-${c.id}`,
      caseId: c.id,
      caseTitle: c.title,
      caseStory: c.story,
      questionType: 'RIGHT_RESTRICTED',
      questionTitle: `[사례 ${c.id}] ${c.title} - 제한받는 기본권 찾기`,
      prompt: '위 사례를 읽고, 법률이나 규정에 의해 국가로부터 제한(침해)받는 기본권은 무엇인지 고르세요.',
      options: rightOptions,
      correctAnswer: rightCorrect,
      correctIndex: rightCorrectIndex,
      explanation: `정답: [${rightCorrect}]\n사례에서 ${c.story} 이를 통해 제한받는 기본권은 "${rightCorrect}"입니다.`,
      hint: `사례 속 주인공의 행동, 몸의 자유, 재산 사용, 장소 이동 등 어떤 권리가 통제되는지 살펴보세요.`,
    });

    // ----------------------------------------------------
    // TYPE 2: 기본권 제한의 사유(목적) 찾는 문제
    // ----------------------------------------------------
    const reasonCorrect = c.limitationReason;
    // Alternative purpose distractors
    const reasonPool = [
      '국가의 재정 수익을 극대화하여 국고를 채우기 위함',
      '특정 기업이나 소수 이익 집단의 독점적 상업 이익을 보장하기 위함',
      '국민들의 개인적인 사생활 취향을 통제하고 간섭하기 위함',
      '정부의 정책에 대한 국민들의 정당한 비판을 억누르기 위함',
      '외국의 특정 기업에게 경제적 특혜를 부여하기 위함',
      '다른 시민의 기본권과 상관없이 행정 편의주의를 도모하기 위함',
      '질서유지(주민들이 조용히 잠을 자고 쉴 수 있는 평온한 생활을 보호하기 위함)',
      '공공복리(다른 사람들에게 병이 퍼지는 것을 막고 국민 건강을 보호하기 위함)',
      '국가안전보장(적의 침략으로부터 나라를 지킬 수 있는 튼튼한 국방력을 유지하기 위함)',
      '공공복리(성장기 청소년의 몸과 마음을 건강하게 보호하기 위함)',
      '공공복리(도로 건설을 통해 다수 국민이 편리하게 이동할 수 있도록 하기 위함)',
      '질서유지(범죄를 수사하고 사회의 불안과 혼란을 막기 위함)',
      '국가안전보장(국가의 중요한 군사 기밀을 보호하고 국방력을 유지하기 위함)',
    ].filter((r) => r !== reasonCorrect);

    const shuffledReasons = shuffleArray(reasonPool).slice(0, 3);
    const reasonOptions = shuffleArray([reasonCorrect, ...shuffledReasons]);
    const reasonCorrectIndex = reasonOptions.indexOf(reasonCorrect);

    questions.push({
      id: `q-reason-${c.id}`,
      caseId: c.id,
      caseTitle: c.title,
      caseStory: c.story,
      questionType: 'LIMITATION_REASON',
      questionTitle: `[사례 ${c.id}] ${c.title} - 기본권 제한 사유 찾기`,
      prompt: '국가가 이 사례에서 기본권을 제한할 수밖에 없는 헌법적 이유(제한 목적)는 무엇일까요?',
      options: reasonOptions,
      correctAnswer: reasonCorrect,
      correctIndex: reasonCorrectIndex,
      explanation: `정답: [${reasonCorrect}]\n헌법 제37조 제2항에 따라 국민의 자유와 권리는 '국가안전보장, 질서유지 또는 공공복리'를 위해 법률로써 제한할 수 있습니다.`,
      hint: `헌법 제37조 제2항의 목적(국가안전보장 / 질서유지 / 공공복리) 중 왜 이 규제가 꼭 필요한 공익적 이유인지 생각해보세요.`,
    });
  });

  return questions;
}
