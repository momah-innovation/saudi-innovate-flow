import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { 
  Palette, 
  Eraser, 
  Square, 
  Circle, 
  Type, 
  Move, 
  Download,
  Trash2,
  Users,
  Undo,
  Redo
} from 'lucide-react';

interface WhiteboardElement {
  id: string;
  type: 'draw' | 'rectangle' | 'circle' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string;
  color: string;
  userId: string;
  userName: string;
  timestamp: string;
}

interface CollaborativeWhiteboardProps {
  boardId: string;
  contextType?: 'project' | 'challenge' | 'meeting' | 'global';
  readonly?: boolean;
}

export const CollaborativeWhiteboard: React.FC<CollaborativeWhiteboardProps> = ({
  boardId,
  contextType = 'global',
  readonly = false
}) => {
  const { onlineUsers, currentUserPresence } = useCollaboration();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'draw' | 'rectangle' | 'circle' | 'text' | 'move' | 'eraser'>('draw');
  const [color, setColor] = useState('#3b82f6');
  const [elements, setElements] = useState<WhiteboardElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<WhiteboardElement | null>(null);
  const [history, setHistory] = useState<WhiteboardElement[][]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all elements
    elements.forEach(element => {
      context.strokeStyle = element.color;
      context.fillStyle = element.color;
      context.lineWidth = 2;

      switch (element.type) {
        case 'rectangle':
          context.strokeRect(element.x, element.y, element.width || 0, element.height || 0);
          break;
        case 'circle':
          context.beginPath();
          const radius = Math.sqrt((element.width || 0) ** 2 + (element.height || 0) ** 2) / 2;
          context.arc(element.x + (element.width || 0) / 2, element.y + (element.height || 0) / 2, radius, 0, 2 * Math.PI);
          context.stroke();
          break;
        case 'text':
          context.font = '16px Arial';
          context.fillText(element.content || '', element.x, element.y);
          break;
      }
    });
  }, [elements]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readonly) return;

    const canvas = canvasRef.current;
    if (!canvas || !currentUserPresence) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    const newElement: WhiteboardElement = {
      id: `element_${Date.now()}`,
      type: tool === 'move' || tool === 'eraser' ? 'draw' : tool,
      x,
      y,
      color,
      userId: currentUserPresence.user_id,
      userName: currentUserPresence.user_info.display_name || 'User',
      timestamp: new Date().toISOString()
    };

    setCurrentElement(newElement);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentElement || readonly) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const updatedElement = {
      ...currentElement,
      width: currentX - currentElement.x,
      height: currentY - currentElement.y
    };

    setCurrentElement(updatedElement);
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentElement) return;

    setIsDrawing(false);
    setElements(prev => [...prev, currentElement]);
    setCurrentElement(null);

    // Add to history for undo/redo
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push([...elements, currentElement]);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);

    // Add activity - simplified for now
    console.log('Whiteboard activity:', {
      user: currentUserPresence?.user_info.display_name,
      action: `added ${currentElement.type}`,
      boardId
    });
  };

  const clearBoard = () => {
    setElements([]);
    setCurrentElement(null);
    
    // Add to history
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push([]);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setElements(history[historyStep - 1]);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setElements(history[historyStep + 1]);
    }
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `whiteboard_${boardId}_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Toolbar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Collaborative Whiteboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {onlineUsers.length} viewing
              </Badge>
              <div className="flex -space-x-2">
                {onlineUsers.slice(0, 4).map((user) => (
                  <Avatar key={user.user_id} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={user.user_info.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {user.user_info.display_name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Tools */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              {[
                { id: 'draw', icon: Palette, label: 'Draw' },
                { id: 'rectangle', icon: Square, label: 'Rectangle' },
                { id: 'circle', icon: Circle, label: 'Circle' },
                { id: 'text', icon: Type, label: 'Text' },
                { id: 'move', icon: Move, label: 'Move' },
                { id: 'eraser', icon: Eraser, label: 'Eraser' }
              ].map(({ id, icon: Icon, label }) => (
                <Button
                  key={id}
                  variant={tool === id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTool(id as any)}
                  disabled={readonly}
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            {/* Colors */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              {colors.map((c) => (
                <button
                  key={c}
                  className={`w-8 h-8 rounded border-2 ${
                    color === c ? 'border-primary' : 'border-muted'
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  disabled={readonly}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={readonly || historyStep <= 0}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={readonly || historyStep >= history.length - 1}
              >
                <Redo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearBoard}
                disabled={readonly}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportCanvas}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canvas */}
      <Card>
        <CardContent className="p-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full border border-muted rounded-lg cursor-crosshair bg-background"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </CardContent>
      </Card>
    </div>
  );
};