"use client"
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AddChannelDialog = ({ onAdd }: any) => {
  const [channelUrl, setChannelUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setIsOpen(false); // Close the dialog
   
    const toastid =  toast.loading("Adding the channel")

    


    try {
      const response = await fetch('/api/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId: channelUrl }),
      });
      toast.dismiss(toastid)
    

      if (!response.ok) {
        toast.error("Failed to Add Channel");
      }
      toast.success("Channel Added Successfully")
      onAdd();
      setChannelUrl('');
    } catch (err) {
      setError('Failed to add channel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'default'} className='border-primary border-2' onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4" /> Add a New Channel
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

export default AddChannelDialog;