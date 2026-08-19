export const sampleImages: Record<string, string[]> = {
  'new-drops': [
    '/Samples/New drops/ChatGPT Image Aug 3, 2026, 01_49_56 AM.png',
    '/Samples/New drops/ChatGPT Image Jul 22, 2026, 12_39_19 AM.png',
    '/Samples/New drops/ChatGPT Image Jul 22, 2026, 12_41_11 AM.png',
    '/Samples/New drops/ChatGPT Image Jul 25, 2026, 02_24_33 PM.png',
  ],
  'best-sellers': [
    '/Samples/Best sellers/ChatGPT Image Aug 18, 2026, 01_59_39 PM.png',
    '/Samples/Best sellers/ChatGPT Image Aug 18, 2026, 02_04_48 PM.png',
  ],
  'streetwear-collection': [
    '/Samples/Street wear collection/ChatGPT Image Aug 18, 2026, 01_36_54 PM.png',
    '/Samples/Street wear collection/ChatGPT Image Aug 18, 2026, 01_40_26 PM.png',
    '/Samples/Street wear collection/ChatGPT Image Aug 18, 2026, 02_10_00 PM.png',
    '/Samples/Street wear collection/ChatGPT Image Jul 22, 2026, 01_03_24 AM.png',
    '/Samples/Street wear collection/ChatGPT Image Jul 22, 2026, 01_05_16 AM.png',
    '/Samples/Street wear collection/ChatGPT Image Jul 22, 2026, 11_34_02 PM.png',
    '/Samples/Street wear collection/ChatGPT Image Jul 22, 2026, 11_41_46 PM.png',
    '/Samples/Street wear collection/IMG-20260818-WA0010.jpg',
    '/Samples/Street wear collection/IMG-20260818-WA0011.jpg',
    '/Samples/Street wear collection/IMG-20260818-WA0013.jpg',
    '/Samples/Street wear collection/IMG-20260818-WA0014.jpg',
    '/Samples/Street wear collection/IMG_20260818_133403.png.jpg',
  ],
  'acid-wash': [
    '/Samples/Acid wash/ChatGPT Image Jul 22, 2026, 12_47_17 AM.png',
    '/Samples/Acid wash/ChatGPT Image Jul 22, 2026, 12_48_59 AM.png',
    '/Samples/Acid wash/ChatGPT Image Jul 22, 2026, 12_55_16 AM.png',
  ],
  'gym-collection': [
    '/Samples/Gym Collection/ChatGPT Image Jul 22, 2026, 10_12_54 PM.png',
    '/Samples/Gym Collection/IMG-20260818-WA0012.jpg',
    '/Samples/Gym Collection/IMG-20260818-WA0015.jpg',
    '/Samples/Gym Collection/IMG-20260818-WA0016.jpg',
  ],
  'limited-edition': [
    '/Samples/Limited Edition/ChatGPT Image Aug 3, 2026, 01_20_31 AM.png',
    '/Samples/Limited Edition/ChatGPT Image Jul 22, 2026, 03_20_56 AM.png',
  ],
};

export function getSampleImages(categoryId: string): string[] {
  return sampleImages[categoryId] || [];
}

export function hasSampleImages(categoryId: string): boolean {
  return categoryId in sampleImages && sampleImages[categoryId].length > 0;
}