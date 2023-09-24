import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { HistoryIcon } from 'lucide-react';

export function JSONTab({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [text, setText] = useState('');

  return (
    <div className="flex h-full flex-col space-y-4">
      <Textarea
        onChange={(e) => setText(e.target.value)}
        value={text}
        placeholder="Write a tagline for an ice cream shop"
        className="min-h-[400px] flex-1 p-4 md:min-h-[700px] lg:min-h-[700px]"
      />
      <div className="flex items-center space-x-2">
        <Button onClick={() => onSubmit(text)}>Submit</Button>
        <Button variant="secondary">
          <span className="sr-only">Show history</span>
          <HistoryIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
