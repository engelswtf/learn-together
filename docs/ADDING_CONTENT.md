# Adding Content to LearnTogether

This guide explains how to add new topics, flashcards, and quiz questions to LearnTogether.

## Overview

Content is organized by topic. Each topic has:
- **Flashcards**: Question/answer pairs for study
- **Quiz Questions**: Multiple-choice questions with explanations

## Step 1: Create a Content File

Create a new TypeScript file in `src/data/content/`:

```typescript
// src/data/content/my-new-topic.ts
import { TopicContent } from '@/types';

export const myNewTopicContent: TopicContent = {
  topicId: 'my-new-topic', // Must match the topic ID in topics.ts
  flashcards: [],
  quizQuestions: [],
};
```

## Step 2: Add Flashcards

Flashcards have a front (question) and back (answer):

```typescript
flashcards: [
  {
    id: '1',
    front: 'What is the capital of Germany?',
    back: 'Berlin',
  },
  {
    id: '2',
    front: 'What does CPU stand for?',
    back: 'Central Processing Unit',
    hint: 'Think about what controls the computer', // Optional
  },
  // Add more flashcards...
],
```

### Flashcard Best Practices

- **Keep fronts concise**: Ask one clear question
- **Make backs informative**: Include enough detail to learn from
- **Use hints sparingly**: Only when the question might be ambiguous
- **Number IDs sequentially**: Makes it easier to track
- **Group related cards**: Use comments to organize sections

### Formatting Tips

Use `\n` for line breaks in multi-line answers:

```typescript
{
  id: '5',
  front: 'What are the 3 types of cloud service models?',
  back: '1. IaaS (Infrastructure as a Service)\n2. PaaS (Platform as a Service)\n3. SaaS (Software as a Service)',
},
```

## Step 3: Add Quiz Questions

Quiz questions have multiple-choice options:

```typescript
quizQuestions: [
  {
    id: '1',
    question: 'Which city is the capital of Germany?',
    options: ['Munich', 'Berlin', 'Hamburg', 'Frankfurt'],
    correctIndex: 1, // Berlin (0-indexed)
    explanation: 'Berlin has been the capital of Germany since 1990 after reunification.',
  },
  {
    id: '2',
    question: 'What does RAM stand for?',
    options: [
      'Random Access Memory',
      'Read Access Memory',
      'Rapid Access Module',
      'Runtime Application Memory',
    ],
    correctIndex: 0,
    explanation: 'RAM (Random Access Memory) is volatile memory used for temporary data storage while programs are running.',
  },
  // Add more questions...
],
```

### Quiz Question Best Practices

- **4 options per question**: Standard multiple-choice format
- **Make distractors plausible**: Wrong answers should be believable
- **Avoid "all of the above"**: These are often too easy
- **Include explanations**: Help learners understand why the answer is correct
- **Vary difficulty**: Mix easy, medium, and hard questions
- **Avoid negative questions**: "Which is NOT..." can be confusing

## Step 4: Register the Content

Add your content to the index file:

```typescript
// src/data/content/index.ts
import { TopicContent } from '@/types';
import { speichersystemeContent } from './speichersysteme';
import { cloudComputingContent } from './cloud-computing';
import { virtualisierungContent } from './virtualisierung';
import { myNewTopicContent } from './my-new-topic'; // Add this

export const topicContents: Record<string, TopicContent> = {
  'speichersysteme': speichersystemeContent,
  'cloud-computing': cloudComputingContent,
  'virtualisierung': virtualisierungContent,
  'my-new-topic': myNewTopicContent, // Add this
};

export function getTopicContent(topicId: string): TopicContent | null {
  return topicContents[topicId] || null;
}
```

## Step 5: Add the Topic Definition

Add your topic to the topics list:

```typescript
// src/data/topics.ts
import { Topic } from '@/types';

export const topics: Topic[] = [
  // ... existing topics ...
  {
    id: 'my-new-topic',           // Must match topicId in content file
    name: 'My New Topic',          // Display name
    description: 'Description of what this topic covers',
    icon: '📚',                    // Emoji icon
    color: 'bg-green-500',         // Tailwind background color
    cardCount: 25,                 // Number of flashcards
  },
];
```

### Available Colors

Use any Tailwind CSS background color:
- `bg-blue-500`
- `bg-purple-500`
- `bg-cyan-500`
- `bg-green-500`
- `bg-red-500`
- `bg-yellow-500`
- `bg-pink-500`
- `bg-indigo-500`

## Complete Example

Here's a complete example of a new topic:

### 1. Content File (`src/data/content/networking.ts`)

```typescript
import { TopicContent } from '@/types';

export const networkingContent: TopicContent = {
  topicId: 'networking',
  flashcards: [
    {
      id: '1',
      front: 'What is an IP address?',
      back: 'A unique numerical identifier assigned to each device on a network, used for routing data packets.',
    },
    {
      id: '2',
      front: 'What is the difference between TCP and UDP?',
      back: 'TCP: Connection-oriented, reliable, ordered delivery\nUDP: Connectionless, faster, no guaranteed delivery',
    },
    {
      id: '3',
      front: 'What port does HTTP use by default?',
      back: 'Port 80 (HTTPS uses port 443)',
    },
  ],
  quizQuestions: [
    {
      id: '1',
      question: 'Which protocol is connection-oriented?',
      options: ['UDP', 'TCP', 'ICMP', 'ARP'],
      correctIndex: 1,
      explanation: 'TCP (Transmission Control Protocol) establishes a connection before data transfer and ensures reliable, ordered delivery.',
    },
    {
      id: '2',
      question: 'What is the default port for HTTPS?',
      options: ['80', '443', '8080', '22'],
      correctIndex: 1,
      explanation: 'HTTPS uses port 443 by default. Port 80 is for HTTP, 8080 is an alternative HTTP port, and 22 is for SSH.',
    },
  ],
};
```

### 2. Update Index (`src/data/content/index.ts`)

```typescript
import { networkingContent } from './networking';

export const topicContents: Record<string, TopicContent> = {
  // ... existing ...
  'networking': networkingContent,
};
```

### 3. Update Topics (`src/data/topics.ts`)

```typescript
export const topics: Topic[] = [
  // ... existing ...
  {
    id: 'networking',
    name: 'Networking Basics',
    description: 'TCP/IP, ports, protocols, and network fundamentals',
    icon: '🌐',
    color: 'bg-orange-500',
    cardCount: 3, // Update this as you add more cards
  },
];
```

## Testing Your Content

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to your new topic on the home page

3. Test both flashcards and quiz modes

4. Verify:
   - All cards display correctly
   - Quiz answers are marked correctly
   - Explanations show properly
   - Progress is tracked

## Content Guidelines

### For German IT Certification (FISI/FIAE)

When creating content for German IT exams:

1. **Use German terminology** where appropriate
2. **Reference official exam topics** (IHK Prüfungskatalog)
3. **Include practical examples** relevant to German IT workplaces
4. **Cover both theory and application**

### Quality Checklist

- [ ] All IDs are unique within the topic
- [ ] Flashcard fronts are clear questions
- [ ] Flashcard backs are complete answers
- [ ] Quiz questions have exactly 4 options
- [ ] correctIndex is valid (0-3)
- [ ] Explanations add value beyond the answer
- [ ] Content is accurate and up-to-date
- [ ] No typos or grammatical errors
- [ ] cardCount in topics.ts matches actual count

## Troubleshooting

### Topic not showing up

- Check that the `id` in topics.ts matches the `topicId` in content file
- Verify the content is exported from index.ts
- Restart the development server

### Quiz showing wrong answers

- Verify `correctIndex` is 0-indexed (0 = first option)
- Check that options array has exactly 4 items

### TypeScript errors

- Ensure you're importing from `@/types`
- Check that all required fields are present
- Verify the export name matches the import
