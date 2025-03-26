export const throwError = async (req, res, next) => {
  try {
    throw new Error('This is an intentional 500 error. Please try again');
  } catch (error) {
    error.status = 500;
    next(error);
  }
};
