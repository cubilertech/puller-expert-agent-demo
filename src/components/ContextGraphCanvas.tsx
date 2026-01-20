import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import { KnowledgeNode } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ContextGraphCanvasProps {
  nodes: KnowledgeNode[];
  isLearning: boolean;
  newNodeLabel?: string;
  onExpand?: () => void;
  compact?: boolean;
}

const nodeColors = {
  entity: { fill: 'hsl(var(--primary))', glow: 'hsla(var(--primary), 0.5)' },
  rule: { fill: 'hsl(var(--warning))', glow: 'hsla(var(--warning), 0.5)' },
  fact: { fill: 'hsl(var(--success))', glow: 'hsla(var(--success), 0.5)' },
};

export function ContextGraphCanvas({ 
  nodes, 
  isLearning, 
  newNodeLabel,
  onExpand,
  compact = false
}: ContextGraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });
  const pulseRef = useRef(0);

  // Calculate connections
  const connections = nodes.flatMap(node => 
    node.connections
      .map(targetId => nodes.find(n => n.id === targetId))
      .filter(Boolean)
      .map(target => ({ from: node, to: target! }))
  );

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: Math.max(height, 150) });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Apply transformations
    ctx.save();
    ctx.translate(dimensions.width / 2 + pan.x, dimensions.height / 2 + pan.y);
    ctx.scale(zoom, zoom);
    ctx.translate(-dimensions.width / 2, -dimensions.height / 2);

    // Draw connections
    connections.forEach(conn => {
      ctx.beginPath();
      ctx.moveTo(conn.from.x, conn.from.y);
      ctx.lineTo(conn.to.x, conn.to.y);
      ctx.strokeStyle = isLearning 
        ? `hsla(var(--success), ${0.3 + Math.sin(pulseRef.current) * 0.2})`
        : 'hsla(var(--muted-foreground), 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
      const colors = nodeColors[node.type];
      const radius = node.type === 'fact' ? 14 : 10;
      const pulseScale = isLearning ? 1 + Math.sin(pulseRef.current * 2) * 0.1 : 1;
      const actualRadius = radius * pulseScale;

      // Glow effect
      const gradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, actualRadius * 2
      );
      gradient.addColorStop(0, colors.glow);
      gradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, actualRadius * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, actualRadius, 0, Math.PI * 2);
      ctx.fillStyle = colors.fill;
      ctx.globalAlpha = node.isNew ? 1 : 0.8;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Label
      ctx.font = '9px system-ui, sans-serif';
      ctx.fillStyle = 'hsl(var(--foreground))';
      ctx.globalAlpha = 0.7;
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + actualRadius + 12);
      ctx.globalAlpha = 1;
    });

    ctx.restore();

    // Continue animation if learning
    if (isLearning) {
      pulseRef.current += 0.05;
      animationRef.current = requestAnimationFrame(draw);
    }
  }, [nodes, connections, isLearning, zoom, pan, dimensions]);

  // Animation loop
  useEffect(() => {
    draw();
    if (isLearning) {
      animationRef.current = requestAnimationFrame(draw);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw, isLearning]);

  // Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(z => Math.max(0.5, Math.min(3, z + delta)));
  };

  // Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="h-full flex flex-col bg-card/50 rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="p-2 border-b border-border flex items-center gap-2">
        <Brain className={cn(
          'w-3.5 h-3.5 transition-colors',
          isLearning ? 'text-success animate-pulse' : 'text-primary'
        )} />
        <h3 className="font-semibold text-xs text-foreground flex-1">Context Graph</h3>
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleZoomOut}
            title="Zoom out"
          >
            <ZoomOut className="w-3 h-3" />
          </Button>
          <span className="text-[10px] text-muted-foreground w-8 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleZoomIn}
            title="Zoom in"
          >
            <ZoomIn className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleReset}
            title="Reset view"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
          {onExpand && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-1"
              onClick={onExpand}
              title="Expand to full view"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          )}
        </div>

        {isLearning && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-success" />
            <span className="text-[10px] text-success font-medium">UPDATING</span>
          </motion.div>
        )}
      </div>

      {/* Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 relative cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          className={cn(
            'w-full h-full transition-all duration-300',
            isLearning && 'ring-1 ring-success/30 ring-inset'
          )}
          style={{ width: dimensions.width, height: dimensions.height }}
        />

        {/* New Node Callout */}
        <AnimatePresence>
          {newNodeLabel && !compact && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-3 left-3 right-3 bg-success/20 border border-success/30 rounded-lg p-2 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-success" />
                <div>
                  <div className="text-[10px] font-medium text-success">New Knowledge</div>
                  <div className="text-[9px] text-success/80 font-mono">{newNodeLabel}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      {!compact && (
        <div className="p-2 border-t border-border flex items-center justify-center gap-4 text-[9px]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Entity</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">Rule</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Fact</span>
          </div>
        </div>
      )}
    </div>
  );
}