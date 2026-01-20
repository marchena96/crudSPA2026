import { useContacts } from "./services/hooks/UserContacts";
function App() {

  const { contacts, loading, removeContact } = useContacts();
  if (loading) return <p>Loading ...</p>

  return (
    <>

    </>
  )
}

export default App
