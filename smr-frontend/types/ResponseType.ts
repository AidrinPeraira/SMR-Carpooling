type ActionSuccess = {
  success: true;
  message: string;
  description?: string;
};

type ActionFailure = {
  success: false;
  errorMessage: string;
  description?: string;
};

export type ActionResponse = ActionFailure | ActionSuccess;
