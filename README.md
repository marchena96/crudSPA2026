This is a great transition! You have successfully converted your backend into a REST API (as seen in your `ContactsController.cs`).

To connect this to a React frontend, you need to solve one specific problem first: **CORS (Cross-Origin Resource Sharing)**. Your browser will block your React app (running on one port) from talking to your .NET API (running on another) unless you explicitly allow it.

Here is the step-by-step guide to connecting your specific `Contact` model and API to a React frontend.

### Step 1: Enable CORS in `Program.cs`

You must update your backend to allow connections from the frontend.

**Modify `CrudSPA/Program.cs**`:
Add the lines marked with `// <--- ADD THIS`.

```csharp
using CrudSPA.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Add CORS services
builder.Services.AddCors(options => // <--- ADD THIS
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // Common React ports
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
    builder.Configuration.GetConnectionString("DefaultConnection")
    ));

builder.Services.AddControllersWithViews(); // You can actually change this to AddControllers() now since you are using an API

var app = builder.Build();

// ... (Environment check code) ...

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors("AllowReactApp"); // <--- ADD THIS (Must be between UseRouting and UseAuthorization)

app.UseAuthorization();
// ...

```

### Step 2: Create the React App

Open your terminal (outside the `CrudSPA` folder) and run:

```bash
npm create vite@latest client -- --template react
cd client
npm install
npm run dev

```

*Note the URL provided (e.g., `http://localhost:5173`). Make sure this matches the port you allowed in Step 1.*

### Step 3: Create the React Component

In your React project (`src/App.jsx`), replace the code with this complete example. It is custom-built to match your **ContactsController** endpoints and **Contact** model.

**Important:** Replace `https://localhost:7000` with your actual ASP.NET API URL (check your `launchSettings.json` or run the backend to see the port).

```jsx
import { useState, useEffect } from "react";

const API_URL = "https://localhost:7000/api/contacts"; // <--- CHECK YOUR PORT

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });
  const [editingId, setEditingId] = useState(null);

  // 1. READ (GET)
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 2. CREATE (POST) & 3. UPDATE (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    
    // Ensure ID is included for PUT requests if your backend requires it in the body
    const body = editingId ? { ...form, id: editingId } : form;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchContacts(); // Refresh list
        setForm({ name: "", email: "", phone: "", address: "", city: "" }); // Reset form
        setEditingId(null);
      } else {
        alert("Error saving contact");
      }
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  // Prepare form for editing
  const handleEdit = (contact) => {
    setForm(contact);
    setEditingId(contact.id);
  };

  // 4. DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchContacts();
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Contact Manager</h1>

      {/* Form Section */}
      <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc" }}>
        <h2>{editingId ? "Edit Contact" : "Add New Contact"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
          <input
            name="name"
            placeholder="Name *"
            value={form.name}
            onChange={handleChange}
            required
            maxLength={100}
          />
          <input
            name="email"
            placeholder="Email *"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            maxLength={100}
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone || ""}
            onChange={handleChange}
            maxLength={20}
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address || ""}
            onChange={handleChange}
            maxLength={200}
          />
          <input
            name="city"
            placeholder="City"
            value={form.city || ""}
            onChange={handleChange}
            maxLength={100}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit">{editingId ? "Update" : "Create"}</button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", email: "", phone: "", address: "", city: "" }); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>{contact.city}</td>
              <td>
                <button onClick={() => handleEdit(contact)}>Edit</button>
                <button onClick={() => handleDelete(contact.id)} style={{ marginLeft: "5px", color: "red" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

```

### Key Details Matched to Your Files:

1. **Endpoints**: The `fetch` calls use `/api/contacts` which matches the `[Route("api/[controller]")]` in your `ContactsController.cs`.
2. **Model Fields**: The form includes `Name`, `Email`, `Phone`, `Address`, and `City` to match your `Contact.cs` model.
3. **Validation**: I added `maxLength` attributes to the HTML inputs that correspond to the `[StringLength]` attributes in your C# model (e.g., Name=100, Phone=20).
