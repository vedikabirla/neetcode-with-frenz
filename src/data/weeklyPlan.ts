import type { WeeklyWeek } from '../types'

export const weeklyPlan: WeeklyWeek[] = [
  {
    label: 'Week 2',
    startDate: '2026-11-23',
    restDays: { '2026-11-26': 'Thanksgiving · Rest day' },
    dayNotes: {
      '2026-11-27': 'One-minute check-in. Check the topics you’ve already reviewed so we know what to carry into next week.',
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
        { id: 'data-storage', topic: 'Data storage' },
        { id: 'caching', topic: 'Caching' },
        { id: 'load-balancing', topic: 'Load balancing' },
      ].map(({ id, topic }) => ({
        id: `reviewed-${id}`,
        date: '2026-11-27',
        title: topic,
        category: 'System Design' as const,
        duration: 'Quick check-in',
        required: false,
        instructions: 'Check your name if you’ve already reviewed this topic. Leave it unchecked if you haven’t. We’ll use the check-in to choose what to revisit after Thanksgiving.',
      })),
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
        id: 'mock-interviews',
        date: '2026-11-25',
        title: 'Group Mock Interviews',
        category: 'Meeting',
        duration: 'About 60 minutes',
        required: true,
        instructions: 'Meet for a group call. Each person takes a turn as interviewee while the other two act as interviewers. Let follow-up questions arise naturally. Leave time for system design fundamentals questions if needed.',
      },
    ],
  },
]
