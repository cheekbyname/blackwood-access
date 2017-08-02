namespace Blackwood.Access.Models
{
    public class PayrollAggregate
    {
        public Carer Carer { get; set; }
        public int CarerGrade { get; set; }
        public double ActualAdjustedMins { get; set; }
    }
}