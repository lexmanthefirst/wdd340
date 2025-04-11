const invModel = require('../models/inventory-model');
const Util = {};
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* ************************
 * Constructs the nav HTML unordered list using template literals
 ************************** */

Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = `<ul class = "menuLinks">`;
  list += `<li><a href="/" title="Home page">Home</a></li>`;

  data.rows.forEach(row => {
    list += `
      <li>
        <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
          ${row.classification_name}
        </a>
      </li>`;
  });

  list += `</ul>`;
  return list;
};

//Build classification view html
Util.buildClassificationGrid = async function (data) {
  let grid = '';

  if (data.length > 0) {
    grid = `<ul id="inv-display">`;

    data.forEach(vehicle => {
      grid += `
        <li>
          <a href="../../inv/detail/${vehicle.inv_id}" title="View ${
        vehicle.inv_make
      } ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${
        vehicle.inv_make
      } ${vehicle.inv_model} on CSE Motors" />
          </a>
          <div class="namePrice">
            <hr />
            <h2>
              <a href="../../inv/detail/${vehicle.inv_id}" title="View ${
        vehicle.inv_make
      } ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat('en-US').format(
              vehicle.inv_price
            )}</span>
          </div>
        </li>`;
    });

    grid += `</ul>`;
  } else {
    grid = `<p class="notice">Sorry, no matching vehicles could be found.</p>`;
  }

  return grid;
};

Util.buildVehicleGrid = async function (data) {
  let grid = '';
  if (data.length > 0) {
    let vehicle = data[0];

    grid = `
      <div id="singleVehicleWrapper">
     <picture>
    <source media="(max-width: 400px)" srcset="${vehicle.inv_thumbnail}">
    <source media="(max-width: 600px)" srcset="${vehicle.inv_thumbnail}">
    <source media="(max-width: 1200px)" srcset="${vehicle.inv_image}">
    <source media="(min-width: 1201px)" srcset="${vehicle.inv_image}">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_year} ${
      vehicle.inv_make
    } ${vehicle.inv_model}" loading="lazy">
  </picture>
        <ul id="singleVehicleDetails">
          <li><h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2></li>
          <li><strong>Price: </strong>$${new Intl.NumberFormat('en-US').format(
            vehicle.inv_price
          )}</li>
          <li><strong>Description: </strong>${vehicle.inv_description}</li>
          <li><strong>Miles: </strong>${new Intl.NumberFormat('en-US').format(
            vehicle.inv_miles
          )}</li>
        </ul>
      </div>
    `;
  } else {
    grid = `<p class="notice">Sorry, no matching vehicle could be found.</p>`;
  }
  return grid;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach(row => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += ' selected ';
    }
    classificationList += '>' + row.classification_name + '</option>';
  });
  classificationList += '</select>';
  return classificationList;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash('Please log in');
          res.clearCookie('jwt');
          return res.redirect('/account/login');
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash('notice', 'Please log in');
    return res.redirect('/account/login');
  }
};

Util.updateCookie = (accountData, res) => {
  const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 3600,
  });
  if (process.env.NODE_ENV === 'development') {
    res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
  } else {
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600 * 1000,
    });
  }
};

//Check authorization
Util.checkAuthorization = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash('notice', 'Please log in');
          res.clearCookie('jwt');
          return res.redirect('/account/login');
        }
        if (
          accountData.account_type == 'Employee' ||
          accountData.account_type == 'Admin'
        ) {
          next();
        } else {
          req.flash('notice', 'You are not authorized to modify inventory');
          return res.redirect('/account/login');
        }
      }
    );
  } else {
    req.flash('notice', 'You are not authorized to modify inventory');
    res.redirect('/account/login');
  }
};
module.exports = Util;

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
