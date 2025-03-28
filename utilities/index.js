const invModel = require('../models/inventory-model');
const Util = {};

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

module.exports = Util;

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
