export const site = {
  name: "Cult Barber Studio",
  tagline: "Industrial. Crafted. Personal.",
  mission:
    "One-on-one appointments with real attention to detail. No waiting-room noise, no conveyor-belt cuts — just precision work in a space built for the culture.",
  bookingUrl:
    "https://app.squareup.com/appointments/book/akcqkt91qyx43y/L7JEDX4G1KGJ8/start",
  instagram: {
    handle: "@cult.barber.studio",
    url: "https://www.instagram.com/cult.barber.studio/",
  },
  promo: { code: "CULTNEW20", text: "20% off your first cut" },
  contact: {
    address: "Warehouse 23, 4 Peacock Road, Tyabb VIC 3912",
    mapsUrl:
      "https://maps.google.com/?q=Warehouse+23,+4+Peacock+Road,+Tyabb+VIC+3912",
    phoneDisplay: "+61 483 797 635",
    phoneHref: "tel:+61483797635",
    email: "management@cultbarberstudio.com",
    hours: "By appointment only — book online anytime",
  },
} as const;

export const nav = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
] as const;

export type Service = {
  name: string;
  description: string;
  price: number;
  popular?: boolean;
};

export const services: Service[] = [
  {
    name: "Skin Fade",
    description:
      "A sharp, seamless fade from skin or a .5 guard and below into your desired length on top.",
    price: 60,
    popular: true,
  },
  {
    name: "Skin Fade & Beard",
    description:
      "Full skin fade with a beard trim, shape-up, cut-throat razor detailing, and a hot towel shave.",
    price: 80,
    popular: true,
  },
  {
    name: "Standard Cut",
    description: "A classic haircut using clippers on the sides and scissors on top.",
    price: 50,
  },
  {
    name: "Standard Cut & Beard",
    description:
      "A standard cut paired with a full beard trim, shaping, razor detailing, and hot towel shave.",
    price: 70,
  },
  {
    name: "Scissor Cut",
    description:
      "A scissor-focused cut using little to no clippers. Best for longer styles and a softer finish.",
    price: 60,
  },
  {
    name: "Full Restyle",
    description:
      "A complete change of hairstyle — consultation, reshaping, and styling.",
    price: 65,
  },
  {
    name: "Beard Trim",
    description:
      "Full beard grooming: trimming, shaping, cut-throat razor line-up, and a relaxing hot towel shave.",
    price: 35,
  },
  {
    name: "Buzz Cut",
    description: "A clean, even clipper cut all over.",
    price: 35,
  },
  {
    name: "Eyebrow Waxing",
    description: "Professional eyebrow shaping using wax for a clean, sharp finish.",
    price: 40,
  },
  {
    name: "Kids Cut",
    description: "A tailored haircut for children, finished neatly.",
    price: 40,
  },
  {
    name: "Kids Fade",
    description: "A fade haircut for children with blended sides and back.",
    price: 45,
  },
  {
    name: "Seniors Cut",
    description: "A discounted cut for senior clients — seniors card required.",
    price: 35,
  },
];

export type Barber = {
  name: string;
  role: string;
  bio: string;
  specialties: string[];
};

export const team: Barber[] = [
  {
    name: "Bryn",
    role: "Founder & Barber",
    bio: "With over 7 years of experience, Bryn founded Cult Barber Studio with a vision to elevate traditional barbering through precision, consistency, and modern style.",
    specialties: ["Skin fades", "Beard work"],
  },
  {
    name: "Josh",
    role: "Senior Barber",
    bio: "Josh has a passion for clean cuts, sharp fades, and detailed beard work. Specialising in modern cuts, longer-length styles, and precision grooming, he makes every client leave feeling confident.",
    specialties: ["Modern cuts", "Longer lengths", "Precision grooming"],
  },
  {
    name: "Jai",
    role: "Barber",
    bio: "Jai specialises in clean fades, tapers, classic cuts, and detailed beard work. With a strong eye for balance and structure, he's known for consistent, sharp results.",
    specialties: ["Clean fades", "Tapers", "Classic cuts"],
  },
];
