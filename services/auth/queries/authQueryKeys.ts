export const authQueryKeys = {
  all: ['auth'] as const,
  viewer: () => [...authQueryKeys.all, 'viewer'] as const,
};
