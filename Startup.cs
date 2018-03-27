namespace Blackwood.Access
{
    using Active.Messaging.Service;
    using Core.Accident.Service;
    using Core.Data.Models;
    using Core.Data.Models.Reporting;
    using Core.Payroll.Service.Services;
    using Core.User.Service;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Rewrite;
    using Microsoft.AspNetCore.SpaServices.Webpack;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Diagnostics;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;
    using Reporting.Reporting.Service;

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

            services.Configure<MvcOptions>(options =>
            {
                options.Filters.Add(new RequireHttpsAttribute());
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
            services.AddScoped<ICareInitialAssessmentService, CareInitialAssessmentService>();
            services.AddScoped<IPayrollDataService, PayrollDataService>();
            services.AddScoped<IPayrollService, PayrollService>();
            services.AddScoped<IPayrollShiftService, PayrollShiftService>();
            services.AddScoped<IPayrollValidationService, PayrollValidationService>();
            services.AddScoped<IPayrollShiftValidationService, PayrollShiftValidationService>();
            services.AddScoped<IPushService, PushService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAccidentService, AccidentService>();
            services.AddScoped<IReportingService, ReportingService>();
            services.AddScoped<IReportingDataService, ReportingDataService>();
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

            //var options = new RewriteOptions().AddRedirectToHttps(StatusCodes.Status301MovedPermanently, 44313);    // Dev
            var options = new RewriteOptions().AddRedirectToHttps(StatusCodes.Status301MovedPermanently, 443);    // Live
            app.UseRewriter(options);

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
