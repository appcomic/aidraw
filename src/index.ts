export default {
  async fetch(request, env) {
    // 从 URL 取 prompt，fallback 到默认值
    const url = new URL(request.url);
    const prompt = url.searchParams.get("prompt")?.trim() 
      || "一只可爱的赛博朋克猫咪，霓虹灯，夜晚城市";  // 默认值

    // 可选：再加几个常用参数
    const negative = url.searchParams.get("negative") || "模糊，畸形，低质量，手指多";
    const width   = Number(url.searchParams.get("w"))   || 1024;
    const height  = Number(url.searchParams.get("h"))   || 1024;

    const inputs = {
      prompt,
      negative_prompt: negative,
      width,
      height,
      // 你还可以继续加 guidance, num_steps, seed 等
    };

    try {
      const response = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        inputs
      );

      return new Response(response, {
        headers: {
          "content-type": "image/png",
          "content-disposition": 'inline; filename="ai-generated.png"'
        }
      });
    } catch (e) {
      return new Response(`生成失败: ${e.message}`, { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
