namespace Blackwood.Access.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public class Payroll
    {
        [Key]
        public int Id { get; set; }
        public string StaffMember { get; set; }
        public DateTime Date { get; set; }
        public string DateFormatted
        {
            get
            {
                return Date.ToString("dd/MM/yyyy");
            }
        } 
        public int Sequence { get; set; }
        public string NEPay { get; set; } = "N";
        public DateTime? StartDate { get; set; }
        public string StartDateFormatted
        {
            get
            {
                return StartDate == null ? "" : ((DateTime)StartDate).ToString("dd/MM/yyyy");
            }
        }
        public string Position { get; set; } = "";
        public string ContractNo { get; set; } = "";
        public string Code { get; set; }
        public double Hours { get; set; }
    }
}