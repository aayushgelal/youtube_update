"use client"
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Plus, Loader2, Newspaper } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card"
import toast from "react-hot-toast";
import { redirect } from 'next/navigation';
import ChannelCard from '../components/ChannelCard';
import AddChannelDialog from '../components/AddDialog';
import NewsletterPreferences from '../components/NewsletterPreference';

const Dashboard = () => {
  const { user } = useUser();
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);



  const fetchChannels = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/channels');
      const data = await response.json();
      setChannels(data.channels);
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleDeleteChannel = async (channelId: number) => {
    try {
      await fetch("/api/channels", { method: 'DELETE', headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channelId }),
   });
      fetchChannels();
    } catch (error) {
      console.error('Error deleting channel:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChannels();
    } else {
      redirect('/')
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-lg font-medium text-gray-500">Your YouTube Channels</h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <AddChannelDialog onAdd={fetchChannels} />
            <NewsletterPreferences />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : channels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {channels.map((channel: any) => (
              <ChannelCard key={channel.id} channel={channel} onDelete={handleDeleteChannel} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-8 sm:py-12">
            <CardContent>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-primary">No channels yet</h2>
              <p className="text-gray-500 mb-4">Add your first YouTube channel to get started!</p>
              <AddChannelDialog onAdd={fetchChannels} />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;