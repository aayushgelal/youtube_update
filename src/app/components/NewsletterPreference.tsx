import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function NewsletterPreferences() {
  const [frequency, setFrequency] = useState('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect( () => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/user/newsletter-preferences');
      if (response.ok) {
        const data = await response.json();
        setFrequency(data.frequency);
        setSelectedDays(data.weeklyDays);
      } else {
        throw new Error('Failed to fetch preferences');
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error("Error fetching data. Please try again.");
    }
  };

  const handleDayToggle = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const savePreferences = async () => {
    const toastId = toast.loading("Updating preferences...");
    try {
      const response = await fetch('/api/user/newsletter-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          frequency, 
          weeklyDays: frequency === 'weekly' ? selectedDays : [] 
        }),
      });
      if (response.ok) {
        toast.success("Newsletter preferences updated successfully!", { id: toastId });
        setIsPopoverOpen(false);
      } else {
        toast.error("Failed to update preferences. Please try again.", { id: toastId });


      }
    } catch (error) {
      toast.error("Failed to update preferences. Please try again.", { id: toastId });

      console.error('Error saving preferences:', error);
    }
  };

  const handleFrequencyChange = (newFrequency: string) => {
    setFrequency(newFrequency);
    if (newFrequency === 'daily') {
      savePreferences();
    }
  };

  return (
    <div className="space-y-6">
      
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            {frequency === 'daily' ? 'Daily' : 'Weekly'} Newsletter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Select Frequency</h4>
            <RadioGroup value={frequency} onValueChange={handleFrequencyChange} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">Weekly</Label>
              </div>
            </RadioGroup>
          </div>
          {frequency === 'weekly' && (
            <div className="space-y-4 mt-4">
              <h4 className="font-medium leading-none">Select days to receive newsletters:</h4>
              <div className="grid grid-cols-2 gap-2">
                {daysOfWeek.map((day, index) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={selectedDays.includes(index)}
                      onCheckedChange={() => handleDayToggle(index)}
    />
                    <Label htmlFor={day}>{day}</Label>
                  </div>
                ))}
              </div>
              <Button onClick={savePreferences} disabled={selectedDays.length === 0}>
                Save Preferences
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}