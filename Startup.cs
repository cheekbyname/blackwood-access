namespace Blackwood.Access
{
    using Active.Messaging.Service;
    using Core.Accident.Service;
    using Core.Data.Models;
    using Core.Data.Models.Reporting;
    using Core.Payroll.Service.Services;
    using Core.User.Service;
    using Reporting.Reporting.Service;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.SpaServices.Webpack;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Diagnostics;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;
    using Microsoft.Extensions.Logging;

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            string dbConIntegration = Configuration.GetConnectionString("Integration");

            services.AddDbContext<AccessContext>(options => {
                options.UseSqlServer(dbConIntegration);
                options.ConfigureWarnings(warnings =>
                {
                    warnings.Ignore(RelationalEventId.QueryClientEvaluationWarning);
                });
            });

            services.AddDbContext<PayrollContext>(options =>
            {
                options.UseSqlServer(dbConIntegration);
                options.ConfigureWarnings(warnings =>
                {
                    warnings.Ignore(RelationalEventId.QueryClientEvaluationWarning);
                });
            });

            services.AddDbContext<ReportingContext>(options => {
                options.UseSqlServer(dbConIntegration);
                options.ConfigureWarnings(warnings => {
                    warnings.Ignore(RelationalEventId.QueryClientEvaluationWarning);
                });
            });

            string dbConAccident = Configuration.GetConnectionString("Accident");

            services.AddDbContext<AccidentContext>(options =>
            {
                options.UseSqlServer(dbConAccident);
                options.ConfigureWarnings(warnings =>
                {
                    warnings.Ignore(RelationalEventId.QueryClientEvaluationWarning);
                });
            });

            services.Configure<IISOptions>(options =>
            {
                options.AutomaticAuthentication = true;
            });

            // Add framework services.
            services.AddMvc().AddJsonOptions(options => {
                options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });

            // Logger Factory for potentially non-controller-invoked services
            services.AddSingleton(new LoggerFactory().AddConsole().AddDebug());
            services.AddLogging();

            // Add Application services
            services.AddTransient<ICareInitialAssessmentService, CareInitialAssessmentService>();
            services.AddTransient<IPayrollDataService, PayrollDataService>();
            services.AddTransient<IPayrollService, PayrollService>();
            services.AddTransient<IPayrollShiftService, PayrollShiftService>();
            services.AddTransient<IPayrollValidationService, PayrollValidationService>();
            services.AddTransient<IPushService, PushService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IAccidentService, AccidentService>();
            services.AddTransient<IReportingService, ReportingService>();
            services.AddTransient<IReportingDataService, ReportingDataService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
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
