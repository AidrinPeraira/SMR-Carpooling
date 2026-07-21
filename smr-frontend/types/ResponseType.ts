type ActionSuccess<T = unknown> = {
  success: true;
  message: string;
  description?: string;
  payload?: T;
};

type ActionFailure = {
  success: false;
  errorMessage: string;
  description?: string;
};

export type ActionResponse<T = unknown> = ActionFailure | ActionSuccess<T>;
