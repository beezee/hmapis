var g = {};
g.idx = 1;
g.links = [];
g.facing = '';
g.done = false;
g.start = false;
g.mediaType = "application/vnd.amundsen.maze+xml";
g.startLink = "http://localhost:3000/maze/five-by-five/";

// simple right-hand wall-following rules:
// if door-right, face-right
//else-if door-forward, face forward
//else-if door-left, face left
// else face back

g.rules = {
    'east' : ['south', 'east', 'north', 'west'],
    'south' : ['west', 'south', 'east', 'north'],
    'west' : ['north', 'west', 'south', 'east'],
    'north' : ['east', 'north', 'west', 'south']
};

function init() {
    attachEvents();
    setup();
}

function attachEvents() {
    var elm;
    
    elm = $('#go');
    if (elm.length) {
        elm.click(function() {
            firstMove();
        });
    }
}

function setup() {
    var el;
    
    g.done = false;
    g.start = false;
    
    el = $('#game-play');
    if (el.length) {
        el.html('');
    }
}

function firstMove() {
    if(g.done === true) {
        setup();
        firstMove();
    } else {
        g.idx = 1;
        getDocument(g.startLink);
    }
}

function getDocument(url) {
    $.get(url, function(response) {
        processLinks(response);
    });
}

function getLinkElement(key) {
    var i, x, rtn = '';
    
    for (i=0, x=g.links.length; i<x; i++) {
        if(g.links[i].rel === key) {
            rtn = g.links[i].href;
            break;
        }
    }
    return rtn;
}

function printLine(msg) {
    var el, txt, x;
    
    el = $('#game-play');
    if (el.length) {
        txt = el.html();
        txt = g.idx++ + ': ' + msg + '<br />' + txt;
        el.html(txt);
    }
}

function processLinks(response) {
    var xml, i, x, j, y, rels, href, link, flg, rules;
    
    flg = false;
    rules = [];
    g.links = [];
    
    //get all links in response
    xml = $(response);
    xml.find('link').each(function() {
        href = $(this).attr('href');
        rels = $(this).attr('rel').split(' ');
        for(j=0, y=rels.length; j<y; j++) {
            link = {'rel' : rels[j], 'href' : href};
            g.links.push(link);
        }
    });
    
    //is there an exit?
    href = getLinkElement('exit')
    if(href !== '') {
        g.done = true;
        printLine(href + ' *** DONE!');
        alert('Done in only ' + --g.idx + ' moves!');
        return;
    }
    
    //is there an entrance?
    if(flg === false && g.start === false) {
        href = getLinkElement('start');
        if(href !== '') {
            flg = true;
            g.start = true;
            g.facing = 'north';
            printLine(href);
        }
    }
    
    // ok, let's "wall-follow"
    if(flg === false) {
        rules = g.rules[g.facing];
        for(i=0, x = rules.length; i < x; i++) {
            href = getLinkElement(rules[i]);
            if(href !== '') {
                flg = true;
                g.facing = rules[i];
                printLine(href);
                break;
            }
        }
    }
    
    //update pointer, handle next move
    if(href !== '') {
        getDocument(href);
    }
}

$('document').ready(function() {
    init();
})