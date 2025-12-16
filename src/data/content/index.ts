import { TopicContent } from '@/types';
import { speichersystemeContent } from './speichersysteme';
import { cloudComputingContent } from './cloud-computing';
import { virtualisierungContent } from './virtualisierung';

export const topicContent: Record<string, TopicContent> = {
  'speichersysteme': speichersystemeContent,
  'cloud-computing': cloudComputingContent,
  'virtualisierung': virtualisierungContent,
};

export function getTopicContent(topicId: string): TopicContent | null {
  return topicContent[topicId] || null;
}
