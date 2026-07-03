// Static list of catalog categories shown in "Kham pha".
// Kept as plain strings on the Plant model (category: string) for flexibility,
// but this list is the canonical set the clients render as filter chips.
export const CATEGORIES = [
  { slug: "phong-ngu", label: "Phong ngu" },
  { slug: "ban-lam-viec", label: "Ban lam viec" },
  { slug: "phong-bep", label: "Phong bep" },
  { slug: "rau-cu-chua-benh", label: "Rau cu / Chua benh" },
  { slug: "phong-khach", label: "Phong khach" },
  { slug: "ngoai-troi", label: "Ngoai troi" },
];
