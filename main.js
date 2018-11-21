
/**
 * CLASSES
 */
class Upgrade
{
    constructor(name, cost)
    {
        this.name = name;
        this.cost = {Value: cost,
        Default: cost};
        
        this.upAmt = null;
        this.costUp = null;
        // controls
        this.bt = null;
        this.costOut = null;
    }
}

class Player
{
    constructor(money, comission, hourRate)
    {
        this.money = {Value: money,
        Default: 0};
        this.comission = {Value: comission,
        Default: 5};
        this.hourRate = {Value: hourRate,
        Default: 0};
        this.auto = {Value: false,
        Default: false};
    }
}
/**
 * VARS
 */
// Resources
// (money = 0, comission = 5, hourRate = 0)
var player = new Player(0, 5, 0);

// Abilities
var promotion = new Upgrade("Promotion", 20);
promotion.upAmt = 3;
promotion.costUp = 1.2;

var raisePrices = new Upgrade("Raise Prices", 15);
raisePrices.upAmt = 2;
raisePrices.costUp = 1.5;

// GRAB ELEMENTS
var BtMakeMoney = document.getElementById("btMakeMoney");
var BtReset = document.getElementById("btReset");

// GRAB CONTAINERS
var CapUpsOut = document.getElementById("capUpsOut");
var CapUps = document.getElementById("capUps");
var ResourcesOut = document.getElementById("resourcesOut");

/**
 * CREATE ELEMENTS
 */
// CAP UP OUTPUT
var ComissionOut = document.createElement("p");
ComissionOut.appendChild(document.createTextNode(""));

var HourRateOut = document.createElement("p");
HourRateOut.appendChild(document.createTextNode(""));

CapUpsOut.append(ComissionOut, HourRateOut);

// CAP UPGRADES
// Create array of upgrades
var upgrades = [promotion, raisePrices];

// Raise Prices (comission up)
for (var upgrade of upgrades)
{
    upgrade.bt = document.createElement("input");
    upgrade.bt.type = "button";
    upgrade.bt.className = "cardLeft";
    upgrade.bt.value = upgrade.name;
    CapUps.appendChild(upgrade.bt);
    upgrade.costOut = document.createElement("div");
    upgrade.costOut.className = "cardRight";
    CapUps.appendChild(upgrade.costOut);
}



// EVENT DELEGATES
BtMakeMoney.onclick = MakeMoney;
BtReset.onclick = Reset;
promotion.bt.onclick = PromotionUp;
raisePrices.bt.onclick = RaisePricesUp;

// FOR SAVING/LOADING
var outputData = 
[
    ["player.money", player.money],
    ["player.comission", player.comission],
    ["player.hourRate", player.hourRate],
    ["player.auto", player.auto],
    ["promotion.cost", promotion.cost],
    ["raisePrices.cost", raisePrices.cost]
];

// INITIALIZE OUTPUT

if (document.cookie != "")
{
    Load();
}
FullUpdate();

// Begin autosave
//setInterval(Save, 1000);

/**
 * METHODS
 */

//
// OUTPUT METHODS
//
function Update()
{
    ResourcesOut.innerHTML = "Money: " + player.money.Value;
}
function FullUpdate()
{
    Update();
    ComissionOut.innerHTML = "Comission: " + player.comission.Value;
    HourRateOut.innerHTML = "Hourly Rate: " + player.hourRate.Value;
    promotion.costOut.innerHTML = promotion.cost.Value;
    raisePrices.costOut.innerHTML = raisePrices.cost.Value;
}
function Reset()
{
    for (let i = 0; i < outputData.length; ++i)
    {
        outputData[i][1].Value = outputData[i][1].Default;
    }
    document.cookie = "";
    FullUpdate();
    Save();
}
//
// COOKIE METHODS
//

// OUTPUTDATA

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function Save()
{
    for (let i = 0; i < outputData.length; ++i)
    {
        setCookie(outputData[i][0], outputData[i][1].Value);
    }
    console.log(document.cookie);
}
function Load()
{
    for (let i = 0; i < outputData.length; ++i)
    {
        
        if (outputData[i][1] === player.auto)
        {
            player.auto.Value = (getCookie(outputData[i][0]) == 'true');
        }
        else
        {
            outputData[i][1].Value = Number(getCookie(outputData[i][0]));
        }
    }
    if (player.auto.Value == true)
    {
        EnableAuto();
    }
}


//
// INCREMENT METHODS
//
function MakeMoney()
{
    MoneyUp(player.comission.Value);
}

function HourRateMake()
{
    MoneyUp(player.hourRate.Value);
}

function MoneyUp(amt)
{
    player.money.Value += amt;
    Update();
    Save();
}

//
// UPGRADE METHODS
//
function PromotionUp()
{
    if (player.money.Value >= promotion.cost.Value)
    {
        player.money.Value -= promotion.cost.Value;
        player.hourRate.Value += promotion.upAmt;
        promotion.cost.Value = Math.floor(promotion.cost.Value * promotion.costUp);
        if (player.hourRate.Value == promotion.upAmt)
        {
            EnableAuto();
            player.auto.Value = true;
        }
        FullUpdate();
    }
}

function EnableAuto()
{
    setInterval(HourRateMake, 500);
}

function RaisePricesUp()
{
    if (player.money.Value >= raisePrices.cost.Value)
    {
        player.money.Value -= raisePrices.cost.Value;
        player.comission.Value += raisePrices.upAmt;
        raisePrices.cost.Value = Math.floor(raisePrices.cost.Value * raisePrices.costUp);
        FullUpdate();
    }
}