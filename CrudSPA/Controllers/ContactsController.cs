/* Second Stage Add Contacts' controller */
// 1. Crear el constructor
// 1.2 
using CrudSPA.Data;
using CrudSPA.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrudSPA.Controllers
{
    public class ContactsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ContactsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /* GET METHODS */
        // GET: Contacts
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            // Improved: AsNoTracking() is faster for read-only lists
            return View(await _context.Contacts.AsNoTracking().ToListAsync());
        }

        // GET: Contacts/Details/5
        [HttpGet]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();

            var contact = await _context.Contacts
                .FirstOrDefaultAsync(m => m.Id == id);

            if (contact == null) return NotFound();

            return View(contact);
        }

        // GET: Contacts/Create
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // GET: Contacts/Edit/5
        [HttpGet]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null) return NotFound();

            return View(contact);
        }

        // GET: Contacts/Delete/5
        [HttpGet]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();

            var contact = await _context.Contacts
                .FirstOrDefaultAsync(m => m.Id == id);

            if (contact == null) return NotFound();

            return View(contact);
        }

        /* POST METHODS */
        // POST: Contacts/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        // Improved: [Bind] prevents over-posting attacks
        public async Task<IActionResult> Create([Bind("Id,Name,Email,Phone,Address")] Contact contact)
        {
            if (ModelState.IsValid)
            {
                _context.Add(contact);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(contact);
        }


        // POST: Contacts/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Email,Phone,Address")] Contact contact)
        {
            if (id != contact.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(contact);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ContactExists(contact.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(contact);
        }


        // POST: Contacts/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact != null)
            {
                _context.Contacts.Remove(contact);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        // Helper Method
        private bool ContactExists(int id)
        {
            return _context.Contacts.Any(e => e.Id == id);
        }
    }
}

// ...
