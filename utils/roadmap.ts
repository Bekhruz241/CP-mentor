
export const getTopicForDate = (startDateStr: string, currentDateStr: string): string => {
  const start = new Date(startDateStr);
  const current = new Date(currentDateStr);
  const diffDays = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Weekly cycles: 5 days training, 1 day review, 1 day rest
  const dayInWeek = diffDays % 7;
  if (dayInWeek === 5) return "Haftalik takrorlash va qiyin masalalar";
  if (dayInWeek === 6) return "Haftalik dam olish";

  const monthsDiff = Math.floor(diffDays / 30);

  const topics = [
    "Implementation va Basic Math (800-900)",
    "Greedy va Sorting (900-1000)",
    "Brute force va Binary Search (1000-1100)",
    "Dynamic Programming (Basic) va Graphs (DFS/BFS) (1100-1200)",
    "Data Structures (Segment Tree/Fenwick) (1200-1300)",
    "Olimpiada masalalari va Advanced DP (1300-1400)"
  ];

  return topics[Math.min(monthsDiff, topics.length - 1)];
};
