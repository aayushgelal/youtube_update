'use client'

import { useState } from 'react'

interface ChannelInputProps {
  onSubmit: (channelUrl: string) => void
}

export default function ChannelInput({ onSubmit }: ChannelInputProps) {
  const [channelUrl, setChannelUrl] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(channelUrl)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={channelUrl}
        onChange={(e) => setChannelUrl(e.target.value)}
        placeholder="Enter YouTube channel URL"
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Get Transcript
      </button>
    </form>
  )
}