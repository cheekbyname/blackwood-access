namespace Blackwood.Access.Models
{
    using System.ComponentModel.DataAnnotations;
    using System;

    public class Shift
    {
        [Key]
        public int Id { get; set; }
        public int CarerCode { get; set; }
        public int Sequence { get; set; }
        public DateTime Start { get; set; }
        public DateTime Finish { get; set; }
    }
}