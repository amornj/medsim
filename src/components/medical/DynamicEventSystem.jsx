// Dynamic Event Generation System
// Generates random complications and events based on scenario difficulty and time

const EQUIPMENT_FAILURES = [
  {
    equipmentTypes: ['ventilator', 'bipap', 'cpap', 'hfnc'],
    title: 'Ventilator Alarm',
    descriptions: [
      'High pressure alarm - patient fighting ventilator',
      'Low tidal volume - possible circuit leak',
      'FiO2 sensor malfunction - verify SpO2',
      'PEEP valve failure - reintubation may be needed'
    ],
    effects: ['SpO2 may drop rapidly', 'Manual bagging may be required'],
    severity: 'critical'
  },
  {
    equipmentTypes: ['iv_pump', 'syringe_pump'],
    title: 'Infusion Pump Failure',
    descriptions: [
      'Pump occlusion alarm - check IV line',
      'Air in line detected - prime tubing',
      'Battery backup mode - limited runtime',
      'Flow rate error - medication underdosed'
    ],
    effects: ['Medication delivery interrupted', 'Vital signs may deteriorate'],
    severity: 'warning'
  },
  {
    equipmentTypes: ['defibrillator', 'aed'],
    title: 'Defibrillator Malfunction',
    descriptions: [
      'Low battery warning - replace immediately',
      'Electrode pad disconnection',
      'Charge circuit failure - backup unit needed',
      'Sync mode error - manual shock only'
    ],
    effects: ['Unable to deliver shock', 'CPR only option'],
    severity: 'critical'
  },
  {
    equipmentTypes: ['ecmo', 'va_ecmo', 'vv_ecmo', 'cpb'],
    title: 'ECMO/CPB Circuit Issue',
    descriptions: [
      'Oxygenator membrane failure - gas exchange compromised',
      'Circuit thrombosis detected',
      'Pump flow fluctuation - check cannulas',
      'Heat exchanger malfunction - temperature control lost'
    ],
    effects: ['Immediate intervention required', 'Patient rapidly destabilizing'],
    severity: 'critical'
  },
  {
    equipmentTypes: ['arterial_line', 'swan_ganz', 'picco'],
    title: 'Monitoring Line Issue',
    descriptions: [
      'Arterial line dampened - flush required',
      'Transducer drift - recalibrate',
      'Line disconnection - blood loss risk',
      'Catheter migration - repositioning needed'
    ],
    effects: ['Inaccurate vital signs', 'Blind to hemodynamic changes'],
    severity: 'warning'
  }
];

const PATIENT_COMPLICATIONS = [
  {
    conditions: ['cardiac_arrest', 'septic_shock', 'trauma'],
    title: 'Sudden Cardiac Arrhythmia',
    descriptions: [
      'Patient developed ventricular tachycardia',
      'New onset atrial fibrillation with RVR',
      'Bradycardia with hemodynamic compromise',
      'PEA arrest - check reversible causes'
    ],
    vitalChanges: { heart_rate: [0, 180], blood_pressure_systolic: [-30, -50] },
    severity: 'critical',
    requiresAction: true,
    timeLimit: 45
  },
  {
    conditions: ['respiratory_failure', 'pneumonia', 'ards'],
    title: 'Respiratory Decompensation',
    descriptions: [
      'Acute bronchospasm - increasing airway pressures',
      'Mucus plugging - decreased breath sounds',
      'Tension pneumothorax developing',
      'Ventilator-patient dyssynchrony'
    ],
    vitalChanges: { spo2: [-15, -25], respiratory_rate: [5, 10] },
    severity: 'critical',
    requiresAction: true,
    timeLimit: 30
  },
  {
    conditions: ['septic_shock', 'trauma', 'gi_bleed'],
    title: 'Hemodynamic Deterioration',
    descriptions: [
      'Progressive hypotension despite vasopressors',
      'Acute blood loss - possible internal bleeding',
      'Distributive shock worsening',
      'Cardiac output dropping - pump failure'
    ],
    vitalChanges: { blood_pressure_systolic: [-40, -60], heart_rate: [20, 40] },
    severity: 'critical',
    requiresAction: true,
    timeLimit: 60
  },
  {
    conditions: ['stroke', 'head_injury_with_loc', 'intracranial_hemorrhage'],
    title: 'Neurological Decline',
    descriptions: [
      'Pupils becoming asymmetric - herniation risk',
      'GCS dropping - possible increased ICP',
      'New seizure activity observed',
      'Posturing noted - brainstem involvement'
    ],
    vitalChanges: { consciousness: 'Unresponsive' },
    severity: 'critical',
    requiresAction: true,
    timeLimit: 20
  },
  {
    conditions: ['any'],
    title: 'Allergic Reaction',
    descriptions: [
      'Patient developing urticaria and itching',
      'Possible anaphylaxis - angioedema noted',
      'Bronchospasm after medication administration',
      'Hypotension and tachycardia - drug reaction'
    ],
    vitalChanges: { spo2: [-10, -20], heart_rate: [30, 50], blood_pressure_systolic: [-20, -40] },
    severity: 'critical',
    requiresAction: true,
    timeLimit: 40
  }
];

const TIME_BASED_EVENTS = [
  {
    minTime: 300, // 5 minutes
    title: 'Lab Results Critical',
    descriptions: [
      'Lactate elevated to 8.0 mmol/L - tissue hypoperfusion',
      'Potassium 6.8 mEq/L - cardiac arrest risk',
      'pH 7.15 - severe acidosis',
      'Troponin significantly elevated - MI confirmed'
    ],
    severity: 'warning'
  },
  {
    minTime: 180, // 3 minutes
    title: 'Consultant Recommendation',
    descriptions: [
      'Cardiology recommends immediate cath lab',
      'Surgery suggests exploratory laparotomy',
      'Neurology advises CT perfusion study',
      'ICU team requests transfer within 30 minutes'
    ],
    severity: 'info'
  },
  {
    minTime: 420, // 7 minutes
    title: 'Family Member Inquiry',
    descriptions: [
      'Family asking about prognosis - consider goals of care',
      'Next of kin requesting DNR discussion',
      'Family member expressing concerns about treatment',
      'Patient advocate requesting care conference'
    ],
    severity: 'info'
  }
];

export function generateRandomEvent(scenario, equipment, elapsedTime, difficulty, performanceScore) {
  // Event probability increases with difficulty and time
  const baseProbability = 0.15;
  const difficultyMultiplier = difficulty / 6;
  const timeMultiplier = Math.min(elapsedTime / 600, 1); // Max at 10 minutes
  const performanceMultiplier = performanceScore < 60 ? 1.3 : 1.0;
  
  const eventProbability = baseProbability * difficultyMultiplier * timeMultiplier * performanceMultiplier;
  
  if (Math.random() > eventProbability) return null;
  
  // Determine event type
  const eventType = Math.random();
  
  // Equipment failure (30% chance if equipment present)
  if (eventType < 0.3 && equipment.length > 0) {
    const relevantFailures = EQUIPMENT_FAILURES.filter(failure =>
      equipment.some(eq => failure.equipmentTypes.includes(eq.type))
    );
    
    if (relevantFailures.length > 0) {
      const failure = relevantFailures[Math.floor(Math.random() * relevantFailures.length)];
      const failedEquipment = equipment.find(eq => failure.equipmentTypes.includes(eq.type));
      
      return {
        type: 'equipment_failure',
        title: failure.title,
        description: failure.descriptions[Math.floor(Math.random() * failure.descriptions.length)] +
                    ` (${failedEquipment.type.replace(/_/g, ' ')})`,
        effects: failure.effects,
        severity: failure.severity,
        equipmentId: failedEquipment.id,
        requiresAction: true,
        timeLimit: 60
      };
    }
  }
  
  // Patient complication (50% chance)
  if (eventType < 0.8) {
    const relevantComplications = PATIENT_COMPLICATIONS.filter(comp =>
      comp.conditions.includes('any') || comp.conditions.includes(scenario?.condition || scenario?.id)
    );
    
    if (relevantComplications.length > 0) {
      const complication = relevantComplications[Math.floor(Math.random() * relevantComplications.length)];
      
      return {
        type: 'patient_deterioration',
        title: complication.title,
        description: complication.descriptions[Math.floor(Math.random() * complication.descriptions.length)],
        vitalChanges: complication.vitalChanges,
        severity: complication.severity,
        requiresAction: complication.requiresAction,
        timeLimit: complication.timeLimit
      };
    }
  }
  
  // Time-based event (20% chance)
  const eligibleTimeEvents = TIME_BASED_EVENTS.filter(event => elapsedTime >= event.minTime);
  if (eligibleTimeEvents.length > 0) {
    const timeEvent = eligibleTimeEvents[Math.floor(Math.random() * eligibleTimeEvents.length)];
    
    return {
      type: 'time_critical',
      title: timeEvent.title,
      description: timeEvent.descriptions[Math.floor(Math.random() * timeEvent.descriptions.length)],
      severity: timeEvent.severity,
      requiresAction: false
    };
  }
  
  return null;
}

export function applyEventEffects(event, vitals, equipment) {
  let newVitals = { ...vitals };
  let affectedEquipment = [...equipment];
  
  // Apply vital changes
  if (event.vitalChanges) {
    Object.entries(event.vitalChanges).forEach(([vital, change]) => {
      if (Array.isArray(change)) {
        const [min, max] = change;
        const delta = min + Math.random() * (max - min);
        newVitals[vital] = Math.max(0, (newVitals[vital] || 0) + delta);
      } else {
        newVitals[vital] = change;
      }
    });
  }
  
  // Mark equipment as malfunctioning
  if (event.equipmentId) {
    affectedEquipment = affectedEquipment.map(eq =>
      eq.id === event.equipmentId
        ? { ...eq, malfunctioning: true, settings: { ...eq.settings, enabled: 'false' } }
        : eq
    );
  }
  
  return { newVitals, affectedEquipment };
}