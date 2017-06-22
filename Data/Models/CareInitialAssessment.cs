namespace Blackwood.Access.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class CareInitialAssessmentSummary
    {
        [Key]
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public string Name { get; set; }
        public string Address1 { get; set; }
        public string VisitBy { get; set; }
        public DateTime VisitDate { get; set; }
    }

    public class CareInitialAssessment
    {
        [Key]
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public ActiveUser ActiveUser { get; set; }
        public int ActiveUserId { get; set; }
        public string Name { get; set; }
        public string PrefName { get; set; }
        public string Address1 { get; set; }
        public string TelephoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime VisitDate { get; set; }
        public string VisitBy { get; set; }
        public int? VisitType { get; set; }
        public string WhatRequired { get; set; }
        public string GeneralHealth { get; set; }
        public string FamilyCarer { get; set; }
        public int? EyeSight { get; set; }
        public string Hearing { get; set; }
        public string CommunicationAbility { get; set; }
        public ICollection<CommsItem> Comms { get; set; }
        public int? Continence { get; set; }
        public string ContinenceDetails { get; set; }
        public int? Dexterity { get; set; }
        public string Adaptations { get; set; }
        public string MentalHealth { get; set; }
        public string DietaryRequirements { get; set; }
        public string FoodDrinkPreferences { get; set; }
        public string SocialInterests { get; set; }
        public string ReligionCulture { get; set; }
        public string WhenRequired { get; set; }
        public string StaffRequirements { get; set; }
        public bool? HappyVary { get; set; }
        public string TimeChange { get; set; }
        public int? GenderPref { get; set; }
        public string GenderDetails { get; set; }
        public bool? AltGender { get; set; }
        public string AccessArrangements { get; set; }
        public int? DoorEntry { get; set; }
        public string KeyCode { get; set; }
        public string Disability { get; set; }
        public string Medication { get; set; }
        public int? MedicationCapacity { get; set; }
        public bool? MedicMorningVisit { get; set; }
        public bool? MedicLunchVisit { get; set; }
        public bool? MedicTeatimeVisit { get; set; }
        public bool? MedicBedtimeVisit { get; set; }
        public bool? MedicOtherVisit { get; set; }
        public string MedicOtherVisitDetails { get; set; }
        public int? MedicOralGrading { get; set; }
        public int? MedicNonOralGrading { get; set; }
        public int? WhoOrdersMedication { get; set; }
        public string Allergies { get; set; }
        public string GpDetails { get; set; }
        public string OtherProvider { get; set; }
        public string NextOfKin { get; set; }
        public string SpecificRisks { get; set; }
        public string Goals { get; set; }
        public string AdditionalInfo { get; set; }
        public ICollection<CheckItem> CheckItems { get; set; }
        public string OtherHazards { get; set; }
        public string FurtherAction { get; set; }
        public bool? FullAssessReqd { get; set; }
        public string AboutPerson { get; set; }
        public int? BodyBuildWeight { get; set; }
        public int? BodyBuildHeight { get; set; }
        public int? RiskFalls { get; set; }
        public string Problems { get; set; }
        public string Constraints { get; set; }
        public int? TransferSpec { get; set; }
        public int? TransferPeople { get; set; }
        public string TransferWalkingAid { get; set; }
        public string TransferAdditional { get; set; }
        public int? ToiletSpec { get; set; }
        public int? ToiletPeople { get; set; }
        public string ToiletWalkingAid { get; set; }
        public string ToiletAdditional { get; set; }
        public int? BedpanSpec { get; set; }
        public int? BedpanManeuver { get; set; }
        public int? BedpanPeople { get; set; }
        public string BedpanAdditional { get; set; }
        public int? BedMoveSpec { get; set; }
        public int? BedMoveHandlingAid { get; set; }
        public int? BedMovePeople { get; set; }
        public string BedMoveAdditional { get; set; }
        public int? BedTransferSpec { get; set; }
        public int? BedTransferHandlingAid { get; set; }
        public int? BedTransferPeople { get; set; }
        public string BedTransferAdditional { get; set; }
        public int? BedsideSpec { get; set; }
        public int? BedsidePeople { get; set; }
        public string BedsideAdditional { get; set; }
        public int? BathShowerWhich { get; set; }
        public int? BathShowerHandlingAid { get; set; }
        public int? BathShowerSpec { get; set; }
        public int? BathShowerPeople { get; set; }
        public string BathShowerAdditional { get; set; }
        public int? WalkingSpec { get; set; }
        public string WalkingWalkingAid { get; set; }
        public int? WalkingPeople { get; set; }
        public string WalkingAdditional { get; set; }
        public string OtherInstructions { get; set; }
        public ICollection<TileGroup> TileGroups { get; set; }
        public int? OverallRisk { get; set; }
    }
}
