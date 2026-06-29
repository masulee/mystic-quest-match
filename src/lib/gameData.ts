import libraryScene from "@/assets/scenes/library-of-mists.jpg";
import lakeScene from "@/assets/scenes/moonlight-lake.jpg";
import towerScene from "@/assets/scenes/tower-of-storms.jpg";
import marketScene from "@/assets/scenes/red-market.jpg";
import gardenScene from "@/assets/scenes/garden-of-silence.jpg";

export type PersonalityTrait = "감성" | "지혜" | "용기" | "신비";

export type QuizTarget = "self" | "ideal";

export interface Choice {
  text: string;
  trait: PersonalityTrait;
  response: string;
}

export interface Quiz {
  question: string;
  target: QuizTarget; // "self" = 나의 성향, "ideal" = 이상형 성향
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
  sceneImage: string;
  quizzes: Quiz[];
  rewards: LocationReward[];
}

// Pre-quest door choice (records to 나의 성향)
export interface DoorChoice {
  text: string;
  hint: string;
  trait: PersonalityTrait;
}

export const doorChoices: DoorChoice[] = [
  { text: "아침 빛이 새어 들어오는 문", hint: "문틈 사이로 이슬 냄새가 납니다", trait: "감성" },
  { text: "빗소리가 들리는 문", hint: "조용하지만 쉬지 않는 리듬이 있습니다", trait: "지혜" },
  { text: "아무것도 보이지 않는 문", hint: "그 안이 어딘지 전혀 알 수 없습니다", trait: "신비" },
  { text: "웅성임이 들려오는 문", hint: "누군가의 웃음소리가 섞여 있습니다", trait: "용기" },
];

// Helper: build a single-item reward set so the chosen item is the same regardless of trait.
const sameReward = (
  itemName: string,
  icon: string,
  rarity: "common" | "rare" | "legendary",
  description: string,
): LocationReward[] =>
  (["감성", "지혜", "용기", "신비"] as PersonalityTrait[]).map((trait) => ({
    trait,
    itemName,
    icon,
    rarity,
    description,
  }));

export const gameLocations: GameLocation[] = [
  {
    id: 1,
    name: "안개의 도서관",
    icon: "📚",
    description: "기억이 책이 되는 곳. 끝없이 이어진 서가에는 제목 없는 책들이 놓여 있고, 안개가 낮게 깔려 있습니다.",
    backgroundEmoji: "🌫️",
    sceneImage: libraryScene,
    quizzes: [
      {
        target: "ideal",
        question: "당신 앞에 펼쳐진 책 — 표지도 제목도 없습니다. 첫 페이지에 적힌 것은 무엇입니까?",
        choices: [
          { text: "낯선 사람의 꿈 일기 — 가장 깊은 밤이 고스란히 담겨 있습니다", trait: "감성", response: "페이지에서 누군가의 숨소리가 들려옵니다…" },
          { text: "아직 일어나지 않은 일들의 기록 — 미래가 이미 쓰여져 있는 것처럼", trait: "신비", response: "글자가 천천히 움직이며 다시 쓰여집니다…" },
          { text: "빈 페이지 — 무엇이든 쓸 수 있는, 아직 아무것도 없는", trait: "용기", response: "백지가 당신의 손끝을 기다립니다…" },
          { text: "두 사람이 번갈아 쓴 일기 — 한 쪽은 낯선 필체, 한 쪽은 내 것 같은 느낌", trait: "지혜", response: "두 필체가 한 줄에서 만납니다…" },
        ],
      },
      {
        target: "self",
        question: "서가 한쪽에 당신의 이름이 적힌 빈 책이 있습니다. 당신은 이 책에 무엇을 씁니까?",
        choices: [
          { text: "오늘 본 것들 — 사람, 빛, 풍경 / 기록하지 않으면 사라질 것들을 붙잡습니다", trait: "지혜", response: "관찰의 문장들이 또렷이 새겨집니다…" },
          { text: "오늘 느낀 것들 — 감정의 흐름 / 사실보다 감각이 더 진실하다고 생각합니다", trait: "감성", response: "감정의 결이 페이지에 번져갑니다…" },
          { text: "아직 답 못 한 질문들 — 모르는 것을 모른다고 인정하는 사람입니다", trait: "신비", response: "질문들이 안개 속에서 빛을 냅니다…" },
          { text: "아무것도 쓰지 않습니다 — 기록보다 경험이 먼저인 사람입니다", trait: "용기", response: "당신은 책을 덮고 다시 걸음을 옮깁니다…" },
        ],
      },
    ],
    rewards: sameReward(
      "안개 깃털 펜",
      "🪶",
      "common",
      "이 펜으로 쓴 것은 안개 속에서도 지워지지 않습니다. 당신이 찾는 이상형은 당신만의 언어를 이해하는 사람일 것입니다.",
    ),
  },
  {
    id: 2,
    name: "달빛 호수",
    icon: "🌙",
    description: "반영만이 진실을 말하는 곳. 달이 수면 가득 비치고, 발밑의 물은 파문 없이 고요합니다.",
    backgroundEmoji: "🌊",
    sceneImage: lakeScene,
    quizzes: [
      {
        target: "ideal",
        question: "호수 표면에 당신 옆에 서 있는 그림자가 비칩니다. 그 그림자는 무엇을 하고 있습니까?",
        choices: [
          { text: "당신보다 먼저 돌아보며 살피고 있습니다 — 언제나 한 발 앞서 챙기는 사람", trait: "감성", response: "그림자의 시선이 당신에게 닿습니다…" },
          { text: "같은 방향을 바라보고 있습니다 — 나란히 같은 것을 보는 존재", trait: "지혜", response: "두 그림자의 윤곽이 하나로 겹쳐집니다…" },
          { text: "당신의 손을 잡고 있습니다 — 말 없이도 연결되어 있는 존재", trait: "신비", response: "수면 위 두 손에 잔물결이 입니다…" },
          { text: "자신만의 세계에 빠져 있습니다 — 각자의 빛이 있고, 그래서 더 끌리는 존재", trait: "용기", response: "그림자가 홀로 빛을 발합니다…" },
        ],
      },
      {
        target: "self",
        question: "달빛을 받으며 혼자 서 있는 지금 이 순간, 당신은 무엇을 느낍니까?",
        choices: [
          { text: "고요하고 충만합니다 — 혼자여도 외롭지 않은 사람입니다", trait: "지혜", response: "마음이 호수처럼 잔잔해집니다…" },
          { text: "누군가가 있었으면 합니다 — 연결을 통해 완성되는 사람입니다", trait: "감성", response: "달빛이 당신의 어깨를 가만히 감쌉니다…" },
          { text: "생각이 오히려 선명해집니다 — 고독이 사고를 날카롭게 만드는 사람입니다", trait: "신비", response: "수면에 떠오른 별자리가 또렷해집니다…" },
          { text: "빨리 이곳을 벗어나고 싶습니다 — 움직임 속에서 살아있음을 느끼는 사람입니다", trait: "용기", response: "당신의 발이 이미 다음 길을 향합니다…" },
        ],
      },
    ],
    rewards: sameReward(
      "달빛 물방울",
      "💧",
      "rare",
      "손 위에 올리면 잠시 다른 사람의 감정이 느껴집니다. 당신이 찾는 이상형은 감정의 결이 비슷한 사람일 것입니다.",
    ),
  },
  {
    id: 3,
    name: "폭풍의 탑",
    icon: "🗼",
    description: "가장 높은 곳이 가장 위험한 곳. 올라갈수록 바람이 거세지고, 꼭대기에서는 폭풍이 몰아칩니다.",
    backgroundEmoji: "⛈️",
    sceneImage: towerScene,
    quizzes: [
      {
        target: "ideal",
        question: "폭풍 속 탑 꼭대기에서 그 사람은 어떻게 합니까?",
        choices: [
          { text: "말없이 난간을 함께 붙잡습니다 — 쓰러질 것 같은 순간, 함께 버티는 사람", trait: "감성", response: "두 손이 같은 차가운 난간 위에 포개집니다…" },
          { text: "당신 앞에 서서 바람을 막습니다 — 자신을 내어주는 사람", trait: "용기", response: "그 사람의 등이 폭풍을 막아냅니다…" },
          { text: "폭풍이 아름답다고 말합니다 — 두려움을 경이로 바꾸는 사람", trait: "신비", response: "번개가 그 사람의 눈동자에 비칩니다…" },
          { text: "먼저 내려가자고 손을 잡아당깁니다 — 용기보다 안전을 택할 줄 아는 사람", trait: "지혜", response: "잡힌 손에서 따뜻한 결단이 전해집니다…" },
        ],
      },
      {
        target: "self",
        question: "폭풍이 지나간 탑 꼭대기, 당신은 무엇을 합니까?",
        choices: [
          { text: "잠시 눈을 감고 숨을 고릅니다 — 내면으로 돌아오는 사람입니다", trait: "감성", response: "심장의 박동이 천천히 가라앉습니다…" },
          { text: "사방을 바라보며 왔던 길을 확인합니다 — 전체를 보려는 사람입니다", trait: "지혜", response: "지나온 길이 한눈에 들어옵니다…" },
          { text: "이 순간을 기억하려 애씁니다 — 경험을 수집하는 사람입니다", trait: "신비", response: "바람의 결이 마음에 새겨집니다…" },
          { text: "다음 장소를 찾아봅니다 — 머무르기보다 나아가는 사람입니다", trait: "용기", response: "이미 다음 길이 시야에 들어옵니다…" },
        ],
      },
    ],
    rewards: sameReward(
      "폭풍 속 깃털",
      "🪶",
      "rare",
      "아무리 강한 바람에도 날아가지 않는 깃털. 당신이 찾는 이상형은 어려운 순간에 당신 곁에 남아 있는 사람일 것입니다.",
    ),
  },
  {
    id: 4,
    name: "붉은 시장",
    icon: "🏮",
    description: "이름 없는 것들이 거래되는 곳. 여기서 거래되는 것은 물건이 아닙니다 — 가장 진귀한 물건은 기억으로만 살 수 있습니다.",
    backgroundEmoji: "🔥",
    sceneImage: marketScene,
    quizzes: [
      {
        target: "self",
        question: "상인이 요구합니다 — 가장 소중한 기억 하나를 내놓으라고. 당신이 내놓는 기억은?",
        choices: [
          { text: "가장 행복했던 하루 — 그 온기를 다시 느끼고 싶은 기억", trait: "감성", response: "내려놓은 기억에서 따뜻한 빛이 새어 나옵니다…" },
          { text: "처음으로 완전히 혼자였던 밤 — 외로움과 자유가 공존했던 기억", trait: "신비", response: "그 밤의 공기가 잠시 시장에 머뭅니다…" },
          { text: "무언가를 처음 해낸 순간 — 스스로가 달라 보였던 기억", trait: "용기", response: "기억이 작은 불꽃처럼 타오릅니다…" },
          { text: "아직 결말이 없는 이야기 — 자꾸 떠오르는, 끝나지 않은 기억", trait: "지혜", response: "상인이 이 기억을 오래 들여다봅니다…" },
        ],
      },
      {
        target: "ideal",
        question: "상인이 내민 물건이 있습니다. 당신이 집어드는 것은?",
        choices: [
          { text: "방향 없는 나침반 — 어디든 원하는 곳을 가리킵니다", trait: "용기", response: "바늘이 당신의 손끝을 따라 돕니다…" },
          { text: "자물쇠 없는 열쇠 — 어떤 문이든 열린다고 합니다", trait: "지혜", response: "열쇠가 손바닥 위에서 가벼이 빛납니다…" },
          { text: "뒷면이 없는 거울 — 자신이 아닌 상대방만 비칩니다", trait: "감성", response: "거울 속에 낯선 얼굴이 비칩니다…" },
          { text: "모래가 거꾸로 흐르는 모래시계 — 시간이 느려지는 것처럼 느껴집니다", trait: "신비", response: "시간이 한순간 멈춥니다…" },
        ],
      },
    ],
    rewards: sameReward(
      "기억의 동전",
      "🪙",
      "rare",
      "아무것도 새겨져 있지 않지만, 빛에 비추면 당신의 얼굴이 보입니다. 당신이 찾는 이상형은 당신이 소중히 여기는 것을 함께 소중히 여길 사람일 것입니다.",
    ),
  },
  {
    id: 5,
    name: "침묵의 정원",
    icon: "🌿",
    description: "말하지 않아도 들리는 곳. 정원 한가운데 의자 두 개가 놓여 있고, 당신이 먼저 앉아 기다립니다.",
    backgroundEmoji: "🌸",
    sceneImage: gardenScene,
    quizzes: [
      {
        target: "ideal",
        question: "오랜 침묵 끝에, 그 사람이 처음 꺼내는 말은?",
        choices: [
          { text: "\"배고프지 않아?\" — 일상의 온기로 먼저 다가오는 사람", trait: "감성", response: "그 한마디가 마음의 빗장을 풉니다…" },
          { text: "\"오늘 어땠어?\" — 당신의 하루를 가장 먼저 궁금해하는 사람", trait: "지혜", response: "그 사람의 눈빛이 당신의 하루로 향합니다…" },
          { text: "아무 말도 없이 당신 손 위에 손을 얹습니다 — 말 없이도 전달되는 사람", trait: "신비", response: "손끝에서 모든 말이 전해집니다…" },
          { text: "\"나 좀 이상한 생각 해도 돼?\" — 자신의 내면을 당신에게 열어주는 사람", trait: "용기", response: "그 사람의 진심이 정원에 내려앉습니다…" },
        ],
      },
      {
        target: "self",
        question: "이 여정이 끝나고 전당포로 돌아간다면, 노인에게 뭐라고 말하겠습니까?",
        choices: [
          { text: "\"찾은 것 같습니다\" — 확신보다 감각으로 아는 사람입니다", trait: "감성", response: "당신의 목소리에 따뜻한 확신이 묻어납니다…" },
          { text: "\"더 보고 싶습니다\" — 탐색 자체를 즐기는 사람입니다", trait: "용기", response: "당신의 눈빛이 아직 길 위에 있습니다…" },
          { text: "\"이미 알고 있었는지도 모르겠습니다\" — 직관을 신뢰하는 사람입니다", trait: "신비", response: "노인이 조용히 미소짓습니다…" },
          { text: "\"아직 모르겠습니다\" — 열린 마음으로 기다릴 줄 아는 사람입니다", trait: "지혜", response: "그 침묵이 가장 솔직한 대답이 됩니다…" },
        ],
      },
    ],
    rewards: sameReward(
      "침묵의 씨앗",
      "🌱",
      "legendary",
      "심으면 무엇이 자라는지 아무도 모릅니다. 돌보는 사람에게만 꽃이 핀다고 합니다. 당신이 찾는 이상형은 곁에 있는 것만으로 충분한 사람일 것입니다.",
    ),
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

export const idealDescriptions: Record<PersonalityTrait, { title: string; description: string }> = {
  감성: {
    title: "마음을 먼저 건네는 사람",
    description: "당신이 찾는 이상형은 따뜻함과 공감으로 먼저 손을 내미는 사람입니다.",
  },
  지혜: {
    title: "나란히 같은 곳을 보는 사람",
    description: "당신이 찾는 이상형은 깊이 이해하고 함께 길을 가늠하는 사람입니다.",
  },
  용기: {
    title: "당신 앞을 막아서는 사람",
    description: "당신이 찾는 이상형은 결정적인 순간에 자신을 내어줄 줄 아는 사람입니다.",
  },
  신비: {
    title: "말 없이도 닿아 있는 사람",
    description: "당신이 찾는 이상형은 침묵 속에서도 당신과 연결되어 있는 사람입니다.",
  },
};
