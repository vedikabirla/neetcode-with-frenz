import type { WeeklyWeek } from '../types'

export const normalWeekPlan = [
  {
    day: 'Monday',
    activities: ['Solve one LeetCode problem of your choice.', 'Deep-dive into the week’s system design topic.'],
  },
  {
    day: 'Tuesday',
    activities: [
      'Solve one LeetCode problem of your choice.',
      'Familiarize yourself with a project you worked on that relates to the week’s system design topic. For example, if the topic is caching, choose a project where caching was involved. Practice telling the story aloud and answering technical follow-up questions.',
    ],
  },
  {
    day: 'Wednesday',
    activities: ['Meet on Zoom for 60 minutes of mock interviews. Tell your project stories to each other and give each other feedback.'],
  },
  {
    day: 'Thursday',
    activities: [
      'Solve one LeetCode problem of your choice.',
      'Spend about 30 minutes familiarizing yourself with the provided system architecture prompt for the week.',
    ],
  },
  {
    day: 'Friday',
    activities: [
      'Solve one LeetCode problem of your choice.',
      'Spend 60 minutes on a call solving the week’s system design problem together, live.',
    ],
  },
]

export const weeklyPlan: WeeklyWeek[] = [
  {
    label: 'Week 2',
    startDate: '2026-11-23',
    systemDesignTopic: 'Caching',
    restDays: {
      '2026-11-26': 'Thanksgiving · Rest day. The usual 30-minute review of a system architecture prompt, such as designing a URL shortener, is off for the holiday. LeetCode is optional.',
      '2026-11-27': 'Holiday rest day. The usual live call to solve the system design problem together is off for the holiday. LeetCode is optional.',
    },
    assignments: [
      {
        id: 'algorithm-practice',
        date: '2026-11-23',
        title: 'Solve One LeetCode Problem',
        category: 'Algorithm',
        duration: '30 minutes',
        required: true,
        instructions: 'Choose any LeetCode problem you want to practice and solve it.',
      },
      {
        id: 'study-caching',
        date: '2026-11-23',
        title: 'System Design Topic · Caching',
        category: 'System Design',
        duration: '20–25 minutes',
        required: true,
        instructions: [
          'Start with the caching section of the System Design Primer linked below. Focus on three things:',
          '• Why use a cache? Learn what a cache does and why it helps when the same data is read often.',
          '• How does cache-aside work? Follow the steps for a cache hit and a cache miss. Look for when the app reads from the database and writes to the cache.',
          '• How does cached data stay fresh? Learn the difference between letting an entry expire after a set time (TTL) and removing it when the underlying data changes (invalidation).',
        ].join('\n\n'),
        resources: [
          {
            label: 'Start here · ByteByteGo System Design 101',
            url: 'https://github.com/ByteByteGoHq/system-design-101',
            description: 'Visual explanations of common system design concepts and architecture patterns.',
          },
          {
            label: 'Go deeper · System Design Primer',
            url: 'https://github.com/donnemartin/system-design-primer',
            description: 'Free reference for fundamentals, caching strategies, and interview trade-offs.',
          },
          {
            label: 'Educative · Grokking Modern System Design Interview',
            url: 'https://www.educative.io/courses/grokking-the-system-design-interview',
            description: 'Interview-focused lessons on system design building blocks and worked examples.',
          },
          {
            label: 'Educative · Distributed Systems for Practitioners',
            url: 'https://www.educative.io/courses/distributed-systems-practitioners',
            description: 'Optional background on how distributed systems work and the trade-offs they introduce.',
          },
        ],
      },
      {
        id: 'algorithm-practice-tuesday',
        date: '2026-11-24',
        title: 'Solve One LeetCode Problem',
        category: 'Algorithm',
        duration: '20 minutes',
        required: true,
        instructions: 'Choose any LeetCode problem you want to practice and solve it.',
      },
      {
        id: 'project-story',
        date: '2026-11-24',
        title: 'Prepare a Project Story About Caching',
        category: 'Behavioral',
        duration: '30–45 minutes',
        required: true,
        instructions: 'Pick a real project where caching mattered and practice telling the story aloud. Explain the problem, your contribution, and what changed as a result.\n\nPrepare for caching follow-ups: What did you cache and why? How did you handle stale data? What trade-off did you make, and how did you know the cache helped?',
      },
      {
        id: 'mock-interviews',
        date: '2026-11-25',
        title: 'Group Mock Interviews',
        category: 'Meeting',
        duration: '60 minutes',
        required: true,
        instructions: 'Meet on Zoom. Take turns telling your project stories, asking follow-up questions, and giving each other feedback. For this week’s caching follow-ups, ask what was cached, why, and how the team handled stale data.',
      },
      {
        id: 'algorithm-practice-thursday',
        date: '2026-11-26',
        title: 'Solve One LeetCode Problem',
        category: 'Algorithm',
        duration: '20 minutes',
        required: false,
        instructions: 'If you feel like practicing, choose any LeetCode problem and solve it.',
      },
      {
        id: 'algorithm-practice-friday',
        date: '2026-11-27',
        title: 'Solve One LeetCode Problem',
        category: 'Algorithm',
        duration: '20 minutes',
        required: false,
        instructions: 'If you feel like practicing, choose any LeetCode problem and solve it.',
      },
    ],
  },
]
