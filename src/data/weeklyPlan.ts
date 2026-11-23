import type { WeeklyWeek } from '../types'

export const weeklyPlan: WeeklyWeek[] = [
  {
    label: 'Week 2',
    startDate: '2026-11-23',
    restDays: {
      '2026-11-26': 'Thanksgiving · Rest day',
      '2026-11-27': 'Rest day',
    },
    dayNotes: {
      '2026-11-23': 'We’re skipping the usual system design study and challenge this week. Monday’s check-in is just to see what we’ve covered and plan what to pick up next week.',
    },
    dayResources: {
      '2026-11-23': [
        { label: 'Educative · Distributed Systems for Practitioners (background reading)', url: 'https://www.educative.io/courses/distributed-systems-practitioners' },
        { label: 'Educative · Grokking Modern System Design Interview', url: 'https://www.educative.io/courses/grokking-the-system-design-interview' },
      ],
    },
    assignments: [
      {
        id: 'algorithm-practice',
        date: '2026-11-23',
        title: 'Algorithm Practice',
        category: 'Algorithm',
        duration: '30 minutes',
        required: true,
        instructions: 'Complete one unsolved NeetCode problem. Suggested problem: Group Anagrams (Medium).',
        resources: [{ label: 'Group Anagrams on LeetCode', url: 'https://leetcode.com/problems/group-anagrams/' }],
      },
      {
        id: 'weekly-problem-target',
        date: '2026-11-23',
        title: 'What’s a realistic LeetCode target this week?',
        category: 'Meeting',
        duration: '1 minute',
        required: false,
        participantNames: ['Ali', 'Vedika'],
        instructions: 'Ali and Vedika, reply in the group chat with how many problems you think each person can realistically solve this week. The draft has three, one per day Monday through Wednesday. If three feels like too much, suggest a lower number. Check your name after you reply.',
      },
      ...[
        { id: 'data-storage', topic: 'Data storage', scope: 'How to store a short code → destination URL mapping, look it up on a redirect, and explain a SQL vs. key-value store trade-off.' },
        { id: 'caching', topic: 'Caching', scope: 'Cache-aside for redirects: look up the short code in the cache first, read the database on a miss, and use a TTL or invalidation when the mapping can change.' },
        { id: 'load-balancing', topic: 'Load balancing', scope: 'Where a load balancer sits in front of the redirect servers, how it spreads requests across instances, and how health checks route traffic away from unhealthy ones.' },
      ].map(({ id, topic, scope }) => ({
        id: `reviewed-${id}`,
        date: '2026-11-23',
        title: topic,
        category: 'System Design' as const,
        duration: 'Part of the one-minute check-in',
        required: false,
        instructions: `${scope}\n\nCheck your name if you’ve already reviewed this. Post the topics you still want to cover in the group chat so we can plan next week.`,
      })),
      {
        id: 'algorithm-practice-tuesday',
        date: '2026-11-24',
        title: 'Algorithm Practice',
        category: 'Algorithm',
        duration: '20 minutes',
        required: true,
        instructions: 'Complete one unsolved NeetCode problem. Suggested problem: Valid Anagram (Easy). If you already solved it, pick another unsolved problem.',
        resources: [{ label: 'Valid Anagram on LeetCode', url: 'https://leetcode.com/problems/valid-anagram/' }],
      },
      {
        id: 'project-story',
        date: '2026-11-24',
        title: 'Prepare a Project Story',
        category: 'Behavioral',
        duration: '30–45 minutes',
        required: true,
        instructions: '“Tell me about a technically challenging project you worked on. What made it challenging, and what was your contribution?”\n\nRefresh your memory about the actual project. Review its architecture, implementation, technical decisions, alternatives, challenges, and results. Be ready for follow-up questions during Wednesday’s mock interview.',
      },
      {
        id: 'algorithm-practice-wednesday',
        date: '2026-11-25',
        title: 'Algorithm Practice',
        category: 'Algorithm',
        duration: '20 minutes',
        required: true,
        instructions: 'Complete one unsolved NeetCode problem. Suggested problem: Contains Duplicate (Easy). If you already solved it, pick another unsolved problem.',
        resources: [{ label: 'Contains Duplicate on LeetCode', url: 'https://leetcode.com/problems/contains-duplicate/' }],
      },
      {
        id: 'mock-interviews',
        date: '2026-11-25',
        title: 'Group Mock Interviews',
        category: 'Meeting',
        duration: 'About 60 minutes',
        required: true,
        instructions: 'Meet for a group call. Each person takes a turn as interviewee while the other two act as interviewers. Let follow-up questions arise naturally.',
      },
    ],
  },
]
