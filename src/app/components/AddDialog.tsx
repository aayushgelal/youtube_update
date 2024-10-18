import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from 'lucide-react';

const AddChannelDialog = ({ onAdd }: any) => {
  const [channelUrl, setChannelUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
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
        <Button variant={'default'} className='border-primary border-2'>
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
