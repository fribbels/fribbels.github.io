HERO_CACHE = "https://e7-optimizer-game-data.s3-accelerate.amazonaws.com/herodata.json?";
ARTIFACT_CACHE = "https://e7-optimizer-game-data.s3-accelerate.amazonaws.com/artifactdata.json?";
heroData = {};
artifactData = {};
heroesById = {};
$ = jQuery
dev = false;

selector0 = null
loadedHeroData = false;
loadedArtifactData = false;

buildDefSelector0 = null

var currentAggregate = {};

var artifactsById = {}
// for (var a of artifactsList) {
//     a.id = a.id.replace("_name", "")
//     artifactsById[a.id] = a.text
// }

var idsByName = null;

var filters = {
    setFilter: null,
    artifactFilter: null,
    gsFilter: null
}

let totalAtk = 0;
let totalDef = 0;
let totalHP = 0;
let totalCHC = 0;
let totalCHD = 0;
let totalEff = 0;
let totalEfr = 0;
let totalSpd = 0;
let totalGS = 0;

const DIGITS_3 = 40;
const DIGITS_4 = 47;
const DIGITS_5 = 54;
const DIGITS_6 = 20;

            // {headerName: i18next.t('atk'), field: 'atk', width: DIGITS_4},
            // {headerName: i18next.t('def'), field: 'def', width: DIGITS_4},
            // {headerName: i18next.t('hp'), field: 'hp', width: DIGITS_5},
            // {headerName: i18next.t('spd'), field: 'spd', width: DIGITS_3},
            // {headerName: i18next.t('cr'), field: 'cr', width: DIGITS_3},
            // {headerName: i18next.t('cd'), field: 'cd', width: DIGITS_3},
            // {headerName: i18next.t('eff'), field: 'eff', width: DIGITS_3},
            // {headerName: i18next.t('res'), field: 'res', width: DIGITS_3},
            // // {headerName: i18next.t('dac'), field: 'dac'},
            // {headerName: i18next.t('cp'), field: 'cp', width: DIGITS_6},
            // {headerName: i18next.t('hps'), field: 'hpps', width: DIGITS_4},
            // {headerName: i18next.t('ehp'), field: 'ehp', width: DIGITS_6},
            // {headerName: i18next.t('ehps'), field: 'ehpps', width: DIGITS_5},
            // {headerName: i18next.t('dmg'), field: 'dmg', width: DIGITS_5},
            // {headerName: i18next.t('dmgs'), field: 'dmgps', width: DIGITS_4},
            // {headerName: i18next.t('mcd'), field: 'mcdmg', width: DIGITS_5},
            // {headerName: i18next.t('mcds'), field: 'mcdmgps', width: DIGITS_4},
            // {headerName: i18next.t('dmgh'), field: 'dmgh', width: DIGITS_5},
            // {headerName: i18next.t('dmgd'), field: 'dmgd', width: DIGITS_5},
            // {headerName: i18next.t('score'), field: 'score', width: DIGITS_3},
            // {headerName: i18next.t('prio'), field: 'priority', width: DIGITS_3},
            // {headerName: i18next.t('upg'), field: 'upgrades', width: DIGITS_2},
                // row.ehp = ehp
                // row.hpps = hpps
                // row.ehpps = ehpps
                // row.dmg = dmg
                // row.dmgps = dmgps
                // row.mcdmg = mcdmg
                // row.mcdmgps = mcdmgps
                // row.dmgh = dmgh
                // row.dmgd = dmgd

var gridOptions = {
    defaultColDef: {
        sortingOrder: ['desc', 'asc'],
        // cellStyle: columnGradient,
        cellStyle: columnGradient,
        // suppressNavigable: true,
        cellClass: 'no-border',
        // valueFormatter: numberFormatter,
        width: 50,
        sortable: true,
    },
    overlayNoRowsTemplate:
    'Select a hero',
    showLoadingOverlay: "Loading..",
    rowSelection: 'single',
    paginationPageSize: 1000,
    cacheBlockSize: 1000,
    suppressCellSelection: true,
    enableRangeSelection: false,
    suppressDragLeaveHidesColumns: true,
    isExternalFilterPresent: isExternalFilterPresent,
    doesExternalFilterPass: doesExternalFilterPass,

 // each entry here represents one column
     columnDefs: [
       { headerName: " #", field: "rank", width: DIGITS_3, sortingOrder: ['asc', 'desc']},
       { headerName: " sets ", field: "sets", width: 85, cellRenderer: (params) => renderSets(params.value)},
       { headerName: " gs ", field: "gs", width: DIGITS_3, cellStyle: columnGradient},
       { headerName: " bs ", field: "bs", width: DIGITS_3, cellStyle: columnGradient},
       { headerName: " atk", field: "atk", width: DIGITS_4, cellStyle: columnGradient},
       { headerName: " def", field: "def", width: DIGITS_4, cellStyle: columnGradient},
       { headerName: " hp", field: "hp", width: DIGITS_5, cellStyle: columnGradient},
       { headerName: " spd", field: "spd", width: DIGITS_3, cellStyle: columnGradient},
       { headerName: " cc", field: "chc", width: DIGITS_3, cellStyle: columnGradient},
       { headerName: " cd", field: "chd", width: DIGITS_3, cellStyle: columnGradient},
       { headerName: " eff", field: "eff", width: DIGITS_3, cellStyle: columnGradient},
       { headerName: " res", field: "efr", width: DIGITS_3, cellStyle: columnGradient},
       { headerName: " ehp", field: "ehp", width: DIGITS_4, cellStyle: columnGradient},
       { headerName: " hps", field: "hps", width: DIGITS_4, cellStyle: columnGradient},
       { headerName: " ehps", field: "ehps", width: DIGITS_4, cellStyle: columnGradient},
       { headerName: " dmg", field: "dmg", width: DIGITS_4, cellStyle: columnGradient},
       { headerName: " dmgs", field: "dmgs", width: DIGITS_4, cellStyle: columnGradient},
       { headerName: " mcd", field: "mcd", width: DIGITS_4, cellStyle: columnGradient},
       { headerName: " mcds", field: "mcds", width: DIGITS_4, cellStyle: columnGradient},
       { headerName: " dmgh", field: "dmgh", width: DIGITS_4, cellStyle: columnGradient},
       { headerName: " dmgd", field: "dmgd", width: DIGITS_4, cellStyle: columnGradient},
       { headerName: "arti", field: "artifactName", width: DIGITS_5, width: 150, cellStyle: {"justify-content": "left", "display": "block"}},
       { headerName: "date", field: "createDate", width: DIGITS_5, width: 85},
     ],

            // build["atk"] = d["atk"]
            // build["spd"] = d["spd"]
            // build["def"] = d["def"]
            // build["eff"] = d["eff"]
            // build["hp"] = d["hp"]
            // build["chc"] = d["chc"]
            // build["chd"] = d["chd"]
            // build["gs"] = d["gs"]
            // build["efr"] = d["efr"]
            // build["sets"] = d["sets"]
            // build["unitId"] = d["unitId"]
            // build["buildId"] = d["buildId"]
            // build["artifactCode"] = d["artifactCode"]
            // build["createDate"] = d["createDate"]
            // build["unitCode"] = d["unitCode"]
            // build["unitName"] = d["unitName"]

 // default col def properties get applied to all columns

 rowSelection: 'multiple', // allow rows to be selected
 animateRows: true, // have rows animate to new positions when sorted

 // example event handler
 onCellClicked: params => {
    var before = params.data;

    $('#atkStatBefore').text(before.atk)
    $('#defStatBefore').text(before.def)
    $('#hpStatBefore').text(before.hp)
    $('#spdStatBefore').text(before.spd)
    $('#crStatBefore').text(before.chc)
    $('#cdStatBefore').text(before.chd)
    $('#effStatBefore').text(before.eff)
    $('#resStatBefore').text(before.efr)
    $('#gsStatBefore').text(before.gs)

    $("#heroArtifact").attr("src", `https://static.smilegatemegaport.com/event/live/epic7/guide/wearingStatus/images/artifact/${before.artifactCode}_ico.png`)
    $('#setBefore').html(renderSets(before.sets, false, "heroBannerSetIcon"));
    // $("#heroArtifact").show()
    $('#heroArtifact').css('opacity', '1')

    $('.statPreviewContainer').addClass('gutterTop')
    $('#avgText').hide()
 }
};

function isExternalFilterPresent(params) {
    return false;

}

function doesExternalFilterPass(row) {
    // console.log("2", row.data)
    return true;
}
var grid = undefined

jQuery(document).ready(function($){
    document.title = "Fribbels Hero Library"
    $("#homeLink").attr("href", window.location.href.split('?')[0])

    fetchCache(HERO_CACHE).then(x => {
        console.log("herodata", x)
        heroData = x;

        for (var name of Object.keys(heroData)) {
            heroesById[heroData[name].code] = name;
        }

        loadedHeroData = true;
        checkReady();
    })

    fetchCache(ARTIFACT_CACHE).then(x => {
        console.log("artifactdata", x)
        artifactData = x;

        for (var name of Object.keys(artifactData)) {
            artifactsById[artifactData[name].code] = name;
        }

        loadedArtifactData = true;
        checkReady();
    })
});



function search(pop) {
    $('.setCombos, .artifactCombos, .gsStats').hide();
    $('.statPreviewContainer').addClass('gutterTop')
    $('#avgText').hide()


    savedSetCombos = []
    name = $('#heroSelector0').select2('data')[0].text
    var id = $('#heroSelector0').select2('data')[0].id

    $("#heroBanner").attr("src", `https://raw.githubusercontent.com/fribbels/Fribbels-Epic-7-Optimizer/main/data/cachedimages/${id}_su.png`)
    $("#artifactCombos").html("")
    $("#setCombos").html("")
    $("#gsStats").html("")

    $('#atkStatBefore').text("")
    $('#defStatBefore').text("")
    $('#hpStatBefore').text("")
    $('#spdStatBefore').text("")
    $('#crStatBefore').text("")
    $('#cdStatBefore').text("")
    $('#effStatBefore').text("")
    $('#resStatBefore').text("")
    $('#gsStatBefore').text("")

    if (!name) {
        return;
    }
    if (pop == true) {
    } else {
        const url = new URL(window.location);
        url.searchParams.set('hero', name);
        window.history.pushState({hero: name}, '', url);
    }

    // window.history.replaceState(null, null, "?hero=" + name);

    // $("#heroArtifact").attr("src", ``)
    // $("#heroArtifact").hide()
    $('#heroArtifact').css('opacity', '0')
    $('#setBefore').html(renderSets({}, false, "heroBannerSetIcon"));

   gridOptions.api.showLoadingOverlay();
    $.ajax({
        url: dev ? "http://127.0.0.1:5000/getBuilds" : "https://krivpfvxi0.execute-api.us-west-2.amazonaws.com/dev/getBuilds",
        //force to handle it as text
        dataType: "text",
        type: "POST",
        crossDomain: true,
        data: name,
        success: function(data) {
            currentIndex = -1
            savedSetCombos = []
            $(`#setCombos`).off()
            gridOptions.api.setDoesExternalFilterPass((row) => {return true})
            gridOptions.api.onFilterChanged()
            data = JSON.parse(data)

            resetStatTotals();

            var setCombos = {
            }
            var artifactCombos = {
            }
            filters = {
                setFilter: null,
                artifactFilter: null,
                gsFilter: null
            }
            var rank = 1;
            for (row of data.data) {
                row.atk = parseInt(row.atk)
                totalAtk += row.atk;
                row.def = parseInt(row.def)
                totalDef += row.def;
                row.hp = parseInt(row.hp)
                totalHP += row.hp;
                row.chc = parseInt(row.chc)
                totalCHC += row.chc;
                row.chd = parseInt(row.chd)
                totalCHD += row.chd;
                row.eff = parseInt(row.eff)
                totalEff += row.eff;
                row.efr = parseInt(row.efr)
                totalEfr += row.efr;
                row.spd = parseInt(row.spd)
                totalSpd += row.spd;

                var critRate;
                if (row.chc > 100) {
                    critRate = 1
                } else {
                    critRate = row.chc / 100
                }

                var critDamage;
                if (row.chd > 350) {
                    critDamage = 3.5;
                } else {
                    critDamage = row.chd / 100
                }

                var torrentSetMultiplier = 1
                if (row.sets.set_torrent) {
                    torrentSetMultiplier += Math.floor(row.sets.set_torrent / 2) * 0.1
                }

                var penSetMultiplier = 1
                if (row.sets.set_penetrate > 1) {
                    penSetMultiplier = 1.14
                }

                var spdDiv1000 = row.spd / 1000
                var ehp = Math.floor(row.hp * (row.def/300 + 1))
                var hpps = Math.floor(row.hp*spdDiv1000);
                var ehpps = Math.floor(ehp*spdDiv1000);
                var dmg = Math.floor(((critRate * row.atk * critDamage) + (1-critRate) * row.atk) * penSetMultiplier * torrentSetMultiplier);
                var dmgps = Math.floor(dmg*spdDiv1000);
                var mcdmg = Math.floor(row.atk * critDamage * penSetMultiplier * torrentSetMultiplier);
                var mcdmgps = Math.floor(mcdmg*spdDiv1000);
                var dmgh = Math.floor((critDamage * row.hp)/10 * penSetMultiplier * torrentSetMultiplier);
                var dmgd = Math.floor((critDamage * row.def) * penSetMultiplier * torrentSetMultiplier);

                row.ehp = ehp
                row.hps = hpps
                row.ehps = ehpps
                row.dmg = dmg
                row.dmgs = dmgps
                row.mcd = mcdmg
                row.mcds = mcdmgps
                row.dmgh = dmgh
                row.dmgd = dmgd

                var setsStr = JSON.stringify(convertToFullSets(row.sets))
                if (!Object.keys(setCombos).includes(setsStr)) {
                    setCombos[setsStr] = []
                }
                setCombos[setsStr].push(row)

                if (!Object.keys(artifactCombos).includes(row.artifactCode)) {
                    artifactCombos[row.artifactCode] = []
                }
                artifactCombos[row.artifactCode].push(row)

                // https://static.smilegatemegaport.com/event/live/epic7/guide/wearingStatus/images/artifact/efw21_ico.png
                row.artifactName = artifactsById[row.artifactCode] || "?"

                if (!artifactsById[row.artifactCode]) {
                    row.invalid = true;
                    continue;
                }

                var artifact = artifactData[row.artifactName]
                var artiAtk = artifact.stats.attack * 13;
                var artiHp = artifact.stats.health * 13;
                var base = heroData[row.unitName].calculatedStatus.lv60SixStarFullyAwakened

                var baseAtk = base.overrideAtk || base.atk;
                var baseDef = base.overrideDef || base.def;
                var baseHp = base.overrideHp || base.hp;
                var baseSpd = base.spd + (base.overrideAdditionalSpd || 0);

                var fullSets = convertToFullSets(row.sets)
                var bonusSetAcc = (fullSets.set_acc || 0)/2 * 20
                var bonusSetAtt = (fullSets.set_att || 0)/4 * 45
                var bonusSetCri = (fullSets.set_cri || 0)/2 * 12
                var bonusSetCriDmg = (fullSets.set_cri_dmg || 0)/4 * 60
                var bonusSetDef = (fullSets.set_def || 0)/2 * 20
                var bonusSetMaxHp = (fullSets.set_max_hp || 0)/2 * 20
                var bonusSetRes = (fullSets.set_res || 0)/2 * 20
                var bonusSetTorrent = (fullSets.set_torrent || 0)/2 * -10
                var bonusSetRevenge = (fullSets.set_revenge || 0)/4 * Math.floor(0.12 * baseSpd)
                var bonusSetSpeed = (fullSets.set_speed || 0)/4 * Math.floor(0.25 * baseSpd)

                // console.log(row)

                var bsStats = {
                    hp: (row.hp - baseHp - artiHp - bonusSetMaxHp/100*baseHp - bonusSetTorrent/100*baseHp) / baseHp * 100,
                    atk: (row.atk - baseAtk - artiAtk - bonusSetAtt/100*baseAtk) / baseAtk * 100,
                    def: (row.def - baseDef - bonusSetDef/100*baseDef) / baseDef * 100,
                    chc: (Math.min(100, row.chc) - base.chc*100 - (base.overrideAdditionalCr || 0)*100 - bonusSetCri),
                    chd: (Math.min(350, row.chd) - base.chd*100 - (base.overrideAdditionalCd || 0)*100 - bonusSetCriDmg),
                    eff: (row.eff - base.eff*100 - (base.overrideAdditionalEff || 0)*100 - bonusSetAcc),
                    res: (row.efr - base.efr*100 - (base.overrideAdditionalRes || 0)*100 - bonusSetRes),
                    spd: (row.spd - baseSpd - bonusSetSpeed - bonusSetRevenge),
                }

                row.gs = Math.ceil(row.gs - Math.max(0, row.chc - 100)*1.6 - Math.max(0, row.chd - 350)*1.14)
                totalGS += row.gs
                bs = bsStats.hp + bsStats.atk + bsStats.def + bsStats.eff + bsStats.res + bsStats.chc * 1.6 + bsStats.chd * 1.14 + bsStats.spd * 2
                row.bs = Math.floor(bs)


                // row.sets = JSON.stringify(Object.keys(row.sets))

        // final float spdDiv1000 = (float)spd/1000;

        // final int ehp = (int) (hp * (def/300 + 1));
        // final int hpps = (int) (hp*spdDiv1000);
        // final int ehpps = (int) ((float)ehp*spdDiv1000);
        // final int dmg = (int) (((critRate * atk * critDamage) + (1-critRate) * atk) * rageMultiplier * penMultiplier * torrentMultiplier);
        // final int dmgps = (int) ((float)dmg*spdDiv1000);
        // final int mcdmg = (int) (atk * critDamage * rageMultiplier * penMultiplier * torrentMultiplier);
        // final int mcdmgps = (int) ((float)mcdmg*spdDiv1000);
        // final int dmgh = (int) ((critDamage * hp)/10 * rageMultiplier * penMultiplier * torrentMultiplier);
        // final int dmgd = (int) ((critDamage * def) * rageMultiplier * penMultiplier * torrentMultiplier);

            }

            if (data.data.length) {
                updateAverages(data.data.length);
            }
            

            console.log(data)

            data.data = data.data.filter(x => !x.invalid).sort((x,y) => y.gs-x.gs)
            for (var rank = 0; rank < data.data.length; rank++) {
                data.data[rank].rank = rank+1
            }

            var len = data.data.length;

            var intervals = [1, 3, 5, 10, 20, 30, 40, 50, 75];
            let gsCutoffs = []
            var gsHtml = ""
            let index = 0;
            for (var i of intervals) {
                let gsCutoff = data.data[Math.floor(len  * i / 100)].gs;
                gsCutoffs.push(gsCutoff);
                gsHtml += `
                <div class="statPreviewRow gsRow gsRow${index}" id="gsRow${index}">
                    <div class="setArtifactRowLeft">
                        ${"" + i + "% "}
                    </div>
                    <div class="gsRowRight">
                        ${gsCutoff + " gs"}
                    </div>
                </div>
                `;
                index++;
            }
            $("#gsStats").html(gsHtml)
            index = 0;
            // 9

            aggregateCurrentHeroStats(data.data)
            gridOptions.api.setRowData(data.data);

            window.gridOptions = gridOptions
            gridOptions.columnApi.resetColumnState()

            var sortedSetCombos = Object.entries(setCombos).sort((x, y) => y[1].length - x[1].length)
            sortedSetCombos = sortedSetCombos.splice(0, 9)
            savedSetCombos = sortedSetCombos;
            var setComboHtml = ""
            var count = 0
            for (var combo of sortedSetCombos) {
                var html = renderSets(JSON.parse(combo[0]), false);
                var setComboText = (combo[1].length / data.data.length * 100).toFixed(1) + "%";
                setComboHtml += `
                <div class="statPreviewRow setComboRow setComboRow${count}" id="setComboRow${count}">
                    <div class="setComboRowText">
                        ${setComboText}
                    </div>
                    <div class="setComboRowImages">
                        ${html}
                    </div>
                </div>
                `;
                count++;
            }
            $("#setCombos").html(setComboHtml)


            var sortedArtifactCombos = Object.entries(artifactCombos).sort((x, y) => y[1].length - x[1].length)
            sortedArtifactCombos = sortedArtifactCombos.splice(0, 9)

            var artifactComboHtml = ""
            for (var combo of sortedArtifactCombos) {
                var html = artifactsById[combo[0]] || "?"
                var artifactComboText = (combo[1].length / data.data.length * 100).toFixed(1) + "%";
                artifactComboHtml += `
                <div class="statPreviewRow artifactComboRow artifactComboRow${index}" id="artifactComboRow${index}"">
                    <div class="setArtifactRowLeft">
                        ${artifactComboText}
                    </div>
                    <div class="setArtifactRowRight">
                        ${html}
                    </div>
                </div>
                `;
                index++;
            }
            index = 0;
            $("#artifactCombos").html(artifactComboHtml)

            for (let i = 0; i < count; i++) {
                $(`#setCombos`).off('click', `#setComboRow${i}`);
                $(`#setCombos`).on('click', `#setComboRow${i}`, (x) => {
                    $(`.setComboRow:not(#setComboRow${i})`).removeClass('active')
                    $(`#setComboRow${i}`).toggleClass('active')

                    const selectedFilter = JSON.parse(savedSetCombos[i][0]);
                    if (objectsAreEqual(selectedFilter, filters.setFilter)) {
                        filters.setFilter = null;
                    } else {
                        filters.setFilter = selectedFilter;
                    }
                    filterBuilds();
                })
            }

            for (let i = 0; i < sortedArtifactCombos.length; i++) {
                $(`#artifactCombos`).off('click', `#artifactComboRow${i}`);
                $(`#artifactCombos`).on('click', `#artifactComboRow${i}`, (x) => {
                    $(`.artifactComboRow:not(#artifactComboRow${i})`).removeClass('active')
                    $(`#artifactComboRow${i}`).toggleClass('active')

                    const selectedFilter = sortedArtifactCombos[i][0];
                    if (selectedFilter === filters.artifactFilter) {
                        filters.artifactFilter = null;
                    } else {
                        filters.artifactFilter = selectedFilter;
                    }
                    filterBuilds();
                })
            }

            for (let i = 0; i < intervals.length; i++) {
                $(`#gsStats`).off('click', `#gsRow${i}`);
                $(`#gsStats`).on('click', `#gsRow${i}`, (x) => {
                    $(`.gsRow:not(#gsRow${i})`).removeClass('active')
                    $(`#gsRow${i}`).toggleClass('active')

                    const selectedFilter = gsCutoffs[i];
                    if (selectedFilter === filters.gsFilter) {
                        filters.gsFilter = null;
                    } else {
                        filters.gsFilter = gsCutoffs[i];
                    }
                    filterBuilds();
                })
            }

            $('.setCombos, .artifactCombos, .gsStats').show();
        }
    })
}

var currentIndex = -1
var savedSetCombos = []

function convertToFullSets(sets) {
    var result = {}
    for (var entry of Object.entries(sets)) {
        if (fourPieceSetsIngame.includes(entry[0])) {
            if (entry[1] > 3) {
                result[entry[0]] = 4
            }
        } else if (entry[1] == 6) {
            result[entry[0]] = 6
        } else if (entry[1] >= 4) {
            result[entry[0]] = 4
        } else if (entry[1] >= 2) {
            result[entry[0]] = 2
        }
    }
    return result
}

function checkReady() {
    if (!loadedHeroData) {
        return;
    }

    if (!loadedArtifactData) {
        return;
    }

    var options = {
        sortField: 'text',
        width: 'resolve', // need to override the changed default
        placeholder: "Select hero",
        templateResult: formatHeroList,
        theme: "classic"
    }

    idsByHero = {

    }

    var entries = Object.entries(heroesById).sort(function compare(a, b) {
        if (a[1] < b[1])
            return -1;
        if (a[1] > b[1])
            return 1;
        return 0;
    })

    for (var entry of entries) {
        idsByHero[entry[1]] = entry[0];

        var data = {
            id: entry[0],
            text: entry[1]
        };

        var newOption0 = new Option(data.text, data.id, false, false);
        $('#heroSelector0').append(newOption0);

    }


    // get div to host the grid
    var gridDiv = document.getElementById("myGrid");
    // new grid instance, passing in the hosting DIV and Grid Options
    grid = new agGrid.Grid(gridDiv, gridOptions);

    gridOptions.api.setRowData([]);

    selector0 = $('#heroSelector0').select2(options);
    $("#buildsSearchButton").click(search)

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString).get('hero');

    if (urlParams) {
        console.log("a", urlParams)

        selector0.val(idsByHero[urlParams] || "").trigger("change");
        search()
    } else {
        console.log("b", urlParams)
        // $('#metaRows').html("Loading...")
    }

    window.onpopstate = function(e) {selector0.val(idsByHero[e.state.hero] || "").trigger("change"); search(true)}

}

function filterBuilds() {
    if (!!filters.artifactFilter || !!filters.gsFilter || !!filters.setFilter) {
        gridOptions.api.setIsExternalFilterPresent(() => {
            return true;
        })

        gridOptions.api.setDoesExternalFilterPass((row) => {
            if (filters.setFilter) {
                var rowSets = row.data.sets;
                for (let entry of Object.entries(filters.setFilter)) {
                    if ((rowSets[entry[0]] || 0) < parseInt(entry[1])) {
                        return false;
                    }
                }
            }

            if (filters.artifactFilter && row.data.artifactCode !== filters.artifactFilter) {
                return false;
            }

            if (filters.gsFilter && row.data.gs < filters.gsFilter) {
                return false;
            }
            
            return true
        })
    } else {
        gridOptions.api.setIsExternalFilterPresent(() => {
            return false;
        })
    }

    gridOptions.api.onFilterChanged()
    updateAverages(0)
}

function objectsAreEqual(a, b) {
    try {
        const aEntries = Object.entries(a);
        for (let entry of aEntries) {
            if (a[entry] !== b[entry]) {
                return false;
            }
        }
    
        return Object.entries(b).length === aEntries.length;
    } catch {
        return false;
    }
}

function resetStatTotals() {
    totalAtk = 0;
    totalDef = 0;
    totalHP = 0;
    totalCHC = 0;
    totalCHD = 0;
    totalEff = 0;
    totalEfr = 0;
    totalSpd = 0;
    totalGS = 0;
}

function updateAverages(dataLength) {
    let length = dataLength;

    if (!length) {
        resetStatTotals();

        gridOptions.api.forEachNodeAfterFilter((node, index) => {
            totalAtk += node.data.atk;
            totalDef += node.data.def;
            totalHP += node.data.hp;
            totalCHC += node.data.chc;
            totalCHD += node.data.chd;
            totalEff += node.data.eff;
            totalEfr += node.data.efr;
            totalSpd += node.data.spd;
            totalGS += node.data.gs;
        })

        length = gridOptions.api.getDisplayedRowCount();
    }

    if (!!length) {
        const avgAtk = totalAtk / length;
        const avgDef = totalDef / length;
        const avgHP  = totalHP / length;
        const avgCHC = totalCHC / length;
        const avgCHD = totalCHD / length;
        const avgEff = totalEff / length;
        const avgEfr = totalEfr / length;
        const avgSpd = totalSpd / length;
        const avgGS = totalGS / length;

        $('#atkStatBefore').text(avgAtk.toFixed(0))
        $('#defStatBefore').text(avgDef.toFixed(0))
        $('#hpStatBefore').text(avgHP.toFixed(0))
        $('#spdStatBefore').text(avgSpd.toFixed(0))
        $('#crStatBefore').text(avgCHC.toFixed(0))
        $('#cdStatBefore').text(avgCHD.toFixed(0))
        $('#effStatBefore').text(avgEff.toFixed(0))
        $('#resStatBefore').text(avgEfr.toFixed(0))
        $('#gsStatBefore').text(avgGS.toFixed(0))

        $('.statPreviewContainer').removeClass('gutterTop')
        $('#avgText').show()
    }
}


const fourPieceSets = [
    "AttackSet",
    "SpeedSet",
    "DestructionSet",
    "LifestealSet",
    "ProtectionSet",
    "CounterSet",
    "RageSet",
    "RevengeSet",
    "InjurySet"
]
const fourPieceSetsIngame = [
    "set_att",
    "set_counter",
    "set_cri_dmg",
    "set_rage",
    "set_revenge",
    "set_scar",
    "set_speed",
    "set_vampire",
    "set_shield",
]

const ingameSetsToSetNames = {
    "set_acc": "HitSet",
    "set_att": "AttackSet",
    "set_coop": "UnitySet",
    "set_counter": "CounterSet",
    "set_cri_dmg": "DestructionSet",
    "set_cri": "CriticalSet",
    "set_def": "DefenseSet",
    "set_immune": "ImmunitySet",
    "set_max_hp": "HealthSet",
    "set_penetrate": "PenetrationSet",
    "set_rage": "RageSet",
    "set_res": "ResistSet",
    "set_revenge": "RevengeSet",
    "set_scar": "InjurySet",
    "set_speed": "SpeedSet",
    "set_vampire": "LifestealSet",
    "set_shield": "ProtectionSet",
    "set_torrent": "TorrentSet"
}
const assetsBySet = {
    "HealthSet": "./assets/sethealth.png",
    "DefenseSet": "./assets/setdefense.png",
    "AttackSet": "./assets/setattack.png",
    "SpeedSet": "./assets/setspeed.png",
    "CriticalSet": "./assets/setcritical.png",
    "HitSet": "./assets/sethit.png",
    "DestructionSet": "./assets/setdestruction.png",
    "LifestealSet": "./assets/setlifesteal.png",
    "CounterSet": "./assets/setcounter.png",
    "ResistSet": "./assets/setresist.png",
    "UnitySet": "./assets/setunity.png",
    "RageSet": "./assets/setrage.png",
    "ImmunitySet": "./assets/setimmunity.png",
    "RevengeSet": "./assets/setrevenge.png",
    "InjurySet": "./assets/setinjury.png",
    "PenetrationSet": "./assets/setpenetration.png",
    "ProtectionSet": "./assets/setprotection.png",
    "TorrentSet": "./assets/settorrent.png",
}

function renderSets(sets, reverse, iconClass) {
    if (!iconClass) {
        iconClass = 'optimizerSetIcon';
    }
    // const sets = [];
    // for (var i = 0; i < setCounters.length; i++) {
    //     const setsFound = Math.floor(setCounters[i] / Constants.piecesBySetIndex[i]);
    //     for (var j = 0; j < setsFound; j++) {
    //         sets.push(Constants.setsByIndex[i]);
    //     }
    // }

    const collectedSets = []
    for (var key of Object.keys(sets)) {
        var setName = ingameSetsToSetNames[key]
        if (fourPieceSets.includes(setName)) {
            if (sets[key] > 3) {
                collectedSets.push(setName)
            }
        } else if (sets[key] == 6) {
            collectedSets.push(setName)
            collectedSets.push(setName)
            collectedSets.push(setName)
        } else if (sets[key] >= 4) {
            collectedSets.push(setName)
            collectedSets.push(setName)
        } else if (sets[key] >= 2) {
            collectedSets.push(setName)
        }
    }

    collectedSets.sort((a, b) => {
        if (reverse) {
            if (fourPieceSets.includes(a)) {
                return 1;
            } else if (fourPieceSets.includes(b)) {
                return -1;
            } else {
                return b.localeCompare(a);
            }
        }
        if (fourPieceSets.includes(a)) {
            return -1;
        } else if (fourPieceSets.includes(b)) {
            return 1;
        } else {
            return a.localeCompare(b);
        }
    })

    const images = collectedSets.map(x => '<img class="' + iconClass + ' " src=' + assetsBySet[x] + '></img>');
    return images.join("");
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

var questionCircle = "https://raw.githubusercontent.com/fribbels/Fribbels-Epic-7-Optimizer/main/data/cachedimages/question_circle.png";
function imgHtml(offenseStr) {
    var heroIds = offenseStr.split(",")
    var heroNames = heroIds.map(x => heroesById[x])
    var imgHtml = heroNames.map(x => {
        return heroData[x] ?
        `<img class="portrait" title="${x}" src=${heroData[x].assets.icon}></img>` :
        `<img class="portrait" src=${questionCircle}></img>`
    })

    return imgHtml.join(`<div class="vSpace"></div>`)
}



function formatHeroList(hero) {
    if (!hero.id) {
        return hero.text
    }
    var output = $(`<div class="searchRowContainer"><img src="${heroData[hero.text].assets.icon}" class="heroSearchIcon" />${hero.text}</div>`);

    return output;
};


function columnGradient(params) {
    try {
        if (!params || params.value == undefined) return;
        var colId = params.column.colId;
        var value = params.value;

        var agg = currentAggregate[colId];
        if (!agg) return;

        var percent = agg.max == agg.min ? 1 : (value - agg.min) / (agg.max - agg.min);
        percent = Math.min(1, Math.max(0, percent))

        var color = gradient.gradient.rgbAt(percent);
        if (agg.min == 0 && agg.max == 0) {
            color = gradient.gradient.rgbAt(0.5)
        }

        return {
            backgroundColor: color.toHexString()
        };
    } catch (e) {console.error(e)}
}

var lightGradient = {gradient:tinygradient([
    {color: '#5A1A06', pos: 0}, // red
    {color: '#343127', pos: 0.5},
    {color: '#38821F', pos: 1} // green
])};
gradient = lightGradient

function aggregateCurrentHeroStats(heroStats) {
// currentAggregate
    const statsToAggregate = [
        "atk",
        "hp",
        "def",
        "spd",
        "chc",
        "chd",
        "eff",
        "efr",
        "hps",
        "ehp",
        "ehps",
        "dmg",
        "dmgs",
        "mcd",
        "mcds",
        "dmgh",
        "dmgd",
        "gs",
        "bs",
    ]

    var count = heroStats.length;

    for (var stat of statsToAggregate) {
        const arrSum = arr => arr.reduce((a,b) => a + b[stat], 0);
        var max = Math.max(...getField(heroStats, stat));
        var min = Math.min(...getField(heroStats, stat));
        var sum = arrSum(heroStats);
        var avg = sum/count;

        if (stat == 'cr') {
            max = Math.min(100, max);
            min = Math.min(100, min);
        }
        if (stat == 'cd') {
            max = Math.min(350, max);
            min = Math.min(350, min);
        }

        currentAggregate[stat] = {
            max: cleanInfinities(max),
            min: cleanInfinities(min),
            sum: cleanInfinities(sum),
            avg: cleanInfinities(avg)
        }
    }

}

function getField(heroStats, stat) {
    return heroStats.map(x => x[stat]);
}

function cleanInfinities(num) {
    if (num == -Infinity || num == Infinity) {
        return 0;
    }
    return num;
}
