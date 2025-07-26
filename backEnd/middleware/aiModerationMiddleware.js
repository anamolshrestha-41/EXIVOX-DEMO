export const adminModerationBypass = (req, res, next) => {
  req.moderationResult = { approved: true };
  next();
};