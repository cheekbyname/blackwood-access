namespace Blackwood.Access.Services
{
    using Models;
    using System.Collections.Generic;

    public interface ICareInitialAssessmentService
    {
        IEnumerable<CareInitialAssessment> GetAllAssessments();
        CareInitialAssessment GetAssessment(int Id);
        IEnumerable<CareInitialAssessmentSummary> GetAllAssessSummaries();
    }
}
