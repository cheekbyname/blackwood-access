namespace Blackwood.Access.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public class Adjustment
    {
        [Key]
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public int CarerCode { get; set; }
        public DateTime WeekCommencing { get; set; }
        public string RequestedBy { get; set; }
        public DateTime Requested { get; set; }
        public string AuthorisedBy { get; set; }
        public DateTime Authorised { get; set; }
        public int ContractCode { get; set; }
        public int DayOffset { get; set; }
        public string Reason { get; set; }
        public int Hours { get; set; }
        public int Mins { get; set; }
    }
}

// export class Adjustment {
//     public id: number;
// 	public carerCode: number;
// 	public weekCommencing: Date;
//     public adjustedBy: string;
//     public contractCode: number;
//     public dayOffset: number;
//     public reason: string;
//     public hours: number;
//     public mins: number;

//     constructor(carerCode:number, weekCommencing: Date, dayOffset: number) {
//         this.carerCode = carerCode;
//         this.weekCommencing = weekCommencing;
//         this.dayOffset = dayOffset;
//     }
// }