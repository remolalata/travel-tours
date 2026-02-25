const avatarOptions = [
  '/img/avatars/animal-cat.svg',
  '/img/avatars/animal-fox.svg',
  '/img/avatars/animal-frog.svg',
  '/img/avatars/animal-owl.svg',
  '/img/avatars/animal-panda.svg',
] as const;

export function getRandomAvatarUrl() {
  const randomIndex = Math.floor(Math.random() * avatarOptions.length);
  return avatarOptions[randomIndex] ?? avatarOptions[0];
}
