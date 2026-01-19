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

        // ---------------------------------------------------------
        // LIST (INDEX) & DETAILS
        // ---------------------------------------------------------

        // GET: Contacts
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            // AsNoTracking optimiza la lectura
            return View(await _context.Contacts.AsNoTracking().ToListAsync());
        }

        // GET: Contacts/Details/5
        [HttpGet]
        public async Task<IActionResult> Details(int? id)
        {
            if (id is null) return NotFound();

            var contact = await _context.Contacts
                .FirstOrDefaultAsync(m => m.Id == id);

            if (contact is null) return NotFound();

            return View(contact);
        }

        // ---------------------------------------------------------
        // CREATE
        // ---------------------------------------------------------

        // GET: Contacts/Create
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Contacts/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
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

        // ---------------------------------------------------------
        // EDIT
        // ---------------------------------------------------------

        // GET: Contacts/Edit/5
        [HttpGet]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id is null) return NotFound();

            var contact = await _context.Contacts.FindAsync(id);
            if (contact is null) return NotFound();

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
                    // AWAIT añadido aquí para no bloquear el hilo
                    if (!await ContactExists(contact.Id))
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

        // ---------------------------------------------------------
        // DELETE
        // ---------------------------------------------------------

        // GET: Contacts/Delete/5
        [HttpGet]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id is null) return NotFound();

            var contact = await _context.Contacts
                .FirstOrDefaultAsync(m => m.Id == id);

            if (contact is null) return NotFound();

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

        // ---------------------------------------------------------
        // HELPERS
        // ---------------------------------------------------------

        // Método convertido a ASYNC para no bloquear la base de datos
        private async Task<bool> ContactExists(int id)
        {
            return await _context.Contacts.AnyAsync(e => e.Id == id);
        }
    }
}

// ...


        