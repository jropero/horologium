export interface Shichen {
  id: number;
  branchHanzi: string;
  branchPinyin: string;
  animalHanzi: string;
  animalPinyin: string;
  animalName: string;
  animalEmoji: string;
  startHour: number;
  endHour: number;
  meaning: string;
}

export const SHICHEN_DATA: Shichen[] = [
  { id: 1, branchHanzi: "子", branchPinyin: "Zǐ", animalHanzi: "鼠", animalPinyin: "Shǔ", animalName: "Rata", animalEmoji: "🐀", startHour: 23, endHour: 1, meaning: "Las ratas están más activas buscando comida en la oscuridad de la noche." },
  { id: 2, branchHanzi: "丑", branchPinyin: "Chǒu", animalHanzi: "牛", animalPinyin: "Niú", animalName: "Buey", animalEmoji: "🐂", startHour: 1, endHour: 3, meaning: "Los bueyes rumian y se alimentan lentamente preparándose para el trabajo del día." },
  { id: 3, branchHanzi: "寅", branchPinyin: "Yín", animalHanzi: "虎", animalPinyin: "Hǔ", animalName: "Tigre", animalEmoji: "🐅", startHour: 3, endHour: 5, meaning: "Los tigres están más activos, feroces y cazan sus presas antes del amanecer." },
  { id: 4, branchHanzi: "卯", branchPinyin: "Mǎo", animalHanzi: "兔", animalPinyin: "Tù", animalName: "Conejo", animalEmoji: "🐇", startHour: 5, endHour: 7, meaning: "El Conejo de Jade de la luna machaca elixires mágicos; los conejos terrenales salen a pastar el rocío." },
  { id: 5, branchHanzi: "辰", branchPinyin: "Chén", animalHanzi: "龙", animalPinyin: "Lóng", animalName: "Dragón", animalEmoji: "🐉", startHour: 7, endHour: 9, meaning: "Los dragones ascienden a los cielos para reunir nubes y hacer llover sobre la tierra." },
  { id: 6, branchHanzi: "巳", branchPinyin: "Sì", animalHanzi: "蛇", animalPinyin: "Shé", animalName: "Serpiente", animalEmoji: "🐍", startHour: 9, endHour: 11, meaning: "Las serpientes salen de sus madrigueras para buscar calor bajo el sol naciente." },
  { id: 7, branchHanzi: "午", branchPinyin: "Wǔ", animalHanzi: "马", animalPinyin: "Mǎ", animalName: "Caballo", animalEmoji: "🐎", startHour: 11, endHour: 13, meaning: "El sol está en su cenit (Yang máximo). Los caballos celestiales corren vigorosos." },
  { id: 8, branchHanzi: "未", branchPinyin: "Wèi", animalHanzi: "羊", animalPinyin: "Yáng", animalName: "Cabra", animalEmoji: "🐐", startHour: 13, endHour: 15, meaning: "Las cabras pastan sin dañar las raíces, permitiendo que la hierba vuelva a crecer." },
  { id: 9, branchHanzi: "申", branchPinyin: "Shēn", animalHanzi: "猴", animalPinyin: "Hóu", animalName: "Mono", animalEmoji: "🐒", startHour: 15, endHour: 17, meaning: "Los monos se vuelven más animados, aullando y saltando entre los árboles antes del atardecer." },
  { id: 10, branchHanzi: "酉", branchPinyin: "Yǒu", animalHanzi: "鸡", animalPinyin: "Jī", animalName: "Gallo", animalEmoji: "🐓", startHour: 17, endHour: 19, meaning: "El sol se oculta. Los gallos terminan de comer y regresan a sus gallineros." },
  { id: 11, branchHanzi: "戌", branchPinyin: "Xū", animalHanzi: "狗", animalPinyin: "Gǒu", animalName: "Perro", animalEmoji: "🐕", startHour: 19, endHour: 21, meaning: "Cae la noche. Los perros comienzan su vigilancia para proteger el hogar." },
  { id: 12, branchHanzi: "亥", branchPinyin: "Hài", animalHanzi: "猪", animalPinyin: "Zhū", animalName: "Cerdo", animalEmoji: "🐖", startHour: 21, endHour: 23, meaning: "Todo está en silencio. Los cerdos duermen profundamente." },
];

export const getCurrentShichen = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const current = SHICHEN_DATA.find((shichen) => {
    if (shichen.startHour < shichen.endHour) {
      return hours >= shichen.startHour && hours < shichen.endHour;
    } else {
      // Periodo de la Rata (23:00 - 01:00)
      return hours >= shichen.startHour || hours < shichen.endHour;
    }
  }) || SHICHEN_DATA[0];

  // Calculate progress within the 120-minute period
  // Convert current time to minutes from the start of the Shichen
  let startMinutes = current.startHour * 60;
  let currentMinutes = hours * 60 + minutes;

  // Adjust for wrap-around
  if (hours < current.startHour) {
    currentMinutes += 24 * 60;
  }
  
  const minutesIntoShichen = currentMinutes - startMinutes;
  const progressPercent = Math.min(Math.max(minutesIntoShichen / 120, 0), 1);

  return { current, progressPercent };
};
