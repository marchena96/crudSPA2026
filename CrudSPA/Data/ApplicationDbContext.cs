using CrudSPA.Models;
using Microsoft.EntityFrameworkCore;

namespace CrudSPA.Data
{
    // 1.3 Set up the Application Db Context.

    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {

        }

        // DB Sets to work with the Controller ...
        public DbSet<Contact> Contacts { get; set; }
    }
}
