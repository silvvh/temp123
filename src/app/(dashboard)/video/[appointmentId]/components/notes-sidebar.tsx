'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Save, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/client';

interface NotesSidebarProps {
  appointmentId: string;
  onClose: () => void;
}

export default function NotesSidebar({ appointmentId, onClose }: NotesSidebarProps) {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const supabase = createClient();

  // Load existing notes
  useEffect(() => {
    async function loadNotes() {
      const { data } = await supabase
        .from('appointments')
        .select('notes')
        .eq('id', appointmentId)
        .single();

      if (data?.notes) {
        setNotes(data.notes);
      }
    }

    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (notes) {
        handleSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [notes]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await supabase
        .from('appointments')
        .update({ notes })
        .eq('id', appointmentId);
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateProntuario = async () => {
    // TODO: Integrar com OpenAI para gerar prontuário estruturado
    console.log('Generate prontuário from notes:', notes);
  };

  return (
    <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">Anotações da Consulta</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        {lastSaved && (
          <p className="text-xs text-gray-400">
            Salvo automaticamente às {format(lastSaved, 'HH:mm')}
          </p>
        )}
      </div>

      {/* Notes Editor */}
      <ScrollArea className="flex-1 p-4">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anote aqui as informações relevantes da consulta...


Sugestões:

- Queixa principal do paciente

- Sintomas relatados

- Histórico relevante

- Exame físico (se aplicável)

- Hipótese diagnóstica

- Conduta e prescrições"
          className="min-h-[500px] bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 resize-none"
        />
      </ScrollArea>

      {/* Actions */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <Button
          className="w-full bg-primary-600 hover:bg-primary-700"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Salvando...' : 'Salvar Anotações'}
        </Button>
        
        <Button
          variant="outline"
          className="w-full border-secondary-500 text-secondary-500 hover:bg-secondary-500 hover:text-white"
          onClick={handleGenerateProntuario}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Gerar Prontuário com IA
        </Button>
      </div>
    </div>
  );
}

