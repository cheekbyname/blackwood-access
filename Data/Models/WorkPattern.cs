namespace Blackwood.Access.Models
{
    using System;
    using System.Collections.Generic;

    public class WorkPattern
    {
        public Carer Carer { get; set; }
        public List<CarerContract> Contracts { get; set; }
        public List<Tuple<int, List<Availability>>> Schedule { get; set; }
        public List<Display> Pattern { get; set; }

        public WorkPattern()
        {
            Contracts = new List<CarerContract>();
            Schedule = new List<Tuple<int, List<Availability>>>();
            Pattern = new List<Display>();
        }

        public class Display
        {
            public int CycleWeek { get; set; }
            public string DayOfWeek { get; set; }
            public TimeSpan StartTime { get; set; }
            public TimeSpan FinishTime { get; set; }
            public TimeSpan Duration { get; set; }
        }
    }
}
