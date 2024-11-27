using Microsoft.EntityFrameworkCore;
using UmrahAssistantAPI.Models;

namespace UmrahAssistantAPI.Models
{
    public class UmrahDbContext : DbContext
    {
        public UmrahDbContext(DbContextOptions<UmrahDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
    }
}
