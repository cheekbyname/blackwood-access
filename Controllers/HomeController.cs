namespace Access.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;

    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
            => (_logger) = (logger);

        public IActionResult Index() => View();

        public IActionResult Error() => View();
    }
}
