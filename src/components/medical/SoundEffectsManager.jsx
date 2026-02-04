import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Volume2, VolumeX, Music, Heart, Bell, Trophy, Zap,
  AlertTriangle, Activity, Play, Pause
} from 'lucide-react';

// Sound effect definitions with Web Audio API oscillator-based sounds
const SOUND_EFFECTS = {
  // UI Sounds
  ui_click: { name: 'Button Click', category: 'ui', freq: 800, duration: 0.05, type: 'square' },
  ui_hover: { name: 'Hover', category: 'ui', freq: 600, duration: 0.03, type: 'sine' },
  ui_success: { name: 'Success', category: 'ui', freq: [523, 659, 784], duration: 0.15, type: 'sine' },
  ui_error: { name: 'Error', category: 'ui', freq: [200, 150], duration: 0.2, type: 'square' },
  ui_notification: { name: 'Notification', category: 'ui', freq: [880, 1100], duration: 0.1, type: 'sine' },

  // Medical Sounds
  medical_heartbeat: { name: 'Heartbeat', category: 'medical', freq: [80, 60], duration: 0.3, type: 'sine' },
  medical_flatline: { name: 'Flatline', category: 'medical', freq: 440, duration: 2, type: 'sine' },
  medical_alarm: { name: 'Alarm', category: 'medical', freq: [880, 0, 880, 0, 880], duration: 0.2, type: 'square' },
  medical_defibrillator: { name: 'Defibrillator', category: 'medical', freq: [100, 2000, 100], duration: 0.5, type: 'sawtooth' },
  medical_ventilator: { name: 'Ventilator', category: 'medical', freq: [200, 180], duration: 1, type: 'sine' },

  // Gameplay Sounds
  gameplay_achievement: { name: 'Achievement', category: 'gameplay', freq: [523, 659, 784, 1047], duration: 0.2, type: 'sine' },
  gameplay_level_up: { name: 'Level Up', category: 'gameplay', freq: [392, 523, 659, 784, 1047], duration: 0.15, type: 'triangle' },
  gameplay_streak: { name: 'Streak', category: 'gameplay', freq: [440, 554, 659], duration: 0.12, type: 'sine' },
  gameplay_complete: { name: 'Complete', category: 'gameplay', freq: [523, 659, 784, 1047, 1319], duration: 0.1, type: 'sine' },
  gameplay_fail: { name: 'Fail', category: 'gameplay', freq: [392, 330, 262], duration: 0.25, type: 'triangle' },
  gameplay_timer: { name: 'Timer Tick', category: 'gameplay', freq: 1000, duration: 0.05, type: 'square' },
  gameplay_countdown: { name: 'Countdown', category: 'gameplay', freq: [880, 880, 880, 1320], duration: 0.3, type: 'sine' }
};

// Category definitions
const CATEGORIES = {
  ui: { name: 'UI Sounds', icon: Bell, description: 'Button clicks, notifications' },
  medical: { name: 'Medical', icon: Heart, description: 'Heartbeat, alarms, equipment' },
  gameplay: { name: 'Gameplay', icon: Trophy, description: 'Achievements, level up' }
};

// Default settings
const DEFAULT_SETTINGS = {
  masterVolume: 0.5,
  enabled: true,
  categories: {
    ui: true,
    medical: true,
    gameplay: true
  }
};

// Get settings from localStorage
function getSoundSettings() {
  const stored = localStorage.getItem('medsim_sound_settings');
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
}

// Save settings to localStorage
function saveSoundSettings(settings) {
  localStorage.setItem('medsim_sound_settings', JSON.stringify(settings));
}

// Sound Context for global access
const SoundContext = createContext(null);

export function useSoundEffects() {
  return useContext(SoundContext);
}

// Audio Context singleton
let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// Play a sound effect using Web Audio API
function playSound(soundKey, volume = 1) {
  const settings = getSoundSettings();
  const sound = SOUND_EFFECTS[soundKey];

  if (!settings.enabled || !sound) return;
  if (!settings.categories[sound.category]) return;

  const finalVolume = settings.masterVolume * volume;
  if (finalVolume <= 0) return;

  try {
    const ctx = getAudioContext();
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = finalVolume * 0.3; // Scale down to reasonable level

    const frequencies = Array.isArray(sound.freq) ? sound.freq : [sound.freq];
    const duration = sound.duration;

    frequencies.forEach((freq, i) => {
      if (freq === 0) return; // Skip silent notes

      const oscillator = ctx.createOscillator();
      oscillator.type = sound.type;
      oscillator.frequency.value = freq;
      oscillator.connect(gainNode);

      const startTime = ctx.currentTime + (i * duration);
      const endTime = startTime + duration;

      oscillator.start(startTime);
      oscillator.stop(endTime);

      // Fade out
      gainNode.gain.setValueAtTime(finalVolume * 0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);
    });
  } catch (e) {
    console.warn('Sound playback failed:', e);
  }
}

// Sound Effects Provider
export function SoundEffectsProvider({ children }) {
  const [settings, setSettings] = useState(getSoundSettings);

  const play = useCallback((soundKey, volume = 1) => {
    playSound(soundKey, volume);
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    saveSoundSettings(newSettings);
  }, []);

  return (
    <SoundContext.Provider value={{ play, settings, updateSettings }}>
      {children}
    </SoundContext.Provider>
  );
}

// Sound test button
function SoundTestButton({ soundKey, sound }) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
    playSound(soundKey);
    setTimeout(() => setPlaying(false), 500);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8"
      onClick={handlePlay}
      disabled={playing}
    >
      {playing ? <Activity className="w-3 h-3 animate-pulse" /> : <Play className="w-3 h-3" />}
    </Button>
  );
}

// Main Sound Effects Manager Dialog
export default function SoundEffectsManager({ open, onClose }) {
  const [settings, setSettings] = useState(getSoundSettings);

  useEffect(() => {
    if (open) {
      setSettings(getSoundSettings());
    }
  }, [open]);

  const handleSettingsChange = (updates) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    saveSoundSettings(newSettings);
  };

  const handleCategoryToggle = (category) => {
    const newCategories = {
      ...settings.categories,
      [category]: !settings.categories[category]
    };
    handleSettingsChange({ categories: newCategories });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-blue-500" />
            Sound Effects
          </DialogTitle>
          <DialogDescription>
            Configure sound effects for gameplay feedback
          </DialogDescription>
        </DialogHeader>

        {/* Master Controls */}
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.enabled ? (
                  <Volume2 className="w-5 h-5 text-blue-500" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-400" />
                )}
                <div>
                  <Label className="font-medium">Sound Effects</Label>
                  <p className="text-xs text-slate-500">Enable or disable all sounds</p>
                </div>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(enabled) => handleSettingsChange({ enabled })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Master Volume</Label>
                <span className="text-sm text-slate-500">{Math.round(settings.masterVolume * 100)}%</span>
              </div>
              <Slider
                value={[settings.masterVolume * 100]}
                onValueChange={([value]) => handleSettingsChange({ masterVolume: value / 100 })}
                max={100}
                step={5}
                disabled={!settings.enabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Controls */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Sound Categories</Label>
          {Object.entries(CATEGORIES).map(([key, category]) => (
            <Card key={key} className={settings.categories[key] ? 'bg-blue-50 border-blue-200' : ''}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <category.icon className={`w-5 h-5 ${settings.categories[key] ? 'text-blue-500' : 'text-slate-400'}`} />
                    <div>
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className="text-xs text-slate-500">{category.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.categories[key]}
                    onCheckedChange={() => handleCategoryToggle(key)}
                    disabled={!settings.enabled}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sound Preview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Music className="w-4 h-4" />
              Preview Sounds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(SOUND_EFFECTS).slice(0, 9).map(([key, sound]) => (
                <div key={key} className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded">
                  <span className="text-xs truncate">{sound.name}</span>
                  <SoundTestButton soundKey={key} sound={sound} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Note about audio */}
        <p className="text-xs text-slate-500 text-center">
          Sounds are generated using Web Audio API. No audio files required.
        </p>
      </DialogContent>
    </Dialog>
  );
}

// Hook for playing sounds in components
export function useSoundEffect() {
  const play = useCallback((soundKey, volume = 1) => {
    playSound(soundKey, volume);
  }, []);

  return { play };
}

// Pre-built sound hooks for common actions
export function useUISounds() {
  const { play } = useSoundEffect();

  return {
    playClick: () => play('ui_click'),
    playHover: () => play('ui_hover'),
    playSuccess: () => play('ui_success'),
    playError: () => play('ui_error'),
    playNotification: () => play('ui_notification')
  };
}

export function useMedicalSounds() {
  const { play } = useSoundEffect();

  return {
    playHeartbeat: () => play('medical_heartbeat'),
    playFlatline: () => play('medical_flatline'),
    playAlarm: () => play('medical_alarm'),
    playDefibrillator: () => play('medical_defibrillator'),
    playVentilator: () => play('medical_ventilator')
  };
}

export function useGameplaySounds() {
  const { play } = useSoundEffect();

  return {
    playAchievement: () => play('gameplay_achievement'),
    playLevelUp: () => play('gameplay_level_up'),
    playStreak: () => play('gameplay_streak'),
    playComplete: () => play('gameplay_complete'),
    playFail: () => play('gameplay_fail'),
    playTimer: () => play('gameplay_timer'),
    playCountdown: () => play('gameplay_countdown')
  };
}
