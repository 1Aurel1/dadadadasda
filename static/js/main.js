populateTable(false, null);

var currentPage = 0;

function populateTable(justOne, page, searchText) {

    var table = document.getElementById("tableContet");

    var hr = new XMLHttpRequest();

    console.log(searchText);

    if (page == null && (searchText == "" || searchText == null)) {
        var url = "http://localhost:8080/guests/list?checkIn=false";
    } else if (searchText != "" || searchText != null) {
        if (searchText == "" || searchText == null) {
            searchText = " ";
        }
        var url = "http://localhost:8080/guests/list?checkIn=false&page=" + page + "&name=" + searchText + "&surname=" + searchText;
    } else {
        var url = "http://localhost:8080/guests/list?checkIn=false&page=" + page;
    }
    console.log(url);
    hr.open("GET", url, true);
    hr.send();

    hr.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            var object = JSON.parse(hr.responseText);
            if (justOne) {
                if (object.totalElements > 3) {
                    var i = object.content[object.content.length - 1];
                    id = i.id;
                    var row = table.insertRow();
                    row.id = "guest" + id;
                    var theRow = document.getElementById("guest" + id);
                    theRow.classList.add("fade-in");
                    var cell1 = row.insertCell(0);
                    cell1.id = "id";
                    var cell2 = row.insertCell(1);
                    cell2.id = "name";
                    var cell3 = row.insertCell(2);
                    cell3.id = "surname";
                    var cell4 = row.insertCell(3);
                    cell4.id = "checkIn";
                    // output.innerHTML = "<tr> <td scope='row' style='display: none;'>"+i.id+"</td><td scope='row'>"+i.name+"</td><td scope='row'>"+i.surname+"</td><td scope='row'>"+i.checkIn+"</td><td scope='row'></td></tr>";
                    console.log("<tr class='fade-in' > <td scope='row' style='display: none;'>" + id + "</td><td scope='row'>" + i.name + "</td><td scope='row'>" + i.surname + "</td><td scope='row'>" + i.checkIn + "</td><td scope='row'></td></tr>");
                    cell1.innerHTML = id;
                    cell2.innerHTML = i.name;
                    cell3.innerHTML = i.surname;
                    if (i.checkIn) {
                        cell4.innerHTML = "<input type='checkbox' id='chechG" + id + " onclick='checkGuest(" + id + ")' class='form-check-input' checked>Check";
                    } else {
                        cell4.innerHTML = "<input type='checkbox' id='chechG" + id + "' onclick='checkGuest(" + id + ")' class='form-check-input'>Check";
                    }
                }

            } else {

                object.content.forEach(i = > {
                    console.log(i);
                id = i.id;
                var row = table.insertRow();
                row.id = "guest" + id;
                var theRow = document.getElementById("guest" + id);
                theRow.classList.add("fade-in");
                var cell1 = row.insertCell(0);
                cell1.id = "id";
                var cell2 = row.insertCell(1);
                cell2.id = "name";
                var cell3 = row.insertCell(2);
                cell3.id = "surname";
                var cell4 = row.insertCell(3);
                cell4.id = "checkIn";
                // output.innerHTML = "<tr> <td scope='row' style='display: none;'>"+i.id+"</td><td scope='row'>"+i.name+"</td><td scope='row'>"+i.surname+"</td><td scope='row'>"+i.checkIn+"</td><td scope='row'></td></tr>";
                console.log("<tr> <td scope='row' style='display: none;'>" + id + "</td><td scope='row'>" + i.name + "</td><td scope='row'>" + i.surname + "</td><td scope='row'>" + i.checkIn + "</td><td scope='row'></td></tr>");
                cell1.innerHTML = id;
                cell2.innerHTML = i.name;
                cell3.innerHTML = i.surname;
                if (i.checkIn) {
                    cell4.innerHTML = "<input type='checkbox' id='chechG" + id + " onclick='checkAndRefresh(" + id + ")' class='form-check-input' checked>Check";
                } else {
                    cell4.innerHTML = "<input type='checkbox' id='chechG" + id + "' onclick='checkAndRefresh(" + id + ")' class='form-check-input'>Check";
                }
            })
                ;
            }

            currentPage = object.pageable.pageNumber;
            var totalPages = object.totalPages;
            var previousPageHtml = document.getElementById("previousPage");
            var previousPageItem = document.getElementById("previousPageItem");
            var nextPageHtml = document.getElementById("nextPage");
            if (currentPage == 0) {
                previousPageHtml.classList.remove("btn-primary");
            } else {
                previousPageHtml.classList.add("btn-primary");
                previousPageHtml.setAttribute("onclick", "changePage(false, false);");
            }
            if (currentPage == (totalPages - 1)) {
                nextPageHtml.classList.remove("btn-primary");
            } else {
                nextPageHtml.classList.add("btn-primary");
                nextPageHtml.setAttribute("onclick", "changePage(false, true);");
            }


        }
    }
}

function checkGuest(guestId, page) {

    var data = {};
    data.id = guestId;
    data.checkIn = true;

    var row = document.getElementById("guest" + guestId);

    var json = JSON.stringify(data);

    var hr = new XMLHttpRequest();
    var url = "http://localhost:8080/api/guests/" + guestId;

    hr.open("PATCH", url, true);
    hr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    console.log(hr);

    // execute after send
    hr.onload = function () {
        var users = JSON.parse(hr.responseText);
        if (hr.readyState == 4 && hr.status == "200") {
            console.table(users);


            row.remove();

            populateTable(true, currentPage);
        } else {
            console.error(users);
        }
    }

    hr.send(json);
}

function checkAndRefresh(guestId) {
    setTimeout(checkGuest(guestId), 10);
}

function changePage(onlyOne, forword) {

    if (forword) {
        currentPage++;
    } else {
        currentPage--;
    }

    setTimeout(clearTable(), 10);
    setTimeout(populateTable(false, currentPage), 1510);
}

function clearTable() {

    var table = document.getElementById("tableContet");
    var tableRows = table.getElementsByTagName("tr");
    var rowCount = tableRows.length;

    for (var x = rowCount - 1; x > -1; x--) {
        table.removeChild(tableRows[x]);
    }
}

$("#search").keyup(function () {
    var searchText = document.getElementById("search").value;
    clearTable();
    populateTable(false, 0, searchText);
});