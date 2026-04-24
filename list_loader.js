var table = document.createElement('table');
var currentSort = { column: 0, ascending: true }; //default sorting - by index zero
const NUMBER_REGEX = /^\s*-?\d+(\.\d+)?\s*$/;

function sortTable(columnIndex) {
    var tbody = table.querySelector('tbody') || table;
    var rows = Array.from(tbody.querySelectorAll('tr'));
    var headerCells = table.querySelectorAll('th');

    if (currentSort.column === columnIndex) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        currentSort.column = columnIndex;
        currentSort.ascending = true;
    }

    headerCells.forEach(function(cell, i) {
        cell.style.cursor = i === columnIndex ? 'pointer' : 'default';
    });

    rows.sort(function(a, b) {
        var aVal = a.cells[columnIndex].textContent;
        var bVal = b.cells[columnIndex].textContent;

        if (aVal.match(NUMBER_REGEX) && bVal.match(NUMBER_REGEX)) {
            var aNum = parseFloat(aVal);
            var bNum = parseFloat(bVal);
            return currentSort.ascending ? aNum - bNum : bNum - aNum;
        }

        return currentSort.ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    rows.forEach(function(row) {
        tbody.appendChild(row);
    });
}

var header_row = document.createElement('tr');
var video_cell = document.createElement('th');
video_cell.textContent = 'Название видео';
video_cell.style.cursor = 'pointer';
var upload_cell = document.createElement('th');
upload_cell.textContent = 'Дата загрузки';
upload_cell.style.cursor = 'pointer';
var view_count_cell = document.createElement('th');
view_count_cell.textContent = 'Количество просмотров';
view_count_cell.style.cursor = 'pointer';
var entry_date_cell = document.createElement('th');
entry_date_cell.textContent = 'Дата добавления в плейлист';
entry_date_cell.style.cursor = 'pointer';
header_row.appendChild(video_cell)
header_row.appendChild(view_count_cell)
header_row.appendChild(upload_cell)
header_row.appendChild(entry_date_cell)
table.appendChild(header_row);

video_cell.addEventListener('click', function() { sortTable(0); });
view_count_cell.addEventListener('click', function() { sortTable(1); });
upload_cell.addEventListener('click', function() { sortTable(2); });
entry_date_cell.addEventListener('click', function() { sortTable(3); });

var main_container = document.getElementById("main_container")
var tbody = document.createElement('tbody');
table.appendChild(tbody);

videos.sort(function(a, b) {
    var aName = a.name !== null ? a.name.toLowerCase() : '';
    var bName = b.name !== null ? b.name.toLowerCase() : '';
    return aName.localeCompare(bName);
});

for (var i = 0; i < videos.length; i++) {
    var video = videos[i];
    var row = document.createElement('tr');
    var video_cell = document.createElement('td');
    var link = document.createElement('a');
    link.href = 'https://www.youtube.com/watch?v=' + video.id;
    link.textContent = video.name !== null ? video.name : 'None';
    video_cell.appendChild(link);
    var upload_date = video.published_at !== null ? video.published_at.split('T')[0] : 'None';
    var upload_cell = document.createElement('td');
    upload_cell.textContent = upload_date;
    var view_cell = document.createElement('td');
    view_cell.textContent = video.view_count !== null ? video.view_count : 'None';
    var entry_cell = document.createElement('td');
    entry_cell.textContent = video.created_at;
    row.appendChild(video_cell);
    row.appendChild(view_cell);
    row.appendChild(upload_cell);
    row.appendChild(entry_cell);
    tbody.appendChild(row);
}

main_container.appendChild(table);
