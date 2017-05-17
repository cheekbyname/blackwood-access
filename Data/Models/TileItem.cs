namespace Blackwood.Access.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class TileItem
    {
        [Key]
        public int Id { get; set; }
        public int TileGroupId { get; set; }
        public int GroupId { get; set; }
        public int ItemId { get; set; }
        [NotMapped]
        public string Task { get; set; }
        public bool? Hazard { get; set; }
        public string RemedialAction { get; set; }

        public static Dictionary<Tuple<int, int>, string> Lookup = new Dictionary<Tuple<int, int>, string>()
        {
            { Tuple.Create(0, 0), "Holding loads away from trunk?" },
            { Tuple.Create(0, 1), "Twisting" },
            { Tuple.Create(0, 2), "Stooping?" },
            { Tuple.Create(0, 3), "Reaching Upwards?" },
            { Tuple.Create(0, 4), "Large vertical movement?" },
            { Tuple.Create(0, 5), "Long carrying distances?" },
            { Tuple.Create(0, 6), "Strenuous pushing or pulling?" },
            { Tuple.Create(0, 7), "Unpredicatable movement of loads?" },
            { Tuple.Create(0, 8), "Repetitive handling?" },
            { Tuple.Create(0, 9), "Insufficient rest or recovery?" },
            { Tuple.Create(0, 10), "A work rate imposed by a process?" },
            { Tuple.Create(1, 0), "Requrie unusual capability?" },
            { Tuple.Create(1, 1), "Hazard those with a health problem?" },
            { Tuple.Create(1, 2), "Hazard those who are pregnant?" },
            { Tuple.Create(1, 3), "Call for special information/training?" },
            { Tuple.Create(2, 0), "Heavy?" },
            { Tuple.Create(2, 1), "Bulky/Unweildy?" },
            { Tuple.Create(2, 2), "Difficult to grasp?" },
            { Tuple.Create(2, 3), "Unstable/Unpredicatable?" },
            { Tuple.Create(2, 4), "Constraints on posture?" },
            { Tuple.Create(3, 0), "Poor floors?" },
            { Tuple.Create(3, 1), "Variations in levels?" },
            { Tuple.Create(3, 2), "Hot/cold/humid conditions?" },
            { Tuple.Create(3, 3), "Strong air movements?" },
            { Tuple.Create(3, 4), "Poor lighting conditions?" },
            { Tuple.Create(4, 0), "Is movement or posture hindered by clothing or personal protective equipment?" }
        };
    }
}
