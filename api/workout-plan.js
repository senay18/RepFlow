export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const apiKey = process.env.CLAUDE_API_KEY;
    const model = process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514";


    if (!apiKey) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Missing CLAUDE_API_KEY in .env" }));
        return;
    }

    try {
        const rawBody = await new Promise((resolve, reject) => {
            let body = "";
            req.on("data", (chunk) => { body += chunk; });
            req.on("end", () => resolve(body));
            req.on("error", reject);
        });

        const parsedBody = rawBody ? JSON.parse(rawBody) : {};
        const equipment = Array.isArray(parsedBody.equipment) ? parsedBody.equipment : [];

        if (equipment.length === 0) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Provide at least one equipment item." }));
            return;
        }

        // Ask Claude to return a strict JSON workout plan from the equipment list.
        const prompt = `
You are an expert strength coach. Build a practical 3-day workout plan using only the user's equipment.
Return only valid JSON with this exact shape:
{
  "title": "string",
  "summary": "string",
  "days": [
    {
      "name": "string",
      "focus": "string",
      "exercises": ["string", "string", "string"]
    }
  ]
}

Rules:
- Exactly 3 day objects.
- 3 to 5 exercises per day.
- Include sets/reps in each exercise string.
- Keep summary to one sentence.
- No markdown, no commentary, only JSON.

User equipment: ${equipment.join(", ")}
`.trim();

        const messageHeaders = {
            "content-type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
        };

        // Send the prompt to the selected Anthropic model.
        const requestPlan = async (modelId) => {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: messageHeaders,
                body: JSON.stringify({
                    model: modelId,
                    max_tokens: 800,
                    temperature: 0.4,
                    messages: [{ role: "user", content: prompt }],
                }),
            });

            const rawText = await response.text();
            const data = rawText ? JSON.parse(rawText) : {};
            return { response, data };
        };

        let modelUsed = model;
        let { response, data } = await requestPlan(modelUsed);

        // Retry with an available model if the configured one is missing.
        if (!response.ok && response.status === 404 && data?.error?.type === "not_found_error") {
            const modelListResponse = await fetch("https://api.anthropic.com/v1/models", {
                method: "GET",
                headers: {
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01",
                },
            });

            const modelListRawText = await modelListResponse.text();
            const modelListData = modelListRawText ? JSON.parse(modelListRawText) : {};
            const availableModelIds = Array.isArray(modelListData?.data)
                ? modelListData.data.map((item) => item?.id).filter(Boolean)
                : [];

            const preferredFallback =
                availableModelIds.find((id) => id.includes("sonnet")) ||
                availableModelIds[0];

            if (preferredFallback) {
                modelUsed = preferredFallback;
                const retry = await requestPlan(modelUsed);
                response = retry.response;
                data = retry.data;
            }
        }

        if (!response.ok) {
            res.statusCode = response.status;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
                error: data?.error?.message || `Claude request failed with status ${response.status}.`,
                status: response.status,
                type: data?.error?.type || null,
                modelUsed,
            }));
            return;
        }

        const text = data?.content?.[0]?.text || "";
        const extractedJson = text.match(/\{[\s\S]*\}/)?.[0];

        // Parse the JSON block returned by Claude before sending it to the client.
        const plan = JSON.parse(extractedJson || "{}");

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ plan, modelUsed }));
    } catch (error) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
            error: error instanceof Error ? error.message : "Unexpected server error.",
        }));
    }
}
    


