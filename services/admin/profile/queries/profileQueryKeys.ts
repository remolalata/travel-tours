export const adminProfileQueryKeys = {
  all: ['admin', 'profile'] as const,
  detail: () => [...adminProfileQueryKeys.all, 'detail'] as const,
};
