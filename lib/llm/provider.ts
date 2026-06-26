import { openai } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

const model = process.env.OPENAI_MODEL || 'gpt-4-turbo';

export function getModel(): LanguageModel {
  return openai(model);
}

export const llmConfig = {
  model: getModel(),
  temperature: 0.7,
  maxTokens: 2048,
};
