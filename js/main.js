if (window.openDatabase){
	var mydb = openDatabase("booking", "0.1","UAS",3*1024*1024);
	mydb.transaction(function (t){
		t.executeSql("CREATE TABLE IF NOT EXISTS kamar (id_kamar INTEGER PRIMARY KEY ASC, nama_kamar VARCHAR(25), harga_per_malam DECIMAL(10))");
	});
	mydb.transaction(function (t){
		t.executeSql("CREATE TABLE IF NOT EXISTS sewa (id_sewa INTEGER PRIMARY KEY ASC, id_kamar INTEGER, tanggal_checkin DATE, lama_sewa INTEGER)");
	});
} else{
	alert("not support");
}
function addKamar() {
	// body...
	if(mydb){
		var fnama = document.getElementById("nama").value;
		var fharga = document.getElementById("harga").value;
		
		if(fnama !== "" && fharga !== ""){
			mydb.transaction(function (t){
				t.executeSql("INSERT INTO kamar (nama_kamar,harga_per_malam) VALUES (?,?)", [fnama,fharga], function(transaction, result){
					console.log(result);
				});
			});
		}
	}
}

function getKamar(){
	if(mydb){
		console.log("test get");
		mydb.transaction(function (t){
			t.executeSql("SELECT * FROM kamar", [], function(transaction, results){
				var listholder = document.getElementById("dataKamar");
				listholder.innerHTML = "";
				console.log(results);
				for (var i = 0; i < results.rows.length; i++) {
					var row = results.rows.item(i);
					console.log(row);
					listholder.innerHTML += `
					<li class="list-item list-item--material">
				    <div class="list-item__center list-item--material__center">
				      	<div class="list-item__title list-item--material__title">No : ${row.id_kamar}</div>
					      	<div class="list-item__subtitle list-item--material__subtitle">
					      	<p>Nama Kamar : ${row.nama_kamar}</p>
					      	<p>Harga Per Malam : ${row.harga_per_malam}</p>
					      	<p>
					      		<button class="button button--material" onclick="edit_formKamar(${row.id_kamar})">Edit</button>
					      		<button class="button button--material" onclick="deleteKamar(${row.id_kamar})">Hapus</button>
					      	</p>
					      	</div>
				    	</div>
				  	</li>
					`;
				}
			});
		});
	} else {
		alert("db gak enek");
	}
}

function deleteKamar(id) {
	if(mydb){
		mydb.transaction(function (t){
			t.executeSql("DELETE FROM kamar WHERE id_kamar = ?", [id], function(transaction, results){
				console.log(results);
				alert("Data berhasil dihapus");
				fn.load("crud1.html");
			});
		});
	} else {
		alert("db gak enek");
	}
}
function edit_formKamar(id){
	if(mydb){
		mydb.transaction(function (t){
			var formholder = document.getElementById("form-kamar");
			formholder.innerHTML = "";
			t.executeSql("SELECT * FROM kamar WHERE id_kamar = ?", [id], function(transaction, results){
				
				console.log(results);
				formholder.innerHTML += `
				<div><input class="text-input text-input--material" placeholder="Nama Kamar" type="text" value="${results.rows.item(0).nama_kamar}" id="nama" required></div>
			  <br />
			  <div><input class="text-input text-input--material" placeholder="Harga Per Kamar" type="text" value="${results.rows.item(0).harga_per_malam}" id="harga" required></div>
			  <br/>
			  <button class="button button--material" onclick="updateKamar(${results.rows.item(0).id_kamar})">Edit</button>
				`;
				
			});
		});
	} else {
		alert("db gak enek");
	}
}
function updateKamar(id){
	
	if(mydb){
		var fnama = document.getElementById("nama").value;
		var fharga = document.getElementById("harga").value;
		
		if(fnama !== "" && fharga !== ""){
			mydb.transaction(function (t){
				t.executeSql("UPDATE kamar SET nama_kamar = ?, harga_per_malam = ? WHERE id_kamar = ?", [fnama,fharga,id], function(transaction, result){
					console.log(result);
				});
			});
		}
	
	} else {
		alert("db gak enek");
	}
}

function selectKamar() {
	// body...
	if(mydb){
		mydb.transaction(function (t){
			t.executeSql("SELECT * FROM kamar", [], function(transaction, results){
				var selectholder = document.getElementById("id_kamar");
				selectholder.innerHTML = "";
				for (var i = 0; i < results.rows.length; i++) {
					var row = results.rows.item(i);
					console.log(row);
					selectholder.innerHTML += `
					<option value="${row.id_kamar}">${row.nama_kamar}</option>
					`;
				}
			});
		});
	} else {
		alert("db gak enek");
	}
}
function addSewa() {
	// body...
	if(mydb){
		var ftanggal = document.getElementById("tanggal").value;
		var fkamar = document.getElementById("id_kamar").value;
		var flama = document.getElementById("lama").value;
		console.log("sdas");
		if(flama !== "" ){
			mydb.transaction(function (t){
				t.executeSql("INSERT INTO sewa (tanggal_checkin,id_kamar,lama_sewa) VALUES (?,?,?)", [ftanggal,fkamar,flama], function(transaction, result){
					console.log(result);
				});
			});
		}else{
			alert("data harus diisi");
		}
	}
}


function getSewa(){
	if(mydb){
		mydb.transaction(function (t){
			t.executeSql("SELECT sewa.id_sewa,kamar.nama_kamar,sewa.tanggal_checkin,sewa.lama_sewa FROM sewa JOIN kamar WHERE kamar.id_kamar=sewa.id_kamar", [], function(transaction, results){
				var listholder = document.getElementById("dataSewa");
				listholder.innerHTML = "";
				for (var i = 0; i < results.rows.length; i++) {
					var row = results.rows.item(i);
					console.log(row);
					listholder.innerHTML += `
					<li class="list-item list-item--material">
				    <div class="list-item__center list-item--material__center">
				      	<div class="list-item__title list-item--material__title">No : ${row.id_sewa}</div>
					      	<div class="list-item__subtitle list-item--material__subtitle">
					      	<p>Nama Kamar : ${row.nama_kamar}</p>
					      	<p>Tanggal Checkin : ${row.tanggal_checkin}</p>
					      	<p>Lama : ${row.lama_sewa} hari</p>
					      	<p>
					      		<button class="button button--material" onclick="edit_formSewa(${row.id_sewa})">Edit</button>
					      		<button class="button button--material" onclick="deleteSewa(${row.id_sewa})">Hapus</button>
					      	</p>
					      	</div>
				    	</div>
				  	</li>
					`;
				}
			});
		});
	} else {
		alert("db gak enek");
	}
}

function deleteSewa(id) {
	if(mydb){
		mydb.transaction(function (t){
			t.executeSql("DELETE FROM sewa WHERE id_sewa = ?", [id], function(transaction, results){
				console.log(results);
				alert("Data berhasil dihapus");
				fn.load("crud1.html");
			});
		});
	} else {
		alert("db gak enek");
	}
}