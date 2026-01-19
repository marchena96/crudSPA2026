/* Second Stage Add Contacts' controller */
// 1. Crear el constructor
// 1.2 
using Microsoft.AspNetCore.Mvc;

namespace CrudSPA.Controllers
{
    public class ContactsController : Controller
    {
        public ContactsController()
        {

        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
