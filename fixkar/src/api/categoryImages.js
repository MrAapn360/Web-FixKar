// Maps each service category to its image assets under
// /public/images/categories/[category-slug]/. Keeping this as a single
// lookup means new categories only need a folder + one entry here.
const SLUGS = {
  Electrician: "electrician",
  Plumber: "plumber",
  Carpenter: "carpenter",
  "AC Technician": "ac-technician",
  Mechanic: "mechanic",
  Painter: "painter",
  Laborer: "laborer",
};

export function categoryIcon(category) {
  const slug = SLUGS[category];
  return slug ? `/images/categories/${slug}/icon.svg` : null;
}

// Full-body 3D-style mascot illustration for a category — same character
// art used on the mobile app's home screen and promo cards.
export function categoryMascot(category) {
  const slug = SLUGS[category];
  return slug ? `/mascots/${slug}.svg` : null;
}

export default SLUGS;
