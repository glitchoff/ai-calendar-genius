
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, Plus, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import type { CalendarEvent } from './Calendar';

interface ChatWithAIProps {
  onAddEvent: (event: CalendarEvent) => void;
}

export function ChatWithAI({ onAddEvent }: ChatWithAIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [suggestedEvent, setSuggestedEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setIsLoading(true);
      const apiKey = localStorage.getItem('apiKey');
      if (!apiKey) {
        toast({
          title: "Error",
          description: "Please add your API key first",
          variant: "destructive",
        });
        return;
      }

      const prompt = `Create a calendar event based on this request: "${message}". 
      Respond with a JSON object that has these properties:
      - title (string)
      - description (string)
      - start (ISO date string)
      - end (ISO date string)
      - priority ("high", "medium", or "low")
      Make the dates realistic and close to the current time.`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Gemini');
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }

      const eventData = JSON.parse(jsonMatch[0]);
      const suggestion: CalendarEvent = {
        id: crypto.randomUUID(),
        title: eventData.title,
        description: eventData.description,
        start: new Date(eventData.start),
        end: new Date(eventData.end),
        priority: eventData.priority as "high" | "medium" | "low"
      };

      setSuggestedEvent(suggestion);
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    if (suggestedEvent) {
      onAddEvent(suggestedEvent);
      setSuggestedEvent(null);
      toast({
        title: "Success",
        description: "Event has been added to your calendar",
      });
    }
  };

  const handleDecline = () => {
    setSuggestedEvent(null);
    toast({
      description: "Event suggestion declined",
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 p-0"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-80 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Chat with Gemini AI</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {suggestedEvent && (
              <div className="bg-secondary p-3 rounded-lg">
                <h4 className="font-medium mb-2">{suggestedEvent.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {suggestedEvent.description}
                </p>
                <p className="text-sm">
                  {suggestedEvent.start.toLocaleString()} - {suggestedEvent.end.toLocaleString()}
                </p>
                <div className="flex space-x-2 mt-3">
                  <Button
                    size="sm"
                    onClick={handleAccept}
                    className="flex-1"
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDecline}
                    className="flex-1"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask AI to create an event..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Plus className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
}
