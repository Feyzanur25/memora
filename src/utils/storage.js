export const getCapsules = () => {
  try {
    const data = localStorage.getItem("memora_capsules");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("localStorage parse error:", error);
    return [];
  }
};

export const saveCapsules = (capsules) => {
  try {
    localStorage.setItem(
      "memora_capsules",
      JSON.stringify(capsules)
    );
  } catch (error) {
    console.error("localStorage write error:", error);
  }
};
