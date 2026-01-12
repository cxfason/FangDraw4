# AI你画我猜游戏

一个基于Next.js和硅基流动API的在线你画我猜游戏,玩家在画布上作画,AI负责猜测画的内容。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **AI模型**: Qwen/QVQ-72B-Preview (通过硅基流动API)

## 功能特性

- 🎨 画布绘画功能
  - 多种颜色选择(7种预设颜色)
  - 可调节笔刷大小(1-20px)
  - 清空画布功能
  - **支持鼠标和触摸屏绘画**

- 🤖 AI图像识别
  - 使用Qwen/QVQ-72B-Preview视觉语言模型
  - 实时图像识别与猜测

- 🎮 游戏系统
  - 随机题目生成(24个预设题目)
  - 得分统计
  - 游戏记录追踪
  - 尝试次数统计

- 📱 移动端支持
  - 响应式设计,适配各种屏幕尺寸
  - 触摸屏手势绘画
  - 优化的移动端UI布局
  - 防止页面滚动干扰绘画

## 快速开始

### 1. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 2. 配置API密钥

在项目根目录创建 \`.env.local\` 文件,添加你的硅基流动API密钥:

\`\`\`env
SILICONFLOW_API_KEY=your_api_key_here
\`\`\`

> 如何获取API密钥:
> 1. 访问 [硅基流动官网](https://siliconflow.cn)
> 2. 注册并登录账号
> 3. 在控制台中创建API密钥

### 3. 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

\`\`\`
fangproject/
├── app/
│   ├── api/
│   │   └── guess/
│   │       └── route.ts        # AI识别API路由
│   ├── globals.css             # 全局样式
│   ├── layout.tsx              # 根布局
│   └── page.tsx                # 主页面
├── components/
│   └── DrawingCanvas.tsx       # 画布组件
├── .env.local                  # 环境变量(需自行创建)
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
\`\`\`

## 游戏玩法

1. 点击"开始游戏"按钮获取绘画题目
2. 使用画布工具画出题目要求的物品
   - **PC端**: 使用鼠标拖动绘画
   - **移动端**: 用手指在屏幕上滑动绘画
3. 点击"让AI猜猜看"按钮
4. AI会分析你的画作并给出猜测
5. 如果AI猜对了,你将获得10分!
6. 可以点击"换一题"开始新一轮

## API说明

### POST /api/guess

向AI发送图片并获取猜测结果。

**请求体:**
\`\`\`json
{
  "image": "data:image/png;base64,..."
}
\`\`\`

**响应:**
\`\`\`json
{
  "guess": "苹果"
}
\`\`\`

## 构建生产版本

\`\`\`bash
npm run build
npm start
\`\`\`

## 注意事项

- 确保已正确配置 \`.env.local\` 文件中的API密钥
- 硅基流动API可能有调用频率限制,请注意使用
- 画布尺寸为800x600像素,会自动适配屏幕宽度
- 游戏判断逻辑为简单的关键词包含匹配
- 移动端使用时,画布会阻止页面滚动以确保流畅绘画体验

## 可能的改进方向

- [x] 添加移动端触摸支持 ✅
- [ ] 增加更多题目类别和难度级别
- [ ] 实现多人在线对战模式
- [ ] 添加时间限制挑战
- [ ] 优化AI识别准确度算法
- [ ] 添加画作保存和分享功能
- [ ] 增加音效和动画效果
- [ ] 添加撤销/重做功能
- [ ] 支持橡皮擦工具

## 许可证

MIT
