namespace Blackwood.Access.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class TileGroup
    {
        [Key]
        public int Id { get; set; }
        public int CareInitialAssessmentId { get; set; }
        public int GroupId { get; set; }
        [NotMapped]
        public string Title { get; set; }
        [NotMapped]
        public string Desc { get; set; }
        public ICollection<TileItem> Items { get; set; }

        public static Dictionary<int, TileGroupLookup> Lookup = new Dictionary<int, TileGroupLookup>()
        {
            { 0, new TileGroupLookup("Task", "The Tasks - Do They Involve:") },
            { 1, new TileGroupLookup("Individual", "Individual Capability - Does the Job:") },
            { 2, new TileGroupLookup("Load", "The Loads - Are They:") },
            { 3, new TileGroupLookup("Environment", "The Working Environment - Are There:") },
            { 4, new TileGroupLookup("Other", "Other Factors:") }
        };

        public class TileGroupLookup
        {
            public string Title { get; set; }
            public string Desc { get; set; }

            public TileGroupLookup(string title, string desc)
            {
                Title = title;
                Desc = desc;
            }
        }
    }
}
