using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UmrahAssistantAPI.Controllers;
using UmrahAssistantAPI.Models;
using Xunit;

namespace UmrahAssistantAPI.Tests
{
    public class AuthControllerTests
    {
        [Fact]
        public async Task GoogleCallback_ExistingUser_ReturnsOk()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<UmrahDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            using (var context = new UmrahDbContext(options))
            {
                context.Users.Add(new User { Id = "1", Email = "test@example.com", Name = "Test User", Tier = "premium", DailyCalls = 0 });
                await context.SaveChangesAsync();
            }

            var controller = new AuthController(options);
            var request = new GoogleAuthRequest { code = "testcode" };

            // Act
            var actionResult = await controller.GoogleCallback(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            Assert.IsType<User>(okResult.Value);
        }


        [Fact]
        public async Task GoogleCallback_NonExistingUser_ReturnsNotFound()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<UmrahDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            var controller = new AuthController(options);
            var request = new GoogleAuthRequest { code = "testcode" };

            // Act
            var actionResult = await controller.GoogleCallback(request);

            // Assert
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }
    }
}
