using CrudSPA.Data;
using CrudSPA.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrudSPA.Controllers
{
    // CHANGE 1: Define this as an API controller
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase // CHANGE 2: Inherit from ControllerBase (lighter than Controller)
    {
        private readonly ApplicationDbContext _context;

        public ContactsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ---------------------------------------------------------
        // READ (GET)
        // ---------------------------------------------------------

        // GET: api/Contacts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            // CHANGE 3: Return the list directly. ASP.NET automatically converts this to JSON.
            return await _context.Contacts.AsNoTracking().ToListAsync();
        }

        // GET: api/Contacts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);

            if (contact == null)
            {
                return NotFound();
            }

            return contact;
        }

        // ---------------------------------------------------------
        // CREATE (POST)
        // ---------------------------------------------------------

        // NOTE: We DELETED the 'public IActionResult Create()' GET method.
        // React handles the UI, so we don't need an endpoint to serve the "Create" form.

        // POST: api/Contacts
        [HttpPost]
        public async Task<ActionResult<Contact>> PostContact(Contact contact)
        {
            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            // CHANGE 4: Return 'CreatedAtAction'. This returns a 201 status code
            // and the location of the new resource.
            return CreatedAtAction("GetContact", new { id = contact.Id }, contact);
        }

        // ---------------------------------------------------------
        // EDIT (PUT)
        // ---------------------------------------------------------

        // NOTE: We DELETED the 'Edit' GET method. React fetches data via GetContact(id).

        // PUT: api/Contacts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContact(int id, Contact contact)
        {
            if (id != contact.Id)
            {
                return BadRequest();
            }

            _context.Entry(contact).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ContactExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            // CHANGE 5: API standard for updates is usually "NoContent" (204)
            return NoContent();
        }

        // ---------------------------------------------------------
        // DELETE
        // ---------------------------------------------------------

        // NOTE: We DELETED the 'Delete' GET confirmation method. React handles the UI popup.

        // DELETE: api/Contacts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                return NotFound();
            }

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> ContactExists(int id)
        {
            return await _context.Contacts.AnyAsync(e => e.Id == id);
        }
    }
}

// ...


        