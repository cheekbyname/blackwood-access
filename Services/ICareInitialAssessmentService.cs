namespace Blackwood.Access.Services
{
    using Models;
    using System.Collections.Generic;

    public interface ICareInitialAssessmentService
    {
        IEnumerable<CareInitialAssessment> GetAllAssessments();
    }
}
