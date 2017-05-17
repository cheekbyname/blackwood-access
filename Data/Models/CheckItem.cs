namespace Blackwood.Access.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class CheckItem
    {
        [Key]
        public int Id { get; set; }
        public int CareInitialAssessmentId { get; set; }
        public int ItemId { get; set; }
        [NotMapped]
        public string ItemName { get; set; }
        public string Value { get; set; }
        [NotMapped]
        public string FurtherValue { get; set; }
        [NotMapped]
        public string FurtherTitle { get; set; }
        public string Further { get; set; }

        public static Dictionary<int, CheckItemLookup> Lookup = new Dictionary<int, CheckItemLookup>()
        {
            { 0, new CheckItemLookup("Are internal floors/flooring free from slip and trip hazards?") },
            { 1, new CheckItemLookup("Are external areas even and free from holes/loose slabs?") },
            { 2, new CheckItemLookup("Are steps, ramps and stairs in good condition?") },
            { 3, new CheckItemLookup("Are external access routes free from steep slopes which could be hazardous in icy conditions?") },
            { 4, new CheckItemLookup("Is access in general free from hazards?") },
            { 5, new CheckItemLookup("Are there no apparent electrical hazards e.g. dodgy wiring, very old switches?") },
            { 6, new CheckItemLookup("Is there sufficient lighting inlcuding internal and external artificial light, to safely perform tasks required?") },
            { 7, new CheckItemLookup("Is the house free from pets/pests?", "no", "If no, give details. Give details of any concerns e.g. dangerous dogs") },
            { 8, new CheckItemLookup("Do occupants avoid smoking while you are in the house?") },
            { 9, new CheckItemLookup("Is the neighbourhood one that you would feel comfortable visiting at all times of day?", "no", "If no, describe your concerns") },
            { 10, new CheckItemLookup("Would you rate the risk of violence or abuse from the occupants as 'Low'?") },
            { 11, new CheckItemLookup("Is the client free from known infection risks?") },
            { 12, new CheckItemLookup("Is there a mobile phone signal throughout the areas of the property you visit?") },
            { 13, new CheckItemLookup("Are there any hazards related to the work you do e.g. patient handling with insufficient space/incorrect equipment, use of cleaning chemicals, sharps, etc?") },
            { 14, new CheckItemLookup("Is there any equipment provided for your use at the property, e.g. by your employer, by another organisation or by the client?", "yes", "If yes, is the equipment properly maintained?") }
        };

        public class CheckItemLookup
        {
            public string ItemName { get; set; }
            public string FurtherValue { get; set; }
            public string FurtherTitle { get; set; }

            public CheckItemLookup(string itemName, string furtherValue = null, string furtherTitle = null)
            {
                ItemName = itemName;
                FurtherValue = furtherValue;
                FurtherTitle = furtherTitle;
            }
        }
    }
}
