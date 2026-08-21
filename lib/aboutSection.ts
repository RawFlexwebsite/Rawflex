export type AboutSectionSettings = {
  image_url: string
  eyebrow: string
  headline_top: string
  headline_bottom: string
  paragraph_one: string
  paragraph_two: string
  badge_value: string
  badge_label: string
  stat_one_value: string
  stat_one_label: string
  stat_two_value: string
  stat_two_label: string
  stat_three_value: string
  stat_three_label: string
}

export const DEFAULT_ABOUT_SECTION: AboutSectionSettings = {
  image_url: '/hero-parts.png',
  eyebrow: 'Our Story',
  headline_top: 'Built in Kanpur,',
  headline_bottom: 'made for the streets.',
  paragraph_one:
    "RAWFLEX started with a simple idea - streetwear that feels as good as it looks. Heavyweight fabric that survives the daily grind, acid washes you won't find anywhere else, and fits that move with you. Every piece is designed, printed and packed in Kanpur.",
  paragraph_two:
    "No fast-fashion shortcuts. Just drops we're proud to put our name on, shipped to every corner of India.",
  badge_value: '3+',
  badge_label: 'Years on the streets',
  stat_one_value: '120+',
  stat_one_label: 'Drops delivered',
  stat_two_value: '24',
  stat_two_label: 'States shipped to',
  stat_three_value: '5,000+',
  stat_three_label: 'Flexers styled',
}
