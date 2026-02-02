import { useState } from 'react';
import { Plug, Plus, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ContextApiConnectProps {
  onConnect: (config: { url: string; authType: string; headers: Record<string, string> }) => void;
}

type ConnectionStatus = 'idle' | 'testing' | 'success' | 'error';

export function ContextApiConnect({ onConnect }: ContextApiConnectProps) {
  const [url, setUrl] = useState('');
  const [authType, setAuthType] = useState('none');
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('idle');

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const testConnection = () => {
    if (!url.trim()) return;
    
    setStatus('testing');
    
    // Simulate API test
    setTimeout(() => {
      // Randomly succeed or fail for demo
      const success = Math.random() > 0.3;
      setStatus(success ? 'success' : 'error');
      
      if (success) {
        setTimeout(() => {
          const headerObj = headers.reduce((acc, h) => {
            if (h.key) acc[h.key] = h.value;
            return acc;
          }, {} as Record<string, string>);
          
          onConnect({ url, authType, headers: headerObj });
          
          // Reset form
          setUrl('');
          setAuthType('none');
          setHeaders([]);
          setStatus('idle');
        }, 1500);
      }
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground mb-1">Connect API Source</h3>
        <p className="text-xs text-muted-foreground">
          Sync data from external APIs and services
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-auto">
        {/* Endpoint URL */}
        <div className="space-y-2">
          <Label htmlFor="api-url" className="text-xs">Endpoint URL</Label>
          <Input
            id="api-url"
            placeholder="https://api.example.com/v1/data"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        {/* Authentication Type */}
        <div className="space-y-2">
          <Label className="text-xs">Authentication</Label>
          <Select value={authType} onValueChange={setAuthType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Authentication</SelectItem>
              <SelectItem value="bearer">Bearer Token</SelectItem>
              <SelectItem value="api-key">API Key</SelectItem>
              <SelectItem value="basic">Basic Auth</SelectItem>
              <SelectItem value="oauth2">OAuth 2.0</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Headers */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Custom Headers</Label>
            <Button variant="ghost" size="sm" onClick={addHeader} className="h-7 text-xs">
              <Plus className="w-3 h-3 mr-1" />
              Add Header
            </Button>
          </div>
          
          {headers.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">No custom headers</p>
          ) : (
            <div className="space-y-2">
              {headers.map((header, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Header name"
                    value={header.key}
                    onChange={(e) => updateHeader(i, 'key', e.target.value)}
                    className="flex-1 h-8 text-xs"
                  />
                  <Input
                    placeholder="Value"
                    value={header.value}
                    onChange={(e) => updateHeader(i, 'value', e.target.value)}
                    className="flex-1 h-8 text-xs"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHeader(i)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Connection Status */}
        {status !== 'idle' && (
          <div className={cn(
            'flex items-center gap-2 p-3 rounded-lg border',
            status === 'testing' && 'bg-muted/50 border-border',
            status === 'success' && 'bg-success/10 border-success/30',
            status === 'error' && 'bg-destructive/10 border-destructive/30'
          )}>
            {status === 'testing' && (
              <>
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-xs text-muted-foreground">Testing connection...</span>
              </>
            )}
            {status === 'success' && (
              <>
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-xs text-success">Connection successful!</span>
              </>
            )}
            {status === 'error' && (
              <>
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-xs text-destructive">Connection failed. Check URL and credentials.</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Test & Connect Button */}
      <Button
        onClick={testConnection}
        disabled={!url.trim() || status === 'testing'}
        className="mt-4"
      >
        <Plug className="w-4 h-4 mr-2" />
        Test & Connect
      </Button>
    </div>
  );
}
