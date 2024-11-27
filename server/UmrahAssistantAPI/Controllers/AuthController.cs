using Microsoft.AspNetCore.Mvc;
using UmrahAssistantAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace UmrahAssistantAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly DbContextOptions<UmrahDbContext> _options;

        public AuthController(DbContextOptions<UmrahDbContext> options)
        {
            _options = options;
        }

        [HttpPost("google/callback")]
		public async Task<ActionResult<User?>> GoogleCallback([FromBody] GoogleAuthRequest? request)
		{
			// Validate the request and perform actual OAuth verification here (e.g., using Google's APIs).

			// Simulate fetching user from the database.
			try
			{
				using (var db = new UmrahDbContext(_options))
				{
					var user = await db.Users.FirstOrDefaultAsync(u => u.Email == "test@example.com"); // Assume Email comes in the request.
					if (user == null)
					{
						return NotFound(new { Message = "User not found." });
					}
					return Ok(user);
				}
			}
			catch (Exception ex)
			{
				// Log the exception (use a logging library like Serilog or NLog).
				return StatusCode(500, new { Message = "An error occurred.", Details = ex.Message });
			}
		}
	}

    public class GoogleAuthRequest
    {
        public string? code { get; set; }
    }
}
