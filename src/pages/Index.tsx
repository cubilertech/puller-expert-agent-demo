import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskFeed } from '@/components/TaskFeed';
import { ContextThread } from '@/components/ContextThread';
import { ArtifactEditor } from '@/components/ArtifactEditor';
import { ContextGraph } from '@/components/ContextGraph';
import { FlyingArtifact } from '@/components/FlyingArtifact';
import { LearningToast } from '@/components/LearningToast';
import { ControlTowerHeader } from '@/components/ControlTowerHeader';
import { useSimulation } from '@/hooks/useSimulation';
import { useAuth } from '@/hooks/useAuth';
import { Task, KnowledgeNode, LearningSignal } from '@/types';
import { initialTasks, initialKnowledgeNodes, allTaskData, chatMessages, originalCode, originalCodeAnnotations } from '@/data/demoData';

export default function Index() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // Auth check
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(initialTasks[0]?.id || null);
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>(initialKnowledgeNodes);
  const [isApproving, setIsApproving] = useState(false);
  const [showFlyingArtifact, setShowFlyingArtifact] = useState(false);
  const [isLearning, setIsLearning] = useState(false);
  const [learningSignal, setLearningSignal] = useState<LearningSignal | null>(null);
  const [approvedCount, setApprovedCount] = useState(0);
  const [artifactsReady, setArtifactsReady] = useState(false);
  const previousTaskId = useRef<string | null>(null);

  // Reset artifacts ready state when task changes
  useEffect(() => {
    if (previousTaskId.current !== selectedTaskId) {
      setArtifactsReady(false);
      previousTaskId.current = selectedTaskId;
    }
  }, [selectedTaskId]);

  // Enable simulation for ghost tasks
  useSimulation(true, setTasks);

  // Refresh demo content
  const handleRefreshDemo = useCallback(() => {
    setTasks([...initialTasks]);
    setSelectedTaskId(initialTasks[0]?.id || null);
    setKnowledgeNodes([...initialKnowledgeNodes]);
    setApprovedCount(0);
    setIsApproving(false);
    setShowFlyingArtifact(false);
    setIsLearning(false);
    setLearningSignal(null);
  }, []);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);
  const taskData = selectedTaskId ? allTaskData[selectedTaskId] : null;

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
        onLogout={logout}
        onRefresh={handleRefreshDemo}
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
                  messages={taskData?.messages || chatMessages}
                  taskTitle={selectedTask.description}
                  taskStatus={selectedTask.status}
                  taskSource={selectedTask.source}
                  requestor={selectedTask.requestor}
                  onArtifactsReady={() => setArtifactsReady(true)}
                  onCommentAdded={(comment) => {
                    // Add a new knowledge node from the comment
                    const newNode: KnowledgeNode = {
                      id: `node-${Date.now()}`,
                      label: comment.quotedText.slice(0, 20) + (comment.quotedText.length > 20 ? '...' : ''),
                      type: 'rule',
                      x: 80 + Math.random() * 140,
                      y: 280 + Math.random() * 60,
                      isNew: true,
                      connections: ['node-1'],
                    };
                    setKnowledgeNodes((prev) => [...prev, newNode]);
                    setApprovedCount((prev) => prev + 1);
                    
                    // Show learning signal
                    setLearningSignal({
                      id: `signal-${Date.now()}`,
                      rule: 'USER_CORRECTION',
                      value: comment.comment.slice(0, 30),
                      timestamp: new Date(),
                    });
                  }}
                />
              </div>
              
              {/* Artifact Editor - Show loading state until artifacts are ready */}
              <div className="w-[480px] border-l border-border flex-shrink-0">
                {artifactsReady || selectedTask.status === 'sent' || selectedTask.status === 'approved' || selectedTask.status === 'review' ? (
                  <ArtifactEditor
                    code={taskData?.code || originalCode}
                    annotations={taskData?.annotations || originalCodeAnnotations}
                    tableColumns={taskData?.tableColumns}
                    tableData={taskData?.tableData}
                    initialAssumptions={taskData?.assumptions}
                    initialMessage={taskData?.responseMessage}
                    onApprove={handleSendToRequestor}
                    onOverride={handleOverride}
                    isApproving={isApproving}
                    hideActions={selectedTask.status === 'sent' || selectedTask.status === 'approved'}
                  />
                ) : (
                  <div className="h-full flex flex-col bg-background">
                    {/* Header */}
                    <div className="p-3 border-b border-border flex items-center gap-2 flex-shrink-0">
                      <div className="w-4 h-4 rounded bg-muted animate-pulse" />
                      <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                    </div>
                    
                    {/* Loading skeleton */}
                    <div className="flex-1 p-4 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-muted animate-pulse" />
                          <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                        </div>
                        <div className="h-24 rounded bg-muted/50 animate-pulse" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-muted animate-pulse" />
                          <div className="h-4 w-28 rounded bg-muted animate-pulse" />
                        </div>
                        <div className="space-y-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded bg-muted animate-pulse" />
                              <div className="h-3 flex-1 rounded bg-muted/60 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-muted animate-pulse" />
                          <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                        </div>
                        <div className="h-48 rounded bg-muted/40 animate-pulse" />
                      </div>
                      
                      {/* Waiting text */}
                      <div className="flex items-center justify-center gap-2 text-muted-foreground mt-8">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '200ms' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '400ms' }} />
                        </div>
                        <span className="text-xs">Waiting for agent response...</span>
                      </div>
                    </div>
                  </div>
                )}
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

        {/* Right Sidebar - Context Graph */}
        <aside className="w-64 border-l border-border flex-shrink-0 p-3">
          <ContextGraph
            nodes={knowledgeNodes}
            isLearning={isLearning}
            newNodeLabel={learningSignal?.rule}
          />
        </aside>
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
