import type { WeeklyWeek } from '../types'

export const normalWeekPlan = [
  { day: 'Monday', activity: 'Study one system design topic.' },
  { day: 'Tuesday', activity: 'Pick a project that uses the topic. Practice telling the story aloud and answering follow-up questions about your design decisions.' },
  { day: 'Wednesday', activity: 'Meet on Zoom for 60 minutes of mock interviews, including follow-ups on the week’s topic.' },
]

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
        {
          label: 'Educative · Distributed Systems for Practitioners',
          url: 'https://www.educative.io/courses/distributed-systems-practitioners',
          description: 'Optional background on how distributed systems work and the trade-offs they introduce.',
        },
        {
          label: 'Educative · Grokking Modern System Design Interview',
          url: 'https://www.educative.io/courses/grokking-the-system-design-interview',
          description: 'Interview-focused lessons on system design building blocks and worked examples.',
        },
        {
          label: 'Start here · ByteByteGo System Design 101',
          url: 'https://github.com/ByteByteGoHq/system-design-101',
          description: 'Visual explanations of common system design concepts and architecture patterns.',
        },
        {
          label: 'Go deeper · System Design Primer',
          url: 'https://github.com/donnemartin/system-design-primer',
          description: 'Free reference for fundamentals, design trade-offs, and interview practice.',
        },
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
      ...[
        { id: 'data-storage', topic: 'Data storage', scope: 'How to store a short code → destination URL mapping, look it up on a redirect, and explain a SQL vs. key-value store trade-off.' },
        { id: 'caching', topic: 'Caching', scope: 'Cache-aside for redirects: look up the short code in the cache first, read the database on a miss, and use a TTL or invalidation when the mapping can change.' },
        { id: 'load-balancing', topic: 'Load balancing', scope: 'Where a load balancer sits in front of the redirect servers, how it spreads requests across instances, and how health checks route traffic away from unhealthy ones.' },
      ].map(({ id, topic, scope }) => ({
        id: `reviewed-${id}`,
        date: '2026-11-23',
        title: topic,
        category: 'System Design' as const,
        group: 'System design topics we’ve covered',
        duration: 'Part of the one-minute check-in',
        required: false,
        instructions: scope,
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
        instructions: '“Tell me about a technically challenging project you worked on. What made it challenging, and what was your contribution?”\n\nRefresh your memory about the actual project. Review its architecture, implementation, technical decisions, alternatives, challenges, and results. Practice telling the story aloud and be ready for follow-up questions during Wednesday’s mock interview.',
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
