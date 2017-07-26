namespace Blackwood.Access.Models
{
    using System;
    using System.Collections.Generic;
    
    public class ValidationResult
    {
        public int TeamCode { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodFinish { get; set; }
        public ICollection<Adjustment> PendingAdjustments { get; set; }
        public ICollection<CarerDataValidationItem> CarerDataValidationItems { get; set; }
    }

    public class CarerDataValidationItem
    {
        public Carer Carer { get; set; }
        public string Revision { get; set; }
    }
}