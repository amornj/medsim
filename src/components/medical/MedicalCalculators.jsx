import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Pill, Brain, Heart, Flame, Scale, Droplets, Wind, Activity, Stethoscope, AlertTriangle, Zap, Shield } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

// Drug Dosage Calculator
function DrugDosageCalculator() {
  const [weight, setWeight] = useState('');
  const [dosePerKg, setDosePerKg] = useState('');
  const [frequency, setFrequency] = useState('1');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const d = parseFloat(dosePerKg);
    const f = parseInt(frequency);
    if (w > 0 && d > 0) {
      const singleDose = w * d;
      const dailyDose = singleDose * f;
      setResult({ singleDose, dailyDose, frequency: f });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Patient Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dosePerKg">Dose (mg/kg)</Label>
          <Input
            id="dosePerKg"
            type="number"
            placeholder="10"
            value={dosePerKg}
            onChange={(e) => setDosePerKg(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="frequency">Daily Frequency</Label>
        <Select value={frequency} onValueChange={setFrequency}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Once daily (QD)</SelectItem>
            <SelectItem value="2">Twice daily (BID)</SelectItem>
            <SelectItem value="3">Three times daily (TID)</SelectItem>
            <SelectItem value="4">Four times daily (QID)</SelectItem>
            <SelectItem value="6">Every 4 hours (Q4H)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={calculate} className="w-full">Calculate Dose</Button>
      {result && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-green-600">Single Dose</p>
                <p className="text-2xl font-bold text-green-800">{result.singleDose.toFixed(1)} mg</p>
              </div>
              <div>
                <p className="text-sm text-green-600">Daily Total</p>
                <p className="text-2xl font-bold text-green-800">{result.dailyDose.toFixed(1)} mg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Glasgow Coma Scale Calculator
function GCSCalculator() {
  const [eye, setEye] = useState('4');
  const [verbal, setVerbal] = useState('5');
  const [motor, setMotor] = useState('6');

  const total = parseInt(eye) + parseInt(verbal) + parseInt(motor);

  const getSeverity = () => {
    if (total >= 13) return { label: 'Minor', color: 'bg-green-100 text-green-800' };
    if (total >= 9) return { label: 'Moderate', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Severe', color: 'bg-red-100 text-red-800' };
  };

  const severity = getSeverity();

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-2">
          <Label>Eye Opening (E)</Label>
          <Select value={eye} onValueChange={setEye}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4 - Spontaneous</SelectItem>
              <SelectItem value="3">3 - To voice</SelectItem>
              <SelectItem value="2">2 - To pain</SelectItem>
              <SelectItem value="1">1 - None</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Verbal Response (V)</Label>
          <Select value={verbal} onValueChange={setVerbal}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 - Oriented</SelectItem>
              <SelectItem value="4">4 - Confused</SelectItem>
              <SelectItem value="3">3 - Inappropriate words</SelectItem>
              <SelectItem value="2">2 - Incomprehensible sounds</SelectItem>
              <SelectItem value="1">1 - None</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Motor Response (M)</Label>
          <Select value={motor} onValueChange={setMotor}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 - Obeys commands</SelectItem>
              <SelectItem value="5">5 - Localizes pain</SelectItem>
              <SelectItem value="4">4 - Withdraws from pain</SelectItem>
              <SelectItem value="3">3 - Abnormal flexion</SelectItem>
              <SelectItem value="2">2 - Extension</SelectItem>
              <SelectItem value="1">1 - None</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card className={severity.color.split(' ')[0] + ' border'}>
        <CardContent className="pt-4 text-center">
          <p className="text-4xl font-bold">{total}/15</p>
          <Badge className={severity.color + ' mt-2'}>{severity.label} Brain Injury</Badge>
          <p className="text-sm mt-2">E{eye}V{verbal}M{motor}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// SOFA Score Calculator
function SOFACalculator() {
  const [respiratory, setRespiratory] = useState('0');
  const [coagulation, setCoagulation] = useState('0');
  const [liver, setLiver] = useState('0');
  const [cardiovascular, setCardiovascular] = useState('0');
  const [cns, setCns] = useState('0');
  const [renal, setRenal] = useState('0');

  const total = [respiratory, coagulation, liver, cardiovascular, cns, renal]
    .reduce((sum, val) => sum + parseInt(val), 0);

  const getMortality = () => {
    if (total <= 1) return '<6.4%';
    if (total <= 3) return '6.4-20%';
    if (total <= 6) return '20-33%';
    if (total <= 9) return '33-50%';
    if (total <= 12) return '50-80%';
    return '>80%';
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Respiratory (PaO2/FiO2)</Label>
          <Select value={respiratory} onValueChange={setRespiratory}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0: ≥400</SelectItem>
              <SelectItem value="1">1: 300-399</SelectItem>
              <SelectItem value="2">2: 200-299</SelectItem>
              <SelectItem value="3">3: 100-199 + vent</SelectItem>
              <SelectItem value="4">4: &lt;100 + vent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Coagulation (Plt ×10³/µL)</Label>
          <Select value={coagulation} onValueChange={setCoagulation}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0: ≥150</SelectItem>
              <SelectItem value="1">1: 100-149</SelectItem>
              <SelectItem value="2">2: 50-99</SelectItem>
              <SelectItem value="3">3: 20-49</SelectItem>
              <SelectItem value="4">4: &lt;20</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Liver (Bilirubin mg/dL)</Label>
          <Select value={liver} onValueChange={setLiver}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0: &lt;1.2</SelectItem>
              <SelectItem value="1">1: 1.2-1.9</SelectItem>
              <SelectItem value="2">2: 2.0-5.9</SelectItem>
              <SelectItem value="3">3: 6.0-11.9</SelectItem>
              <SelectItem value="4">4: ≥12</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Cardiovascular (MAP/Pressors)</Label>
          <Select value={cardiovascular} onValueChange={setCardiovascular}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0: MAP ≥70</SelectItem>
              <SelectItem value="1">1: MAP &lt;70</SelectItem>
              <SelectItem value="2">2: Dop ≤5 / Dob</SelectItem>
              <SelectItem value="3">3: Dop &gt;5 / Epi ≤0.1</SelectItem>
              <SelectItem value="4">4: Dop &gt;15 / Epi &gt;0.1</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">CNS (GCS)</Label>
          <Select value={cns} onValueChange={setCns}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0: 15</SelectItem>
              <SelectItem value="1">1: 13-14</SelectItem>
              <SelectItem value="2">2: 10-12</SelectItem>
              <SelectItem value="3">3: 6-9</SelectItem>
              <SelectItem value="4">4: &lt;6</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Renal (Cr mg/dL or UO)</Label>
          <Select value={renal} onValueChange={setRenal}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0: &lt;1.2</SelectItem>
              <SelectItem value="1">1: 1.2-1.9</SelectItem>
              <SelectItem value="2">2: 2.0-3.4</SelectItem>
              <SelectItem value="3">3: 3.5-4.9 / UO &lt;500</SelectItem>
              <SelectItem value="4">4: ≥5.0 / UO &lt;200</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4 text-center">
          <p className="text-3xl font-bold text-blue-800">{total}/24</p>
          <p className="text-sm text-blue-600 mt-1">Est. Mortality: {getMortality()}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Parkland Formula Calculator
function ParklandCalculator() {
  const [weight, setWeight] = useState('');
  const [tbsa, setTbsa] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const b = parseFloat(tbsa);
    if (w > 0 && b > 0 && b <= 100) {
      const total24hr = 4 * w * b;
      const first8hr = total24hr / 2;
      const second16hr = total24hr / 2;
      const hourlyFirst8 = first8hr / 8;
      const hourlyNext16 = second16hr / 16;
      setResult({ total24hr, first8hr, second16hr, hourlyFirst8, hourlyNext16 });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="burnWeight">Patient Weight (kg)</Label>
          <Input
            id="burnWeight"
            type="number"
            placeholder="70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tbsa">TBSA Burned (%)</Label>
          <Input
            id="tbsa"
            type="number"
            placeholder="20"
            min="1"
            max="100"
            value={tbsa}
            onChange={(e) => setTbsa(e.target.value)}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Formula: 4ml × weight(kg) × TBSA%</p>
      <Button onClick={calculate} className="w-full">Calculate Fluid Requirements</Button>
      {result && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-4 space-y-3">
            <div className="text-center">
              <p className="text-sm text-orange-600">Total 24hr Volume (LR)</p>
              <p className="text-2xl font-bold text-orange-800">{(result.total24hr / 1000).toFixed(1)} L</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="bg-orange-100 p-2 rounded">
                <p className="font-semibold">First 8 hours</p>
                <p>{(result.first8hr / 1000).toFixed(1)} L</p>
                <p className="text-xs text-orange-600">{result.hourlyFirst8.toFixed(0)} mL/hr</p>
              </div>
              <div className="bg-orange-100 p-2 rounded">
                <p className="font-semibold">Next 16 hours</p>
                <p>{(result.second16hr / 1000).toFixed(1)} L</p>
                <p className="text-xs text-orange-600">{result.hourlyNext16.toFixed(0)} mL/hr</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// BMI Calculator
function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState('metric');
  const [result, setResult] = useState(null);

  const calculate = () => {
    let w = parseFloat(weight);
    let h = parseFloat(height);

    if (unit === 'imperial') {
      w = w * 0.453592; // lbs to kg
      h = h * 0.0254; // inches to meters
    } else {
      h = h / 100; // cm to meters
    }

    if (w > 0 && h > 0) {
      const bmi = w / (h * h);
      let category, color;
      if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-600'; }
      else if (bmi < 25) { category = 'Normal'; color = 'text-green-600'; }
      else if (bmi < 30) { category = 'Overweight'; color = 'text-yellow-600'; }
      else if (bmi < 35) { category = 'Obese Class I'; color = 'text-orange-600'; }
      else if (bmi < 40) { category = 'Obese Class II'; color = 'text-red-500'; }
      else { category = 'Obese Class III'; color = 'text-red-700'; }
      setResult({ bmi, category, color });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <Button
          variant={unit === 'metric' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUnit('metric')}
        >
          Metric
        </Button>
        <Button
          variant={unit === 'imperial' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUnit('imperial')}
        >
          Imperial
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bmiWeight">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</Label>
          <Input
            id="bmiWeight"
            type="number"
            placeholder={unit === 'metric' ? '70' : '154'}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bmiHeight">Height ({unit === 'metric' ? 'cm' : 'in'})</Label>
          <Input
            id="bmiHeight"
            type="number"
            placeholder={unit === 'metric' ? '175' : '69'}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
      </div>
      <Button onClick={calculate} className="w-full">Calculate BMI</Button>
      {result && (
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="pt-4 text-center">
            <p className="text-4xl font-bold">{result.bmi.toFixed(1)}</p>
            <p className={`text-lg font-semibold mt-1 ${result.color}`}>{result.category}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Creatinine Clearance Calculator (Cockcroft-Gault)
function CrClCalculator() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [creatinine, setCr] = useState('');
  const [sex, setSex] = useState('male');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const cr = parseFloat(creatinine);

    if (a > 0 && w > 0 && cr > 0) {
      let crcl = ((140 - a) * w) / (72 * cr);
      if (sex === 'female') crcl *= 0.85;

      let stage, color;
      if (crcl >= 90) { stage = 'Normal (G1)'; color = 'text-green-600'; }
      else if (crcl >= 60) { stage = 'Mild (G2)'; color = 'text-yellow-600'; }
      else if (crcl >= 45) { stage = 'Mild-Mod (G3a)'; color = 'text-orange-500'; }
      else if (crcl >= 30) { stage = 'Mod-Severe (G3b)'; color = 'text-orange-600'; }
      else if (crcl >= 15) { stage = 'Severe (G4)'; color = 'text-red-500'; }
      else { stage = 'Kidney Failure (G5)'; color = 'text-red-700'; }

      setResult({ crcl, stage, color });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Age (years)</Label>
          <Input
            type="number"
            placeholder="65"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Weight (kg)</Label>
          <Input
            type="number"
            placeholder="70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Serum Creatinine (mg/dL)</Label>
          <Input
            type="number"
            step="0.1"
            placeholder="1.2"
            value={creatinine}
            onChange={(e) => setCr(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Sex</Label>
          <Select value={sex} onValueChange={setSex}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Cockcroft-Gault: CrCl = [(140-age) × weight] / (72 × Cr) × 0.85 if female</p>
      <Button onClick={calculate} className="w-full">Calculate CrCl</Button>
      {result && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-purple-800">{result.crcl.toFixed(1)} mL/min</p>
            <p className={`font-semibold mt-1 ${result.color}`}>{result.stage}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Corrected Calcium and Sodium Calculator
function CorrectedLabsCalculator() {
  const [calcType, setCalcType] = useState('calcium');

  // Calcium correction
  const [calcium, setCalcium] = useState('');
  const [albumin, setAlbumin] = useState('');
  const [correctedCa, setCorrectedCa] = useState(null);

  // Sodium correction
  const [sodium, setSodium] = useState('');
  const [glucose, setGlucose] = useState('');
  const [correctedNa, setCorrectedNa] = useState(null);

  const calculateCalcium = () => {
    const ca = parseFloat(calcium);
    const alb = parseFloat(albumin);
    if (ca > 0 && alb > 0) {
      const corrected = ca + 0.8 * (4 - alb);
      setCorrectedCa(corrected);
    }
  };

  const calculateSodium = () => {
    const na = parseFloat(sodium);
    const glu = parseFloat(glucose);
    if (na > 0 && glu > 0) {
      const corrected = na + 1.6 * ((glu - 100) / 100);
      setCorrectedNa(corrected);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <Button
          variant={calcType === 'calcium' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCalcType('calcium')}
        >
          Calcium
        </Button>
        <Button
          variant={calcType === 'sodium' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCalcType('sodium')}
        >
          Sodium
        </Button>
      </div>

      {calcType === 'calcium' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Measured Calcium (mg/dL)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="8.5"
                value={calcium}
                onChange={(e) => setCalcium(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Albumin (g/dL)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="3.5"
                value={albumin}
                onChange={(e) => setAlbumin(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Formula: Ca + 0.8 × (4 - Albumin)</p>
          <Button onClick={calculateCalcium} className="w-full">Calculate Corrected Calcium</Button>
          {correctedCa !== null && (
            <Card className="bg-teal-50 border-teal-200">
              <CardContent className="pt-4 text-center">
                <p className="text-sm text-teal-600">Corrected Calcium</p>
                <p className="text-3xl font-bold text-teal-800">{correctedCa.toFixed(1)} mg/dL</p>
                <p className="text-xs mt-1 text-teal-600">Normal: 8.5-10.5 mg/dL</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Measured Sodium (mEq/L)</Label>
              <Input
                type="number"
                placeholder="135"
                value={sodium}
                onChange={(e) => setSodium(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Glucose (mg/dL)</Label>
              <Input
                type="number"
                placeholder="400"
                value={glucose}
                onChange={(e) => setGlucose(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Formula: Na + 1.6 × [(Glucose - 100) / 100]</p>
          <Button onClick={calculateSodium} className="w-full">Calculate Corrected Sodium</Button>
          {correctedNa !== null && (
            <Card className="bg-cyan-50 border-cyan-200">
              <CardContent className="pt-4 text-center">
                <p className="text-sm text-cyan-600">Corrected Sodium</p>
                <p className="text-3xl font-bold text-cyan-800">{correctedNa.toFixed(1)} mEq/L</p>
                <p className="text-xs mt-1 text-cyan-600">Normal: 135-145 mEq/L</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// A-a Gradient Calculator
function AaGradientCalculator() {
  const [fio2, setFio2] = useState('');
  const [pao2, setPao2] = useState('');
  const [paco2, setPaco2] = useState('');
  const [age, setAge] = useState('');
  const [altitude, setAltitude] = useState('0');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const f = parseFloat(fio2) / 100;
    const pa = parseFloat(pao2);
    const pc = parseFloat(paco2);
    const a = parseFloat(age);

    // Atmospheric pressure based on altitude (simplified)
    const altitudeMeters = parseFloat(altitude);
    const patm = 760 * Math.exp(-altitudeMeters / 8500);

    if (f > 0 && pa > 0 && pc > 0) {
      const ph2o = 47; // Water vapor pressure at 37°C
      const rq = 0.8; // Respiratory quotient

      // Alveolar gas equation: PAO2 = FiO2 × (Patm - PH2O) - (PaCO2 / RQ)
      const pao2Alveolar = f * (patm - ph2o) - (pc / rq);
      const aaGradient = pao2Alveolar - pa;

      // Expected A-a gradient = (Age + 10) / 4
      const expectedGradient = a > 0 ? (a + 10) / 4 : null;

      let interpretation, color;
      if (expectedGradient) {
        if (aaGradient <= expectedGradient) {
          interpretation = 'Normal'; color = 'text-green-600';
        } else if (aaGradient <= expectedGradient + 10) {
          interpretation = 'Mildly elevated'; color = 'text-yellow-600';
        } else if (aaGradient <= expectedGradient + 20) {
          interpretation = 'Moderately elevated'; color = 'text-orange-600';
        } else {
          interpretation = 'Severely elevated'; color = 'text-red-600';
        }
      }

      setResult({ pao2Alveolar, aaGradient, expectedGradient, interpretation, color });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>FiO2 (%)</Label>
          <Input
            type="number"
            placeholder="21"
            min="21"
            max="100"
            value={fio2}
            onChange={(e) => setFio2(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>PaO2 (mmHg)</Label>
          <Input
            type="number"
            placeholder="95"
            value={pao2}
            onChange={(e) => setPao2(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>PaCO2 (mmHg)</Label>
          <Input
            type="number"
            placeholder="40"
            value={paco2}
            onChange={(e) => setPaco2(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Age (years)</Label>
          <Input
            type="number"
            placeholder="50"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Altitude (meters)</Label>
        <Select value={altitude} onValueChange={setAltitude}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Sea Level (0m)</SelectItem>
            <SelectItem value="500">500m</SelectItem>
            <SelectItem value="1000">1000m</SelectItem>
            <SelectItem value="1500">1500m (Denver)</SelectItem>
            <SelectItem value="2000">2000m</SelectItem>
            <SelectItem value="3000">3000m</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="text-xs text-muted-foreground">PAO2 = FiO2 × (Patm - 47) - (PaCO2 / 0.8)</p>
      <Button onClick={calculate} className="w-full">Calculate A-a Gradient</Button>
      {result && (
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="pt-4 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-indigo-600">PAO2 (Alveolar)</p>
                <p className="text-xl font-bold text-indigo-800">{result.pao2Alveolar.toFixed(1)} mmHg</p>
              </div>
              <div>
                <p className="text-xs text-indigo-600">A-a Gradient</p>
                <p className="text-xl font-bold text-indigo-800">{result.aaGradient.toFixed(1)} mmHg</p>
              </div>
            </div>
            {result.expectedGradient && (
              <div className="text-center pt-2">
                <p className="text-xs text-indigo-600">Expected for age: ≤{result.expectedGradient.toFixed(1)} mmHg</p>
                <p className={`font-semibold ${result.color}`}>{result.interpretation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// TIMI Risk Score Calculator (for STEMI/NSTEMI)
function TIMICalculator() {
  const [type, setType] = useState('nstemi');

  // NSTEMI/UA criteria
  const [age65, setAge65] = useState(false);
  const [riskFactors3, setRiskFactors3] = useState(false);
  const [knownCAD, setKnownCAD] = useState(false);
  const [aspirinUse, setAspirinUse] = useState(false);
  const [anginaEpisodes, setAnginaEpisodes] = useState(false);
  const [stChanges, setStChanges] = useState(false);
  const [elevatedMarkers, setElevatedMarkers] = useState(false);

  // STEMI criteria
  const [ageSTE, setAgeSTE] = useState('0');
  const [dmHtnAngina, setDmHtnAngina] = useState(false);
  const [sbpLow, setSbpLow] = useState(false);
  const [hrHigh, setHrHigh] = useState(false);
  const [killipClass, setKillipClass] = useState(false);
  const [weightLow, setWeightLow] = useState(false);
  const [anteriorSte, setAnteriorSte] = useState(false);
  const [timeDelay, setTimeDelay] = useState(false);

  const nstemiScore = [age65, riskFactors3, knownCAD, aspirinUse, anginaEpisodes, stChanges, elevatedMarkers]
    .filter(Boolean).length;

  const stemiScore = parseInt(ageSTE) +
    (dmHtnAngina ? 1 : 0) + (sbpLow ? 3 : 0) + (hrHigh ? 2 : 0) +
    (killipClass ? 2 : 0) + (weightLow ? 1 : 0) + (anteriorSte ? 1 : 0) + (timeDelay ? 1 : 0);

  const getNstemiRisk = () => {
    if (nstemiScore <= 1) return { risk: '4.7%', level: 'Low', color: 'text-green-600' };
    if (nstemiScore <= 2) return { risk: '8.3%', level: 'Low-Moderate', color: 'text-yellow-600' };
    if (nstemiScore <= 3) return { risk: '13.2%', level: 'Moderate', color: 'text-orange-500' };
    if (nstemiScore <= 4) return { risk: '19.9%', level: 'Moderate-High', color: 'text-orange-600' };
    return { risk: '26.2-40.9%', level: 'High', color: 'text-red-600' };
  };

  const getStemiMortality = () => {
    if (stemiScore === 0) return { risk: '0.8%', color: 'text-green-600' };
    if (stemiScore <= 2) return { risk: '1.6-2.2%', color: 'text-green-600' };
    if (stemiScore <= 4) return { risk: '4.4-7.3%', color: 'text-yellow-600' };
    if (stemiScore <= 6) return { risk: '12-16%', color: 'text-orange-600' };
    if (stemiScore <= 8) return { risk: '23-27%', color: 'text-red-500' };
    return { risk: '>35%', color: 'text-red-700' };
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button variant={type === 'nstemi' ? 'default' : 'outline'} size="sm" onClick={() => setType('nstemi')}>
          NSTEMI/UA
        </Button>
        <Button variant={type === 'stemi' ? 'default' : 'outline'} size="sm" onClick={() => setType('stemi')}>
          STEMI
        </Button>
      </div>

      {type === 'nstemi' ? (
        <div className="space-y-2">
          {[
            { label: 'Age ≥65', state: age65, setter: setAge65 },
            { label: '≥3 CAD risk factors', state: riskFactors3, setter: setRiskFactors3 },
            { label: 'Known CAD (stenosis ≥50%)', state: knownCAD, setter: setKnownCAD },
            { label: 'ASA use in past 7 days', state: aspirinUse, setter: setAspirinUse },
            { label: '≥2 angina episodes in 24h', state: anginaEpisodes, setter: setAnginaEpisodes },
            { label: 'ST changes ≥0.5mm', state: stChanges, setter: setStChanges },
            { label: 'Elevated cardiac markers', state: elevatedMarkers, setter: setElevatedMarkers },
          ].map(({ label, state, setter }) => (
            <label key={label} className="flex items-center gap-2 p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100">
              <input type="checkbox" checked={state} onChange={(e) => setter(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </label>
          ))}
          <Card className="bg-red-50 border-red-200 mt-4">
            <CardContent className="pt-4 text-center">
              <p className="text-3xl font-bold text-red-800">{nstemiScore}/7</p>
              <p className={`font-semibold mt-1 ${getNstemiRisk().color}`}>
                {getNstemiRisk().level} Risk
              </p>
              <p className="text-sm text-red-600">14-day event risk: {getNstemiRisk().risk}</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Age</Label>
            <Select value={ageSTE} onValueChange={setAgeSTE}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">&lt;65 (0 pts)</SelectItem>
                <SelectItem value="2">65-74 (2 pts)</SelectItem>
                <SelectItem value="3">≥75 (3 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {[
            { label: 'DM, HTN, or Angina', state: dmHtnAngina, setter: setDmHtnAngina },
            { label: 'SBP <100 mmHg (+3)', state: sbpLow, setter: setSbpLow },
            { label: 'HR >100 bpm (+2)', state: hrHigh, setter: setHrHigh },
            { label: 'Killip II-IV (+2)', state: killipClass, setter: setKillipClass },
            { label: 'Weight <67 kg', state: weightLow, setter: setWeightLow },
            { label: 'Anterior STE or LBBB', state: anteriorSte, setter: setAnteriorSte },
            { label: 'Time to treatment >4h', state: timeDelay, setter: setTimeDelay },
          ].map(({ label, state, setter }) => (
            <label key={label} className="flex items-center gap-2 p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100">
              <input type="checkbox" checked={state} onChange={(e) => setter(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </label>
          ))}
          <Card className="bg-red-50 border-red-200 mt-4">
            <CardContent className="pt-4 text-center">
              <p className="text-3xl font-bold text-red-800">{stemiScore}/14</p>
              <p className={`font-semibold mt-1 ${getStemiMortality().color}`}>
                30-day mortality: {getStemiMortality().risk}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// HEART Score Calculator
function HEARTCalculator() {
  const [history, setHistory] = useState('0');
  const [ekg, setEkg] = useState('0');
  const [age, setAge] = useState('0');
  const [riskFactors, setRiskFactors] = useState('0');
  const [troponin, setTroponin] = useState('0');

  const score = [history, ekg, age, riskFactors, troponin].reduce((sum, val) => sum + parseInt(val), 0);

  const getRisk = () => {
    if (score <= 3) return { risk: '0.9-1.7%', level: 'Low', color: 'text-green-600', action: 'Consider discharge' };
    if (score <= 6) return { risk: '12-16.6%', level: 'Moderate', color: 'text-yellow-600', action: 'Observation, serial troponins' };
    return { risk: '50-65%', level: 'High', color: 'text-red-600', action: 'Early invasive strategy' };
  };

  const risk = getRisk();

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs font-semibold">History</Label>
        <Select value={history} onValueChange={setHistory}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Slightly suspicious (0)</SelectItem>
            <SelectItem value="1">Moderately suspicious (1)</SelectItem>
            <SelectItem value="2">Highly suspicious (2)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-semibold">EKG</Label>
        <Select value={ekg} onValueChange={setEkg}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Normal (0)</SelectItem>
            <SelectItem value="1">Non-specific changes (1)</SelectItem>
            <SelectItem value="2">Significant ST depression (2)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-semibold">Age</Label>
        <Select value={age} onValueChange={setAge}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">&lt;45 (0)</SelectItem>
            <SelectItem value="1">45-64 (1)</SelectItem>
            <SelectItem value="2">≥65 (2)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-semibold">Risk Factors</Label>
        <Select value={riskFactors} onValueChange={setRiskFactors}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">No known risk factors (0)</SelectItem>
            <SelectItem value="1">1-2 risk factors (1)</SelectItem>
            <SelectItem value="2">≥3 risk factors or CAD history (2)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-semibold">Troponin</Label>
        <Select value={troponin} onValueChange={setTroponin}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">≤normal limit (0)</SelectItem>
            <SelectItem value="1">1-3x normal limit (1)</SelectItem>
            <SelectItem value="2">&gt;3x normal limit (2)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className={`${score <= 3 ? 'bg-green-50 border-green-200' : score <= 6 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
        <CardContent className="pt-4 text-center">
          <p className="text-3xl font-bold">{score}/10</p>
          <p className={`font-semibold mt-1 ${risk.color}`}>{risk.level} Risk</p>
          <p className="text-sm mt-1">6-week MACE: {risk.risk}</p>
          <p className="text-xs mt-2 text-slate-600">{risk.action}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// CHA2DS2-VASc Score Calculator
function CHADS2VAScCalculator() {
  const [chf, setChf] = useState(false);
  const [htn, setHtn] = useState(false);
  const [age75, setAge75] = useState(false);
  const [age65, setAge65] = useState(false);
  const [dm, setDm] = useState(false);
  const [stroke, setStroke] = useState(false);
  const [vascular, setVascular] = useState(false);
  const [female, setFemale] = useState(false);

  const score = (chf ? 1 : 0) + (htn ? 1 : 0) + (age75 ? 2 : 0) + (!age75 && age65 ? 1 : 0) +
    (dm ? 1 : 0) + (stroke ? 2 : 0) + (vascular ? 1 : 0) + (female ? 1 : 0);

  const getStrokeRisk = () => {
    const risks = ['0%', '1.3%', '2.2%', '3.2%', '4.0%', '6.7%', '9.8%', '9.6%', '6.7%', '15.2%'];
    return risks[Math.min(score, 9)];
  };

  const getRecommendation = () => {
    if (score === 0) return { text: 'No anticoagulation needed', color: 'text-green-600' };
    if (score === 1 && female && !stroke && !age75) return { text: 'Consider anticoagulation', color: 'text-yellow-600' };
    return { text: 'Anticoagulation recommended', color: 'text-red-600' };
  };

  return (
    <div className="space-y-2">
      {[
        { label: 'CHF/LV dysfunction (C)', state: chf, setter: setChf, pts: 1 },
        { label: 'Hypertension (H)', state: htn, setter: setHtn, pts: 1 },
        { label: 'Age ≥75 (A₂)', state: age75, setter: setAge75, pts: 2 },
        { label: 'Age 65-74', state: age65, setter: setAge65, pts: 1, disabled: age75 },
        { label: 'Diabetes (D)', state: dm, setter: setDm, pts: 1 },
        { label: 'Stroke/TIA/TE (S₂)', state: stroke, setter: setStroke, pts: 2 },
        { label: 'Vascular disease (V)', state: vascular, setter: setVascular, pts: 1 },
        { label: 'Sex female (Sc)', state: female, setter: setFemale, pts: 1 },
      ].map(({ label, state, setter, pts, disabled }) => (
        <label key={label} className={`flex items-center justify-between p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100 ${disabled ? 'opacity-50' : ''}`}>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={state} onChange={(e) => setter(e.target.checked)} disabled={disabled} className="w-4 h-4" />
            <span className="text-sm">{label}</span>
          </div>
          <Badge variant="outline" className="text-xs">+{pts}</Badge>
        </label>
      ))}
      <Card className="bg-purple-50 border-purple-200 mt-4">
        <CardContent className="pt-4 text-center">
          <p className="text-3xl font-bold text-purple-800">{score}/9</p>
          <p className="text-sm text-purple-600 mt-1">Annual stroke risk: {getStrokeRisk()}</p>
          <p className={`font-semibold mt-2 ${getRecommendation().color}`}>{getRecommendation().text}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Wells Score for PE
function WellsCalculator() {
  const [clinicalDvt, setClinicalDvt] = useState(false);
  const [pelikely, setPelikely] = useState(false);
  const [hr100, setHr100] = useState(false);
  const [immobilization, setImmobilization] = useState(false);
  const [previousDvtPe, setPreviousDvtPe] = useState(false);
  const [hemoptysis, setHemoptysis] = useState(false);
  const [malignancy, setMalignancy] = useState(false);

  const score = (clinicalDvt ? 3 : 0) + (pelikely ? 3 : 0) + (hr100 ? 1.5 : 0) +
    (immobilization ? 1.5 : 0) + (previousDvtPe ? 1.5 : 0) + (hemoptysis ? 1 : 0) + (malignancy ? 1 : 0);

  const getRisk = () => {
    if (score <= 4) return { level: 'PE Unlikely', probability: '<15%', color: 'text-green-600', action: 'D-dimer, if negative rules out PE' };
    return { level: 'PE Likely', probability: '>15%', color: 'text-red-600', action: 'CT-PA indicated' };
  };

  const risk = getRisk();

  return (
    <div className="space-y-2">
      {[
        { label: 'Clinical signs of DVT', state: clinicalDvt, setter: setClinicalDvt, pts: 3 },
        { label: 'PE is #1 diagnosis or equally likely', state: pelikely, setter: setPelikely, pts: 3 },
        { label: 'Heart rate >100', state: hr100, setter: setHr100, pts: 1.5 },
        { label: 'Immobilization/surgery in past 4 weeks', state: immobilization, setter: setImmobilization, pts: 1.5 },
        { label: 'Previous DVT/PE', state: previousDvtPe, setter: setPreviousDvtPe, pts: 1.5 },
        { label: 'Hemoptysis', state: hemoptysis, setter: setHemoptysis, pts: 1 },
        { label: 'Malignancy (treatment within 6mo)', state: malignancy, setter: setMalignancy, pts: 1 },
      ].map(({ label, state, setter, pts }) => (
        <label key={label} className="flex items-center justify-between p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={state} onChange={(e) => setter(e.target.checked)} className="w-4 h-4" />
            <span className="text-sm">{label}</span>
          </div>
          <Badge variant="outline" className="text-xs">+{pts}</Badge>
        </label>
      ))}
      <Card className={`${score <= 4 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} mt-4`}>
        <CardContent className="pt-4 text-center">
          <p className="text-3xl font-bold">{score}</p>
          <p className={`font-semibold mt-1 ${risk.color}`}>{risk.level}</p>
          <p className="text-sm mt-1">Pre-test probability: {risk.probability}</p>
          <p className="text-xs mt-2 text-slate-600">{risk.action}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// MELD Score Calculator
function MELDCalculator() {
  const [bilirubin, setBilirubin] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [inr, setInr] = useState('');
  const [sodium, setSodium] = useState('');
  const [dialysis, setDialysis] = useState(false);
  const [result, setResult] = useState(null);

  const calculate = () => {
    let bili = Math.max(1, parseFloat(bilirubin));
    let cr = Math.max(1, Math.min(4, parseFloat(creatinine)));
    if (dialysis) cr = 4;
    let inrVal = Math.max(1, parseFloat(inr));
    let na = Math.max(125, Math.min(137, parseFloat(sodium) || 137));

    const meld = Math.round(
      10 * (0.957 * Math.log(cr) + 0.378 * Math.log(bili) + 1.12 * Math.log(inrVal) + 0.643)
    );
    const meldNa = Math.round(meld + 1.32 * (137 - na) - 0.033 * meld * (137 - na));

    let mortality3mo;
    if (meldNa <= 9) mortality3mo = '1.9%';
    else if (meldNa <= 19) mortality3mo = '6%';
    else if (meldNa <= 29) mortality3mo = '19.6%';
    else if (meldNa <= 39) mortality3mo = '52.6%';
    else mortality3mo = '71.3%';

    setResult({ meld: Math.min(40, Math.max(6, meld)), meldNa: Math.min(40, Math.max(6, meldNa)), mortality3mo });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Bilirubin (mg/dL)</Label>
          <Input type="number" step="0.1" placeholder="1.2" value={bilirubin} onChange={(e) => setBilirubin(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Creatinine (mg/dL)</Label>
          <Input type="number" step="0.1" placeholder="1.0" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">INR</Label>
          <Input type="number" step="0.1" placeholder="1.2" value={inr} onChange={(e) => setInr(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Sodium (mEq/L)</Label>
          <Input type="number" placeholder="140" value={sodium} onChange={(e) => setSodium(e.target.value)} />
        </div>
      </div>
      <label className="flex items-center gap-2 p-2 bg-slate-50 rounded cursor-pointer">
        <input type="checkbox" checked={dialysis} onChange={(e) => setDialysis(e.target.checked)} className="w-4 h-4" />
        <span className="text-sm">Dialysis ≥2x/week or CVVHD in past week</span>
      </label>
      <Button onClick={calculate} className="w-full">Calculate MELD</Button>
      {result && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-amber-600">MELD</p>
                <p className="text-2xl font-bold text-amber-800">{result.meld}</p>
              </div>
              <div>
                <p className="text-xs text-amber-600">MELD-Na</p>
                <p className="text-2xl font-bold text-amber-800">{result.meldNa}</p>
              </div>
            </div>
            <p className="text-center text-sm text-amber-700 mt-2">3-month mortality: {result.mortality3mo}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// qSOFA Calculator
function QSOFACalculator() {
  const [alteredMental, setAlteredMental] = useState(false);
  const [rrHigh, setRrHigh] = useState(false);
  const [sbpLow, setSbpLow] = useState(false);

  const score = (alteredMental ? 1 : 0) + (rrHigh ? 1 : 0) + (sbpLow ? 1 : 0);

  const getRisk = () => {
    if (score < 2) return { level: 'Low Risk', color: 'text-green-600', action: 'qSOFA negative, continue monitoring' };
    return { level: 'High Risk', color: 'text-red-600', action: 'qSOFA positive - assess for organ dysfunction, consider ICU' };
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">Quick Sepsis-related Organ Failure Assessment (outside ICU)</p>
      {[
        { label: 'Altered mental status (GCS <15)', state: alteredMental, setter: setAlteredMental },
        { label: 'Respiratory rate ≥22/min', state: rrHigh, setter: setRrHigh },
        { label: 'Systolic BP ≤100 mmHg', state: sbpLow, setter: setSbpLow },
      ].map(({ label, state, setter }) => (
        <label key={label} className="flex items-center gap-3 p-3 bg-slate-50 rounded cursor-pointer hover:bg-slate-100">
          <input type="checkbox" checked={state} onChange={(e) => setter(e.target.checked)} className="w-5 h-5" />
          <span>{label}</span>
        </label>
      ))}
      <Card className={`${score < 2 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <CardContent className="pt-4 text-center">
          <p className="text-4xl font-bold">{score}/3</p>
          <p className={`font-semibold mt-2 ${getRisk().color}`}>{getRisk().level}</p>
          <p className="text-sm mt-2 text-slate-600">{getRisk().action}</p>
          {score >= 2 && <p className="text-xs mt-2 text-red-500">≥2 points = 3-14x higher in-hospital mortality</p>}
        </CardContent>
      </Card>
    </div>
  );
}

// Main Medical Calculators Component
export default function MedicalCalculators({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Medical Calculators
          </DialogTitle>
          <DialogDescription>
            Clinical calculation tools for medical decision support
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="drug" className="w-full">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex h-auto gap-1 bg-transparent p-1 w-max">
              <TabsTrigger value="drug" className="flex flex-col items-center gap-1 px-3 py-2 text-xs">
                <Pill className="w-4 h-4" />
                <span>Dosage</span>
              </TabsTrigger>
              <TabsTrigger value="gcs" className="flex flex-col items-center gap-1 px-3 py-2 text-xs">
                <Brain className="w-4 h-4" />
                <span>GCS</span>
              </TabsTrigger>
              <TabsTrigger value="sofa" className="flex flex-col items-center gap-1 px-3 py-2 text-xs">
                <Activity className="w-4 h-4" />
                <span>SOFA</span>
              </TabsTrigger>
              <TabsTrigger value="qsofa" className="flex flex-col items-center gap-1 px-3 py-2 text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>qSOFA</span>
              </TabsTrigger>
              <TabsTrigger value="timi" className="flex flex-col items-center gap-1 px-3 py-2 text-xs">
                <Heart className="w-4 h-4 text-red-500" />
                <span>TIMI</span>
              </TabsTrigger>
              <TabsTrigger value="heart" className="flex flex-col items-center gap-1 px-3 py-2 text-xs">
                <Stethoscope className="w-4 h-4" />
                <span>HEART</span>
              </TabsTrigger>
              <TabsTrigger value="chads" className="flex flex-col items-center gap-1 px-3 py-2 text-xs">
                <Zap className="w-4 h-4" />
                <span>CHA₂DS₂</span>
              </TabsTrigger>
              <TabsTrigger value="wells" className="flex flex-col items-center gap-1 px-3 py-2 text-xs">
                <Shield className="w-4 h-4" />
                <span>Wells PE</span>
              </TabsTrigger>
              <TabsTrigger value="meld" className="flex flex-col items-center gap-1 px-3 py-2 text-xs">
                <Activity className="w-4 h-4 text-amber-500" />
                <span>MELD</span>
              </TabsTrigger>
              <TabsTrigger value="parkland" className="flex flex-col items-center gap-1 px-3 py-2 text-xs">
                <Flame className="w-4 h-4" />
                <span>Parkland</span>
              </TabsTrigger>
              <TabsTrigger value="bmi" className="flex flex-col items-center gap-1 px-3 py-2 text-xs">
                <Scale className="w-4 h-4" />
                <span>BMI</span>
              </TabsTrigger>
              <TabsTrigger value="crcl" className="flex flex-col items-center gap-1 px-3 py-2 text-xs">
                <Droplets className="w-4 h-4" />
                <span>CrCl</span>
              </TabsTrigger>
              <TabsTrigger value="labs" className="flex flex-col items-center gap-1 px-3 py-2 text-xs">
                <Heart className="w-4 h-4" />
                <span>Labs</span>
              </TabsTrigger>
              <TabsTrigger value="aa" className="flex flex-col items-center gap-1 px-3 py-2 text-xs">
                <Wind className="w-4 h-4" />
                <span>A-a</span>
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          <div className="mt-4">
            <TabsContent value="drug">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Pill className="w-4 h-4 text-blue-500" />
                    Weight-Based Drug Dosing
                  </CardTitle>
                  <CardDescription>Calculate medication doses based on patient weight</CardDescription>
                </CardHeader>
                <CardContent>
                  <DrugDosageCalculator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gcs">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    Glasgow Coma Scale
                  </CardTitle>
                  <CardDescription>Assess level of consciousness after brain injury</CardDescription>
                </CardHeader>
                <CardContent>
                  <GCSCalculator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sofa">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-500" />
                    SOFA Score
                  </CardTitle>
                  <CardDescription>Sequential Organ Failure Assessment for ICU mortality prediction</CardDescription>
                </CardHeader>
                <CardContent>
                  <SOFACalculator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qsofa">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    qSOFA Score
                  </CardTitle>
                  <CardDescription>Quick sepsis screening for patients outside the ICU</CardDescription>
                </CardHeader>
                <CardContent>
                  <QSOFACalculator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timi">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    TIMI Risk Score
                  </CardTitle>
                  <CardDescription>Risk stratification for STEMI and NSTEMI/UA</CardDescription>
                </CardHeader>
                <CardContent>
                  <TIMICalculator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="heart">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-blue-500" />
                    HEART Score
                  </CardTitle>
                  <CardDescription>Risk stratification for chest pain and ACS</CardDescription>
                </CardHeader>
                <CardContent>
                  <HEARTCalculator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chads">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-500" />
                    CHA₂DS₂-VASc Score
                  </CardTitle>
                  <CardDescription>Stroke risk in atrial fibrillation</CardDescription>
                </CardHeader>
                <CardContent>
                  <CHADS2VAScCalculator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wells">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    Wells Score for PE
                  </CardTitle>
                  <CardDescription>Pre-test probability for pulmonary embolism</CardDescription>
                </CardHeader>
                <CardContent>
                  <WellsCalculator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="meld">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-500" />
                    MELD Score
                  </CardTitle>
                  <CardDescription>Model for End-Stage Liver Disease severity</CardDescription>
                </CardHeader>
                <CardContent>
                  <MELDCalculator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parkland">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    Parkland Formula
                  </CardTitle>
                  <CardDescription>Burn fluid resuscitation calculator</CardDescription>
                </CardHeader>
                <CardContent>
                  <ParklandCalculator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bmi">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Scale className="w-4 h-4 text-green-500" />
                    Body Mass Index
                  </CardTitle>
                  <CardDescription>Calculate BMI and weight classification</CardDescription>
                </CardHeader>
                <CardContent>
                  <BMICalculator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crcl">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-purple-500" />
                    Creatinine Clearance
                  </CardTitle>
                  <CardDescription>Cockcroft-Gault equation for renal function</CardDescription>
                </CardHeader>
                <CardContent>
                  <CrClCalculator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="labs">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="w-4 h-4 text-teal-500" />
                    Corrected Labs
                  </CardTitle>
                  <CardDescription>Calcium and sodium corrections</CardDescription>
                </CardHeader>
                <CardContent>
                  <CorrectedLabsCalculator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aa">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Wind className="w-4 h-4 text-indigo-500" />
                    A-a Gradient
                  </CardTitle>
                  <CardDescription>Alveolar-arterial oxygen gradient for oxygenation assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <AaGradientCalculator />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
