import { useEffect, useState } from "react";
import supabase from "../lib/supabase";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("Erro ao buscar usuários:", error);
      } else {
        setUsers(data);
      }
    }
    fetchUsers();
  }, []);

  async function addUser() {
    if (!name || !email) return;

    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email }])
      .select();

    if (error) {
      console.error("Erro ao adicionar usuário:", error);
    } else if (data && data.length > 0) {
      // 🔹 Verifica se 'data' tem algo antes de acessar 'data[0]'
      setUsers([...users, { id: data[0].id, name, email }]); // Atualiza a lista
      setName("");
      setEmail("");
    } else {
      console.warn("Nenhum dado retornado pelo Supabase.");
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Lista de Usuários</h1>
      <ul className="mt-4">
        {users.map((user) => (
          <li key={user.id} className="border p-2 my-2">
            {user.name} - {user.email}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-6">Adicionar Usuário</h2>
      <div className="mt-4 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={addUser}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
