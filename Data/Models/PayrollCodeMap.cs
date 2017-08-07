namespace Blackwood.Access.Models
{
using System.ComponentModel.DataAnnotations;

    public class PayrollCodeMap
    {
        [Key]
        public int Id { get; set; }
        public int Type { get; set; }           // 0: Booking Type, 1: Availability Type
        public int TypeCode { get; set; }       // Booking or Availability Type Code
        public string Code { get; set; }        // Payroll Output Code
        public int? Unit { get; set; }           // Is paid as Unit - Deprecate?
        public bool? PayHours { get; set; }      // Hours count towards Actual Hours
        public bool? PayInstance { get; set;}    // Is paid as a single code instance
        public bool? ShiftCode { get; set; }     // Should be included in Shift calcs
        public bool? PayGaps { get; set; }       // Gaps between Bookings count towards Actual Hours
    }
}