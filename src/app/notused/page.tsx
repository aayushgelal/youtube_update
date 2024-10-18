'use client'

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [channelName, setChannelName] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [channels, setChannels] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchChannels();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data.map((user: any) => user.email));
  };

  const fetchChannels = async () => {
    const res = await fetch('/api/getUserChannels');
    const data = await res.json();
    setChannels(data.map((channel: any) => channel.channelId));
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setEmail('');
      fetchUsers();
      setMessage('User added successfully');
    } else {
      setMessage('Failed to add user');
    }
  };

  const addChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/getUserChannels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId: channelName }),
    });
    if (res.ok) {
      setChannelName('');
      fetchChannels();
      setMessage('Channel added successfully');
    } else {
      setMessage('Failed to add channel');
    }
  };
"use client"
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Plus, Loader2, Trash2, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"




const ChannelCard = ({ channel, onDelete }:any) => (
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
        <Button variant="ghost" size="icon" onClick={() => onDelete(channel.id)} className="text-red-500 hover:text-red-700">
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const AddChannelDialog = ({ onAdd }:any) => {
  const [channelUrl, setChannelUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId: channelUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to add channel');
      }

      onAdd();
      setChannelUrl('');
    } catch (err) {
      setError('Failed to add channel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'default'} className=' border-primary border-2'>
          <Plus className=" h-4 w-4" /> Add a New Channel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Channel</DialogTitle>
          <DialogDescription>
            Enter the URL of the YouTube channel you want to add to your digest.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Input
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="Enter YouTube channel URL"
              className="col-span-3"
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading} variant={'default'}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Channel'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

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

  const handleDeleteChannel = async (channelId:string) => {
    try {
      await fetch(`/api/channels/${channelId}`, { method: 'DELETE' });
      fetchChannels();
    } catch (error) {
      console.error('Error deleting channel:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChannels();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg font-medium text-gray-500 ">Your YouTube Channels</h1>
          <AddChannelDialog onAdd={fetchChannels} />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : channels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {channels.map((channel:any) => (
              <ChannelCard key={channel.id} channel={channel} onDelete={handleDeleteChannel} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-2xl font-semibold mb-2 text-primary">No channels yet</h2>
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
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">YouTube Transcript Manager</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add User</h2>
        <form onSubmit={addUser} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="flex-grow p-2 border rounded"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add User</button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add Channel</h2>
        <form onSubmit={addChannel} className="flex gap-2">
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Enter channel name or ID"
            className="flex-grow p-2 border rounded"
            required
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Channel</button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Trigger Daily Transcripts</h2>
        <button onClick={triggerDailyTranscripts} className="bg-purple-500 text-white px-4 py-2 rounded">
          Send Daily Transcripts
        </button>
      </div>

      {message && <p className="text-lg font-semibold mt-4">{message}</p>}

      <div className="grid grid-cols-2 gap-8 mt-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <ul className="list-disc pl-5">
            {users.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Channels</h2>
          <ul className="list-disc pl-5">
            {channels.map((channel, index) => (
              <li key={index}>{channel}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}