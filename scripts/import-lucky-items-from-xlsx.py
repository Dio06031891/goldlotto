"""Import Coupang partner links from scripts/_links_import.json into content/lucky-items/*.json"""
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMPORT_PATH = ROOT / "scripts" / "_links_import.json"
OUT_DIR = ROOT / "content" / "lucky-items"

SLUGS = [
    "golden-dragon-guardian",
    "prosperity-bell",
    "golden-ingot-wealth",
    "money-tree-gold",
    "golden-elephant-wealth",
    "sunflower-canvas-wealth",
    "dried-fish-prosperity-gift",
    "four-leaf-clover-card",
    "silver-clover-bracelet",
    "car-evil-eye-fish",
    "crystal-ball-mood-lamp-6cm",
    "bookmark-gift-set",
    "agate-lucky-bracelet",
    "feng-shui-animal-canvas-gold",
    "obsidian-crystal-pyramid",
    "crystal-diamond-ornament",
    "crystal-ball-mood-lamp-8cm",
    "crystal-owl-statue",
    "obsidian-wish-bracelet",
    "zodiac-guardian-bracelet",
]
EMOJI = [
    "🐉", "🔔", "🪙", "🌳", "🐘", "🌻", "🐟", "🍀", "📿", "🎏",
    "🔮", "🔖", "💎", "🖼️", "🔺", "💠", "✨", "🦉", "⚫", "♈",
]
SHORT = [
    "황금 용 수호신 · 재물운",
    "만사형통 코뚜레 풍경종",
    "금원보 · 돈 들어오는 상징",
    "돈나무 · 금전수 미니어처",
    "황금 코끼리 · 재물운",
    "돈벼락 해바라기 캔버스",
    "엽전 명태 · 개업·선물",
    "네잎클로버 행운 카드",
    "실버 클로버 매듭 팔찌",
    "차량용 액막이 명태",
    "수정구슬 무드등 6cm",
    "행운 북마크 선물세트",
    "호안석 행운팔찌",
    "풍수 동물 캔버스액자",
    "흑요석 크리스탈 피라미드",
    "크리스탈 다이아몬드 오브제",
    "색변환 수정구슬 무드등",
    "크리스탈 부엉이 조각",
    "흑요석 소원성취 염주",
    "12지신 수호신 흑요석 팔찌",
]


def map_category(item: dict) -> str:
    ko = item["category_ko"]
    name = item["name"]
    if ko == "풍수":
        return "feng-shui"
    if ko == "크리스탈(행운)":
        return "crystal"
    if ko == "행운팔찌":
        return "charms"
    if "크리스탈" in name or "수정구슬" in name or ("연하" in name and "수정" in name):
        return "crystal"
    if "캔버스" in name or "풍수" in name:
        return "feng-shui"
    return "charms"


def make_body(item: dict, short: str, cat: str) -> str:
    cat_title = {
        "feng-shui": "풍수·개운",
        "charms": "부적·키링",
        "crystal": "크리스탈·원석",
    }.get(cat, "행운템")
    title = item["name"][:40] + ("…" if len(item["name"]) > 40 else "")
    return f"""{short}

## {title}

{cat_title} 카테고리에서 로또·복권 구매 전후로 많이 찾는 아이템입니다. **당첨을 보장하지는 않지만**, 기분 전환·선물·책상·차량 인테리어용으로 인기가 많습니다.

## 로또와 함께 쓰는 방법

- **명당 방문 전** — 휴대·차량용 소품으로 기분 환기
- **토요일 추첨 전** — 작은 의식용 (구매 금액과 무관하게 ‘한 장’만 사기 등)
- **당첨 후 선물** — 1~2만 원대 실용 선물

## 구매 전 참고

- 가격 **{item['price']:,}원**, 별점 **{item['rating']}** — 등록 시점 기준, **쿠팡에서 최종 확인**하세요.
- 본 페이지는 쿠팡 파트너스 제휴 링크를 포함합니다.
"""


def main() -> None:
    with open(IMPORT_PATH, encoding="utf-8") as f:
        items = json.load(f)

    mapped = []
    cat_counters: dict[str, int] = {}
    for i, item in enumerate(items):
        cat = map_category(item)
        cat_counters[cat] = cat_counters.get(cat, 0) + 1
        mapped.append(
            {
                "id": f"{cat}-{cat_counters[cat]:03d}",
                "slug": SLUGS[i],
                "name": item["name"],
                "price": item["price"],
                "rating": item["rating"],
                "imageEmoji": EMOJI[i],
                "coupangUrl": item["link"],
                "description": SHORT[i],
                "body": make_body(item, SHORT[i], cat),
                "category": cat,
            }
        )

    by_cat: dict[str, list] = {
        "feng-shui": [],
        "charms": [],
        "crystal": [],
        "this-week": [],
        "zodiac": [],
    }
    for m in mapped:
        by_cat[m["category"]].append(m)

    pick_idx = [4, 8, 1, 10, 19]
    for j, idx in enumerate(pick_idx):
        src = mapped[idx]
        by_cat["this-week"].append(
            {**src, "id": f"this-week-{j + 1:03d}", "category": "this-week"}
        )

    for j, idx in enumerate([19, 0]):
        src = mapped[idx]
        by_cat["zodiac"].append(
            {
                **src,
                "id": f"zodiac-{j + 1:03d}",
                "slug": ["zodiac-guardian-bracelet-2026", "zodiac-golden-dragon-2026"][j],
                "category": "zodiac",
            }
        )

    for cat, arr in by_cat.items():
        path = OUT_DIR / f"{cat}.json"
        with open(path, "w", encoding="utf-8") as f:
            json.dump(arr, f, ensure_ascii=False, indent=2)
        print(f"{cat}: {len(arr)}")


if __name__ == "__main__":
    main()
