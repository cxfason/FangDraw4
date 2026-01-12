import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: '请提供图片数据' },
        { status: 400 }
      );
    }

    const apiKey = process.env.SILICONFLOW_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API密钥未配置' },
        { status: 500 }
      );
    }

    // 调用硅基流动API
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'Qwen/QVQ-72B-Preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: image, // base64格式的图片
                },
              },
              {
                type: 'text',
                text: '请简洁地猜测这幅画画的是什么东西,只需要回答物品或场景名称,不要有多余的解释。如果画面模糊或无法识别,请猜测最有可能的内容。',
              },
            ],
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API错误:', errorData);
      return NextResponse.json(
        { error: `API调用失败: ${response.status}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const guess = data.choices?.[0]?.message?.content || '无法识别';

    return NextResponse.json({ guess });
  } catch (error) {
    console.error('服务器错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
