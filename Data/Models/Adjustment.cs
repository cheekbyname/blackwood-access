namespace Blackwood.Access.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public class Adjustment
    {
        [Key]
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public int CarerCode { get; set; }
        public DateTime WeekCommencing { get; set; }
        public string RequestedBy { get; set; }
        public DateTime? Requested { get; set; }
        public string AuthorisedBy { get; set; }
        public DateTime? Authorised { get; set; }
        public string RejectedBy { get; set; }
        public DateTime? Rejected { get; set; }
        public int ContractCode { get; set; }
        public int DayOffset { get; set; }
        public string Reason { get; set; }
        public int Hours { get; set; }
        public int Mins { get; set; }
    }
}
