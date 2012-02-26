var g = {};
g.moves = 0;
g.links = [];
g.mediaType = "application/vnd.amundsen.maze+xml";
g.startLink = "http://localhost:3000/maze/five-by-five/";
g.sorryMsg = 'Sorry, I don\'t understand what you want to do.';
g.successMsg = 'Congratulations! You\'ve made it out of the maze.';

function init() {
    attachEvents();
    getDocument(g.startLink);
    setFocus();
}

function attachEvents() {
    var elm;
    
    elm = document.getElementsByName('interface')[0];
    if(elm) {
        elm.onsubmit = function(){return move();};
    }
}

function getDocument(url) {
    $.get(url, function(data) {
        processLinks(data);
    })
}

function setFocus() {
    var elm;
    
    elm = document.getElementsByName('move')[0];
    if(elm) {
        elm.value = '';
        elm.focus();
    }
}

function processLinks(response) {
    var xml, link, links, i, x, y, j, rels, href;
    
    g.links = [];
    xml = $(response).find('link');
    for(i = 0, x = xml.length; i < x; i++) {
        href = xml[i].getAttribute('href');
        rels = xml[i].getAttribute('rel').split(' ');
        for(j = 0, y = rels.length; j < y; j++) {
            link = {'rel': rels[j], 'href': href};
            g.links[g.links.length] = link;
        }
    }
    showOptions();
}

function showOptions() {
    var elm, i, x, txt;
    
    txt = '';
    elm = $('.options')[0];
    if (elm) {
        for(i=0, x=g.links.length; i<x; i++) {
            if(i>0){
                txt += ', ';
            }
            if(g.links[i].rel === 'collection') {
                txt += 'clear';
            } else {
                txt += g.links[i].rel;
            }
        }
        elm.innerHTML = txt;
    }
}

function move() {
    var elm, mv, href;
    
    elm = document.getElementsByName('move')[0];
    if(elm) {
        mv = elm.value;
        if (!mv) return;
        if(mv === 'clear') {
            reload();
        } else {
            href = getLinkElement(mv);
            console.log(href);
            if(href == '') {
                alert(g.sorryMsg);
            } else {
                updateHistory(mv);
                getDocument(href);
            }
        }
        setFocus();
    }
    delete(g.running);
    return false;
}

function reload() {
    $('#history').html('');
}

function getLinkElement(key) {
    var i, x, rtn;
    
    for(i=0, x=g.links.length; i<x; i++) {
        if(g.links[i].rel === key) {
            rtn = g.links[i].href;
            break;
        }
    }
    return rtn || '';
}

function updateHistory(mv) {
    var elm, txt;
    
    elm = $('#history');
    if (elm.length) {
        txt = elm.html();
        g.moves++;
        if(mv ==='exit') {
            txt = g.moves + ': ' + g.successMsg + '<br />' + txt;
        } else {
            txt = g.moves + ':' + mv + '<br />' + txt;
        }
        elm.html(txt);
    }
}

$('document').ready(function() {
    init();
    $('input[type=submit]').click(function() {
       move(); 
    });
    $('input[name=move]').keyup(function(e) {
        if (e.keyCode == '13') {
            if (g.running) return;
            g.running = setTimeout(move(), 100);
            return;
        }
    })
})