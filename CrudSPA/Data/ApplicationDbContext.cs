using Microsoft.EntityFrameworkCore;

namespace CrudSPA.Data
{
    // 1.3 Set up the Application Db Context.

    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            :  base(options)
        {

        }

        // DB Sets ...
    }
}
