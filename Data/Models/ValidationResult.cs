namespace Blackwood.Access.Models
{
    using System;
    using System.Collections.Generic;
    
    public class ValidationResult
    {
        public int TeamCode { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodFinish { get; set; }
        public ICollection<Carer> Carers { get; set; }
        public ICollection<Adjustment> PendingAdjustments { get; set; }
        public ICollection<Adjustment> OtherAdjustments { get; set; }
        public ICollection<CarerDataValidationItem> CarerDataValidationItems { get; set; }

        public ValidationResult(int teamCode, DateTime periodStart, DateTime periodFinish)
        {
            TeamCode = teamCode;
            PeriodStart = periodStart;
            PeriodFinish = periodFinish;
            CarerDataValidationItems = new List<CarerDataValidationItem>();
        }
    }

    public class CarerDataValidationItem
    {
        public Carer Carer { get; set; }
        public string Revision { get; set; }
    }
}