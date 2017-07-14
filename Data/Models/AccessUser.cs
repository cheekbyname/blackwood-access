namespace Blackwood.Access.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public class AccessUser
    {
        [Key]
        public int Id { get; set; }
        public string DomainUsername { get; set; }
        public string AccountName { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsAdmin { get; set; } = false;
        public bool IsPayrollUser { get; set; } = false;
        public int DefaultTeamCode { get; set; } = 0;
        public bool CanAuthoriseAdjustments { get; set; } = false;
        public bool CanRejectAdjustments { get; set; } = false;
        public bool IsAssessmentUser { get; set; } = false;
    }
}