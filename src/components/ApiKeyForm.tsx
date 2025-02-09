
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function ApiKeyForm() {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }
    
    // Store the API key in localStorage
    localStorage.setItem('apiKey', apiKey);
    toast({
      title: "Success",
      description: "API key has been saved",
    });
    setApiKey('');
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">API Key Configuration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enter API Key
          </label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full">
          Save API Key
        </Button>
      </form>
    </div>
  );
}
