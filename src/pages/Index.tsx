import { useState, useCallback, useEffect } from 'react';
import { TaskFeed } from '@/components/TaskFeed';
import { ContextThread } from '@/components/ContextThread';
import { ArtifactEditor } from '@/components/ArtifactEditor';
import { KnowledgeGraph } from '@/components/KnowledgeGraph';
import { FlyingArtifact } from '@/components/FlyingArtifact';
import { LearningToast } from '@/components/LearningToast';
import { ControlTowerHeader } from '@/components/ControlTowerHeader';
import { useSimulation } from '@/hooks/useSimulation';
import { Task, KnowledgeNode, LearningSignal } from '@/types';
import { initialTasks, chatMessages, originalCode, initialKnowledgeNodes } from '@/data/demoData';

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>('task-1');
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>(initialKnowledgeNodes);
  const [isApproving, setIsApproving] = useState(false);
  const [showFlyingArtifact, setShowFlyingArtifact] = useState(false);
  const [isLearning, setIsLearning] = useState(false);
  const [learningSignal, setLearningSignal] = useState<LearningSignal | null>(null);
  const [approvedCount, setApprovedCount] = useState(0);

  // Enable simulation for ghost tasks
  useSimulation(true, setTasks);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  const handleSendToRequestor = useCallback(() => {
    if (!selectedTaskId) return;

    setIsApproving(true);

    // Move task to Active (waiting room) after brief delay
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTaskId 
            ? { 
                ...t, 
                status: 'sent' as const, 
                sentStatus: 'pending' as const,
                sentAt: new Date()
              } 
            : t
        )
      );
      setIsApproving(false);
      setSelectedTaskId(null);
    }, 800);
  }, [selectedTaskId]);

  const handleFlyingComplete = useCallback(() => {
    setShowFlyingArtifact(false);
    setIsLearning(true);

    // Add new knowledge node
    const newNode: KnowledgeNode = {
      id: `node-${Date.now()}`,
      label: 'NULL → ZERO',
      type: 'fact',
      x: 150,
      y: 320,
      isNew: true,
      connections: ['node-4'],
    };

    setKnowledgeNodes((prev) => [...prev, newNode]);

    // Show learning toast
    setTimeout(() => {
      setLearningSignal({
        id: `signal-${Date.now()}`,
        rule: 'REVENUE_NULL_BEHAVIOR',
        value: 'ZERO',
        timestamp: new Date(),
      });

      // Mark task as approved
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTaskId ? { ...t, status: 'approved' as const } : t
        )
      );

      setApprovedCount((prev) => prev + 1);
      setIsApproving(false);
      setIsLearning(false);
      setSelectedTaskId(null);
    }, 1500);
  }, [selectedTaskId]);

  const handleOverride = useCallback(() => {
    // In a real app, this would open an editing interface
    console.log('Override requested');
  }, []);

  const handleForceComplete = useCallback((taskId: string) => {
    // Trigger the flying artifact animation and move to done
    setSelectedTaskId(taskId);
    setShowFlyingArtifact(true);
  }, []);

  const handleDismissToast = useCallback(() => {
    setLearningSignal(null);
  }, []);

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (learningSignal) {
      const timer = setTimeout(() => setLearningSignal(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [learningSignal]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <ControlTowerHeader
        taskCount={tasks.filter((t) => t.status !== 'approved').length}
        approvedCount={approvedCount}
        isLearning={isLearning}
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Task Feed */}
        <aside className="w-72 border-r border-border flex-shrink-0">
          <TaskFeed
            tasks={tasks}
            selectedTaskId={selectedTaskId}
            onSelectTask={setSelectedTaskId}
            onForceComplete={handleForceComplete}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedTask ? (
            <div className="flex-1 flex overflow-hidden">
              {/* Context Thread */}
              <div className="flex-1 overflow-hidden">
                <ContextThread
                  messages={chatMessages}
                  taskTitle={selectedTask.description}
                />
              </div>
              
              {/* Artifact Editor */}
              <div className="w-[480px] border-l border-border flex-shrink-0">
              <ArtifactEditor
                  code={originalCode}
                  onApprove={handleSendToRequestor}
                  onOverride={handleOverride}
                  isApproving={isApproving}
                  hideActions={selectedTask.status === 'sent' || selectedTask.status === 'approved'}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Select a Task
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Choose a task from The Pulse to review the Agent's work and provide expert judgment.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Flying Artifact Animation */}
      <FlyingArtifact
        isVisible={showFlyingArtifact}
        onComplete={handleFlyingComplete}
      />

      {/* Learning Toast */}
      <LearningToast signal={learningSignal} onDismiss={handleDismissToast} />
    </div>
  );
}
