"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";
import { useUser } from '@clerk/nextjs';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function NewsletterPreferences() {
  const { user } = useUser();
  const [frequency, setFrequency] = useState('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([4]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = async () => {
    if (!user) return;
    
    try {
      setError(null);
      const response = await fetch('/api/user/newsletter-preferences');
      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }
      const data = await response.json();
      setFrequency(data.frequency || 'daily');
      setSelectedDays(data.weeklyDays || [4]);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setError('Failed to load preferences');
      toast.error("Unable to load preferences");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const handleDayToggle = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const savePreferences = async () => {
    if (!user) return;

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
      
      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }
      
      toast.success("Preferences updated successfully!", { id: toastId });
      setIsPopoverOpen(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error("Failed to update preferences", { id: toastId });
    }
  };

  const handleFrequencyChange = (newFrequency: string) => {
    setFrequency(newFrequency);
    if (newFrequency === 'daily') {
      savePreferences();
    }
  };

  if (isLoading) {
    return (
      <Button disabled variant="outline">
        Loading preferences...
      </Button>
    );
  }

  if (error) {
    return (
      <Button variant="outline" onClick={fetchPreferences}>
        Retry loading preferences
      </Button>
    );
  }

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