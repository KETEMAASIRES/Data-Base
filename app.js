let mysql = require("mysql2");
let express = require("express");
let app = express();

let connection = mysql.createConnection({
  host: "localhost",
  user: "myDBuser",
  password: "123456",
  database: "mydb",
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("connected");
  }
});
app.get("/INSTALL", (req, res) => {
  let products_table = `CREATE TABLE PRODUCT(
    product_id int auto_increment,
    product_url VARCHAR(255) not null,
    product_name VARCHAR(255) NOT NULL,
    PRIMARY KEY(product_id)
   )`;

  let product_desc_table = `CREATE TABLE description(
       Description_id int auto_increment PRIMARY KEY,
       product_id int not null ,
       Product_description VARCHAR(255) not null,
   Product_brief_description VARCHAR(255) NOT NULL,
   Product_img VARCHAR(100) not null,
   Product_link VARCHAR(100) not null,
    FOREIGN KEY(product_id) REFERENCES PRODUCT(product_id)
      )`;

  let Product_Price_Table = `CREATE TABLE PRICE(
      price_id int auto_increment,
       product_id int not null ,
       starting_price int not null,
       price_range VARCHAR(255) not null,
       PRIMARY KEY(price_id),
       FOREIGN KEY(product_id) REFERENCES PRODUCT(product_id)
     )`;
  let user_table = `CREATE TABLE user(
      user_id int auto_increment PRIMARY KEY,
       user_name VARCHAR(50) not null ,
       User_password VARCHAR(25) NOT NULL
     )`;

  let orders_Table = `CREATE TABLE ORDER_PRICE(
      order_id int auto_increment PRIMARY KEY,
       product_id int not null ,
       user_id int not null,
       FOREIGN KEY(user_id) REFERENCES user(user_id),
       FOREIGN KEY(product_id) REFERENCES PRODUCT(product_id)
     )`;

  connection.query(products_table, (err, results, feild) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("created table");
    }
  });
  connection.query(product_desc_table, (err, results, feild) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("created table");
    }
  });
  connection.query(Product_Price_Table, (err, results, feild) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("created table");
    }
  });
  connection.query(user_table, (err, results, feild) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("created table");
    }
  });
  connection.query(orders_Table, (err, results, feild) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("created table");
    }
  });
  res.send("table is created");
});

//3 post methode
app.use(express.urlencoded({ extended: true })); //midle were(two tpye of trsansfer methode josn and html.)converter=parser
app.post("/add-product", (req, res) => {
  //REQUEST TYPE POST=/ADD-PORDUCT FROM CLIENTS
  let {
    product_name,
    product_url,
    Product_brief_description,
    Product_description,
    Product_link,
    Product_img,
    starting_price,
    price_range,
  } = req.body; //OBJECT ALL DATA AVAILABLE FROM KEY
  //let prduct_name=req.body.product_name(form name given before html)
  let producttable = `INSERT INTO PRODUCT(product_url, product_name) VALUE (?, ?)`;
  let prod_discripition = `INSERT INTO description(Product_id, Product_description, Product_brief_description, Product_img, Product_link) VALUE (?, ?, ?, ? ,?)`;
  let Product_Price_Table = `INSERT INTO PRICE(Product_id, starting_price, price_range) VALUE (?, ? ,?)`;

  connection.query(
    producttable,
    [product_url, product_name],
    (err, results, feild) => {
      //FIELD META DATA //RESULTS CLEINTS INPUTES
      if (err) {
        console.log(err.message);
      } else {
        console.log(" product value is posted");

        // console.table(results);
        let FOREIGN = results.insertId;
        connection.query(
          prod_discripition,
          [
            FOREIGN,
            Product_description,
            Product_brief_description,
            Product_img,
            Product_link, // VALUES /??? ASSIGNED BEFORE //LINE 110
          ],
          (err, results, feild) => {
            if (err) {
              console.log("discripition:", err);
            }
          }
        );

        connection.query(
          Product_Price_Table,
          [FOREIGN, starting_price, price_range],
          (err, results, feild) => {
            if (err) {
              console.log("price table:", err);
            }
          }
        );
      }
    } // WHEN WE USE FK WE MUST FOLLOWED QUERY WITH QUERY UNTIL FK FINISGED
  );

  res.send("data is posted");
});

app.listen(3001, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("server is runing with port 3001");
  }
});
