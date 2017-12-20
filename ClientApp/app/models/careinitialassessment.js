"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CheckItem_1 = require("./CheckItem");
var CareInitialAssessment = (function () {
    function CareInitialAssessment() {
        this.comms = [
            new CommsItem(0, "Phone"),
            new CommsItem(1, "Email"),
            new CommsItem(2, "Face to Face"),
            new CommsItem(3, "Audio"),
            new CommsItem(4, "Braille"),
            new CommsItem(5, "Written - Standard Print"),
            new CommsItem(6, "Written - Large Print")
        ];
        // CheckList Tab
        this.checkItems = [
            new CheckItem_1.CheckItem(0, "Are internal floors/flooring free from slip and trip hazards?"),
            new CheckItem_1.CheckItem(1, "Are external areas even and free from holes/loose slabs?"),
            new CheckItem_1.CheckItem(2, "Are steps, ramps and stairs in good condition?"),
            new CheckItem_1.CheckItem(3, "Are external access routes free from steep slopes which could be hazardous in icy conditions?"),
            new CheckItem_1.CheckItem(4, "Is access in general free from hazards?"),
            new CheckItem_1.CheckItem(5, "Are there no apparent electrical hazards e.g. dodgy wiring, very old switches?"),
            new CheckItem_1.CheckItem(6, "Is there sufficient lighting inlcuding internal and external artificial light, to safely perform tasks required?"),
            new CheckItem_1.CheckItem(7, "Is the house free from pets/pests?", "no", "If no, give details. Give details of any concerns e.g. dangerous dogs"),
            new CheckItem_1.CheckItem(8, "Do occupants avoid smoking while you are in the house?"),
            new CheckItem_1.CheckItem(9, "Is the neighbourhood one that you would feel comfortable visiting at all times of day?", "no", "If no, describe your concerns"),
            new CheckItem_1.CheckItem(10, "Would you rate the risk of violence or abuse from the occupants as 'Low'?"),
            new CheckItem_1.CheckItem(11, "Is the client free from known infection risks?"),
            new CheckItem_1.CheckItem(12, "Is there a mobile phone signal throughout the areas of the property you visit?"),
            new CheckItem_1.CheckItem(13, "Are there any hazards related to the work you do e.g. patient handling with insufficient space/incorrect equipment, use of cleaning chemicals, sharps, etc?"),
            new CheckItem_1.CheckItem(14, "Is there any equipment provided for your use at the property, e.g. by your employer, by another organisation or by the client?", "yes", "If yes, is the equipment properly maintained?")
        ];
        // TILE Tab
        // DEV: 
        this.tileGroups = [
            new TileGroup(0, "Task", "The Tasks - Do They Involve:", [
                new TileItem(0, 0, "Holding loads away from trunk?"),
                new TileItem(0, 1, "Twisting?"),
                new TileItem(0, 2, "Stooping?"),
                new TileItem(0, 3, "Reaching Upwards?"),
                new TileItem(0, 4, "Large vertical movement?"),
                new TileItem(0, 5, "Long carrying distances?"),
                new TileItem(0, 6, "Strenuous pushing or pulling?"),
                new TileItem(0, 7, "Unpredicatable movement of loads?"),
                new TileItem(0, 8, "Repetitive handling?"),
                new TileItem(0, 9, "Insufficient rest or recovery?"),
                new TileItem(0, 10, "A work rate imposed by a process?")
            ]),
            new TileGroup(1, "Individual", "Individual Capability - Does the Job:", [
                new TileItem(1, 0, "Requrie unusual capability?"),
                new TileItem(1, 1, "Hazard those with a health problem?"),
                new TileItem(1, 2, "Hazard those who are pregnant?"),
                new TileItem(1, 3, "Call for special information/training?"),
            ]),
            new TileGroup(2, "Load", "The Loads - Are They:", [
                new TileItem(2, 0, "Heavy?"),
                new TileItem(2, 1, "Bulky/Unwieldy?"),
                new TileItem(2, 2, "Difficult to grasp?"),
                new TileItem(2, 3, "Unstable/Unpredicatable?"),
                new TileItem(2, 4, "Constraints on posture?"),
            ]),
            new TileGroup(3, "Environment", "The Working Envrionment - Are There:", [
                new TileItem(3, 0, "Poor floors?"),
                new TileItem(3, 1, "Variations in levels?"),
                new TileItem(3, 2, "Hot/cold/humid conditions?"),
                new TileItem(3, 3, "Strong air movements?"),
                new TileItem(3, 4, "Poor lighting conditions?"),
            ]),
            new TileGroup(4, "Other", "Other Factors:", [
                new TileItem(4, 0, "Is movement or posture hindered by clothing or personal protective equipment?")
            ])
        ];
    }
    return CareInitialAssessment;
}());
exports.CareInitialAssessment = CareInitialAssessment;
var TileItem = (function () {
    function TileItem(groupId, itemId, task) {
        this.groupId = groupId;
        this.itemId = itemId;
        this.task = task;
    }
    return TileItem;
}());
var TileGroup = (function () {
    function TileGroup(groupId, title, desc, items) {
        this.groupId = groupId;
        this.title = title;
        this.desc = desc;
        this.items = items;
    }
    return TileGroup;
}());
var CommsItem = (function () {
    function CommsItem(itemId, title) {
        this.itemId = itemId;
        this.title = title;
    }
    return CommsItem;
}());
//# sourceMappingURL=careinitialassessment.js.map