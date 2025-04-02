const intentionalErrorController = {};
intentionalErrorController.causeError = async function (req, res, next) {
  try {
    console.log('Causing an error...');
    // Force a division by zero error
    const aNumber = 1 / 0;
    if (!isFinite(aNumber)) {
      throw new Error('Division by zero error');
    }
    return res.render('/', {
      title: 'Intentional Error',
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = intentionalErrorController;
