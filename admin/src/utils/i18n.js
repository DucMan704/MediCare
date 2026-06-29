export const specialityLabels = {
  "General physician": "Bác sĩ đa khoa",
  Gynecologist: "Sản phụ khoa",
  Dermatologist: "Da liễu",
  Pediatricians: "Nhi khoa",
  Neurologist: "Thần kinh",
  Gastroenterologist: "Tiêu hóa",
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

export const formatSlotDate = (slotDate) => {
  const dateArray = slotDate.split("_");
  return `${dateArray[0]} ${monthsVi[Number(dateArray[1]) - 1]} ${dateArray[2]}`;
};

export const translateExperience = (exp) => {
  if (!exp) return exp;
  return exp.replace(/(\d+)\s*Year(s)?/i, "$1 năm");
};
