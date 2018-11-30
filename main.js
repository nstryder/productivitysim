/* jshint esversion: 6 */

/** 
 * --------------------------------------------------------
 * CLASSES
 * --------------------------------------------------------
 */ 
//#region 
// Holds properties for abilities/upgrades
// such as name and cost
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

// Holds various stats for the player
class Player
{
    constructor(money, comission, hourRate)
    {
        // Capitalism
        this.money =        {Value: money,      Default: 10000000};
        this.comission =    {Value: comission,  Default: 5};
        this.hourRate =     {Value: hourRate,   Default: 0};
        this.auto =         {Value: 0,          Default: 0};
        
        // Pet stuff
        this.petFood =      {Value: 0,          Default: 0};
    }
}

// Holds stats for pet
class Pet
{
    constructor(level, xp, toNextLv)
    {
        this.level = {Value: level, Default: 1};
        this.xp = {Value: xp, Default: 0};
        this.toNextLv = {Value: toNextLv, Default: 100};
        this.state = {Value: 0, Default: 0}
    }
}
//#endregion

/**
 * --------------------------------------------------------
 * VARS
 * --------------------------------------------------------
 */
//#region 
// Resources
// Player
// (money = 0, comission = 5, hourRate = 0)
const player = new Player(1111110, 5, 0);

// Pet
// (level = 1, xp = 0, toNextLv = 100)
const pet = new Pet(200, 0, 100);

// Pet states (evolution images)
const petStates = ["pet1.gif", "pet2.png", "pet3.png", "pet4.jpg"];

// Flag for unlocking pet module
var petIsUnlocked = {Value: 0, Default: 0};

//#endregion 
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Abilities
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//#region 

// CAPITALISM
const promotion = new Upgrade("Promotion", 20);
promotion.upAmt = 3;
promotion.costUp = 1.2;

const raisePrices = new Upgrade("Raise Prices", 15);
raisePrices.upAmt = 2;
raisePrices.costUp = 1.35;

const unlockPet = new Upgrade("Unlock Pet", 200);
const buyPetFood = new Upgrade("Buy Pet Food", 100);

// PET
const feed = new Upgrade("Feed Pet (Needs pet food)", 1);
const evolve = new Upgrade("Evolve (Needs levels", 10);

//#endregion 
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DOM GRABBING
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//#region 

// GRAB ELEMENTS
const BtMakeMoney = document.getElementById("btMakeMoney");
const BtReset =     document.getElementById("btReset");
const PetState =    document.getElementById("petState");

// GRAB CONTAINERS
const CapUpsOut =   document.getElementById("capUpsOut");
const CapUps =      document.getElementById("capUps");
const ResourcesOut= document.getElementById("resourcesOut");
const PetBox =      document.getElementById("petBox");
const PetActions =  document.getElementById("petActions");
const PetStatsOut = document.getElementById("petStatsOut");
const LevelOut =    document.getElementById("lvl");
const XpOut =       document.getElementById("xp");
const ToNextLvOut = document.getElementById("toNextLv");
const InnerXPBar =  document.getElementById("innerXPBar");

//#endregion 

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * CREATE ELEMENTS
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
//#region 

// RESOURCES OUTPUT
// (eg money and food)
var MoneyOut = document.createElement("p");
MoneyOut.appendChild(document.createTextNode(""));

ResourcesOut.append(MoneyOut);

var PetFoodOut = document.createElement("p");
PetFoodOut.appendChild(document.createTextNode(""));

// CAP UP OUTPUT
// (Y'know where we display our comission and hour rate)
var ComissionOut = document.createElement("p");
ComissionOut.appendChild(document.createTextNode(""));

var HourRateOut = document.createElement("p");
HourRateOut.appendChild(document.createTextNode(""));

CapUpsOut.append(ComissionOut, HourRateOut);

// CAP UPGRADES
// Create array of upgrades
var capUpgrades = [promotion, raisePrices, unlockPet, buyPetFood];
var petUpgrades = [feed];

// Create each upgrade html element
// FOR CAPITALISM
for (let i = 0; i < capUpgrades.length; ++i)
{
    let upgrade = capUpgrades[i];
    // Create hbox to contain name and cost
    var hbox = document.createElement("div");
    hbox.className = "flex hbox";
    hbox.id = "upbox" + i;

    // Create upgrade button
    createBt(upgrade, hbox);

    // Create cost
    createCost(upgrade, hbox);

    // Finalization
    CapUps.appendChild(hbox);
}
// Hide buyPetFood upgrade
upbox3.classList.add("hide");

// FOR PET
for (let i = 0; i < petUpgrades.length; ++i)
{
    let upgrade = petUpgrades[i];
    // Create hbox to contain name and cost
    var hbox = document.createElement("div");
    hbox.className = "flex hbox";

    // Create action button
    createBt(upgrade, hbox);
    
    // Create cost
    createCost(upgrade, hbox);

    // Finalize
    PetActions.appendChild(hbox);
}

// Create evolve button
function createEvolve()
{
    var hbox = document.createElement("div");
    hbox.className = "flex hbox";
    hbox.id = "evolveBox";

    createBt(evolve, hbox);
    createCost(evolve, hbox);

    PetActions.appendChild(hbox);
}
createEvolve();

// Creates buttons for abilities/upgrades
function createBt(upgrade, hbox)
{
    upgrade.bt = document.createElement("input");
    upgrade.bt.type = "button";
    upgrade.bt.className = "bt";
    upgrade.bt.value = upgrade.name;
    hbox.appendChild(upgrade.bt);
}

// Creates cost for abilities/upgrades
function createCost(upgrade, hbox)
{
    upgrade.costOut = document.createElement("div");
    upgrade.costOut.className = "label";
    upgrade.costOut.innerHTML = upgrade.cost.Value;
    hbox.appendChild(upgrade.costOut);
}

//#endregion 
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// EVENT DELEGATES
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//#region 

function eventDelegate()
{
    BtMakeMoney.onclick = MakeMoney;
    BtReset.onclick = Reset;
    promotion.bt.onclick = PromotionUp;
    raisePrices.bt.onclick = RaisePricesUp;
    unlockPet.bt.onclick = UnlockPet;
    buyPetFood.bt.onclick = BuyPetFood;
    feed.bt.onclick = FeedPet;
    evolve.bt.onclick = Evolve;
}
eventDelegate();

//#endregion 

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// MISC (SAVE/LOAD STUFF)
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//#region 

// FOR SAVING/LOADING
var outputData = 
[
    ["player.money", player.money],
    ["player.comission", player.comission],
    ["player.hourRate", player.hourRate],
    ["player.auto", player.auto],
    ["player.petFood", player.petFood],

    ["promotion.cost", promotion.cost],
    ["raisePrices.cost", raisePrices.cost],

    ["pet.level", pet.level],
    ["pet.xp" ,pet.xp],
    ["pet.toNextLv", pet.toNextLv],
    ["pet.state", pet.state],
    ["petIsUnlocked", petIsUnlocked],

    ["evolve.cost", evolve.cost]
];

// INITIALIZE OUTPUT
if (document.cookie != "")
{
    Load();
}
FullUpdate();
//#endregion 

/**
 * --------------------------------------------------------
 * METHODS
 * --------------------------------------------------------
 */
//#region 
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// OUTPUT METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//#region 

function Update()
{
    MoneyOut.innerHTML = "Money: " + player.money.Value;
}
function PetFoodUpdate()
{
    PetFoodOut.innerHTML = "Pet Food: " + player.petFood.Value;
}
function PetStatUpdate()
{
    // Percentage for xp bar
    let progress = pet.xp.Value / pet.toNextLv.Value * 100;
    if (progress < 10)
    {
        progress = 10;
    }
    if (progress > 100)
    {
        progress = 100;
    }
    InnerXPBar.style = "width:" + progress + "%;";

    // Update numeric stats
    LevelOut.innerHTML = "LV: " + pet.level.Value;
    XpOut.innerHTML = "XP: " + pet.xp.Value + " / " + pet.toNextLv.Value;
}
function PetStateUpdate()
{
    PetState.src = "images\\" + petStates[pet.state.Value];
    evolve.costOut.innerHTML = evolve.cost.Value;

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
    Save();
    location.reload();
}
//#endregion 
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// COOKIE METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//#region 

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
        outputData[i][1].Value = Number(getCookie(outputData[i][0]));
    }
    // Check if auto ability is unlocked
    if (player.auto.Value == 1)
    {
        EnableAuto();
    }
    // Check if pet module is unlocked
    if (petIsUnlocked.Value == 1)
    {
        UnlockPet();
    }
}
//#endregion 
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// INCREMENT METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//#region 

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
//#endregion 
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// UPGRADE/ABILITY METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//#region 

// Checks if player can afford upgrade/ability
function CanAfford(upgrade)
{
    if (player.money.Value >= upgrade.cost.Value)
    {
        player.money.Value -= upgrade.cost.Value;
        return true;
    }
    return false;
}

// CAPITALISM
function PromotionUp()
{
    if (CanAfford(promotion))
    {
        player.hourRate.Value += promotion.upAmt;
        promotion.cost.Value = 
            Math.floor(promotion.cost.Value * promotion.costUp);
        if (player.hourRate.Value == promotion.upAmt)
        {
            EnableAuto();
            player.auto.Value = 1;
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
    if (CanAfford(raisePrices))
    {
        player.comission.Value += raisePrices.upAmt;
        raisePrices.cost.Value = 
            Math.floor(raisePrices.cost.Value * raisePrices.costUp);
        FullUpdate();
    }
}
function UnlockPet()
{
    if (CanAfford(unlockPet))
    {
        petIsUnlocked.Value = 1;
        // unhide element
        PetBox.classList.remove("hide");
        // hide upgrade
        document.getElementById("upbox2").classList.add("hide");
        // unhide buy pet food action
        document.getElementById("upbox3").classList.remove("hide");
        // add pet food to resources
        ResourcesOut.append(PetFoodOut);
        PetStateUpdate();
        PetFoodUpdate();
        PetStatUpdate();
        Update();
    }
}

// PET
function BuyPetFood()
{
    if (CanAfford(buyPetFood))
    {
        ++player.petFood.Value;
        PetFoodUpdate();
        Update();
    }
}

function FeedPet()
{
    if (player.petFood.Value >= feed.cost.Value)
    {
        --player.petFood.Value;
        if (pet.xp.Value < pet.toNextLv.Value)
        {
            pet.xp.Value += 50;
            if (pet.xp.Value > pet.toNextLv.Value)
            {
                pet.xp.Value = pet.toNextLv.Value;
            }
        }
        else
        {
            ++pet.level.Value;
            pet.xp.Value = 0;
            pet.toNextLv.Value = Math.floor(pet.toNextLv.Value * 1.05);
        }
        PetFoodUpdate();
        PetStatUpdate();
    }
}

function Evolve()
{
    if (pet.level.Value >= evolve.cost.Value)
    {
        pet.level.Value -= evolve.cost.Value;
        pet.state.Value++;
        evolve.cost.Value += 30;
        // Remove evolve button if maxed out
        if (pet.state.Value == petStates.length - 1)
        {
            document.getElementById("evolveBox").classList.add("hide");
        }
        PetStatUpdate();
        PetStateUpdate();
    }
}
//#endregion 
//#endregion 