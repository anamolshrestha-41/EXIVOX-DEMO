const bannedKeywords = ['memes', 'gossip', 'funny', 'drama', 'nonsense'];
const educationKeywords = ['learn', 'tutorial', 'course', 'study', 'education', 'lesson'];

export const moderateContent = (req, res, next) => {
  const { title = '', description = '' } = req.body;

  const text = `${title} ${description}`.toLowerCase();

  const containsBanned = bannedKeywords.some(word => text.includes(word));
  const containsEducation = educationKeywords.some(word => text.includes(word));

  // Flag or reject based on match
  if (containsBanned && !containsEducation) {
    return res.status(403).json({ error: 'Content rejected: Non-educational content detected.' });
  }

  // Continue if educational or neutral
  next();
};
