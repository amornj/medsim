import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, User, Droplets, Activity, Ruler, Weight } from 'lucide-react';

const ORGAN_NORMAL_SIZES = {
  heart: { size: 8.5, unit: 'cm', weight: 300, weightUnit: 'g' },
  liver: { size: 18, unit: 'cm', weight: 1500, weightUnit: 'g' },
  kidney: { size: 11, unit: 'cm', weight: 150, weightUnit: 'g' },
  lungs: { size: 25, unit: 'cm', weight: 600, weightUnit: 'g' },
  brain: { size: 15, unit: 'cm', weight: 1400, weightUnit: 'g' }
};

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const SEXES = ['Male', 'Female'];

const generateDonors = (count = 20) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `donor-${i + 1}`,
    age: Math.floor(Math.random() * (60 - 16 + 1)) + 16,
    weight: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
    height: Math.floor(Math.random() * (190 - 150 + 1)) + 150,
    bloodType: BLOOD_TYPES[Math.floor(Math.random() * BLOOD_TYPES.length)],
    sex: SEXES[Math.floor(Math.random() * SEXES.length)],
    compatibility: Math.floor(Math.random() * 30) + 70, // 70-100%
    organHealth: Math.floor(Math.random() * 20) + 80, // 80-100%
  }));
};

export default function DonorSelector({ open, onClose, onSelectDonor, organType = 'heart' }) {
  const [donors] = useState(generateDonors(20));
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [filterBloodType, setFilterBloodType] = useState('all');

  const organInfo = ORGAN_NORMAL_SIZES[organType] || ORGAN_NORMAL_SIZES.heart;

  const filteredDonors = filterBloodType === 'all' 
    ? donors 
    : donors.filter(d => d.bloodType === filterBloodType);

  const getCompatibilityColor = (compatibility) => {
    if (compatibility >= 90) return 'bg-green-600';
    if (compatibility >= 80) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const handleSelectDonor = () => {
    if (selectedDonor) {
      onSelectDonor(selectedDonor);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Organ Donor Selection - {organType.charAt(0).toUpperCase() + organType.slice(1)} Transplant
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Organ Normal Values */}
          <Card className="bg-blue-50">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-xs text-slate-600">Normal Size</div>
                  <div className="font-bold text-blue-900">{organInfo.size} {organInfo.unit}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600">Normal Weight</div>
                  <div className="font-bold text-blue-900">{organInfo.weight} {organInfo.weightUnit}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600">Blood Type Match</div>
                  <div className="font-bold text-blue-900">Critical</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600">Age Range</div>
                  <div className="font-bold text-blue-900">16-60 years</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Filter by Blood Type:</span>
            <Button
              size="sm"
              variant={filterBloodType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterBloodType('all')}
            >
              All
            </Button>
            {BLOOD_TYPES.map(type => (
              <Button
                key={type}
                size="sm"
                variant={filterBloodType === type ? 'default' : 'outline'}
                onClick={() => setFilterBloodType(type)}
              >
                {type}
              </Button>
            ))}
          </div>

          {/* Donor List */}
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
              {filteredDonors.map((donor) => (
                <Card
                  key={donor.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedDonor?.id === donor.id ? 'border-2 border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedDonor(donor)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-600" />
                        <span className="font-bold">Donor #{donor.id.split('-')[1]}</span>
                      </div>
                      <Badge className={getCompatibilityColor(donor.compatibility)}>
                        {donor.compatibility}% Match
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-600">Age:</span>
                        <span className="font-medium">{donor.age}y</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-600">Sex:</span>
                        <span className="font-medium">{donor.sex}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Weight className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-600">Weight:</span>
                        <span className="font-medium">{donor.weight}kg</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Ruler className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-600">Height:</span>
                        <span className="font-medium">{donor.height}cm</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-slate-600">Blood:</span>
                        <span className="font-medium text-red-600">{donor.bloodType}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-slate-600">Health:</span>
                        <span className="font-medium text-green-600">{donor.organHealth}%</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t text-xs text-slate-500">
                      Body Ratio: {(donor.weight / ((donor.height / 100) ** 2)).toFixed(1)} BMI
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSelectDonor}
              disabled={!selectedDonor}
              className="bg-green-600 hover:bg-green-700"
            >
              <Heart className="w-4 h-4 mr-2" />
              Select Donor & Proceed with Transplant
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}