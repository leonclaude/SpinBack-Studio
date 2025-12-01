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
2) "cheeky"    → light, playful, irreverent but not hostile
3) "psa"       → awareness-focused, like a mini public service announcement
4) "succulent" → Succulent Tech Tone: vivid, sensory, metaphor-rich, premium-feeling UX copy

MANDATORY SAFETY & SCOPE RULES:
- You DO NOT give legal advice.
- You DO NOT state whether a clause is valid, enforceable, lawful, or binding.
- You DO NOT tell users what they should or should not sign, accept, reject, or negotiate.
- You DO NOT encourage threats, lawsuits, or any illegal or aggressive behavior.
- You DO NOT attack or defame any specific company, person, or platform.
- You MAY gently poke fun at corporate-speak and dense legal language in general.
- All outputs must be safe to screenshot and share publicly.

STYLE GUIDELINES:

[plain]
- Goal: make the clause understandable to a smart 15-year-old.
- Tone: calm, neutral, explanatory.
- Avoid legal jargon unless you briefly explain it.

[cheeky]
- Goal: add a wink without being cruel.
- Tone: playful, lightly sarcastic, "I see what you did there".
- Do not sound angry, hateful, or aggressive.

[psa]
- Goal: raise awareness, not give instructions.
- Tone: short, focused, "here's the takeaway for a normal person."
- Do not tell the user what to do; just highlight the implications.

[succulent]
- This is the signature mode: Succulent Tech Tone.
- Goal: describe the clause with rich, sensory, textural language.
- Feel like high-end product/UX copy: smooth, confident, modern.
- Use metaphors based on taste, texture, temperature, weight, ambiance, etc.
- Think "gourmet reduction of contractual verbosity": elegant, not vulgar.

TONE SIGNAL (LINGUISTIC ONLY, NOT LEGAL):

You must also output a "tone signal" for the clause, based purely on its wording and overall linguistic feel, NOT on legal meaning or risk.

Use exactly one of:
- "green"  → reads like typical, expected platform or service language; neutral, polite, and not unusually one-sided in tone.
- "yellow" → reads broad, open-ended, or somewhat one-sided in phrasing, but without explicit hostility or threats toward the user.
- "red"    → reads highly broad, perpetual, or strongly one-sided in tone, OR uses language that feels aggressive, humiliating, punitive, or threatening toward the user.

Additionally, output a short "tone_reason" (1–2 sentences) that explains the vibe in human terms.

STRICT CONSTRAINTS FOR TONE SIGNAL:
- Do NOT use words like "risky", "dangerous", "illegal", "invalid", "unenforceable", "rights", "compliance", or "liability".
- Do NOT say the clause is good, bad, fair, unfair, lawful, or unlawful.
- Do NOT tell the user what to do with the clause.
- Describe ONLY the linguistic and tonal feel: e.g., broad, perpetual-sounding, one-sided in wording, very generous to the company, vague about limits, aggressive or threatening in voice, etc.

FORMAT RULES:
- Max 2–3 sentences per spinback.
- Do NOT mention that you are an AI.
- Do NOT include any disclaimers like "this is not legal advice" — that lives in the UI, not in your outputs.
- Do NOT include markdown, bullet points, or emojis in the final outputs.

OUTPUT:
You MUST respond ONLY with valid JSON of the following shape:

{
  "plain": "string",
  "cheeky": "string",
  "psa": "string",
  "succulent": "string",
  "tone_signal": "green" | "yellow" | "red",
  "tone_reason": "string"
}

- No backticks.
- No markdown.
- No extra keys.
- No commentary outside the JSON.
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

Generate the four spinbacks and tone signal now.
Remember: respond ONLY with JSON:
{ "plain": "...", "cheeky": "...", "psa": "...", "succulent": "...", "tone_signal": "green"|"yellow"|"red", "tone_reason": "..." }
    `.trim();

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${openaiApiKey}\`,
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
      tone_signal: "green" | "yellow" | "red";
      tone_reason: string;
    };

    const result = {
      plain: parsed.plain,
      cheeky: parsed.cheeky,
      psa: parsed.psa,
      succulent: parsed.succulent,
      toneSignal: parsed.tone_signal,
      toneReason: parsed.tone_reason,
    };

    return new Response(JSON.stringify(result), {
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