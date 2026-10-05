// Single source of truth for appointment feedback values, labels and emoji.
export const FEEDBACK = [
  { value: "helpful", label: "Helpful", emoji: "🙂" },
  { value: "better", label: "Better", emoji: "😄" },
  { value: "no_improvement", label: "No improvement", emoji: "😕" },
] as const;

const BY_VALUE = Object.fromEntries(FEEDBACK.map((f) => [f.value, f]));

export const feedbackEmoji = (value: string) => BY_VALUE[value]?.emoji ?? "";

// "Better 😄" — falls back to the raw value for anything unknown.
export const feedbackLabel = (value: string) => {
  const f = BY_VALUE[value];
  return f ? `${f.label} - ${f.emoji}` : value;
};
