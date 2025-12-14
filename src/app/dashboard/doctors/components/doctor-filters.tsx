'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DoctorFiltersProps {
  onFilterChange: (filters: any) => void;
}

export default function DoctorFilters({ onFilterChange }: DoctorFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState({
    today: false,
    thisWeek: false,
    weekend: false,
  });
  const [features, setFeatures] = useState({
    acceptsInsurance: false,
    homeVisit: false,
    emergencyService: false,
  });

  const handleApplyFilters = () => {
    onFilterChange({
      priceRange,
      minRating,
      availability,
      features,
    });
  };

  const handleClearFilters = () => {
    setPriceRange([0, 500]);
    setMinRating(0);
    setAvailability({ today: false, thisWeek: false, weekend: false });
    setFeatures({ acceptsInsurance: false, homeVisit: false, emergencyService: false });
    onFilterChange({});
  };

  return (
    <Card className="border-2">
      <CardContent className="p-6">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Price Range */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">
              Faixa de Preço
            </Label>
            <div className="space-y-4">
              <Slider
                min={0}
                max={500}
                step={10}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="mb-2"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">R$ {priceRange[0]}</span>
                <span className="text-gray-600">R$ {priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">
              Disponibilidade
            </Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="today"
                  checked={availability.today}
                  onCheckedChange={(checked) =>
                    setAvailability({ ...availability, today: checked as boolean })
                  }
                />
                <label htmlFor="today" className="text-sm text-gray-700 cursor-pointer">
                  Hoje
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="thisWeek"
                  checked={availability.thisWeek}
                  onCheckedChange={(checked) =>
                    setAvailability({ ...availability, thisWeek: checked as boolean })
                  }
                />
                <label htmlFor="thisWeek" className="text-sm text-gray-700 cursor-pointer">
                  Esta semana
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weekend"
                  checked={availability.weekend}
                  onCheckedChange={(checked) =>
                    setAvailability({ ...availability, weekend: checked as boolean })
                  }
                />
                <label htmlFor="weekend" className="text-sm text-gray-700 cursor-pointer">
                  Fim de semana
                </label>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">
              Recursos
            </Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insurance"
                  checked={features.acceptsInsurance}
                  onCheckedChange={(checked) =>
                    setFeatures({ ...features, acceptsInsurance: checked as boolean })
                  }
                />
                <label htmlFor="insurance" className="text-sm text-gray-700 cursor-pointer">
                  Aceita convênio
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="homeVisit"
                  checked={features.homeVisit}
                  onCheckedChange={(checked) =>
                    setFeatures({ ...features, homeVisit: checked as boolean })
                  }
                />
                <label htmlFor="homeVisit" className="text-sm text-gray-700 cursor-pointer">
                  Atende em casa
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emergency"
                  checked={features.emergencyService}
                  onCheckedChange={(checked) =>
                    setFeatures({ ...features, emergencyService: checked as boolean })
                  }
                />
                <label htmlFor="emergency" className="text-sm text-gray-700 cursor-pointer">
                  Atendimento urgente
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col justify-end gap-2">
            <Button onClick={handleApplyFilters} className="bg-primary-600 hover:bg-primary-700">
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

