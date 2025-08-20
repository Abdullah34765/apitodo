"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

const Todo_Main = () => {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [allNotes, setAllNotes] = useState<Todo[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
    } else {
      fetchTodos();
    }
  }, [router]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  // Helper: API call with token
  const apiRequest = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ send token
        ...(options.headers || {}),
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data;
  };

  // Fetch all todos
  const fetchTodos = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const data = await apiRequest("/api/Get-todo", { method: "GET" });
      setAllNotes(data);
    } catch (err: any) {
      setErrorMessage(err.message || "Error fetching todos.");
    } finally {
      setLoading(false);
    }
  };

  // Add new todo
  const handleAdd = async () => {
    if (!note.trim()) {
      setErrorMessage("Please enter a valid note.");
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest("/api/Add-todo", {
        method: "POST",
        body: JSON.stringify({ title: note, completed: isCompleted }),
      });
      setAllNotes((prev) => [data, ...prev]);
      setNote("");
      setIsCompleted(false);
      setErrorMessage("");
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update todo
  const handleUpdate = async () => {
    if (editId === null) return;
    setLoading(true);
    try {
      const data = await apiRequest("/api/Update-todo", {
        method: "PATCH",
        body: JSON.stringify({
          id: editId,
          title: editTitle,
          completed: editCompleted,
        }),
      });
      setAllNotes((prev) => prev.map((n) => (n.id === editId ? data : n)));
      setEditId(null);
      setEditTitle("");
      setEditCompleted(false);
      setErrorMessage("");
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete todo
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await apiRequest(`/api/Delete-todo/${id}`, { method: "DELETE" });
      setAllNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const handleEditClick = (noteItem: Todo) => {
    setEditId(noteItem.id);
    setEditTitle(noteItem.title);
    setEditCompleted(noteItem.completed);
  };

  return (
    <div
      className="flex flex-col justify-center items-center w-full h-screen  p-4 bg-no-repeat bg-cover "
      style={{ backgroundImage: `url("/book.jpg")` }}
    >
      <div className="flex flex-col items-center w-full max-w-md gap-3">
        <div className="w-full flex justify-end">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="cursor-pointer"
          >
            Logout
          </Button>
        </div>

        <p className="text-sm text-white">Enter Note:</p>
        <Input
          className="bg-gray-300 h-10"
          placeholder="Enter Note.."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={loading}
        />

        <div className="flex flex-row gap-6 justify-center items-center">
          <p className="text-white text-xl">
            Check Box<span className="text-sm"> (if Completed?)</span>
          </p>
          <Checkbox
            className="cursor-pointer"
            checked={isCompleted}
            onCheckedChange={(checked) => setIsCompleted(Boolean(checked))}
            disabled={loading}
          />
        </div>

        <div className="flex flex-row gap-6">
          <Button
            onClick={handleAdd}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? "Adding..." : "Add Note"}
          </Button>
          <Button
            onClick={fetchTodos}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? "Loading..." : "See All Notes"}
          </Button>
        </div>

        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

        {allNotes.length > 0 && (
          <div className="mt-6 w-full bg-white p-4 rounded max-h-64 overflow-auto">
            <h3 className="text-lg font-semibold mb-2">My Notes:</h3>
            <ul>
              {allNotes.map((noteItem) => (
                <li key={noteItem.id} className="mb-2 border-b pb-1">
                  {editId === noteItem.id ? (
                    <div className="flex flex-col gap-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <span>Completed?</span>
                        <Checkbox
                          checked={editCompleted}
                          onCheckedChange={(checked) =>
                            setEditCompleted(Boolean(checked))
                          }
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleUpdate}
                          disabled={loading}
                          className="cursor-pointer"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setEditId(null)}
                          className="cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span>
                        <strong>Title:</strong> {noteItem.title} |{" "}
                        <strong>Completed:</strong>{" "}
                        {noteItem.completed ? "Yes" : "No"}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(noteItem)}
                          className="cursor-pointer"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(noteItem.id)}
                          className="cursor-pointer"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Todo_Main;
