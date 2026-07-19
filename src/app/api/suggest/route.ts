import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

// Let generation run up to 30s on hosts that honour it (e.g. Vercel).
export const maxDuration = 30;

const MEAL_SLOTS = ["breakfast", "lunch", "dinner"] as const;

// The exact shape we ask the model for. `generateObject` validates the
// model's JSON against this schema before it ever reaches us, so the
// frontend never has to defend against a malformed response.
const SuggestionSchema = z.object({
  source: z
    .enum(["library", "new"])
    .describe(
      "Use 'library' when recommending one of the user's existing meals. Use 'new' ONLY when nothing in their library suits the slot, or the library is empty.",
    ),
  mealName: z
    .string()
    .describe(
      "The meal to recommend. If source is 'library', this MUST exactly match the name of one of the provided library meals.",
    ),
  reason: z
    .string()
    .describe(
      "One or two warm, concrete sentences on why this fits right now. Reference the slot, their pantry, or variety across the week where relevant. No lists, no preamble.",
    ),
  slots: z
    .array(z.enum(MEAL_SLOTS))
    .describe(
      "Which slots this meal suits. For a library pick, echo the meal's existing slots.",
    ),
  prepTime: z
    .number()
    .int()
    .describe(
      "Approximate hands-on prep time in minutes (a positive whole number).",
    ),
  ingredients: z
    .array(z.string())
    .describe(
      "Ingredient names. For a library pick, echo the meal's existing ingredients. For a new meal, keep to realistic, common ingredients.",
    ),
});

interface RequestBody {
  slot?: string;
  library?: {
    name: string;
    slots: string[];
    prepTime: number;
    ingredients: string[];
  }[];
  pantry?: string[];
  plannedThisWeek?: string[];
  plannedTodayOther?: string[];
}

export async function POST(req: Request) {
  // 1. Fail fast, with a message the UI can show, if the key is missing.
  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      {
        error:
          "The suggestion service isn't configured yet (missing GROQ_API_KEY).",
      },
      { status: 500 },
    );
  }

  // 2. Parse the body defensively.
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const {
    slot,
    library = [],
    pantry = [],
    plannedThisWeek = [],
    plannedTodayOther = [],
  } = body;

  if (!slot || !MEAL_SLOTS.includes(slot as (typeof MEAL_SLOTS)[number])) {
    return Response.json(
      { error: "A valid meal slot is required." },
      { status: 400 },
    );
  }

  // 3. Build the prompt. System = the rules of the job; the user prompt =
  //    this specific decision's context, assembled from the user's own data.
  const system = [
    "You are the decision engine inside Mise, a personal meal-planning app whose entire purpose is to kill food decision fatigue.",
    "Given the user's meal library, what's currently in their pantry, and what they've already planned this week, recommend EXACTLY ONE meal for the requested slot.",
    "Prefer a meal from their library that (1) suits the slot, (2) leans on ingredients they already have so they shop less, and (3) adds variety versus what's already planned this week and the other slots today.",
    "Only invent a NEW meal (source: 'new') if their library has nothing suitable for the slot, or the library is empty. Keep invented meals simple, realistic, and lean on their pantry where you can.",
    "Never recommend a meal that is already planned for another slot today.",
    "Keep 'reason' to one or two warm, specific sentences.",
    "Respond with a single valid JSON object matching the required schema.",
  ].join(" ");

  const prompt = [
    `Requested slot: ${slot}`,
    ``,
    `The user's meal library (${library.length} meal${library.length === 1 ? "" : "s"}):`,
    library.length
      ? library
          .map(
            (m) =>
              `- "${m.name}" — suits: ${m.slots.join(", ") || "unspecified"}; ~${m.prepTime} min; ingredients: ${m.ingredients.join(", ") || "none listed"}`,
          )
          .join("\n")
      : "(empty — the user has no saved meals yet)",
    ``,
    `Ingredients currently in their pantry: ${
      pantry.length ? pantry.join(", ") : "(nothing marked available)"
    }`,
    ``,
    `Already planned elsewhere this week: ${
      plannedThisWeek.length ? plannedThisWeek.join(", ") : "(nothing yet)"
    }`,
    `Already planned for other slots today: ${
      plannedTodayOther.length ? plannedTodayOther.join(", ") : "(nothing yet)"
    }`,
    ``,
    `Recommend one meal for the ${slot} slot.`,
  ].join("\n");

  // 4. Generate + validate. Any failure (bad key, rate limit, network,
  //    schema-validation) lands in catch and returns a clean error.
  try {
    const { object } = await generateObject({
      model: groq("openai/gpt-oss-20b"),
      schema: SuggestionSchema,
      system,
      prompt,
      temperature: 0.7,
    });

    return Response.json(object);
  } catch (err) {
    console.error("[/api/suggest] generation failed:", err);
    return Response.json(
      {
        error:
          "Couldn't come up with a suggestion right now. Please try again.",
      },
      { status: 502 },
    );
  }
}
