var mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: 'root',
  password: '3687four',
  database: 'bamazon_db'
});

connection.connect(function(err) {
  if (err) throw err;
});

// Display products
connection.query('SELECT * FROM `products`', function (err, results, fields) {
  if (err) {
    console.log(err);
  }
  for (var i=0; i<results.length; i++) {
    console.log(results[i].id + " " + results[i].product_name + " [" + results[i].price + "]");
  }
  // how to request an item
  function buyPrompt() {
    inquirer.prompt( [{
      name: "id",
      type: "input",
      message: "Enter the id of the product you'd like to buy."
    }, {
      name: "stock_quantity",
      type: "input",
      message: "How many would you like to purchase?"
    }]).then(function(answer) {
      for (var i=0; i<results.length; i++) {
        if (results[i].id === parseInt(answer.id)) {
          // If order is higher than in stock, notify user
          if (results[i].stock_quantity < parseInt(answer.stock_quantity)) {
            console.log("Out of stock!");
            // buyPrompt();
          } else {
            // Calculate order total and remaining stock
            var total = parseFloat(answer.stock_quantity*results[i].price).toFixed(2);
            var newStock = results[i].stock_quantity - answer.stock_quantity;

            // Construct query to update stock
            var updateStock = 'UPDATE `products` SET `stock_quantity` = ' + newStock + ' WHERE `id` = ' + answer.id
            connection.query(updateStock, function(err, result) {
              if (err) {
                console.log(err);
              } else {
                console.log(result.affectedRows + " product updated");
              }
            });

            //successful purchase
            console.log("You have purchased " + answer.stock_quantity + " " + results[i].product_name);
            console.log("Your order total is " + total);
            // buyPrompt();
          }
        }
      }
    });
  }
  // buyPrompt();
  displayInventory();
// });

// displayInventory will retrieve the current inventory from the database and output it to the console
function displayInventory() {
	// console.log('___ENTER displayInventory___');

	// Construct the db query string
	queryStr = 'SELECT * FROM products';

	// Make the db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Existing Inventory: ');
		console.log('...................\n');

		
		for (var i = 0; i < data.length; i++) {
			
      
      console.log(results[i].id + " " + results[i].product_name + " [" + results[i].price + "]");
		}

	  	console.log("---------------------------------------------------------------------\n");

      //Prompt the user for item/quantity they would like to purchase
      buyPrompt();
    })
}

// runBamazon 
function runBamazon() {

	// Display the available inventory
	displayInventory();
}

// Run the application logic
runBamazon();
});