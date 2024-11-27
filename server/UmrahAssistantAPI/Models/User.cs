using System.ComponentModel.DataAnnotations;

namespace UmrahAssistantAPI.Models
{
    public class User
    {
        [Key]
        public string? Id { get; set; }
        public string? Email { get; set; }
        public string? Name { get; set; }
        public string? Tier { get; set; }
        public int? DailyCalls { get; set; }
    }
}
