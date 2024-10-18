import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from 'lucide-react';

const ChannelCard = ({ channel, onDelete }: any) => (
  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
    <CardHeader className="p-0">
      <img 
        src={channel.profilePhotoUrl} 
        alt={channel.name} 
        className="w-full h-40 object-cover"
      />
    </CardHeader>
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-lg mb-1 truncate">{channel.name}</CardTitle>
          <p className="text-sm text-gray-500 truncate">{channel.channelId}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDelete(channel.id)} 
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default ChannelCard;
