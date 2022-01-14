HERO_CACHE = "https://e7-optimizer-game-data.s3-accelerate.amazonaws.com/herodata.json?";
heroData = {};
gwdb = {};
gwDefenses = {}
$ = jQuery

var oathFilter = [
    "Lichty",
    "candi",
    "Avenlokh",
    "TM25MDYT",
    "iluvdahyun",
    "Lusira",
    "42OCatgirl",
    "Lusankya",
    "Trizix",
    "MildTaco",
    "Vestiges",
    "DoctorWeeb",
    "Budandann",
    "OhGodWhyMe",
    "Fribbels",
    "Alexandtheo",
    "Jeffu",
    "Strychnine",
    "Arkyah",
    "\uac15\ub3d9\ud638",
    "KimTran",
    "MasonTho",
    "Tommy\u30c4",
    "bumba\u6bc5",
    "\u4eba\u9593",
    "JPimport",
    "YorhaCat",
    "McWookie",
    "Karlito"
];

selector0 = null
selector1 = null
selector2 = null

jQuery(document).ready(function($){
    $("#homeLink").attr("href", window.location.href.split('?')[0])

    $(document).ready(async () => {
        var options = {
            sortField: 'text',
            width: 'resolve', // need to override the changed default
            placeholder: "Select hero",
            theme: "classic"
        }

        selector0 = $('#heroSelector0').select2(options);
        selector1 = $('#heroSelector1').select2(options);
        selector2 = $('#heroSelector2').select2(options);
    });

    $("#searchButton").click(search)

    fetchCache(HERO_CACHE).then(x => {
        console.log(x)
        heroData = x;

        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString).get('def');

        try {
            if (urlParams) {
                var names = urlParams.split(",")
                var ids = names.map(x => Object.entries(heroesById).find(y => y[1] == x)[0])

                selector0.val(ids[0]).trigger("change");
                selector1.val(ids[1]).trigger("change");
                selector2.val(ids[2]).trigger("change");

                search();
            }
        } catch (e) {
            console.error("Url parsing failed", e);
        }
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
                fight.id = fightId
                if (!gwDefenses[fight.defense]) {
                    gwDefenses[fight.defense] = []
                }
                gwDefenses[fight.defense].push(fight);
            }
        }
    });
});

function search() {
    heroes = [
        $('#heroSelector0').select2('data')[0],
        $('#heroSelector1').select2('data')[0],
        $('#heroSelector2').select2('data')[0]
    ]

    var defenseKey = heroes.map(x => x.id).sort()
    console.log("defkey", defenseKey);
    console.log("gwDefenses", gwDefenses);

    var names = defenseKey.map(x => heroesById[x]).join(",")
    window.history.replaceState(null, null, "?def=" + names);

    var fights = gwDefenses[defenseKey]
    console.log("fights", fights)

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

    console.log("offenses", offenses)

    var html = ""

    for (var offense of offenses) {
        var inters = offense.fights.filter(x => x.result == 0).map(x => x.offenseName).filter(x => oathFilter.includes(x));

        html += `
<div class="resultRow">
    <div class="imageRow">
        <div class="fightIcons">
            ${imgHtml(defenseKey.join(","))}
            <div class="vSpace"></div>
            <img class="atkImg" src="atk.png"></img>
            <div class="vSpace"></div>
            ${imgHtml(offense.offense)}
        </div>
        <div class="resultsContainer">
            <div class="results W">${offense.fights.filter(x => x.result == 1).length}W</div>
            <div class="results L">${offense.fights.filter(x => x.result == 0).length}L</div>
            <div class="results D">${offense.fights.filter(x => x.result == 2).length}D</div>
        </div>
        <div class="intersText">
            ${inters.length > 0 ? `Inters: ${inters.join(", ")}<div class="vSpace"></div><div class="vSpace"></div>` : ""}
        </div>

        <div class="ctrlFText">${offense.offense.split(",").map(x => (heroesById[x] || "?")).join(", ")}</div>
    </div>
</div>
        `
    }

    $('#resultRows').html(html)
}

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
    var heroIcons = heroNames.map(x => heroData[x] ? heroData[x].assets.icon : "https://raw.githubusercontent.com/fribbels/Fribbels-Epic-7-Optimizer/main/data/cachedimages/question_circle.png")
    var imgHtml = heroIcons.map(x => `<img class="portrait" src=${x}></img>`)

    return imgHtml.join(`<div class="vSpace"></div>`)
}