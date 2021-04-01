class ErrorController {
  handleNotFound = (req, res, next) => {
    res.notFound('The requested route does not exist');
  };

  handleServerErrors = (err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.log(`Error : ${err.message} | "${req.method} ${req.path}"`);

    // Body Parser error is handled here
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      res.badRequest('Invalid json format in body');
    }

    // All other errors are handled here
    res.internalServerError('Internal Server Error');
  };
}

export default ErrorController;
