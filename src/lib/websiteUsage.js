const RANKS = [
  { minUses: 1, label: 'BALI Pemula' },
  { minUses: 5, label: 'BALI Aktif' },
  { minUses: 15, label: 'BALI Tumbuh' },
  { minUses: 30, label: 'BALI Berdaya' },
];

const getLocalDate = (date = new Date()) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const getSadayaRank = (websiteUsageCount = 0) => {
  const current = [...RANKS].reverse().find((rank) => websiteUsageCount >= rank.minUses) || { minUses: 0, label: 'BALI Pemula' };
  const next = RANKS.find((rank) => rank.minUses > websiteUsageCount) || null;
  return { ...current, next, usageCount: websiteUsageCount };
};

// Count each route at most once per local calendar day so refreshing cannot farm rank points.
export const recordWebsiteUsage = (path) => {
  const username = localStorage.getItem('moodify_currentUser') || localStorage.getItem('ranstal_currentUser');
  if (!username) return null;

  const userKey = `moodify_data_${username}`;
  try {
    const userData = JSON.parse(localStorage.getItem(userKey) || '{}');
    const date = getLocalDate();
    const route = String(path || '/home').split('?')[0];
    const usageByDate = userData.websiteUsageByDate && typeof userData.websiteUsageByDate === 'object'
      ? userData.websiteUsageByDate
      : {};
    const visitedToday = Array.isArray(usageByDate[date]) ? usageByDate[date] : [];
    if (visitedToday.includes(route)) return userData;

    usageByDate[date] = [...visitedToday, route];
    const retentionStart = new Date();
    retentionStart.setDate(retentionStart.getDate() - 60);
    const minimumDate = getLocalDate(retentionStart);
    userData.websiteUsageByDate = Object.fromEntries(
      Object.entries(usageByDate).filter(([usageDate]) => usageDate >= minimumDate)
    );
    userData.websiteUsageCount = (Number(userData.websiteUsageCount) || 0) + 1;
    userData.websiteUsageXp = (Number(userData.websiteUsageXp) || 0) + 5;
    localStorage.setItem(userKey, JSON.stringify(userData));
    return userData;
  } catch {
    return null;
  }
};
