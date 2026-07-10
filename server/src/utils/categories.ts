// Static list of catalog categories shown in "Kham pha".
// Kept as plain strings on the Plant model (category: string) for flexibility,
// but this list is the canonical set the clients render as filter chips.
// IMPORTANT: this must stay in sync with Mobile's ExploreScreen CATEGORIES
// list (src/screens/ExploreScreen.tsx) — a slug here that Mobile doesn't
// have (or vice versa) means that filter tab silently shows zero plants.
export const CATEGORIES = [
  { slug: "phong-ngu", label: "Phòng ngủ" },
  { slug: "ban-lam-viec", label: "Bàn làm việc" },
  { slug: "phong-bep", label: "Phòng bếp" },
  { slug: "phong-khach", label: "Phòng khách" },
  { slug: "san-nha", label: "Sân nhà" },
  { slug: "ban-cong", label: "Ban công" },
  { slug: "rau-cu-chua-benh", label: "Rau củ / Chữa bệnh" },
];
