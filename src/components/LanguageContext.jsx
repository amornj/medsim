import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    // Title Screen
    title: 'MEDICAL',
    subtitle: 'Life Support Simulator',
    tagline: 'Train. Save Lives. Excel.',
    play: 'PLAY',
    
    // Game Mode Selection
    selectGameMode: 'Select Game Mode',
    chooseResourceConstraints: 'Choose your difficulty and resource constraints',
    backToTitle: 'Back to Title',
    
    // Scenario Selection
    selectScenario: 'Select Emergency Scenario',
    searchScenarios: 'Search scenarios...',
    aiGenerate: 'AI Generate',
    manualSetup: 'Manual Setup',
    loadScenario: 'Load Scenario',
    changeGameMode: 'Change Game Mode',
    
    // Main Game
    patientVitals: 'Patient Vitals',
    equipmentPalette: 'Equipment Palette',
    performanceHistory: 'Performance History',
    patientHistory: 'Patient History',
    aiScribe: 'AI Scribe',
    surgery: 'Surgery',
    endNew: 'End & New',
    completeScenario: 'Complete Scenario',
    showAnatomy: 'Show Anatomy Viewer',
    hideAnatomy: 'Hide Anatomy Viewer',
    clinicalNotes: 'Clinical Notes',
    
    // Vitals
    heartRate: 'Heart Rate',
    bloodPressure: 'Blood Pressure',
    respRate: 'Resp Rate',
    temperature: 'Temperature',
    consciousness: 'Consciousness',
    advancedStats: 'Advanced Stats',
    vitalSigns: 'Vital Signs',
    ekgMonitor: 'EKG Monitor',
    
    // Equipment
    configureEquipment: 'Configure Equipment',
    removeEquipment: 'Remove Equipment',
    searchEquipment: 'Search equipment...',
    
    // Buttons
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    acknowledge: 'Acknowledge & Respond',
    
    // Alerts
    insufficientFunds: 'Insufficient funds!',
    equipmentAdded: 'Equipment added',
    equipmentRemoved: 'Equipment removed',
    configurationSaved: 'Configuration saved',
    scenarioCompleted: 'Scenario completed successfully!',
    
    // Performance
    overallScore: 'Overall Score',
    responseSpeed: 'Response Speed',
    bestPractices: 'Best Practices',
    resourceEfficiency: 'Resource Efficiency',
    
    // Difficulty Labels
    veryEasy: 'Very Easy',
    easy: 'Easy',
    moderate: 'Moderate',
    serious: 'Serious',
    severe: 'Severe',
    critical: 'Critical',
    lifeThreatening: 'Life-Threatening'
  },
  th: {
    // Title Screen
    title: 'การแพทย์',
    subtitle: 'โปรแกรมจำลองการช่วยชีวิต',
    tagline: 'ฝึกฝน. ช่วยชีวิต. เป็นเลิศ.',
    play: 'เล่น',
    
    // Game Mode Selection
    selectGameMode: 'เลือกโหมดเกม',
    chooseResourceConstraints: 'เลือกระดับความยากและข้อจำกัดทรัพยากร',
    backToTitle: 'กลับสู่หน้าหลัก',
    
    // Scenario Selection
    selectScenario: 'เลือกสถานการณ์ฉุกเฉิน',
    searchScenarios: 'ค้นหาสถานการณ์...',
    aiGenerate: 'สร้างด้วย AI',
    manualSetup: 'ตั้งค่าเอง',
    loadScenario: 'โหลดสถานการณ์',
    changeGameMode: 'เปลี่ยนโหมดเกม',
    
    // Main Game
    patientVitals: 'สัญญาณชีพผู้ป่วย',
    equipmentPalette: 'อุปกรณ์ทางการแพทย์',
    performanceHistory: 'ประวัติผลงาน',
    patientHistory: 'ประวัติผู้ป่วย',
    aiScribe: 'AI บันทึกข้อมูล',
    surgery: 'การผ่าตัด',
    endNew: 'จบและเริ่มใหม่',
    completeScenario: 'เสร็จสิ้นสถานการณ์',
    showAnatomy: 'แสดงภาพกายวิภาค',
    hideAnatomy: 'ซ่อนภาพกายวิภาค',
    clinicalNotes: 'บันทึกทางคลินิก',
    
    // Vitals
    heartRate: 'อัตราการเต้นของหัวใจ',
    bloodPressure: 'ความดันโลหิต',
    respRate: 'อัตราการหายใจ',
    temperature: 'อุณหภูมิ',
    consciousness: 'สติสัมปชัญญะ',
    advancedStats: 'ข้อมูลขั้นสูง',
    vitalSigns: 'สัญญาณชีพ',
    ekgMonitor: 'จอภาพคลื่นหัวใจ',
    
    // Equipment
    configureEquipment: 'ตั้งค่าอุปกรณ์',
    removeEquipment: 'ลบอุปกรณ์',
    searchEquipment: 'ค้นหาอุปกรณ์...',
    
    // Buttons
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    close: 'ปิด',
    acknowledge: 'รับทราบและตอบสนอง',
    
    // Alerts
    insufficientFunds: 'เงินไม่เพียงพอ!',
    equipmentAdded: 'เพิ่มอุปกรณ์แล้ว',
    equipmentRemoved: 'ลบอุปกรณ์แล้ว',
    configurationSaved: 'บันทึกการตั้งค่าแล้ว',
    scenarioCompleted: 'เสร็จสิ้นสถานการณ์เรียบร้อย!',
    
    // Performance
    overallScore: 'คะแนนรวม',
    responseSpeed: 'ความเร็วในการตอบสนอง',
    bestPractices: 'แนวปฏิบัติที่ดีที่สุด',
    resourceEfficiency: 'ประสิทธิภาพทรัพยากร',
    
    // Difficulty Labels
    veryEasy: 'ง่ายมาก',
    easy: 'ง่าย',
    moderate: 'ปานกลาง',
    serious: 'รุนแรง',
    severe: 'รุนแรงมาก',
    critical: 'วิกฤต',
    lifeThreatening: 'คุกคามชีวิต'
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'th' : 'en');
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};