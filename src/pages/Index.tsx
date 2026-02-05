import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { TaskFeed } from '@/components/TaskFeed';
import { ContextThread } from '@/components/ContextThread';
import { ArtifactEditor } from '@/components/ArtifactEditor';
import { FlyingArtifact } from '@/components/FlyingArtifact';
import { ControlTowerHeader } from '@/components/ControlTowerHeader';
import { ContextHubPanel } from '@/components/ContextHubPanel';
import { useSimulation } from '@/hooks/useSimulation';
import { useAuth } from '@/hooks/useAuth';
import { useContextHub } from '@/hooks/useContextHub';
import { Task, KnowledgeNode, LearningSignal, ChatMessage } from '@/types';
import { initialTasks, initialKnowledgeNodes, allTaskData, originalCode, originalCodeAnnotations } from '@/data/demoData';

// Helper to generate dynamic messages for tasks without predefined data
function generateTaskMessages(task: Task): ChatMessage[] {
  return [
    {
      id: `${task.id}-msg-1`,
      sender: 'user',
      content: task.description || task.title,
      timestamp: task.timestamp,
      type: 'text'
    },
    {
      id: `${task.id}-msg-2`,
      sender: 'agent',
      content: `Analysis complete for "${task.title}". Results generated based on available data sources.`,
      timestamp: new Date(task.timestamp.getTime() + 1000 * 60 * 5),
      type: 'action',
      assumptions: [
        'Using default business logic for calculations',
        'Data filtered to relevant time period',
        'NULL values treated as zero where applicable'
      ]
    }
  ];
}
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
  
  // Context Hub state management
  const { isOpen: isContextHubOpen, openPanel: openContextHub, closePanel: closeContextHub, contextItems, addContextItem, convertToKnowledgeNode } = useContextHub();
  
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

  // Auto-select next task when current task moves out of "incoming" queue
  useEffect(() => {
    if (!selectedTaskId) {
      // No task selected, find the first incoming task to select
      const incomingStatuses = ['ingesting', 'asserting', 'planning', 'building', 'validating', 'generating', 'review'];
      const nextTask = tasks.find(t => incomingStatuses.includes(t.status));
      if (nextTask) {
        setSelectedTaskId(nextTask.id);
      }
      return;
    }

    const selectedTask = tasks.find(t => t.id === selectedTaskId);
    if (!selectedTask) return;

    // If current task moved to sent/approved/learning, auto-select next incoming task
    const completedStatuses = ['sent', 'approved', 'learning'];
    if (completedStatuses.includes(selectedTask.status)) {
      const incomingStatuses = ['ingesting', 'asserting', 'planning', 'building', 'validating', 'generating', 'review'];
      const nextTask = tasks.find(t => t.id !== selectedTaskId && incomingStatuses.includes(t.status));
      if (nextTask) {
        setSelectedTaskId(nextTask.id);
      }
    }
  }, [tasks, selectedTaskId]);

  // Handle auto-complete from simulation - update context graph
  const handleTaskAutoComplete = useCallback((task: Task) => {
    setIsLearning(true);
    
    // Add new knowledge node for the auto-completed task
    const newNode: KnowledgeNode = {
      id: `node-${Date.now()}-${task.id}`,
      label: task.title?.slice(0, 15) || 'Task Complete',
      type: 'fact',
      x: 80 + Math.random() * 140,
      y: 280 + Math.random() * 60,
      isNew: true,
      connections: ['node-1'],
    };
    
    setKnowledgeNodes((prev) => [...prev, newNode]);
    setApprovedCount((prev) => prev + 1);
    
    // End learning animation after delay
    setTimeout(() => {
      setIsLearning(false);
    }, 2000);
  }, []);

  // Enable simulation for ghost tasks with auto-complete callback
  useSimulation(true, setTasks, handleTaskAutoComplete);

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
  const taskDataId = selectedTask?.originalId || selectedTaskId;
  const taskData = taskDataId ? allTaskData[taskDataId] : null;
  
  // Generate dynamic messages for the selected task
  const taskMessages = useMemo(() => {
    if (taskData?.messages) return taskData.messages;
    if (selectedTask) return generateTaskMessages(selectedTask);
    return [];
  }, [taskData, selectedTask]);

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
     // Override functionality - opens editing interface in production
     // Currently a placeholder for future implementation
  }, []);

  const handleForceComplete = useCallback((taskId: string) => {
    // Move task to done and update context
    setIsLearning(true);
    
    // Add new knowledge node for the completed task
    const task = tasks.find(t => t.id === taskId);
    const newNode: KnowledgeNode = {
      id: `node-${Date.now()}`,
      label: task?.title?.slice(0, 15) || 'Task Complete',
      type: 'fact',
      x: 80 + Math.random() * 140,
      y: 280 + Math.random() * 60,
      isNew: true,
      connections: ['node-1'],
    };
    
    setKnowledgeNodes((prev) => [...prev, newNode]);
    
    // Mark task as approved/done
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: 'approved' as const } : t
      )
    );
    
    setApprovedCount((prev) => prev + 1);
    
    // End learning animation after delay
    setTimeout(() => {
      setIsLearning(false);
    }, 2000);
  }, [tasks]);

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

  // Handle adding context from the hub
  const handleAddContext = useCallback((item: Omit<typeof contextItems[0], 'id' | 'timestamp' | 'status'>) => {
    const newItem = addContextItem(item);
    
    // Convert to knowledge node and add to graph
    setTimeout(() => {
      const newNode = convertToKnowledgeNode({ ...newItem, id: newItem.id, timestamp: new Date(), status: 'processed' });
      setKnowledgeNodes((prev) => [...prev, newNode]);
    }, 1500);
  }, [addContextItem, convertToKnowledgeNode]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <ControlTowerHeader
        taskCount={tasks.filter((t) => t.status !== 'approved').length}
        approvedCount={approvedCount}
        isLearning={isLearning}
        onLogout={logout}
        onRefresh={handleRefreshDemo}
        knowledgeNodes={knowledgeNodes}
        newNodeLabel={learningSignal?.rule}
        learningSignal={learningSignal}
        onDismissSignal={handleDismissToast}
        onOpenContextHub={openContextHub}
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
            <ResizablePanelGroup direction="horizontal" className="flex-1">
              {/* Context Thread */}
              <ResizablePanel defaultSize={40} minSize={25} maxSize={60}>
                <div className="h-full overflow-hidden">
                  <ContextThread
                    messages={taskMessages}
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
              </ResizablePanel>
              
              <ResizableHandle withHandle className="bg-border hover:bg-primary/20 transition-colors" />
              
              {/* Artifact Editor - Show loading state until artifacts are ready */}
              <ResizablePanel defaultSize={60} minSize={40} maxSize={75}>
                <div className="h-full border-l border-border">
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
              </ResizablePanel>
            </ResizablePanelGroup>
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

      {/* Context Graph is now integrated into the header */}

      {/* Context Hub Panel */}
      <ContextHubPanel
        isOpen={isContextHubOpen}
        onClose={closeContextHub}
        contextItems={contextItems}
        onAddContext={handleAddContext}
      />

      {/* Flying Artifact Animation */}
      <FlyingArtifact
        isVisible={showFlyingArtifact}
        onComplete={handleFlyingComplete}
      />

    </div>
  );
}
