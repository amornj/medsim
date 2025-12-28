// Random patient history generator for realistic scenarios

const MEDICAL_CONDITIONS = [
  'Hypertension', 'Type 2 Diabetes', 'COPD', 'Asthma', 'CHF', 'Coronary artery disease',
  'Chronic kidney disease', 'Atrial fibrillation', 'Hyperlipidemia', 'GERD',
  'Hypothyroidism', 'Depression', 'Anxiety', 'Osteoarthritis', 'Obesity',
  'Sleep apnea', 'Peripheral vascular disease', 'Stroke history', 'Cancer (in remission)',
  'Rheumatoid arthritis', 'Cirrhosis', 'Hepatitis C', 'HIV positive'
];

const MEDICATIONS = [
  'Lisinopril 10mg daily', 'Metformin 1000mg BID', 'Atorvastatin 20mg daily',
  'Aspirin 81mg daily', 'Metoprolol 50mg BID', 'Levothyroxine 75mcg daily',
  'Omeprazole 20mg daily', 'Albuterol MDI PRN', 'Furosemide 40mg daily',
  'Warfarin 5mg daily', 'Sertraline 100mg daily', 'Gabapentin 300mg TID',
  'Insulin glargine 20 units qHS', 'Prednisone 10mg daily', 'Amlodipine 10mg daily'
];

const ALLERGIES = [
  'Penicillin - anaphylaxis', 'Penicillin - rash', 'Sulfa drugs - Stevens-Johnson syndrome',
  'Morphine - respiratory depression', 'Codeine - nausea', 'Iodine contrast - hives',
  'Latex - contact dermatitis', 'Shellfish - anaphylaxis', 'NSAIDs - bronchospasm',
  'Aspirin - GI bleeding', 'Vancomycin - red man syndrome'
];

const SMOKING_STATUS = [
  'Never smoker',
  '10 pack-year history, quit 5 years ago',
  '20 pack-year history, quit 2 years ago',
  '40 pack-year history, quit 1 year ago',
  'Active smoker, 1 pack per day for 15 years',
  'Active smoker, half pack per day for 10 years'
];

const ALCOHOL_USE = [
  'Denies',
  'Social drinker, 1-2 drinks/week',
  'Moderate drinker, 3-5 drinks/week',
  'Heavy drinker, daily use',
  'Recovering alcoholic, sober 3 years',
  'Occasional wine with dinner'
];

const OCCUPATIONS = [
  'Teacher', 'Construction worker', 'Nurse', 'Office manager', 'Retired',
  'Accountant', 'Factory worker', 'Truck driver', 'Engineer', 'Sales representative',
  'Healthcare administrator', 'IT professional', 'Restaurant server', 'Mechanic'
];

export function generateRandomPatientHistory(options = {}) {
  // Random number of conditions (0-4)
  const numConditions = Math.floor(Math.random() * 5);
  const conditions = [];
  for (let i = 0; i < numConditions; i++) {
    const condition = MEDICAL_CONDITIONS[Math.floor(Math.random() * MEDICAL_CONDITIONS.length)];
    if (!conditions.includes(condition)) {
      conditions.push(condition);
    }
  }

  // Random number of medications (0-5)
  const numMeds = Math.floor(Math.random() * 6);
  const medications = [];
  for (let i = 0; i < numMeds; i++) {
    const med = MEDICATIONS[Math.floor(Math.random() * MEDICATIONS.length)];
    if (!medications.includes(med)) {
      medications.push(med);
    }
  }

  // Random allergies (0-2)
  const numAllergies = Math.floor(Math.random() * 3);
  const allergies = [];
  for (let i = 0; i < numAllergies; i++) {
    const allergy = ALLERGIES[Math.floor(Math.random() * ALLERGIES.length)];
    if (!allergies.includes(allergy)) {
      allergies.push(allergy);
    }
  }

  // Age for pediatrician
  const age = options.young_age ? Math.floor(Math.random() * 15) + 1 : Math.floor(Math.random() * (90 - 18 + 1)) + 18;
  
  // Smoking status
  let smokingStatus = SMOKING_STATUS[Math.floor(Math.random() * SMOKING_STATUS.length)];
  if (options.no_smoking) {
    smokingStatus = 'Never smoker';
  }

  // Alcohol use
  let alcoholUse = ALCOHOL_USE[Math.floor(Math.random() * ALCOHOL_USE.length)];
  if (options.no_alcohol) {
    alcoholUse = 'Denies';
  }

  return {
    past_medical: conditions,
    current_medications: medications,
    allergies: allergies,
    social_history: {
      age: age,
      smoking: smokingStatus,
      alcohol: alcoholUse,
      drugs: Math.random() > 0.9 ? 'Marijuana occasionally' : 'Denies',
      occupation: OCCUPATIONS[Math.floor(Math.random() * OCCUPATIONS.length)]
    }
  };
}