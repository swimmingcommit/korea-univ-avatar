import { UserPreferences } from "./recommendEngine";
import { AvatarArchetypeId } from "./avatarEngine";

// 1. Immutable Base Tiger Anchor (Character Consistency)
export const BASE_TIGER_ANCHOR =
  "A 3D high-detail macro plush toy keychain of Korea University round yellow tiger mascot with open happy fanged smile (:D), cute round black nose, three stripes on cheeks, soft felt fuzzy fur texture, silver carabiner keyring ring attached on top head.";

// 2. Combinatorial Outfit Matrix by Archetype (30+ variations)
export const OUTFIT_MATRIX: Record<AvatarArchetypeId, string[]> = {
  "01": [
    "crimson velvet glam-rock stage blazer with silver rhinestone trims",
    "black leather biker jacket with crimson KU patches and silver studs",
    "sparkling idol stage performer uniform with gold embroidery",
    "crimson satin bomber jacket with oversized 'KOREA' back print",
  ],
  "02": [
    "deep navy oversized hoodie with glowing green binary matrix code print",
    "dark charcoal tech-fleece hoodie with hacker terminal graphics",
    "cozy black knitted developer sweater with mechanical keyboard badge",
    "crimson & white Korea University esports jersey with gamer headset around neck",
  ],
  "03": [
    "moss green eco volunteer safari vest over a clean white Korea Univ t-shirt with a tiny sprout pin",
    "khaki canvas volunteer field vest with eco-friendly tree patches",
    "pastel mint green cotton cardigan with wooden buttons and eco tote",
    "warm beige volunteer apron with embroidered flower badges",
  ],
  "04": [
    "tailored crimson suit blazer over a crisp white dress shirt with crimson silk KU tie",
    "charcoal pinstripe academic suit with KU gold lapel pin and pocket square",
    "navy smart-casual blazer over a crimson crewneck sweater",
    "classic British tweed jacket with leather elbow patches and glasses",
  ],
  "05": [
    "Korea University red athletic basketball jersey with bold white '#26' numbers",
    "crimson running tank top with matching red 'KOREA UNIVERSITY' elastic sweat headband",
    "red & white sporty KU varsity track warmup jacket with zipper",
    "black compression training shirt with red athletic stripes",
  ],
  "06": [
    "trendy purple knit beanie with canvas cross-body tote bag and vintage pins",
    "colorful outdoor windbreaker jacket with climbing carabiners and Anam pins",
    "casual denim jacket over a graphic tee with a mini travel backpack",
    "cozy mustard yellow oversized fleece hoodie with street festival stickers",
  ],
  "07": [
    "canvas vintage photographer safari vest with multiple lens pockets",
    "cozy oversized beige and brown knitted fisherman sweater with corduroy collar",
    "warm olive green chore jacket with antique leather camera strap",
    "vintage brown corduroy jacket with round tortoiseshell wire glasses",
  ],
  "08": [
    "classic official Korea University crimson varsity jacket ('과잠') with white leather sleeves and bold embroidered 'KOREA UNIV.'",
    "freshman crimson hoodie with 2026 Korea University orientation badge",
    "oversized crimson varsity jumper with cheering red megaphone icon",
    "clean navy campus jacket with fresh student ID lanyard",
  ],
};

// 3. Combinatorial Props Matrix by Archetype (40+ items)
export const PROP_MATRIX: Record<AvatarArchetypeId, string[]> = {
  "01": [
    "holding a miniature silver vintage stand microphone",
    "holding an electric guitar with crimson strap",
    "holding glowing cheering lightsticks and audio headphones",
    "holding a silver acoustic guitar and drumsticks",
  ],
  "02": [
    "holding a miniature glowing silver laptop displaying green matrix code and an ice-cold green energy drink can",
    "holding a tiny mechanical keyboard with RGB backlighting",
    "holding dual mini high-res monitors and a large coffee tumbler",
    "holding a handheld gaming device and energy drink",
  ],
  "03": [
    "holding a stainless steel eco tumbler with green leaf icon and a rolled campus recycling guide map",
    "holding a mini potted green sprout plant and wooden watering can",
    "holding a canvas tote bag filled with reusable wooden utensils and tumbler",
    "holding a cute environmental award plaque and wildflower bouquet",
  ],
  "04": [
    "holding a miniature brown leather vintage briefcase and a glowing smartphone",
    "holding a red laser pointer and transparent analytical chart tablet",
    "holding a leather debate portfolio binder with KU gold seal",
    "holding a silver fountain pen and speech cue cards",
  ],
  "05": [
    "holding a miniature matte black dumbbell in one hand and wearing a smart fitness watch",
    "holding a silver protein shaker bottle and gym towel",
    "holding a Korea University crimson basketball with grip tape",
    "holding a stopwatch and running water bottle",
  ],
  "06": [
    "holding a canvas Anam Makgeolli tote bag and a miniature adventure map",
    "holding a Polaroid instant camera and boardgame cards",
    "holding a miniature foodie guide map and street snack skewers",
    "holding a travel compass and stamp passport booklet",
  ],
  "07": [
    "holding a miniature vintage 35mm rangefinder film camera with leather strap",
    "holding a miniature antique leather-bound book and classic brass pen",
    "holding a Chemex pour-over coffee flask and film canister rolls",
    "holding a retro film slate and camera lens",
  ],
  "08": [
    "holding a miniature Korea University campus orientation map and red cheering pompom",
    "holding a crimson cheering megaphone and campus guide brochure",
    "holding a textbook bundle tied with leather strap and student lanyard",
    "holding a welcome gift box and red tiger sticker sheet",
  ],
};

// 4. Korea University Campus Background Matrix (16 iconic locations)
export const KU_BACKGROUND_MATRIX = [
  "cozy warm golden-hour aesthetic cafe in Anam with incandescent Edison bulbs bokeh",
  "Korea University Central Plaza (중앙광장) sprawling green lawn under crisp blue sky with Main Hall in distance",
  "historic Inchon Memorial Hall (인촌기념관) with majestic stone architecture during autumn sunset",
  "vibrant college festival concert stage with dynamic spotlight bokeh and laser beams",
  "warm antique wooden library study room with leather-bound book rows and soft warm reading lamp",
  "Korea University Main Hall (본관) stone castle tower with fluttering crimson KU flags",
  "lively Chamsali-gil (참살이길) street festival at night with glowing festive shop lanterns",
  "Korea University Tiger Plaza (하나스퀘어 / Tiger Plaza) modern sunlit glass lounge",
  "lively cheering stadium during Korea-Yonsei Games (고연전) full of crimson flags and red crowd",
  "quiet Da-ram-jwi-gil (다람쥐길) campus forest path with falling autumn maple leaves",
];

// Helper to pick random item
export function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// 5. Dynamic Prompt Builder Function
export function generateDynamicPlushPrompt(
  prefs: UserPreferences,
  archetypeId: AvatarArchetypeId,
  customKeywords?: string
): { prompt: string; outfit: string; prop: string; background: string } {
  const outfits = OUTFIT_MATRIX[archetypeId] || OUTFIT_MATRIX["08"];
  const props = PROP_MATRIX[archetypeId] || PROP_MATRIX["08"];

  const selectedOutfit = getRandomItem(outfits);
  const selectedProp = getRandomItem(props);
  const selectedBg = getRandomItem(KU_BACKGROUND_MATRIX);

  let extraInterestStr = "";
  if (customKeywords) {
    extraInterestStr = ` Incorporating theme elements of: ${customKeywords}.`;
  } else if (prefs.interests) {
    extraInterestStr = ` Incorporating subtle elements of: ${prefs.interests}.`;
  }

  const fullPrompt = `${BASE_TIGER_ANCHOR} Wearing ${selectedOutfit}, ${selectedProp}. Background: ${selectedBg}.${extraInterestStr} Soft tactile felt texture, macro toy figurine photography, shallow depth of field, warm volumetric cinematic studio lighting, 8k resolution masterpiece.`;

  return {
    prompt: fullPrompt,
    outfit: selectedOutfit,
    prop: selectedProp,
    background: selectedBg,
  };
}
