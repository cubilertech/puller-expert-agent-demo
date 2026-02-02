import { useState } from 'react';
import { Upload, MessageSquare, Plug, Video } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ContextUploader } from '@/components/inputs/ContextUploader';
import { ContextChat } from '@/components/inputs/ContextChat';
import { ContextApiConnect } from '@/components/inputs/ContextApiConnect';
import { ContextScreenRecord } from '@/components/inputs/ContextScreenRecord';
import { ContextItem, ContextItemType, ContextSource } from '@/types';

interface ContextInputHubProps {
  onAddContext: (item: Omit<ContextItem, 'id' | 'timestamp' | 'status'>) => void;
}

const tabs = [
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'api', label: 'API', icon: Plug },
  { id: 'record', label: 'Record', icon: Video },
] as const;

export function ContextInputHub({ onAddContext }: ContextInputHubProps) {
  const [activeTab, setActiveTab] = useState<string>('upload');

  const handleUpload = (file: File, extractedContent: string) => {
    onAddContext({
      type: 'entity',
      source: 'upload',
      content: extractedContent || `Uploaded file: ${file.name}`,
      metadata: {
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        fileType: file.type,
      },
    });
  };

  const handleChatSubmit = (content: string, type: ContextItemType) => {
    onAddContext({
      type,
      source: 'chat',
      content,
    });
  };

  const handleApiConnect = (config: { url: string; authType: string; headers: Record<string, string> }) => {
    onAddContext({
      type: 'fact',
      source: 'api',
      content: `Connected to API endpoint: ${config.url}`,
      metadata: {
        endpoint: config.url,
        authType: config.authType,
        headerCount: Object.keys(config.headers).length,
      },
    });
  };

  const handleRecordingSave = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    onAddContext({
      type: 'entity',
      source: 'screen-record',
      content: 'Screen recording captured - processing for context extraction',
      metadata: {
        duration: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        transcribed: false,
      },
    });
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 m-4 mb-0">
          {tabs.map(({ id, label, icon: Icon }) => (
            <TabsTrigger 
              key={id} 
              value={id}
              className="flex items-center gap-1.5 text-xs"
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="upload" className="h-full m-0 p-4">
            <ContextUploader onUpload={handleUpload} />
          </TabsContent>

          <TabsContent value="chat" className="h-full m-0 p-4">
            <ContextChat onSubmit={handleChatSubmit} />
          </TabsContent>

          <TabsContent value="api" className="h-full m-0 p-4">
            <ContextApiConnect onConnect={handleApiConnect} />
          </TabsContent>

          <TabsContent value="record" className="h-full m-0 p-4">
            <ContextScreenRecord onSave={handleRecordingSave} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
