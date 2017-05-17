namespace Blackwood.Access.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class CommsItem
    {
        [Key]
        public int Id { get; set; }
        public int CareInitialAssessmentId { get; set; }
        public int ItemId { get; set; }
        [NotMapped]
        public string Title { get; set; }
        public bool? Preferred { get; set; }

        public static Dictionary<int, string> Lookup = new Dictionary<int, string>()
        {
            { 0, "Phone" },
            { 1, "Email" },
            { 2, "Face to Face" },
            { 3, "Audio" },
            { 4, "Braille" },
            { 5, "Written - Standard Print" },
            { 6, "Written - Large Print" }
        };
    }
}
