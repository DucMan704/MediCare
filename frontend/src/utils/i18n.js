export const specialityLabels = {
  "Bác sĩ đa khoa": "Bác sĩ đa khoa",
  "Sản phụ khoa": "Sản phụ khoa",
  "Da liễu": "Da liễu",
  "Nhi khoa": "Nhi khoa",
  "Thần kinh": "Thần kinh",
  "Tiêu hóa": "Tiêu hóa",
};

export const translateSpeciality = (key) => specialityLabels[key] || key;

export const specialityList = Object.keys(specialityLabels);

export const monthsVi = [
  "Th1",
  "Th2",
  "Th3",
  "Th4",
  "Th5",
  "Th6",
  "Th7",
  "Th8",
  "Th9",
  "Th10",
  "Th11",
  "Th12",
];

export const daysVi = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export const formatSlotDate = (slotDate) => {
  const dateArray = slotDate.split("_");
  return `${dateArray[0]} ${monthsVi[Number(dateArray[1]) - 1]} ${dateArray[2]}`;
};

export const translateExperience = (exp) => {
  if (!exp) return exp;
  return exp.replace(/(\d+)\s*Year(s)?/i, "$1 năm");
};
