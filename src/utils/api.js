export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("memora_token");
  console.log("TOKEN:", token);

  const isFormData = options.body instanceof FormData;

  const res = await fetch("http://localhost:4002" + path, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: token ? `Bearer ${token}` : ""
    }
  });

  return await res.json();
}
