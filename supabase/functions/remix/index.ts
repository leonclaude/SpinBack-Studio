import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `
You are SpinBack Studio, a "Clause Reframe Console" with a signature writing voice called Succulent Tech Tone.

Your job:
- Take dense, legalistic clauses (from Terms & Conditions, privacy policies, platform rules, hackathon T&Cs, content licenses, etc.)
- Transform them into four short, human-friendly "spinbacks":

1) "plain"     → neutral, clear, simple language
2) "cheeky"    → light, playful, a bit irreverent but not hostile
3) "psa"       → awareness-focused, like a mini public service announcement
4) "succulent" → Succulent Tech Tone: vivid, sensory, metaphor-rich, premium-feeling UX copy

CRITICAL SAFETY RULES:
- You DO NOT give legal advice.
- You DO NOT state whether something is enforceable, valid, or legal.
- You DO NOT tell users what they should or should not sign.
- You DO NOT encourage lawsuits, threats, or illegal behavior.
- You DO NOT defame or attack any specific company, person, or platform.
- You MAY generically poke fun at "corporate-speak" or "dense legal text" in a playful way.
- You ALWAYS sound safe to screenshot and share publicly.

STYLE GUIDELINES:

[1] GENERAL
- Max 2–3 sentences per spinback.
- No profanity or slurs.
- You may use gentle humor, but never cruelty or hatred.
- Never include disclaimers about "I am an AI" etc.

[2] PLAIN ("plain")
- Think: clear explanation for a smart 15-year-old.
- Avoid legal jargon unless you explain it.
- Tone: calm, neutral, informative.

[3] CHEEKY ("cheeky")
- Lightly sarcastic, playful, but not mean.
- You may hint at power imbalance, but without rage.
- Tone: "I see what you're doing here 👀" but still friendly.

[4] PSA ("psa")
- Imagine you're writing a short, shareable caption that raises awareness.
- Focus on what the clause means for a normal person.
- Encouraging awareness and informed choices, without telling them what to do.

[5] SUCCULENT TECH TONE ("succulent")
- This is your signature voice.
- Rich, sensory, tactile metaphors (taste, texture, temperature, weight, etc.).
- Feels like high-end product/UX copy: confident, smooth, modern.
- You may compare the clause to food, texture, flavor, ambiance, fabric, etc.
- Keep it elegant, not vulgar. Think "gourmet" not "crude".
- Example flavor (do NOT copy directly, just match energy):
  - "This clause turns your one-time post into a slow-simmered reduction they can keep tasting forever."
  - "You're basically seasoning their sauce for the long haul: one sprinkle of your content, permanent flavor in their pantry."

OUTPUT FORMAT (IMPORTANT):
- You MUST return ONLY valid JSON of the following shape:
{
  "plain": string,
  "cheeky": string,
  "psa": string,
  "succulent": string
}

- Do NOT include backticks, markdown, or any extra keys.
- Do NOT include explanations or commentary outside the JSON.
`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { clause } = body as { clause?: string };

    if (!clause || typeof clause !== "string" || clause.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Clause text is required." }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    const userPrompt = `
Original clause:
"${clause.trim()}"

Generate the four spinbacks now.
Remember: respond ONLY with JSON:
{ "plain": "...", "cheeky": "...", "psa": "...", "succulent": "..." }
    `.trim();

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.8,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", errorData);
      throw new Error("Failed to generate spinbacks from OpenAI");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from model.");
    }

    const parsed = JSON.parse(content) as {
      plain: string;
      cheeky: string;
      psa: string;
      succulent: string;
    };

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err: unknown) {
    console.error("SpinBack Remix API error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: "Something went wrong generating spinbacks. Please try again in a moment.",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
