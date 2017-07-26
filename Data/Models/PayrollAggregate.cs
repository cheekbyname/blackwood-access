namespace Blackwood.Access.Models
{
    public class PayrollAggregate
    {
        public Carer Carer { get; set; }
        public string CostCentre { get; set; }
        public double ActualAdjustedMins { get; set; }
    }
}