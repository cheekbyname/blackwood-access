namespace Blackwood.Access.Models
{
using System.ComponentModel.DataAnnotations;

    public class PayrollCodeMap
    {
        [Key]
        public int Id { get; set; }
        public int Type { get; set; }       // Deprecated - Could be repurposed [0: Booking Type, 1: Availability Type]
        public int TypeCode { get; set; }   // Booking or Availability Type Code
        public string Code { get; set; }    // Payroll Output Code
        public int Unit { get; set; }       // Is paid as Unit - Deprecate?
        public bool PayHours { get; set; }
        public bool PayInstance { get; set;}
    }
}