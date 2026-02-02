import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, FileSpreadsheet, FileJson, File, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ContextUploaderProps {
  onUpload: (file: File, extractedContent: string) => void;
}

const fileTypeIcons: Record<string, React.ElementType> = {
  'application/pdf': FileText,
  'text/csv': FileSpreadsheet,
  'application/json': FileJson,
  'text/plain': FileText,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileSpreadsheet,
};

const supportedFormats = ['PDF', 'CSV', 'JSON', 'TXT', 'XLSX'];

export function ContextUploader({ onUpload }: ContextUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);

    // Simulate file processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      // Generate mock extracted content based on file type
      const extractedContent = `Processed ${file.name} - extracted data structures and business rules from document`;
      onUpload(file, extractedContent);

      // Reset after showing success
      setTimeout(() => {
        setUploadedFile(null);
        setIsComplete(false);
      }, 2000);
    }, 1500);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const clearFile = () => {
    setUploadedFile(null);
    setIsProcessing(false);
    setIsComplete(false);
  };

  const FileIcon = uploadedFile ? (fileTypeIcons[uploadedFile.type] || File) : Upload;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground mb-1">Upload Documents</h3>
        <p className="text-xs text-muted-foreground">
          Drop files to extract context automatically
        </p>
      </div>

      <div
        className={cn(
          'flex-1 border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center p-6',
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
          uploadedFile && 'border-solid'
        )}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="wait">
          {!uploadedFile ? (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <motion.div
                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4"
              >
                <Upload className={cn(
                  'w-6 h-6 transition-colors',
                  isDragging ? 'text-primary' : 'text-muted-foreground'
                )} />
              </motion.div>
              <p className="text-sm text-foreground mb-1">
                {isDragging ? 'Drop file here' : 'Drag and drop a file'}
              </p>
              <p className="text-xs text-muted-foreground mb-4">or</p>
              <label>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.csv,.json,.txt,.xlsx"
                  onChange={handleFileSelect}
                />
                <Button variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">Browse files</span>
                </Button>
              </label>
            </motion.div>
          ) : (
            <motion.div
              key="file-preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center w-full"
            >
              <div className="relative inline-block">
                <motion.div
                  className={cn(
                    'w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4',
                    isComplete ? 'bg-success/20' : 'bg-muted'
                  )}
                  animate={isProcessing ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={{ repeat: isProcessing ? Infinity : 0, duration: 0.5 }}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  ) : (
                    <FileIcon className="w-8 h-8 text-primary" />
                  )}
                </motion.div>
                {!isProcessing && !isComplete && (
                  <button
                    onClick={clearFile}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-sm font-medium text-foreground mb-1 truncate max-w-full">
                {uploadedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {isProcessing && 'Processing...'}
                {isComplete && 'Context extracted successfully!'}
                {!isProcessing && !isComplete && `${(uploadedFile.size / 1024).toFixed(1)} KB`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="text-[10px] text-muted-foreground">Supported:</span>
        {supportedFormats.map((format) => (
          <span
            key={format}
            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
          >
            {format}
          </span>
        ))}
      </div>
    </div>
  );
}
