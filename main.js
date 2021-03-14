//open Database
var db = openDatabase("itemDB", "1.0", "Item DB", 64 * 1024);

const btncreateTBL = $("#btn-create-tbl");
const btndeleteTBL = $("#btn-delete-tbl");

// input tags
const userid = $("#userid");
const proname = $("#proname");
const price = $("#price");

// buttons
const btncreate = $("#btn-create");
const btnread = $("#btn-read");
const btnupdate = $("#btn-update");
const btndelete = $("#btn-delete");
const btnedit = $(".btnedit");
const btndel = $(".btnedit");

btncreateTBL.click(() => {
  db.transaction((transaction) => {
    var sql =
      `CREATE TABLE items` +
      `(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,` +
      `proname VARCHAR(100) NOT NULL,` +
      `price INTEGER(500) NOT NULL)`;

    transaction.executeSql(
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
});

btndeleteTBL.click(() => {
  db.transaction((transaction) => {
    var sql = `DROP TABLE items`;

    transaction.executeSql(
      sql,
      [],
      () => {
        alert("Table Deleted");
      },
      (transaction, err) => {
        alert("Error in Table Deletion\n" + err.message);
      }
    );
  });
});

btncreate.click(() => {
  if (proname.val() == "" || price.val() == "") {
    alert("Enter All Fields");
  } else {
    db.transaction((transaction) => {
      var sql = `INSERT INTO items (proname, price) VALUES(?,?)`;

      transaction.executeSql(
        sql,
        [proname.val(), price.val()],
        () => {
          alert("Row inserted");
        },
        (transaction, err) => {
          alert("Failed to insert\n" + err.message);
        }
      );
    });
  }
});

btnread.click(() => {
  loadData();
});

function loadData() {
  btncreate.show();
  db.transaction((transaction) => {
    $("#productList").children().remove();
    var sql = `SELECT * FROM items ORDER BY id DESC`;
    transaction.executeSql(
      sql,
      null,
      (transaction, result) => {
        if (result.rows.length >= 1) {
          for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            console.log(row);
            var proname = row.proname;
            var id = row.id;
            var price = row.price;
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
          userid.val(result.rows.length + 1);
        } else {
          $("#productList").append(
            "<tr><th colspan='5'>No Item Found</th></tr>"
          );
        }
      },
      (transaction, err) => {
        alert("Failed to fetch\n" + err.message);
      }
    );
  });
}

//edit
$(document).click(function (event) {
  console.log(event.target.parentElement.parentElement.cells[0].innerText);
  if (event.target.classList.contains("btnedit")) {
    btncreate.hide();
  }
  var uid = userid.val(
    event.target.parentElement.parentElement.cells[0].innerText
  );
  proname.val(event.target.parentElement.parentElement.cells[1].innerText);
  price.val(event.target.parentElement.parentElement.cells[2].innerText);

  btnupdate.click(() => {
    db.transaction((transaction) => {
      var sql = `UPDATE items SET proname=?,price=? WHERE id=?`;

      transaction.executeSql(
        sql,
        [proname.val(), price.val(), uid],
        () => {
          alert("Row Updated");
        },
        (transaction, err) => {
          alert("Failed to update\n" + err.message);
        }
      );
    });
    btncreate.show();
  });
});

//delete
$(document).click(function (event) {
  if (event.target.classList.contains("btndel")) {
    var uid = userid.val(
      event.target.parentElement.parentElement.cells[0].innerText
    );
    db.transaction((transaction) => {
      var sql = `DELETE FROM items WHERE id=?`;

      transaction.executeSql(
        sql,
        [uid],
        () => {
          alert("Row Deleted");
        },
        (transaction, err) => {
          alert("Failed to delete\n" + err.message);
        }
      );
    });
  }
});

/*

*/
