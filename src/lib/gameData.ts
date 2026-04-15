export type PersonalityTrait = "감성" | "지혜" | "용기" | "신비";

export interface Choice {
  text: string;
  trait: PersonalityTrait;
  response: string;
}

export interface Quiz {
  question: string;
  choices: Choice[];
}

export interface LocationReward {
  trait: PersonalityTrait;
  itemName: string;
  icon: string;
  rarity: "common" | "rare" | "legendary";
  description: string;
}

export interface GameLocation {
  id: number;
  name: string;
  icon: string;
  description: string;
  backgroundEmoji: string;
  quizzes: Quiz[];
  rewards: LocationReward[];
}

export const gameLocations: GameLocation[] = [
  {
    id: 1,
    name: "시작의 숲",
    icon: "🌲",
    description: "고요한 숲 속에서 첫 번째 인연의 조각을 찾아보세요. 나무들이 속삭이는 이야기에 귀를 기울여보세요.",
    backgroundEmoji: "🌿",
    quizzes: [
      {
        question: "숲 속 갈림길에서 신비한 빛이 두 방향으로 갈라집니다. 어디로 향하시겠어요?",
        choices: [
          { text: "달빛이 비추는 조용한 연못 쪽으로", trait: "감성", response: "연못의 수면이 당신의 마음을 비춥니다..." },
          { text: "고대 문자가 새겨진 돌기둥 쪽으로", trait: "지혜", response: "문자들이 서서히 빛나며 비밀을 속삭입니다..." },
          { text: "어둠 속에서 빛나는 동굴 쪽으로", trait: "용기", response: "동굴 깊은 곳에서 따뜻한 기운이 느껴집니다..." },
          { text: "안개가 자욱한 꽃밭 쪽으로", trait: "신비", response: "안개 속 꽃들이 당신을 위해 피어납니다..." },
        ],
      },
      {
        question: "숲의 정령이 나타나 질문합니다. \"당신이 가장 소중하게 여기는 것은?\"",
        choices: [
          { text: "함께하는 사람들과의 따뜻한 순간", trait: "감성", response: "정령이 미소지으며 따뜻한 빛을 건넵니다..." },
          { text: "세상의 진리를 깨닫는 순간", trait: "지혜", response: "정령이 고개를 끄덕이며 지혜의 빛을 나눕니다..." },
          { text: "두려움을 극복하고 성장하는 순간", trait: "용기", response: "정령이 감탄하며 용기의 불꽃을 선물합니다..." },
          { text: "설명할 수 없는 신비한 경험", trait: "신비", response: "정령이 신비롭게 웃으며 별빛을 뿌립니다..." },
        ],
      },
    ],
    rewards: [
      { trait: "감성", itemName: "눈물방울 꽃잎", icon: "🌸", rarity: "common", description: "순수한 감성을 담은 반쪽 꽃잎" },
      { trait: "지혜", itemName: "지혜의 나뭇잎", icon: "🍃", rarity: "common", description: "고대의 지혜가 깃든 반쪽 나뭇잎" },
      { trait: "용기", itemName: "용기의 도토리", icon: "🌰", rarity: "common", description: "단단한 용기가 담긴 반쪽 도토리" },
      { trait: "신비", itemName: "신비의 버섯", icon: "🍄", rarity: "rare", description: "신비한 기운이 깃든 반쪽 버섯" },
    ],
  },
  {
    id: 2,
    name: "달빛 호수",
    icon: "🌙",
    description: "은빛 달빛이 호수 위에 춤을 춥니다. 물 위에 비친 별들 사이에서 운명의 조각을 찾아보세요.",
    backgroundEmoji: "🌊",
    quizzes: [
      {
        question: "달빛 호수 위에 신비한 배가 나타났습니다. 배 위에서 무엇을 하시겠어요?",
        choices: [
          { text: "물 위에 비친 달을 바라보며 노래를 부른다", trait: "감성", response: "당신의 노래가 호수 전체에 울려퍼집니다..." },
          { text: "물속에 비친 별자리의 의미를 해석한다", trait: "지혜", response: "별자리가 당신에게 비밀 메시지를 전합니다..." },
          { text: "깊은 물속으로 뛰어든다", trait: "용기", response: "물속에서 빛나는 세계가 펼쳐집니다..." },
          { text: "물 위를 걸어보려 한다", trait: "신비", response: "놀랍게도, 당신의 발 아래 물이 단단해집니다..." },
        ],
      },
      {
        question: "호수의 수호자가 묻습니다. \"인연이란 무엇이라 생각하나요?\"",
        choices: [
          { text: "서로의 마음이 자연스럽게 이어지는 것", trait: "감성", response: "호수가 잔잔한 파문으로 공감합니다..." },
          { text: "시간과 경험이 만들어내는 깊은 유대", trait: "지혜", response: "수호자가 깊이 고개를 끄덕입니다..." },
          { text: "어떤 시련도 함께 이겨내는 힘", trait: "용기", response: "호수의 파도가 힘차게 일렁입니다..." },
          { text: "우주가 정해놓은 불가사의한 운명", trait: "신비", response: "달빛이 더욱 밝게 빛납니다..." },
        ],
      },
    ],
    rewards: [
      { trait: "감성", itemName: "달빛 조개", icon: "🐚", rarity: "rare", description: "달빛을 품은 반쪽 조개" },
      { trait: "지혜", itemName: "별의 나침반", icon: "🧭", rarity: "rare", description: "진실을 가리키는 반쪽 나침반" },
      { trait: "용기", itemName: "파도의 검", icon: "⚔️", rarity: "rare", description: "파도의 힘이 깃든 반쪽 검" },
      { trait: "신비", itemName: "달빛 열쇠", icon: "🔑", rarity: "legendary", description: "운명의 문을 여는 반쪽 열쇠" },
    ],
  },
  {
    id: 3,
    name: "별의 정원",
    icon: "✨",
    description: "하늘에서 떨어진 별들이 꽃이 되어 피어난 정원. 각 별꽃은 다른 운명을 품고 있습니다.",
    backgroundEmoji: "🌟",
    quizzes: [
      {
        question: "별의 정원에서 네 개의 별꽃이 동시에 피어났습니다. 어떤 꽃에 끌리시나요?",
        choices: [
          { text: "부드러운 분홍빛으로 따뜻하게 빛나는 꽃", trait: "감성", response: "꽃이 당신의 손에서 더 환하게 피어납니다..." },
          { text: "깊은 파란빛으로 고요하게 빛나는 꽃", trait: "지혜", response: "꽃잎에서 우주의 지식이 흘러나옵니다..." },
          { text: "강렬한 붉은빛으로 활활 타오르는 꽃", trait: "용기", response: "꽃의 불꽃이 당신의 영혼에 힘을 줍니다..." },
          { text: "무지갯빛으로 계속 변하는 꽃", trait: "신비", response: "꽃이 수천 가지 색으로 당신을 감쌉니다..." },
        ],
      },
      {
        question: "정원의 별 수호자가 시험합니다. \"이 정원이 시들어가고 있어요. 어떻게 하시겠어요?\"",
        choices: [
          { text: "꽃들에게 따뜻한 마음으로 노래를 불러준다", trait: "감성", response: "당신의 마음이 정원 전체를 감싸 안습니다..." },
          { text: "시드는 원인을 분석하고 해결책을 찾는다", trait: "지혜", response: "당신의 통찰력이 정원의 비밀을 밝힙니다..." },
          { text: "어둠의 근원을 찾아 직접 맞선다", trait: "용기", response: "당신의 용기가 어둠을 물리칩니다..." },
          { text: "별에게 소원을 빌어 기적을 바란다", trait: "신비", response: "기적처럼 별빛이 쏟아져 내립니다..." },
        ],
      },
    ],
    rewards: [
      { trait: "감성", itemName: "사랑의 별꽃", icon: "💮", rarity: "rare", description: "사랑의 기운이 담긴 반쪽 별꽃" },
      { trait: "지혜", itemName: "지식의 수정구", icon: "🔮", rarity: "legendary", description: "모든 것을 비추는 반쪽 수정구" },
      { trait: "용기", itemName: "전사의 별", icon: "💫", rarity: "rare", description: "전사의 영혼이 깃든 반쪽 별" },
      { trait: "신비", itemName: "무한의 거울", icon: "🪞", rarity: "legendary", description: "무한한 가능성을 비추는 반쪽 거울" },
    ],
  },
  {
    id: 4,
    name: "운명의 사원",
    icon: "🏛️",
    description: "시간이 멈춘 고대 사원. 이곳에서 당신의 진정한 모습과 마주하게 됩니다.",
    backgroundEmoji: "🕯️",
    quizzes: [
      {
        question: "사원의 네 개의 문 중 하나를 선택해야 합니다. 각 문 위에 다른 문양이 있습니다.",
        choices: [
          { text: "하트 문양 - 사랑의 문", trait: "감성", response: "문이 열리며 따뜻한 빛이 쏟아집니다..." },
          { text: "눈 문양 - 통찰의 문", trait: "지혜", response: "문 너머로 모든 것이 선명하게 보입니다..." },
          { text: "칼 문양 - 시련의 문", trait: "용기", response: "시련의 길이 당신을 더 강하게 만듭니다..." },
          { text: "달 문양 - 신비의 문", trait: "신비", response: "시간과 공간이 뒤틀리며 새로운 차원이 열립니다..." },
        ],
      },
      {
        question: "사원 깊은 곳에서 거울이 당신의 미래를 보여줍니다. 어떤 미래를 선택하시겠어요?",
        choices: [
          { text: "사랑하는 사람과 함께 웃고 있는 모습", trait: "감성", response: "거울 속 당신이 행복하게 미소짓습니다..." },
          { text: "큰 깨달음을 얻고 세상을 이해하는 모습", trait: "지혜", response: "거울이 무한한 지식의 빛을 비춥니다..." },
          { text: "모든 어려움을 극복하고 우뚝 선 모습", trait: "용기", response: "거울 속 당신이 당당히 서 있습니다..." },
          { text: "설명할 수 없는 신비한 힘을 가진 모습", trait: "신비", response: "거울이 산산조각나며 새로운 힘이 깨어납니다..." },
        ],
      },
    ],
    rewards: [
      { trait: "감성", itemName: "사랑의 성배", icon: "🏆", rarity: "legendary", description: "영원한 사랑이 담긴 반쪽 성배" },
      { trait: "지혜", itemName: "현자의 두루마리", icon: "📜", rarity: "legendary", description: "궁극의 지혜가 적힌 반쪽 두루마리" },
      { trait: "용기", itemName: "불사조의 깃털", icon: "🪶", rarity: "legendary", description: "불사의 용기가 깃든 반쪽 깃털" },
      { trait: "신비", itemName: "차원의 오브", icon: "🌀", rarity: "legendary", description: "차원을 넘나드는 반쪽 오브" },
    ],
  },
  {
    id: 5,
    name: "인연의 다리",
    icon: "🌉",
    description: "모든 여정의 끝, 인연의 다리에서 운명의 상대를 만나게 됩니다.",
    backgroundEmoji: "🌈",
    quizzes: [
      {
        question: "인연의 다리 위에서 당신의 반쪽 아이템들이 빛나기 시작합니다. 마지막 질문입니다. 당신에게 사랑이란?",
        choices: [
          { text: "말하지 않아도 서로 느끼는 따뜻한 마음", trait: "감성", response: "다리 전체가 따뜻한 빛으로 물듭니다..." },
          { text: "서로를 깊이 이해하고 존중하는 관계", trait: "지혜", response: "다리의 문양들이 의미를 드러냅니다..." },
          { text: "함께라면 어떤 것도 두렵지 않은 힘", trait: "용기", response: "다리가 흔들려도 당신은 굳건합니다..." },
          { text: "우주가 선물한 기적 같은 만남", trait: "신비", response: "하늘에서 별이 쏟아져 내립니다..." },
        ],
      },
    ],
    rewards: [
      { trait: "감성", itemName: "인연의 붉은 실", icon: "🧵", rarity: "legendary", description: "운명을 잇는 반쪽 붉은 실" },
      { trait: "지혜", itemName: "인연의 별자리", icon: "⭐", rarity: "legendary", description: "운명이 새겨진 반쪽 별자리" },
      { trait: "용기", itemName: "인연의 방패", icon: "🛡️", rarity: "legendary", description: "사랑을 지키는 반쪽 방패" },
      { trait: "신비", itemName: "인연의 수정", icon: "💎", rarity: "legendary", description: "운명을 비추는 반쪽 수정" },
    ],
  },
];

export const personalityDescriptions: Record<PersonalityTrait, { title: string; description: string; color: string }> = {
  감성: {
    title: "따뜻한 감성가",
    description: "깊은 공감 능력과 따뜻한 마음을 가진 당신. 사랑하는 이에게 진심 어린 위로와 이해를 줄 수 있는 사람입니다.",
    color: "from-pink-400 to-rose-500",
  },
  지혜: {
    title: "깊은 사색가",
    description: "세상을 깊이 이해하고 통찰하는 당신. 상대방을 진정으로 이해하고 함께 성장할 수 있는 사람입니다.",
    color: "from-blue-400 to-indigo-500",
  },
  용기: {
    title: "담대한 수호자",
    description: "두려움 앞에서도 굳건한 당신. 사랑하는 사람을 위해 무엇이든 할 수 있는 강인한 마음의 소유자입니다.",
    color: "from-orange-400 to-red-500",
  },
  신비: {
    title: "신비로운 몽상가",
    description: "평범함을 넘어서는 특별한 감각의 소유자. 운명적인 만남을 직감으로 알아차릴 수 있는 사람입니다.",
    color: "from-purple-400 to-violet-500",
  },
};
