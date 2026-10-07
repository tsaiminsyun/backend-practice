export type ValidatedRequest<TBody = unknown, TParams = unknown> = {
  body?: TBody;
  params?: TParams;
};
