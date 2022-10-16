export async function getProfile(req, res, next) {
  const { Profile } = req.app.get('models');
  const profile = await Profile.findOne({
    where: { id: req.get('profile_id') || 0 },
  });
  if (!profile)
    return res.status(401).json({ message: 'Profile non-existent.' });
  req.profile = profile;
  next();
}
