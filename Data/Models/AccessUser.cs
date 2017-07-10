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
        public bool CanAuthoriseAdjustments { get; set; }
        public bool CanRejectAdjustments { get; set; }
        public int DefaultTeamCode { get; set; }
    }
}