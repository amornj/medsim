import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Pill, Brain, Heart, Flame, Scale, Droplets, Wind, Activity } from 'lucide-react';

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
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 h-auto gap-1 bg-transparent">
            <TabsTrigger value="drug" className="flex flex-col items-center gap-1 px-2 py-2 text-xs">
              <Pill className="w-4 h-4" />
              <span>Dosage</span>
            </TabsTrigger>
            <TabsTrigger value="gcs" className="flex flex-col items-center gap-1 px-2 py-2 text-xs">
              <Brain className="w-4 h-4" />
              <span>GCS</span>
            </TabsTrigger>
            <TabsTrigger value="sofa" className="flex flex-col items-center gap-1 px-2 py-2 text-xs">
              <Activity className="w-4 h-4" />
              <span>SOFA</span>
            </TabsTrigger>
            <TabsTrigger value="parkland" className="flex flex-col items-center gap-1 px-2 py-2 text-xs">
              <Flame className="w-4 h-4" />
              <span>Parkland</span>
            </TabsTrigger>
            <TabsTrigger value="bmi" className="flex flex-col items-center gap-1 px-2 py-2 text-xs">
              <Scale className="w-4 h-4" />
              <span>BMI</span>
            </TabsTrigger>
            <TabsTrigger value="crcl" className="flex flex-col items-center gap-1 px-2 py-2 text-xs">
              <Droplets className="w-4 h-4" />
              <span>CrCl</span>
            </TabsTrigger>
            <TabsTrigger value="labs" className="flex flex-col items-center gap-1 px-2 py-2 text-xs">
              <Heart className="w-4 h-4" />
              <span>Labs</span>
            </TabsTrigger>
            <TabsTrigger value="aa" className="flex flex-col items-center gap-1 px-2 py-2 text-xs">
              <Wind className="w-4 h-4" />
              <span>A-a</span>
            </TabsTrigger>
          </TabsList>

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
