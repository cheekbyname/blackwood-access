namespace Blackwood.Access.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class ActiveUser
    {
        [Key]
        public int Id { get; set; }
        public string EmailName { get; set; }
        public string SimpleName { get; set; }
        public string AccountName { get; set; }
        [NotMapped]
        public ICollection<CareInitialAssessment> CareInitialAssessments { get; set; }
    }
}
