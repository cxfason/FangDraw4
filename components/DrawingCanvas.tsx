'use client';

import { useRef, useState, useEffect } from 'react';

interface DrawingCanvasProps {
  onImageChange?: (imageData: string) => void;
}

export default function DrawingCanvas({ onImageChange }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 初始化画布为白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // 获取坐标的通用函数(支持鼠标和触摸)
  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      // 触摸事件
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // 鼠标事件
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // 鼠标事件处理
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCoordinates(e);
    if (!coords) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  // 触摸事件处理
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // 防止页面滚动
    const coords = getCoordinates(e);
    if (!coords) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // 防止页面滚动
    if (!isDrawing) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  };

  const stopDrawing = () => {
    if (isDrawing && onImageChange) {
      const canvas = canvasRef.current;
      if (canvas) {
        // 将画布内容转换为base64
        const imageData = canvas.toDataURL('image/png');
        onImageChange(imageData);
      }
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (onImageChange) {
      onImageChange('');
    }
  };

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* 工具栏 */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
        {/* 颜色选择器 */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs sm:text-sm font-medium min-w-fit">颜色:</label>
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 ${
                  currentColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                } transition-transform active:scale-95`}
                style={{ backgroundColor: color }}
                aria-label={`选择颜色 ${color}`}
              />
            ))}
          </div>
        </div>

        {/* 笔刷大小 */}
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <label className="text-xs sm:text-sm font-medium min-w-fit">笔刷:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="flex-1 sm:w-20 h-2"
          />
          <span className="text-xs sm:text-sm w-6 text-center font-medium">{lineWidth}</span>
        </div>

        {/* 清空按钮 */}
        <button
          onClick={clearCanvas}
          className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded text-sm sm:text-base hover:bg-red-600 active:bg-red-700 transition-colors w-full sm:w-auto font-medium"
        >
          清空画布
        </button>
      </div>

      {/* 画布容器 */}
      <div className="w-full overflow-hidden rounded border-2 border-gray-300 bg-white">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="w-full h-auto touch-none"
          style={{ touchAction: 'none', maxWidth: '100%', height: 'auto' }}
        />
      </div>

      {/* 移动端提示 */}
      <p className="text-xs sm:text-sm text-gray-500 text-center sm:hidden">
        用手指在画布上滑动来绘画
      </p>
    </div>
  );
}
