import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ChannelCard = ({ channel, onDelete }: any) => {
  const handleDelete = (id: string) => {
    const toastId = toast.loading(`Deleting the channel`);

    
    
    // Trigger the onDelete function and show a toast
    onDelete(id).then(() => {
      toast.dismiss(toastId);

      toast.success(`Channel ${channel.name} deleted successfully`)
    }
      );
    
  };

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg h-64">
      {/* Background image with linear gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${channel.profilePhotoUrl})`
        }}
      />
      {/* Content that sits on top of the background */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <CardContent className="text-center">
          <h3 className="text-lg font-semibold mb-1 truncate">{channel.name}</h3>
        </CardContent>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDelete(channel.id)}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
};

export default ChannelCard;