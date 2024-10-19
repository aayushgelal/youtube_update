import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from 'lucide-react';

const ChannelCard = ({ channel, onDelete }: any) => (
  <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg h-64">
   
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-46 bg-red-50 mt-4 h-56 overflow-hidden mb-4 rounded-full">
        <img
          src={channel.profilePhotoUrl}
          alt={channel.name}
          className="w-full h-full object-contain"
        />
      </div>
      <CardContent className="text-center">
        <h3 className="text-sm font-regular text-gray-600 mb-1 truncate">{channel.name}</h3>
      </CardContent>
      <Button
      variant="ghost"
      size="icon"
      onClick={() => onDelete(channel.id)}
      className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"
    >
      <Trash2 className="h-5 w-5" />
    </Button>
    </div>
  </Card>
);

export default ChannelCard;