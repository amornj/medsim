import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function LanguageSelector() {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <Globe className="w-4 h-4" />
      {language === 'en' ? 'ไทย' : 'EN'}
    </Button>
  );
}