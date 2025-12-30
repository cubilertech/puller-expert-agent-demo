import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';
import { KnowledgeNode } from '@/types';
import { cn } from '@/lib/utils';

interface KnowledgeGraphProps {
  nodes: KnowledgeNode[];
  isLearning: boolean;
  newNodeLabel?: string;
}

const nodeColors = {
  entity: { fill: 'fill-primary', stroke: 'stroke-primary', glow: 'text-primary' },
  rule: { fill: 'fill-warning', stroke: 'stroke-warning', glow: 'text-warning' },
  fact: { fill: 'fill-success', stroke: 'stroke-success', glow: 'text-success' },
};

export function KnowledgeGraph({ nodes, isLearning, newNodeLabel }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width, height } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width, height: Math.max(height, 200) });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calculate connections
  const connections: { from: KnowledgeNode; to: KnowledgeNode }[] = [];
  nodes.forEach(node => {
    node.connections.forEach(targetId => {
      const target = nodes.find(n => n.id === targetId);
      if (target) {
        connections.push({ from: node, to: target });
      }
    });
  });

  return (
    <div className="h-full flex flex-col bg-card/50 rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center gap-2">
        <Brain className={cn(
          'w-4 h-4 transition-colors',
          isLearning ? 'text-success animate-pulse' : 'text-primary'
        )} />
        <h3 className="font-semibold text-sm text-foreground">Knowledge Context</h3>
        {isLearning && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 ml-auto"
          >
            <Sparkles className="w-3 h-3 text-success" />
            <span className="text-[10px] text-success font-medium">UPDATING</span>
          </motion.div>
        )}
      </div>

      {/* Graph */}
      <div className="flex-1 relative">
        <svg
          ref={svgRef}
          className={cn(
            'w-full h-full transition-all duration-500',
            isLearning && 'border-glow-success'
          )}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connections */}
          {connections.map((conn, index) => (
            <motion.line
              key={`line-${index}`}
              x1={conn.from.x}
              y1={conn.from.y}
              x2={conn.to.x}
              y2={conn.to.y}
              className={cn(
                'stroke-muted-foreground/30 transition-all duration-500',
                isLearning && 'stroke-success/50'
              )}
              strokeWidth={1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}

          {/* Nodes */}
          <AnimatePresence>
            {nodes.map((node) => {
              const colors = nodeColors[node.type];
              return (
                <motion.g
                  key={node.id}
                  initial={node.isNew ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={node.type === 'fact' ? 14 : 10}
                    className={cn(
                      colors.fill,
                      'opacity-80',
                      node.isNew && 'node-glow'
                    )}
                    filter={node.isNew || isLearning ? 'url(#glow-strong)' : 'url(#glow)'}
                    animate={isLearning ? {
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 1, 0.8],
                    } : {}}
                    transition={{ repeat: isLearning ? Infinity : 0, duration: 1.5 }}
                  />
                  <text
                    x={node.x}
                    y={node.y + (node.type === 'fact' ? 28 : 22)}
                    className="text-[9px] fill-foreground/70 text-center"
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>
                </motion.g>
              );
            })}
          </AnimatePresence>
        </svg>

        {/* New Node Callout */}
        <AnimatePresence>
          {newNodeLabel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-4 left-4 right-4 bg-success/20 border border-success/30 rounded-lg p-2 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-success" />
                <div>
                  <div className="text-xs font-medium text-success">New Knowledge Acquired</div>
                  <div className="text-[10px] text-success/80 font-mono">{newNodeLabel}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
