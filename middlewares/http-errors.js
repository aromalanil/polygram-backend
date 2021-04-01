const sendJsonErrorMessage = (response, status, message) => {
  response.status(status).json({
    error: { status, message },
  });
};

const httpErrors = (req, res, next) => {
  res.badRequest = (message) => {
    sendJsonErrorMessage(res, 400, message);
  };

  res.unAuthorizedRequest = (message) => {
    sendJsonErrorMessage(res, 401, message);
  };

  res.notFound = (message) => {
    sendJsonErrorMessage(res, 404, message);
  };

  res.conflict = (message) => {
    sendJsonErrorMessage(res, 409, message);
  };

  res.internalServerError = (message) => {
    sendJsonErrorMessage(res, 500, message);
  };

  next();
};

export default httpErrors;
