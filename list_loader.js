const NUMBER_REGEX = /^\s*-?\d+(\.\d+)?\s*$/;
var main_container = document.getElementById("main_container")
var currentSort = { column: null, ascending: null }; //default sorting - by index zero

var raw_headers = ['Название видео', 'Дата загрузки', 'Количество просмотров', 'Дата добавления в плейлист'];
var column_bindings = {}
column_bindings[raw_headers[0]] = function(video, raw) {
    let video_name = video.name !== null ? video.name : 'None';
    if (raw) {
        return video_name;
    }
    let link = document.createElement('a');
    link.href = 'https://www.youtube.com/watch?v=' + video.id;
    link.textContent = video_name;
    let video_cell = document.createElement('td');
    video_cell.appendChild(link);
    return video_cell;
}
column_bindings[raw_headers[1]] = function(video, raw) {
    let upload_date = video.published_at !== null ? video.published_at.split('T')[0] : 'None';
    if (raw) {
        return upload_date; //TODO : work like with real date
    }
    let upload_cell = document.createElement('td');
    upload_cell.textContent = upload_date;
    return upload_cell;
}

column_bindings[raw_headers[2]] = function(video, raw) {
    let view_count = video.view_count !== null ? video.view_count : '0';
    if (raw) {
        return view_count;
    }
    let view_cell = document.createElement('td');
    view_cell.textContent = view_count;
    return view_cell;
}

column_bindings[raw_headers[3]] = function(video, raw) {
    if (raw) {
        return video.created_at; //TODO : work like with dates
    }
    let entry_cell = document.createElement('td');
    entry_cell.textContent = video.created_at;
    return entry_cell;
}

//IF you'll need to change column order, change this array
var table_headers = [raw_headers[0], raw_headers[1], raw_headers[2], raw_headers[3]];

function create_table(container, all_videos, sorting_column) {
    let table = document.createElement('table');
    let header_row = document.createElement('tr');
    {
        let a_header = document.createElement('th');
        a_header.textContent = ""
        a_header.style.cursor = 'pointer';
        header_row.appendChild(a_header)
    }
    for (let i = 0; i<table_headers.length; i++) {
        let a_header = document.createElement('th');
        a_header.textContent = table_headers[i];
        a_header.style.cursor = 'pointer';
        a_header.addEventListener('click', function() { create_table(container, all_videos, i); });
        header_row.appendChild(a_header)
    }
    table.appendChild(header_row);
    //TODO : research if copy of videos object is needed

    if (currentSort.column === sorting_column) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        currentSort.column = sorting_column;
        currentSort.ascending = true;
    }
    
    all_videos.sort(function(a, b) {
        let aVal = column_bindings[table_headers[sorting_column]](a, true);
        let bVal = column_bindings[table_headers[sorting_column]](b, true);

        if (aVal.match(NUMBER_REGEX) && bVal.match(NUMBER_REGEX)) {
            let aNum = parseFloat(aVal);
            let bNum = parseFloat(bVal);
            return currentSort.ascending ? aNum - bNum : bNum - aNum;
        }

        return currentSort.ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    for (let i = 0; i<all_videos.length; i++) {
        let row = document.createElement('tr');
        {
            let number = document.createElement('td');
            number.textContent = i;
            row.appendChild(number);
        }
        for (let j = 0; j < table_headers.length; j++) {
            let element = column_bindings[table_headers[j]](all_videos[i], false);
            row.appendChild(element);
        }
        table.appendChild(row);
    }

    container.replaceChildren(table);
}

create_table(main_container, videos, 0)
