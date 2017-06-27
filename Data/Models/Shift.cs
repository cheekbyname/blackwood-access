namespace Blackwood.Access.Models
{
    using System.ComponentModel.DataAnnotations;
    using System;

    public class Shift
    {
        [Key]
        public int Id { get; set; }
        public int CarerCode { get; set; }
        public int? ContractCode { get; set; }
        public int Sequence { get; set; }
        public int Day { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? Finish { get; set; }
        public int ShiftMins { get; set; }
        public int UnpaidMins { get; set; }
        public int BiggestGap { get; set; }
    }
}