import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Heart, Droplets, Zap, Wind, Thermometer, Syringe, Radio, Stethoscope } from 'lucide-react';
import { Draggable, Droppable } from '@hello-pangea/dnd';

const EQUIPMENT_TYPES = [
  {
    id: 'ventilator',
    name: 'Mechanical Ventilator',
    icon: Wind,
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    category: 'Respiratory'
  },
  {
    id: 'cardiac_monitor',
    name: 'Cardiac Monitor',
    icon: Activity,
    color: 'bg-red-100 text-red-700 border-red-300',
    category: 'Cardiac'
  },
  {
    id: 'defibrillator',
    name: 'Defibrillator',
    icon: Zap,
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    category: 'Cardiac'
  },
  {
    id: 'iv_pump',
    name: 'IV Infusion Pump',
    icon: Droplets,
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    category: 'Infusion'
  },
  {
    id: 'syringe_pump',
    name: 'Syringe Pump',
    icon: Syringe,
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    category: 'Infusion'
  },
  {
    id: 'ecmo',
    name: 'ECMO Machine',
    icon: Heart,
    color: 'bg-pink-100 text-pink-700 border-pink-300',
    category: 'Critical'
  },
  {
    id: 'dialysis',
    name: 'Dialysis Machine',
    icon: Droplets,
    color: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    category: 'Renal'
  },
  {
    id: 'pulse_ox',
    name: 'Pulse Oximeter',
    icon: Radio,
    color: 'bg-green-100 text-green-700 border-green-300',
    category: 'Monitoring'
  },
  {
    id: 'temp_monitor',
    name: 'Temperature Monitor',
    icon: Thermometer,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    category: 'Monitoring'
  },
  {
    id: 'arterial_line',
    name: 'Arterial Line Monitor',
    icon: Activity,
    color: 'bg-rose-100 text-rose-700 border-rose-300',
    category: 'Monitoring'
  }
];

export default function EquipmentPalette() {
  return (
    <Card className="h-full shadow-lg">
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-slate-600" />
          Equipment Palette
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Droppable droppableId="palette" isDropDisabled={true}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {EQUIPMENT_TYPES.map((equipment, index) => (
                <Draggable
                  key={equipment.id}
                  draggableId={`palette-${equipment.id}-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-3 rounded-lg border-2 ${equipment.color} transition-all cursor-move hover:shadow-md ${
                          snapshot.isDragging ? 'shadow-xl scale-105 rotate-2' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <equipment.icon className="w-5 h-5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">
                              {equipment.name}
                            </div>
                            <div className="text-xs opacity-75">
                              {equipment.category}
                            </div>
                          </div>
                        </div>
                      </div>
                      {snapshot.isDragging && (
                        <div
                          className={`p-3 rounded-lg border-2 ${equipment.color} opacity-50`}
                        >
                          <div className="flex items-center gap-3">
                            <equipment.icon className="w-5 h-5" />
                            <div className="flex-1">
                              <div className="font-semibold text-sm">
                                {equipment.name}
                              </div>
                              <div className="text-xs opacity-75">
                                {equipment.category}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
}

export { EQUIPMENT_TYPES };