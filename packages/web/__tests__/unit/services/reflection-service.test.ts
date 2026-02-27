// Mock @anthropic-ai/sdk before any imports to prevent runtime check
jest.mock('@anthropic-ai/sdk', () => ({}));

import { generateAndSaveReflection, saveReflectionAnswers, fetchReflection } from '@/lib/services/reflection-service';
import { generateReflection } from '@/lib/ai/generate';
import { createReflection, updateReflectionAnswers, getReflectionByEntryId } from '@/lib/db/reflections';
import { getEntryById } from '@/lib/db/entries';
import type { DailyEntry, AIReflection } from '@/types/database';

jest.mock('@/lib/ai/generate');
jest.mock('@/lib/db/reflections');
jest.mock('@/lib/db/entries');

const mockedGenerateReflection = generateReflection as jest.MockedFunction<typeof generateReflection>;
const mockedCreateReflection = createReflection as jest.MockedFunction<typeof createReflection>;
const mockedUpdateReflectionAnswers = updateReflectionAnswers as jest.MockedFunction<typeof updateReflectionAnswers>;
const mockedGetReflectionByEntryId = getReflectionByEntryId as jest.MockedFunction<typeof getReflectionByEntryId>;
const mockedGetEntryById = getEntryById as jest.MockedFunction<typeof getEntryById>;

const mockEntry: DailyEntry = {
  id: 'entry-1',
  user_id: 'user-1',
  date: '2026-02-28',
  situation: 'Negociacao tensa',
  category: 'negociacao',
  emotion: 'frustracao',
  intensity: 8,
  reaction: 'Perdi a compostura',
  self_perception: 'reactive',
  created_at: '2026-02-28T10:00:00Z',
};

const mockReflection: AIReflection = {
  id: 'ref-1',
  entry_id: 'entry-1',
  questions: [
    'O que disparou essa reacao?',
    'Como voce gostaria de ter reagido?',
  ],
  answers: null,
  created_at: '2026-02-28T10:01:00Z',
};

describe('reflection-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAndSaveReflection', () => {
    it('should generate AI questions and save them as a reflection', async () => {
      mockedGetEntryById.mockResolvedValue(mockEntry);
      const aiQuestions = ['Pergunta IA 1?', 'Pergunta IA 2?', 'Pergunta IA 3?'];
      mockedGenerateReflection.mockResolvedValue(aiQuestions);
      mockedCreateReflection.mockResolvedValue({
        ...mockReflection,
        questions: aiQuestions,
      });

      const result = await generateAndSaveReflection('entry-1');

      expect(mockedGetEntryById).toHaveBeenCalledWith('entry-1');
      expect(mockedGenerateReflection).toHaveBeenCalledWith(mockEntry);
      expect(mockedCreateReflection).toHaveBeenCalledWith('entry-1', aiQuestions);
      expect(result.questions).toEqual(aiQuestions);
    });

    it('should throw when entry is not found', async () => {
      mockedGetEntryById.mockResolvedValue(null);

      await expect(generateAndSaveReflection('nonexistent')).rejects.toThrow('Entry not found');
      expect(mockedGenerateReflection).not.toHaveBeenCalled();
    });

    it('should fall back to default questions when AI generation fails', async () => {
      mockedGetEntryById.mockResolvedValue(mockEntry);
      mockedGenerateReflection.mockRejectedValue(new Error('AI API error'));
      const defaultQuestions = [
        'O que você faria diferente se pudesse voltar a esse momento?',
        'Essa reação reflete quem você quer ser como profissional?',
      ];
      mockedCreateReflection.mockResolvedValue({
        ...mockReflection,
        questions: defaultQuestions,
      });

      const result = await generateAndSaveReflection('entry-1');

      expect(mockedCreateReflection).toHaveBeenCalledWith('entry-1', defaultQuestions);
      expect(result.questions).toEqual(defaultQuestions);
    });
  });

  describe('saveReflectionAnswers', () => {
    it('should update reflection with provided answers', async () => {
      const answers = ['Resposta 1', null];
      const updatedReflection: AIReflection = {
        ...mockReflection,
        answers,
      };
      mockedUpdateReflectionAnswers.mockResolvedValue(updatedReflection);

      const result = await saveReflectionAnswers('ref-1', answers);

      expect(mockedUpdateReflectionAnswers).toHaveBeenCalledWith('ref-1', answers);
      expect(result.answers).toEqual(answers);
    });
  });

  describe('fetchReflection', () => {
    it('should return reflection when found', async () => {
      mockedGetReflectionByEntryId.mockResolvedValue(mockReflection);
      const result = await fetchReflection('entry-1');
      expect(result).toEqual(mockReflection);
    });

    it('should return null when no reflection exists', async () => {
      mockedGetReflectionByEntryId.mockResolvedValue(null);
      const result = await fetchReflection('entry-no-ref');
      expect(result).toBeNull();
    });
  });
});
