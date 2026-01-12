'use client';

import { useState } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';

// 预设题目库
const TOPICS = [
  '苹果', '香蕉', '汽车', '房子', '太阳', '月亮', '猫', '狗',
  '树', '花', '飞机', '船', '自行车', '电脑', '手机', '书',
  '杯子', '桌子', '椅子', '鱼', '鸟', '云', '星星', '山'
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState<string>('');
  const [aiGuess, setAiGuess] = useState<string>('');
  const [isGuessing, setIsGuessing] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [guessHistory, setGuessHistory] = useState<Array<{ topic: string; guess: string; correct: boolean }>>([]);

  const startNewRound = () => {
    // 随机选择一个题目
    const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    setCurrentTopic(randomTopic);
    setAiGuess('');
    setGameStarted(true);
  };

  const handleGuess = async () => {
    if (!currentImage) {
      alert('请先画点东西!');
      return;
    }

    setIsGuessing(true);
    setAiGuess('AI正在思考...');

    try {
      const response = await fetch('/api/guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: currentImage }),
      });

      const data = await response.json();

      if (response.ok) {
        setAiGuess(data.guess);
        setAttempts(attempts + 1);

        // 简单的判断是否猜对(包含关键词即可)
        const isCorrect = data.guess.includes(currentTopic);

        if (isCorrect) {
          setScore(score + 10);
          setGuessHistory([...guessHistory, { topic: currentTopic, guess: data.guess, correct: true }]);
          setTimeout(() => {
            alert(`恭喜!AI猜对了!得分+10`);
            startNewRound();
          }, 1000);
        } else {
          setGuessHistory([...guessHistory, { topic: currentTopic, guess: data.guess, correct: false }]);
        }
      } else {
        setAiGuess(`错误: ${data.error}`);
        console.error('API错误:', data);
      }
    } catch (error) {
      setAiGuess('网络错误,请重试');
      console.error('请求失败:', error);
    } finally {
      setIsGuessing(false);
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-2 text-gray-800">
          AI你画我猜
        </h1>
        <p className="text-center text-sm sm:text-base text-gray-600 mb-4 sm:mb-8">
          画出题目要求的物品,让AI来猜猜你画的是什么
        </p>

        {/* 游戏状态栏 */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex justify-between items-center flex-wrap gap-3 sm:gap-4">
            <div className="text-base sm:text-lg">
              <span className="font-semibold">得分:</span>
              <span className="ml-2 text-blue-600 text-xl sm:text-2xl font-bold">{score}</span>
            </div>
            <div className="text-base sm:text-lg">
              <span className="font-semibold">尝试:</span>
              <span className="ml-2 text-purple-600 text-xl sm:text-2xl font-bold">{attempts}</span>
            </div>
            {!gameStarted ? (
              <button
                onClick={startNewRound}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 active:bg-green-700 transition-colors font-semibold text-base sm:text-lg"
              >
                开始游戏
              </button>
            ) : (
              <button
                onClick={startNewRound}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 active:bg-yellow-700 transition-colors font-semibold text-base"
              >
                换一题
              </button>
            )}
          </div>

          {gameStarted && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-100 rounded-lg">
              <p className="text-center text-lg sm:text-xl">
                <span className="font-semibold">请画:</span>
                <span className="ml-2 sm:ml-3 text-blue-700 text-xl sm:text-2xl font-bold">{currentTopic}</span>
              </p>
            </div>
          )}
        </div>

        {/* 画布区域 */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6 mb-4 sm:mb-6">
          <DrawingCanvas onImageChange={setCurrentImage} />

          <div className="mt-4 sm:mt-6 flex justify-center">
            <button
              onClick={handleGuess}
              disabled={isGuessing || !gameStarted}
              className={`px-6 sm:px-8 py-3 sm:py-4 text-white rounded-lg font-semibold text-base sm:text-lg transition-colors ${
                isGuessing || !gameStarted
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
              }`}
            >
              {isGuessing ? '正在猜测...' : '让AI猜猜看'}
            </button>
          </div>
        </div>

        {/* AI猜测结果 */}
        {aiGuess && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">AI的猜测:</h2>
            <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
              <p className="text-lg sm:text-2xl text-gray-800 text-center font-medium break-words">{aiGuess}</p>
            </div>
          </div>
        )}

        {/* 历史记录 */}
        {guessHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">游戏记录:</h2>
            <div className="space-y-2">
              {guessHistory.slice().reverse().map((record, index) => (
                <div
                  key={index}
                  className={`p-3 sm:p-4 rounded-lg ${
                    record.correct ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 text-sm sm:text-base">
                    <span className="font-semibold">题目: {record.topic}</span>
                    <span className="hidden sm:inline mx-4">|</span>
                    <span className="break-words">AI猜测: {record.guess}</span>
                    <span className="hidden sm:inline mx-4">|</span>
                    <span className={`font-semibold ${record.correct ? 'text-green-600' : 'text-red-600'}`}>
                      {record.correct ? '✓ 正确' : '✗ 错误'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="mt-4 sm:mt-8 bg-yellow-50 rounded-lg p-4 sm:p-6 border border-yellow-200">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-yellow-800">游戏说明:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-gray-700">
            <li>点击"开始游戏"获取绘画题目</li>
            <li>在画布上画出题目要求的物品</li>
            <li>点击"让AI猜猜看"按钮,AI会分析你的画作</li>
            <li>如果AI猜对了,你将获得10分!</li>
            <li>可以随时点击"换一题"开始新一轮</li>
          </ul>
        </div>

        {/* 环境变量配置提示 */}
        <div className="mt-4 sm:mt-6 bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-blue-800">配置提示:</h3>
          <p className="text-sm sm:text-base text-gray-700">
            请在 <code className="bg-gray-200 px-2 py-1 rounded text-xs sm:text-sm">.env.local</code> 文件中配置你的硅基流动API密钥:
          </p>
          <code className="block mt-2 bg-gray-100 p-2 sm:p-3 rounded text-xs sm:text-sm break-all">
            SILICONFLOW_API_KEY=你的API密钥
          </code>
        </div>
      </div>
    </main>
  );
}
