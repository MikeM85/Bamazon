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
  // console.log("connected as id ", connection.threadId);
  
  // connection.end();
// });

// Show ids, names, and prices of products
connection.query('SELECT * FROM `products`', function (err, results, fields) {
  if (err) {
    console.log(err);
  }
  for (var i=0; i<results.length; i++) {
    console.log(results[i].id + " " + results[i].product_name + " [" + results[i].price + "]");
  }
  // Prompt user to select a product and enter desired stock_quantity
  function displayInventory() {
    connection.query('SELECT * FROM `products`', function (err, results, fields) {
      if (err) {
        console.log(err);
      }
      for (var i=0; i<results.length; i++) {
        console.log(results[i].id + " " + results[i].product_name + " [" + results[i].price + "]");
      }
      buyPrompt();
    })
    // }

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
          // If order stock_quantity is too high, notify user of insufficient stock
          if (results[i].stock_quantity < parseInt(answer.stock_quantity)) {
            console.log("Insufficient stock!");
            buyPrompt();
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

            // Notify user of successful purchase
            console.log("You have purchased " + answer.stock_quantity + " " + results[i].product_name);
            console.log("Your order total is " + total);
          }
        }
      }
    });
  }
}
displayInventory();
});
});

