namespace Blackwood.Access
{
    using Active.Messaging.Service;
    using Core.Accident.Service;
    using Core.Data.Models;
    using Core.Payroll.Service.Services;
    using Core.User.Service;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.SpaServices.Webpack;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            string dbConIntegration = Configuration.GetConnectionString("Integration");
            services.AddDbContext<AccessContext>(options => options.UseSqlServer(dbConIntegration));
            services.AddDbContext<PayrollContext>(options => options.UseSqlServer(dbConIntegration));

            string dbConAccident = Configuration.GetConnectionString("Accident");
            services.AddDbContext<AccidentContext>(options => options.UseSqlServer(dbConAccident));
            
            services.Configure<IISOptions>(options =>
            {
                options.ForwardWindowsAuthentication = true;
            });

            // Add framework services.
            services.AddMvc().AddJsonOptions(options => {
                options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });

            // Add Application services
            services.AddTransient<ICareInitialAssessmentService, CareInitialAssessmentService>();
            services.AddTransient<IPayrollDataService, PayrollDataService>();
            services.AddTransient<IPayrollService, PayrollService>();
            services.AddTransient<IPayrollShiftService, PayrollShiftService>();
            services.AddTransient<IPayrollValidationService, PayrollValidationService>();
            services.AddTransient<IPushService, PushService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IAccidentService, AccidentService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
