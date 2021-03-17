// create DB
const db = openDatabase("myDB", "1.0", "items", 64 * 1024);

// input tags
const product_name = $("#product-name");
const price = $("#price");
const pid = $("#pid");

// buttons
const createTBL = $("#btn-create-tbl");
const dropTBL = $("#btn-delete-tbl");

const btn_insert = $("#btn-insert");
const btn_read = $("#btn-read");
const btn_update = $("#btn-update");
const btn_cancel = $("#btn-cancel");

btn_cancel.hide();
btn_update.hide();

createTBL.click(() => {
  db.transaction((tx) => {
    var sql =
      `CREATE TABLE items` +
      `(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,` +
      `productname VARCHAR(100) NOT NULL,` +
      `price INTEGER(500) NOT NULL)`;

    tx.executeSql(
      sql,
      [],
      () => {
        alert("Table Created");
      },
      (transaction, err) => {
        alert("Table already exists");
      }
    );
  });
  createTBL.hide();
});

dropTBL.click(() => {
  db.transaction((tx) => {
    var sql = `DROP TABLE items`;

    tx.executeSql(
      sql,
      [],
      () => {
        alert("Table Deleted");
      },
      (tx, err) => {
        alert("Table not found or already deleted\n" + err);
      }
    );
  });
  location.reload();
  createTBL.show();
});

btn_insert.click(() => {
  if (product_name.val() == "" || price.val() == "") {
    alert("Incomplete Data");
    return;
  } else {
    db.transaction((tx) => {
      var sql = `INSERT INTO items (productname, price) VALUES (?,?)`;
      tx.executeSql(
        sql,
        [product_name.val(), price.val()],
        () => {
          alert("data inserted");
        },
        (tx, err) => {
          alert("data insertion error\n" + err);
        }
      );
    });
  }
  fetchData();
  setTimeout(() => {
    product_name.val("");
    price.val("");
  }, 1000);
});

btn_read.click(() => {
  createTBL.hide();
  fetchData();
  product_name.val("");
  price.val("");
});

function fetchData() {
  var throw_id;
  btn_insert.show();
  db.transaction((tx) => {
    // removes the demo data
    $("#productList").children().remove();
    var sql = `SELECT * FROM items`;
    tx.executeSql(
      sql,
      [],
      (tx, result) => {
        if (result.rows.length >= 1) {
          for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            console.log(row);
            var proname = row.productname;
            var id = row.id;
            var price = row.price;
            throw_id = id;

            $("#productList").append(
              `<tr>
                        <th scope="row">${id}</th>
                        <td>${proname}</td>
                        <td>${price}</td>
                        <td><i class="fas fa-edit btnedit" id="${id}"></i></td>
                        <td><i class="fas fa-trash btndel" id="${id}"></i></td>
                    </tr>`
            );
          }
          pid.val(result.rows.length + 1);  // BUG
        } else {
          $("#productList").append(
            `<tr><th colspan='5' class='text-center py-4'>No Item Found</th></tr>`
          );
        }
      },
      (tx, err) => {
        alert("Failed to fetch\n" + err.message);
      }
    );
  });
  return throw_id;
}

// edit
$(document).click((event) => {
  console.log(event.target);
  console.log(event.target.parentElement.parentElement.cells[0].innerText);

  if (event.target.classList.contains("btnedit")) {
    btn_insert.hide();
    btn_read.hide();
    btn_cancel.show();
    btn_update.show();
  }

  var p_id = event.target.parentElement.parentElement.cells[0].innerText;
  pid.val(p_id);
  product_name.val(event.target.parentElement.parentElement.cells[1].innerText);
  price.val(event.target.parentElement.parentElement.cells[2].innerText);

  // update
  btn_update.click(() => {
    db.transaction((tx) => {
      var sql = "UPDATE items SET productname=?,price=? WHERE id=?";

      tx.executeSql(
        sql,
        [product_name.val(), price.val(), p_id],
        () => {
          alert("Row Updated");
        },
        (tx, err) => {
          alert("Failed to update\n" + err.message);
        }
      );
    });
    btn_update.hide();
    btn_read.show();
    btn_cancel.hide();
    fetchData();
  });
});

// cancel
btn_cancel.click(() => {
  fetchData();
  btn_read.show();
  btn_cancel.hide();
  btn_update.hide();
  product_name.val("");
  price.val("");
});

// delete
$(document).click(function (event) {
  if (event.target.classList.contains("btndel")) {
    var p_id = event.target.parentElement.parentElement.cells[0].innerText;
    pid.val(p_id);
    db.transaction((tx) => {
      var sql = `DELETE FROM items WHERE id=?`;

      tx.executeSql(
        sql,
        [p_id],
        () => {
          alert("Row Deleted");
        },
        (tx, err1) => {
          alert("Failed to delete\n" + err1.message);
        }
      );
    });
    fetchData();
    product_name.val("");
    price.val("");
  }
});
