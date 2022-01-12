HERO_CACHE = "http://e7-optimizer-game-data.s3-accelerate.amazonaws.com/herodata.json?";
heroData = {};
gwdb = {};
gwDefenses = {}
$ = jQuery
jQuery(document).ready(function($){
    $(document).ready(async () => {
        var options = {
            sortField: 'text',
            width: 'resolve' // need to override the changed default
        }

        $('#heroSelector0').select2(options);
        $('#heroSelector1').select2(options);
        $('#heroSelector2').select2(options);
    });

    $("#searchButton").click(() => {
        heroes = [
            $('#heroSelector0').select2('data')[0],
            $('#heroSelector1').select2('data')[0],
            $('#heroSelector2').select2('data')[0]
        ]

        var defenseKey = heroes.map(x => x.id).sort()
        console.log("defkey", defenseKey);
        console.log(gwDefenses);

        var fights = gwDefenses[defenseKey]
        console.log(fights)

        var defenseHtml = imgHtml(defenseKey.join(","))
        $('#defenseIcons').html("<br/>" + defenseHtml)


        if (!fights) {
            $('#resultRows').html("No results")
            return
        }

        var offenses = {}
        for (var fight of fights) {
            if (!offenses[fight.offense]) {
                offenses[fight.offense] = []
            }
            offenses[fight.offense].push(fight)
        }

        offenses = Object.keys(offenses).map(x => ({
            offense: x,
            fights: offenses[x]
        }))

        offenses = offenses.sort(function compare(a, b) {
            if (a.fights.length < b.fights.length)
                return 1;
            if (a.fights.length > b.fights.length)
                return -1;
            return 0;
        })

        $('#resultRows').html("")

        console.log(offenses)

        var html = ""


        for (var offense of offenses) {
            html += `${imgHtml(offense.offense)} <div class="resultsText">Wins ${offense.fights.filter(x => x.result == 1).length}, Losses ${offense.fights.filter(x => x.result == 0).length}, Draws ${offense.fights.filter(x => x.result == 2).length}</div><br/><br/>`
        }

        $('#resultRows').html(html)
    })

    fetchCache(HERO_CACHE).then(x => {
        console.log(x)
        heroData = x;
    })

    for (var i of Object.keys(heroesById)) {
        var data = {
            id: i,
            text: heroesById[i]
        };

        var newOption0 = new Option(data.text, data.id, false, false);
        var newOption1 = new Option(data.text, data.id, false, false);
        var newOption2 = new Option(data.text, data.id, false, false);
        $('#heroSelector0').append(newOption0);
        $('#heroSelector1').append(newOption1);
        $('#heroSelector2').append(newOption2);
    }

    $.ajax({
        url: "./gwdb.json",
        //force to handle it as text
        dataType: "text",
        success: function(data) {
            //data downloaded so we call parseJSON function
            //and pass downloaded data
            var json = $.parseJSON(data);
            //now json variable contains data in json format
            //let's display a few items
            gwdb = json;

            for (var fightId of Object.keys(gwdb)) {
                var fight = gwdb[fightId]
                if (!gwDefenses[fight.defense]) {
                    gwDefenses[fight.defense] = []
                }
                gwDefenses[fight.defense].push(fight);
            }
        }
    });
});

async function fetchCache(url) {
    console.log("Fetching from url: " + url);
    var myHeaders = new Headers();
    myHeaders.append('pragma', 'no-cache');
    myHeaders.append('cache-control', 'no-cache');

    const response = await fetch(url, {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors', // no-cors, *cors, same-origin
    });
    const text = await response.text();
    const json = JSON.parse(text);
    console.log("Finished fetching from url: " + url);

    return json;
}

function sortByAttribute (arr, attributeStr) {
    function compare(a, b) {
        if (a[attributeStr] < b[attributeStr])
            return -1;
        if (a[attributeStr] > b[attributeStr])
            return 1;
        return 0;
    }

    return arr.sort(compare);
}

function imgHtml(offenseStr) {
    var heroIds = offenseStr.split(",")
    var heroNames = heroIds.map(x => heroesById[x])
    var heroIcons = heroNames.map(x => heroData[x].assets.icon)
    var imgHtml = heroIcons.map(x => `<img class="portrait" src=${x}></img>`)

    return imgHtml.join(" ")
}