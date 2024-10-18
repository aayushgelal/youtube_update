interface TranscriptDisplayProps {
    transcript: string
  }
  
  export default function TranscriptDisplay({ transcript }: TranscriptDisplayProps) {
    return (
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Transcript:</h2>
        {transcript ? (
          <p className="whitespace-pre-wrap">{transcript}</p>
        ) : (
          <p>No transcript available yet. Enter a channel URL to fetch the latest video&apos;s transcript.</p>
        )}
      </div>
    )
  }