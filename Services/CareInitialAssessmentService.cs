namespace Blackwood.Access.Services
{
    using Microsoft.EntityFrameworkCore;
    using Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class CareInitialAssessmentService : ICareInitialAssessmentService
    {
        private AccessContext _context;

        public CareInitialAssessmentService(AccessContext context)
        {
            _context = context;
        }

        public IEnumerable<CareInitialAssessmentSummary> GetAllAssessSummaries()
        {
            return _context.CareInitialAssessments.Select(ca => new CareInitialAssessmentSummary() {
                Id = ca.Id, Guid = ca.Guid, Name = ca.Name, Address1 = ca.Address1, VisitBy = ca.VisitBy, VisitDate = ca.VisitDate
            }).OrderByDescending(cs => cs.VisitDate);
        }

        public IEnumerable<CareInitialAssessment> GetAllAssessments()
        {
            // TODO We want this filtered by Users
            List<CareInitialAssessment> assess = _context.CareInitialAssessments
                .Include(c => c.ActiveUser).Include(c => c.CheckItems).Include(c => c.Comms)
                .Include(c => c.TileGroups).Include(c => c.TileGroups).ThenInclude(g => g.Items)
                .ToList();
            // TODO Use PopAndSort (below)
            // Pop lookups and sort Comms
            assess.SelectMany(a => a.Comms).ToList().ForEach(c => { c.Title = CommsItem.Lookup[c.ItemId]; });
            assess.ForEach(a => { a.Comms = a.Comms.OrderBy(c => c.ItemId).ToList(); });
            // Pop lookups and sort CheckItems
            assess.SelectMany(a => a.CheckItems).ToList().ForEach(c =>
            {
                c.ItemName = CheckItem.Lookup[c.ItemId].ItemName;
                c.FurtherValue = CheckItem.Lookup[c.ItemId].FurtherValue;
                c.FurtherTitle = CheckItem.Lookup[c.ItemId].FurtherTitle;
            });
            assess.ForEach(a => { a.CheckItems = a.CheckItems.OrderBy(c => c.ItemId).ToList(); });
            // Pop lookups and sort TileGroups and TileItems
            assess.SelectMany(a => a.TileGroups).ToList().ForEach(c =>
            {
                c.Title = TileGroup.Lookup[c.GroupId].Title;
                c.Desc = TileGroup.Lookup[c.GroupId].Desc;
                c.Items.ToList().ForEach(i =>
                {
                    i.Task = TileItem.Lookup[Tuple.Create(i.GroupId, i.ItemId)];
                });
                c.Items = c.Items.OrderBy(i => i.ItemId).ToList();
            });
            assess.ForEach(a => { a.TileGroups = a.TileGroups.OrderBy(c => c.GroupId).ToList(); });

            return assess;
        }

        public CareInitialAssessment GetAssessment(int Id)
        {
            CareInitialAssessment assess = _context.CareInitialAssessments
                .Include(c => c.ActiveUser).Include(c => c.CheckItems).Include(c => c.Comms)
                .Include(c => c.TileGroups).Include(c => c.TileGroups).ThenInclude(g => g.Items)
                .FirstOrDefault(cia => cia.Id == Id);
            
            return PopAndSort(assess);
        }

        private CareInitialAssessment PopAndSort(CareInitialAssessment assess) {
            assess.Comms.ToList().ForEach(c => { c.Title = CommsItem.Lookup[c.ItemId]; });
            assess.Comms = assess.Comms.OrderBy(c => c.ItemId).ToList();

            assess.CheckItems.ToList().ForEach(c =>
            {
                c.ItemName = CheckItem.Lookup[c.ItemId].ItemName;
                c.FurtherValue = CheckItem.Lookup[c.ItemId].FurtherValue;
                c.FurtherTitle = CheckItem.Lookup[c.ItemId].FurtherTitle;
            });
            assess.CheckItems = assess.CheckItems.OrderBy(c => c.ItemId).ToList();

            assess.TileGroups.ToList().ForEach(c =>
            {
                c.Title = TileGroup.Lookup[c.GroupId].Title;
                c.Desc = TileGroup.Lookup[c.GroupId].Desc;
                c.Items.ToList().ForEach(i =>
                {
                    i.Task = TileItem.Lookup[Tuple.Create(i.GroupId, i.ItemId)];
                });
                c.Items = c.Items.OrderBy(i => i.ItemId).ToList();
            });
            assess.TileGroups = assess.TileGroups.OrderBy(c => c.GroupId).ToList();

            return assess;
        }
    }
}
